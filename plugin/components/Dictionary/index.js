const inherits = require('inherits');
const EventEmitter = require('events').EventEmitter;

const dictionaryTpl = require('./dictionary.html').default;
require('./dictionary.scss');

const Trie = require('./trie.js');

const DICT_LOCAL_KEY = '@vp-dict-history.v2';

const { backIcon, loadingIcon, searchIcon, chevronDownIcon, handsTranslateIcon, categoryIcons } = require('~icons');
const { DICTIONARY_URL, CATEGORIES_URL, CATEGORY_SIGNS_URL, TRANSLATE_URL } = require('~constants');
const { formatGloss } = require('~utils');

// Cache para definições já buscadas (Wiktionary)
const definitionsCache = {};

// URL da API do Wiktionary
const WIKTIONARY_API = 'https://pt.wiktionary.org/w/api.php';
const WIKTIONARY_SEARCH_API = 'https://pt.wiktionary.org/w/rest.php/v1/search/title';

function formatCategoryName(name) {
  if (!name) return '';
  
  const lowercaseWords = ['e', 'ou', 'de', 'da', 'do', 'das', 'dos', 'em', 'na', 'no', 'nas', 'nos', 'a', 'o', 'as', 'os', 'para', 'por', 'com'];
  
  return name
    .replace(/_/g, ' ')
    .split(' ')
    .map((word, index) => {
      const lowerWord = word.toLowerCase();
      // Primeira palavra sempre começa com maiúscula, outras dependem se são preposições/artigos
      if (index === 0 || !lowercaseWords.includes(lowerWord)) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      return lowerWord;
    })
    .join(' ');
}

// Ícone de chevron para cima (rotacionado)
const chevronUpIcon = chevronDownIcon.replace('<svg', '<svg style="transform: rotate(180deg)"');

function Dictionary(player, isWidget) {
  this.visible = false;
  this.player = player;
  this.closeScreen = null;
  this.button = null;
  this.isWidget = isWidget;
  this.currentTab = 'categories';
  this.currentCategory = null;
  this.categoriesData = []; // Categorias vindas da API
  this.allSigns = []; // Todos os sinais para o acordeão A-Z
  this.signsByLetter = {}; // Sinais agrupados por letra
  this.expandedLetter = null; // Letra atualmente expandida
}

inherits(Dictionary, EventEmitter);

Dictionary.prototype.load = function (element, closeScreen, initGuide) {
  this.element = element;
  this.element.innerHTML = dictionaryTpl;
  this.closeScreen = closeScreen;
  this.initGuide = initGuide;
  this.element.classList.add('vpw-dictionary');
  this.button = document.querySelector('.vpw-header-btn-dictionary');
  this.searchInput = element.querySelector('.vpw-search input');

  this.boundCloseAllScreen = closeAllScreen.bind(this);

  const backButton = this.element.querySelector('.vpw-btn-close');
  const tabButtons = this.element.querySelectorAll('.vp-dictionary-btn');
  const categoriesBtn = tabButtons[0];
  const dictBtn = tabButtons[1];
  const recentBtn = tabButtons[2];

  const categoriesHeader = this.element.querySelector('.vpw-categories-header');
  const categoryTitle = this.element.querySelector('.vpw-category-title');
  const categoryHeaderIcon = this.element.querySelector('.vpw-category-header-icon');
  const categoryBackBtn = categoriesHeader.querySelector('.vpw-btn-back');

  const categoriesContainer = this.element.querySelector('.vpw-categories-container');
  const categoriesList = this.element.querySelector('.vpw-categories-list');
  const categorySignsList = this.element.querySelector('.vpw-category-signs-list');

  const recentWords = this.element.querySelector('.vpw-recents-container');
  const dictWords = this.element.querySelector('.vpw-dict-container');
  const azAccordion = this.element.querySelector('.vpw-az-accordion');
  const azSearchResults = this.element.querySelector('.vpw-az-search-results');
  const loadingScreen = this.element.querySelector('.vpw-loading-dictionary');
  const reloadDictButton = loadingScreen.querySelector('div button');
  const headerBtn = document.querySelector('.vpw-header-btn-dictionary');
  let reqCounter = 0;

  // Store references
  this.categoriesContainer = categoriesContainer;
  this.categoriesList = categoriesList;
  this.categorySignsList = categorySignsList;
  this.categoriesHeader = categoriesHeader;
  this.categoryTitle = categoryTitle;
  this.categoryHeaderIcon = categoryHeaderIcon;
  this.dictWords = dictWords;
  this.azAccordion = azAccordion;
  this.azSearchResults = azSearchResults;
  this.recentWords = recentWords;
  this.categoriesBtn = categoriesBtn;
  this.dictBtn = dictBtn;
  this.recentBtn = recentBtn;
  this.loadingScreen = loadingScreen;

  this.boundLoadRecentWords = () => loadRecentWords.bind(this)(recentWords);
  this.boundToggleTab = (tab) => this.toggleTab(tab);

  if (!this.isWidget) recentBtn.style.display = 'none';

  reloadDictButton.onclick = () => {
    getSigns.bind(this)();
  };

  // Tab click handlers
  categoriesBtn.onclick = () => {
    this.boundToggleTab('categories');
    this.showCategoriesList();
  };

  dictBtn.onclick = () => {
    this.boundToggleTab('az');
    this.showAzAccordion();
  };

  recentBtn.onclick = () => {
    this.boundToggleTab('recents');
    this.boundLoadRecentWords();
  };

  // Add icons
  this.element.querySelector('.vpw-icon').innerHTML = searchIcon;
  this.element.querySelector('.vpw-btn-close').innerHTML = backIcon;
  this.element.querySelector('.vpw-loading__img').innerHTML = loadingIcon;
  categoryBackBtn.innerHTML = backIcon;

  backButton.onclick = function () {
    headerBtn.classList.remove('selected');
    this.hide();
  }.bind(this);

  // Category back button handler
  categoryBackBtn.onclick = () => {
    this.showCategoriesList();
  };

  // Signs trie
  this.signs = null;

  // List for search results
  this.list = azSearchResults.querySelector('ul');
  this.list.lastTop = -1;
  this.list.onclick = (e) => this.onGlossClick(e);

  // Category signs list click handler
  categorySignsList.onclick = (e) => this.onGlossClick(e);

  // Message
  this.message = azSearchResults.querySelector('span');

  // Insert item method for search
  let count = 0;
  const tempList = [];

  this.list._insert = function (word) {
    const item = this.createSignItem(word, this.list);

    if (count++ >= 50) tempList.push(item);
    else this.list.appendChild(item);
  }.bind(this);

  const addRetryBtn = () => loadingScreen.classList.add('vpw-dict--error');
  const removeRetryBtn = () =>
    loadingScreen.classList.remove('vpw-dict--error');
  const maxRequest = () => loadingScreen.classList.add('vpw-dict--max-request');

  function checkRequests(err) {
    if (err) console.error(err);
    if (reqCounter > 5) maxRequest();
    else addRetryBtn();
  }

  // Request and load list
  function getSigns() {
    reqCounter++;
    removeRetryBtn();

    const xhr = new XMLHttpRequest();
    xhr.open('get', DICTIONARY_URL, true);
    xhr.responseType = 'text';
    xhr.timeout = 30000;

    xhr.ontimeout = function () {
      console.error('Request timed out. Please try again later.');
      addRetryBtn();
    };

    xhr.onerror = (err) => checkRequests(err);

    xhr.onload = function () {
      try {
        if (xhr.status == 200) {
          const json = JSON.parse(xhr.response);

          this.signs = new Trie(json);

          // Collect all signs for A-Z accordion
          this.allSigns = [];
          this.signs.loadSigns('', (word) => {
            this.allSigns.push(word);
          });
          
          // Group signs by first letter
          this.groupSignsByLetter();
          
          // Render A-Z accordion
          this.renderAzAccordion();

          loadingScreen.remove();

          // Fetch categories from API
          this.fetchCategories();
        } else {
          checkRequests();
          console.error('Bad answer for signs, status: ' + xhr.status);
        }
      } catch (err) {
        checkRequests(err);
      }
    }.bind(this);
    xhr.send();
  }

  getSigns.bind(this)();

  // Clear list method
  this.list._clear = function () {
    this.list.closest('div').scrollTop = 0;
    this.list.innerHTML = '';
    this.list.lastTop = -1;
    count = 0;
    tempList.length = 0;
  }.bind(this);

  // Search
  this.searchInput.addEventListener(
    'input',
    function (event) {
      const searchValue = event.target.value;
      
      // Switch to A-Z tab when searching
      if (searchValue.length > 0) {
        this.boundToggleTab('az');
        this.showSearchResults();

      this.list._clear();
      this.signs.loadSigns(
          searchValue.toUpperCase(),
        this.list._insert.bind(this.list)
      );

      const isEmpty = this.list.childNodes.length === 0;
        this.azSearchResults.classList.toggle('vp-isEmpty', isEmpty);
        this.message.innerHTML = `Sem resultados para <strong>"${searchValue}"</strong>`;
      } else {
        this.showAzAccordion();
      }
    }.bind(this)
  );
};

// Group signs by first letter
Dictionary.prototype.groupSignsByLetter = function () {
  this.signsByLetter = {};
  
  // Create groups for numbers (0-9) and letters (A-Z)
  this.signsByLetter['0..9'] = [];
  for (let i = 65; i <= 90; i++) {
    this.signsByLetter[String.fromCharCode(i)] = [];
  }
  
  this.allSigns.forEach(sign => {
    const firstChar = sign.charAt(0).toUpperCase();
    
    if (/[0-9]/.test(firstChar)) {
      this.signsByLetter['0..9'].push(sign);
    } else if (/[A-Z]/.test(firstChar)) {
      this.signsByLetter[firstChar].push(sign);
    }
  });
};

// Render A-Z accordion
Dictionary.prototype.renderAzAccordion = function () {
  this.azAccordion.innerHTML = '';
  
  const letters = ['0..9', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];
  
  letters.forEach(letter => {
    const signs = this.signsByLetter[letter] || [];
    if (signs.length === 0) return; // Skip empty letters
    
    const section = document.createElement('div');
    section.className = 'vpw-az-section';
    section.setAttribute('data-letter', letter);
    
    // Header
    const header = document.createElement('div');
    header.className = 'vpw-az-header';
    header.innerHTML = `
      <span class="vpw-az-letter">${letter}</span>
      <span class="vpw-az-chevron">${chevronDownIcon}</span>
    `;
    header.onclick = () => this.toggleLetterSection(letter);
    
    // Content (signs list)
    const content = document.createElement('div');
    content.className = 'vpw-az-content';
    
    const ul = document.createElement('ul');
    signs.forEach(sign => {
      const li = this.createSignItem(sign, ul);
      ul.appendChild(li);
    });
    
    content.appendChild(ul);
    section.appendChild(header);
    section.appendChild(content);
    
    this.azAccordion.appendChild(section);
  });
};

// Toggle letter section (expand/collapse)
Dictionary.prototype.toggleLetterSection = function (letter) {
  const section = this.azAccordion.querySelector(`[data-letter="${letter}"]`);
  
  if (!section) return;
  
  const isExpanded = section.classList.contains('vp-expanded');
  
  // Collapse all sections
  this.azAccordion.querySelectorAll('.vpw-az-section').forEach(s => {
    s.classList.remove('vp-expanded');
    const chevron = s.querySelector('.vpw-az-chevron');
    if (chevron) chevron.innerHTML = chevronDownIcon;
  });
  
  // If was not expanded, expand it
  if (!isExpanded) {
    section.classList.add('vp-expanded');
    const chevron = section.querySelector('.vpw-az-chevron');
    if (chevron) chevron.innerHTML = chevronUpIcon;
    this.expandedLetter = letter;
  } else {
    this.expandedLetter = null;
  }
};

// Show A-Z accordion (hide search results)
Dictionary.prototype.showAzAccordion = function () {
  this.azAccordion.style.display = 'block';
  this.azSearchResults.style.display = 'none';
};

// Show search results (hide accordion)
Dictionary.prototype.showSearchResults = function () {
  this.azAccordion.style.display = 'none';
  this.azSearchResults.style.display = 'block';
};

// Fetch categories from API
Dictionary.prototype.fetchCategories = function () {
  const xhr = new XMLHttpRequest();
  xhr.open('get', CATEGORIES_URL, true);
  xhr.responseType = 'json';
  xhr.timeout = 15000;

  xhr.ontimeout = function () {
    console.error('Categories request timed out');
    this.renderCategoriesList([]);
  }.bind(this);

  xhr.onerror = function () {
    console.error('Error fetching categories');
    this.renderCategoriesList([]);
  }.bind(this);

  xhr.onload = function () {
    try {
      if (xhr.status == 200) {
        const categories = xhr.response || [];
        // Filter only active categories
        this.categoriesData = categories.filter(cat => cat.active !== false);
        this.renderCategoriesList(this.categoriesData);
      } else {
        console.error('Bad answer for categories, status: ' + xhr.status);
        this.renderCategoriesList([]);
      }
    } catch (err) {
      console.error(err);
      this.renderCategoriesList([]);
    }
  }.bind(this);

  xhr.send();
};

// Toggle between tabs
Dictionary.prototype.toggleTab = function (tab) {
  this.currentTab = tab;

  // Update button states
  this.categoriesBtn.classList.toggle('vp-selected', tab === 'categories');
  this.dictBtn.classList.toggle('vp-selected', tab === 'az');
  this.recentBtn.classList.toggle('vp-selected', tab === 'recents');

  // Update container visibility
  this.categoriesContainer.classList.toggle('vp-enabled', tab === 'categories');
  this.dictWords.classList.toggle('vp-enabled', tab === 'az');
  this.recentWords.classList.toggle('vp-enabled', tab === 'recents');

  // Hide category header when not on categories tab
  if (tab !== 'categories') {
    this.categoriesHeader.classList.remove('vp-visible');
  }
};

// Render the categories list
Dictionary.prototype.renderCategoriesList = function (categories) {
  this.categoriesList.innerHTML = '';

  if (!categories || categories.length === 0) {
    this.categoriesList.innerHTML = '<li style="color: #888; cursor: default; padding: 20px;">Nenhuma categoria disponível</li>';
    return;
  }

  categories.forEach((category) => {
    const categoryName = category.name;
    const displayName = formatCategoryName(categoryName);
    const li = document.createElement('li');
    li.setAttribute('data-category', categoryName);

    // Ícone da categoria - normalizar nome para busca
    const iconDiv = document.createElement('div');
    iconDiv.className = 'vpw-category-icon';
    
    // Extrair primeira palavra e normalizar (remover acentos, converter para minúsculas)
    const normalizedName = categoryName
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .split('_')[0]
      .split('/')[0];
    
    // Mapeamento de palavras-chave para nomes de arquivos
    const keywordMap = {
      'letras': 'alfabeto',
      'profissao': 'trabalho',
      'aparelho': 'maquinas',
    };
    
    const iconKey = keywordMap[normalizedName] || normalizedName;
    const icon = categoryIcons[iconKey] || '';
    
    if (icon) {
      iconDiv.innerHTML = icon;
    }
    li.appendChild(iconDiv);

    const nameSpan = document.createElement('span');
    nameSpan.className = 'vpw-category-name';
    nameSpan.textContent = displayName;

    // Seta indicando entrada
    const arrowSpan = document.createElement('span');
    arrowSpan.className = 'vpw-category-arrow';
    arrowSpan.innerHTML = '›';

    li.appendChild(nameSpan);
    li.appendChild(arrowSpan);

    li.onclick = () => this.loadCategorySigns(categoryName);

    this.categoriesList.appendChild(li);
  });
};

// Show categories list (hide signs list)
Dictionary.prototype.showCategoriesList = function () {
  this.currentCategory = null;
  this.categoriesHeader.classList.remove('vp-visible');
  this.categoriesList.style.display = 'block';
  this.categorySignsList.classList.remove('vp-visible');
  this.categoriesContainer.classList.remove('vp-isEmpty');
};

// Load signs for a specific category
Dictionary.prototype.loadCategorySigns = function (categoryName) {
  this.currentCategory = categoryName;
  const displayName = formatCategoryName(categoryName);
  this.categoryTitle.textContent = displayName;
  
  // Ícone da categoria no header - normalizar nome para busca (remover acentos)
  const normalizedName = categoryName
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .split('_')[0]
    .split('/')[0];
  
  // Mapeamento de palavras-chave para nomes de arquivos
  const keywordMap = {
    'letras': 'alfabeto',
    'profissao': 'trabalho',
    'aparelho': 'maquinas',
  };
  
  const iconKey = keywordMap[normalizedName] || normalizedName;
  const icon = categoryIcons[iconKey] || '';
  
  this.categoryHeaderIcon.innerHTML = icon;
  
  this.categoriesHeader.classList.add('vp-visible');
  this.categoriesList.style.display = 'none';
  this.categorySignsList.classList.add('vp-visible');
  this.categorySignsList.innerHTML = '<li class="vpw-loading-item">Carregando...</li>';
  this.categoriesContainer.classList.remove('vp-isEmpty');

  const url = `${CATEGORY_SIGNS_URL}?tag=${encodeURIComponent(categoryName)}`;

  const xhr = new XMLHttpRequest();
  xhr.open('get', url, true);
  xhr.responseType = 'json';
  xhr.timeout = 15000;

  xhr.ontimeout = function () {
    this.categorySignsList.innerHTML = '<li class="vpw-error-item">Tempo esgotado. Tente novamente.</li>';
  }.bind(this);

  xhr.onerror = function () {
    this.categorySignsList.innerHTML = '<li class="vpw-error-item">Erro ao carregar. Tente novamente.</li>';
  }.bind(this);

  xhr.onload = function () {
    try {
      if (xhr.status == 200) {
        const response = xhr.response;
        const signs = response.signs || [];

        this.categorySignsList.innerHTML = '';

        if (signs.length === 0) {
          this.categoriesContainer.classList.add('vp-isEmpty');
          return;
        }

        signs.forEach((sign) => {
          const li = this.createSignItem(sign, this.categorySignsList);
          this.categorySignsList.appendChild(li);
        });
      } else {
        this.categorySignsList.innerHTML = '<li class="vpw-error-item">Erro ao carregar categoria.</li>';
      }
    } catch (err) {
      console.error(err);
      this.categorySignsList.innerHTML = '<li class="vpw-error-item">Erro ao processar dados.</li>';
    }
  }.bind(this);

  xhr.send();
};

// Buscar definição/significado usando Wiktionary
Dictionary.prototype.fetchDefinition = function (gloss, callback) {
  // Verificar cache
  if (definitionsCache[gloss]) {
    callback(definitionsCache[gloss]);
    return;
  }

  // Processar a palavra (minúsculas e remover underscores)
  const processedWord = gloss.toLowerCase().replace(/_/g, ' ');
  
  const url = `${WIKTIONARY_API}?action=parse&redirects=1&format=json&origin=*&page=${encodeURIComponent(processedWord)}&prop=text&formatversion=2`;
  
  const xhr = new XMLHttpRequest();
  xhr.open('get', url, true);
  xhr.responseType = 'json';
  xhr.timeout = 10000;

  xhr.ontimeout = function () {
    callback(null, 'Tempo esgotado');
  }.bind(this);

  xhr.onerror = function () {
    callback(null, 'Erro ao buscar');
  }.bind(this);

  xhr.onload = function () {
    if (xhr.status === 200 && xhr.response && xhr.response.parse && xhr.response.parse.text) {
      const html = xhr.response.parse.text;
      const data = this.extractWiktionaryData(html, processedWord);
      
      if (data && data.definitions && data.definitions.length > 0) {
        definitionsCache[gloss] = data;
        callback(data);
      } else {
        // Tentar buscar sugestão
        this.fetchSuggestedWord(processedWord, (suggestedWord) => {
          if (suggestedWord && suggestedWord !== processedWord) {
            this.fetchWiktionaryPage(suggestedWord, callback, gloss);
          } else {
            callback(null, 'Não encontrado');
          }
        });
      }
    } else {
      // Tentar buscar sugestão
      this.fetchSuggestedWord(processedWord, (suggestedWord) => {
        if (suggestedWord && suggestedWord !== processedWord) {
          this.fetchWiktionaryPage(suggestedWord, callback, gloss);
        } else {
          callback(null, 'Não encontrado');
        }
      });
    }
  }.bind(this);

  xhr.send();
};

// Buscar página do Wiktionary diretamente
Dictionary.prototype.fetchWiktionaryPage = function (word, callback, originalGloss) {
  const url = `${WIKTIONARY_API}?action=parse&redirects=1&format=json&origin=*&page=${encodeURIComponent(word)}&prop=text&formatversion=2`;
  
  const xhr = new XMLHttpRequest();
  xhr.open('get', url, true);
  xhr.responseType = 'json';
  xhr.timeout = 10000;

  xhr.onload = function () {
    if (xhr.status === 200 && xhr.response && xhr.response.parse && xhr.response.parse.text) {
      const html = xhr.response.parse.text;
      const data = this.extractWiktionaryData(html, word);
      
      if (data && data.definitions && data.definitions.length > 0) {
        definitionsCache[originalGloss] = data;
        callback(data);
      } else {
        callback(null, 'Não encontrado');
      }
    } else {
      callback(null, 'Não encontrado');
    }
  }.bind(this);

  xhr.onerror = function () {
    callback(null, 'Erro ao buscar');
  };

  xhr.send();
};

// Buscar sugestão de palavra no Wiktionary
Dictionary.prototype.fetchSuggestedWord = function (word, callback) {
  const url = `${WIKTIONARY_SEARCH_API}?q=${encodeURIComponent(word)}&limit=1`;
  
  const xhr = new XMLHttpRequest();
  xhr.open('get', url, true);
  xhr.responseType = 'json';
  xhr.timeout = 5000;

  xhr.onload = function () {
    if (xhr.status === 200 && xhr.response && xhr.response.pages && xhr.response.pages.length > 0) {
      callback(xhr.response.pages[0].title);
    } else {
      callback(null);
    }
  };

  xhr.onerror = function () {
    callback(null);
  };

  xhr.send();
};

// Extrair dados do HTML do Wiktionary
Dictionary.prototype.extractWiktionaryData = function (html, word) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const data = {
    title: word,
    wordClass: '',
    definitions: [],
    pronunciation: '',
    etymology: ''
  };
  
  // Buscar definições em listas ordenadas (ol) dentro da seção de português
  const lists = doc.querySelectorAll('ol');
  
  lists.forEach(ol => {
    const items = ol.querySelectorAll('li');
    items.forEach(li => {
      // Remover sub-listas e elementos desnecessários
      const clone = li.cloneNode(true);
      const subLists = clone.querySelectorAll('ol, ul, dl');
      subLists.forEach(sl => sl.remove());
      
      let text = clone.textContent.trim();
      
      // Limpar o texto
      text = text.replace(/\s+/g, ' ').trim();
      
      // Ignorar textos muito curtos ou que são apenas números
      if (text.length > 3 && !/^\d+\.?\s*$/.test(text)) {
        // Limitar tamanho e remover referências
        text = text.replace(/\[\d+\]/g, '').trim();
        if (text.length > 0 && data.definitions.length < 5) {
          data.definitions.push(text);
        }
      }
    });
  });
  
  // Buscar classe gramatical
  const headers = doc.querySelectorAll('h3, h4');
  headers.forEach(h => {
    const text = h.textContent.toLowerCase();
    if (text.includes('substantivo') || text.includes('verbo') || 
        text.includes('adjetivo') || text.includes('advérbio') ||
        text.includes('pronome') || text.includes('preposição')) {
      data.wordClass = h.textContent.trim();
    }
  });
  
  // Buscar pronúncia
  const pronElements = doc.querySelectorAll('.IPA');
  if (pronElements.length > 0) {
    data.pronunciation = pronElements[0].textContent.trim();
  }
  
  return data;
};

// Traduzir texto PT-BR para Libras (gloss)
Dictionary.prototype.translatePtBr = function (text, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', TRANSLATE_URL, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.responseType = 'text';
  xhr.timeout = 15000;

  xhr.ontimeout = function () {
    callback(null, 'Tempo esgotado');
  };

  xhr.onerror = function () {
    callback(null, 'Erro na tradução');
  };

  xhr.onload = function () {
    if (xhr.status === 200) {
      const gloss = xhr.responseText;
      callback(gloss);
    } else {
      callback(null, 'Falha na tradução');
    }
  };

  xhr.send(JSON.stringify({ text: text }));
};

// Criar elemento de item de sinal com expansão
Dictionary.prototype.createSignItem = function (sign, container) {
  const li = document.createElement('li');
  li.setAttribute('data-gloss', sign);
  
  // Texto do sinal (clique traduz direto)
  const textSpan = document.createElement('span');
  textSpan.className = 'vpw-sign-text';
  textSpan.innerHTML = formatGloss(sign);
  textSpan.onclick = (e) => {
    e.stopPropagation();
    this.translateGloss(sign, formatGloss(sign));
  };
  
  // Botão de expandir (chevron)
  const expandBtn = document.createElement('button');
  expandBtn.className = 'vpw-sign-expand-btn';
  expandBtn.innerHTML = chevronDownIcon;
  expandBtn.title = 'Ver significado';
  expandBtn.onclick = (e) => {
    e.stopPropagation();
    this.toggleSignExpansion(li, sign);
  };
  
  li.appendChild(textSpan);
  li.appendChild(expandBtn);
  
  // Área de definição (inicialmente oculta)
  const definitionArea = document.createElement('div');
  definitionArea.className = 'vpw-sign-definition';
  li.appendChild(definitionArea);
  
  return li;
};

// Toggle expansão do sinal
Dictionary.prototype.toggleSignExpansion = function (liElement, gloss) {
  const isExpanded = liElement.classList.contains('vp-expanded');
  const definitionArea = liElement.querySelector('.vpw-sign-definition');
  const expandBtn = liElement.querySelector('.vpw-sign-expand-btn');
  
  if (isExpanded) {
    // Colapsar
    liElement.classList.remove('vp-expanded');
    expandBtn.innerHTML = chevronDownIcon;
    definitionArea.innerHTML = '';
  } else {
    // Expandir e buscar definição
    liElement.classList.add('vp-expanded');
    expandBtn.innerHTML = chevronUpIcon;
    definitionArea.innerHTML = '<span class="vpw-definition-loading">Carregando...</span>';
    
    this.fetchDefinition(gloss, (data, error) => {
      if (error || !data) {
        definitionArea.innerHTML = `<span class="vpw-definition-error">${error || 'Definição não encontrada'}</span>`;
        return;
      }
      
      this.renderDefinition(definitionArea, data, gloss);
    });
  }
};

// Renderizar definição dentro do item expandido
Dictionary.prototype.renderDefinition = function (container, data, gloss) {
  container.innerHTML = '';
  
  // Verificar se há definições
  const definitions = data.definitions || [];
  
  if (definitions.length === 0) {
    container.innerHTML = '<span class="vpw-definition-empty">Nenhuma definição disponível</span>';
    return;
  }
  
  // Adicionar label "SIGNIFICADO"
  const labelDiv = document.createElement('div');
  labelDiv.className = 'vpw-word-class';
  labelDiv.textContent = 'SIGNIFICADO';
  container.appendChild(labelDiv);
  
  // Renderizar definições
  definitions.forEach((def, index) => {
    const defText = typeof def === 'string' ? def : def.text || def.definition;
    if (defText) {
      this.createDefinitionRow(container, defText, index + 1);
    }
  });
};

// Criar linha de definição com botão de tradução
Dictionary.prototype.createDefinitionRow = function (container, defText, number) {
  const row = document.createElement('div');
  row.className = 'vpw-definition-row';
  
  const textSpan = document.createElement('span');
  textSpan.className = 'vpw-definition-text';
  textSpan.innerHTML = number ? `${number}. ${defText}` : defText;
  
  const translateBtn = document.createElement('button');
  translateBtn.className = 'vpw-translate-btn';
  translateBtn.title = 'Traduzir para Libras';
  translateBtn.innerHTML = handsTranslateIcon;
  translateBtn.onclick = (e) => {
    e.stopPropagation();
    this.translateDefinitionText(defText, translateBtn);
  };
  
  row.appendChild(textSpan);
  row.appendChild(translateBtn);
  container.appendChild(row);
};

// Traduzir texto de definição para Libras
Dictionary.prototype.translateDefinitionText = function (text, button) {
  // Mostrar loading no botão
  const originalContent = button.innerHTML;
  button.innerHTML = '<span class="vpw-btn-loading"></span>';
  button.disabled = true;
  
  this.translatePtBr(text, (gloss, error) => {
    button.innerHTML = originalContent;
    button.disabled = false;
    
    if (error || !gloss) {
      console.error('Erro na tradução:', error);
      // Mostrar feedback visual de erro
      button.classList.add('vpw-translate-error');
      setTimeout(() => button.classList.remove('vpw-translate-error'), 1500);
      return;
    }
    
    // Reproduzir a tradução
    this.boundCloseAllScreen();
    this.player.play(gloss);
    this.player.text = text;
    this.player.translation = gloss;
    this.player.translated = true;
    this.player.fromDictionary = true;
    
    // Salvar no histórico
    const recentWords = getRecentWords();
    recentWords.unshift(JSON.stringify([gloss, text]));
    saveRecentWords(recentWords);
  });
};

// Traduzir gloss diretamente (quando clica no nome do sinal)
Dictionary.prototype.translateGloss = function (gloss, label) {
  if (!gloss) return;
  if (gloss === '%') gloss = '%25';

  this.boundCloseAllScreen();
  this.player.play(gloss);
  this.player.text = gloss;
  this.player.translation = gloss;
  this.player.translated = false;
  this.player.fromDictionary = true;

  const recentWords = getRecentWords();
  recentWords.unshift(JSON.stringify([gloss, label]));
  saveRecentWords(recentWords);
};

Dictionary.prototype.onGlossClick = function (event, isRecent = false) {
  // Find the li element (in case we clicked on a child)
  let target = event.target;
  while (target && target.tagName !== 'LI') {
    target = target.parentElement;
  }
  
  if (!target || target.tagName !== 'LI') return;

  let gloss = target.getAttribute('data-gloss');
  const textElement = target.querySelector('.vpw-sign-text');
  const label = textElement ? textElement.innerText : target.innerText;

  if (!gloss) return;
  
  this.translateGloss(gloss, label);
};

Dictionary.prototype.toggle = function () {
  if (this.visible) this.hide();
  else this.show();
};

Dictionary.prototype.hide = function () {
  this.visible = false;
  this.element.classList.remove('active');
  this.button.classList.remove('selected');
  this.emit('hide');
};

Dictionary.prototype.show = function () {
  this.visible = true;
  this.element.classList.add('active');
  this.button.classList.add('selected');
  resetDictionary.bind(this)();
  
  // Resetar scroll para o topo
  this.categoriesContainer.scrollTop = 0;
  this.dictWords.scrollTop = 0;
  this.recentWords.scrollTop = 0;
  
  this.emit('show');
};

function closeAllScreen() {
  this.closeScreen.closeAll();
  this.isWidget && this.initGuide.hide();
}

function resetDictionary() {
  if (!this.signs) return;
  this.searchInput.value = '';
  this.boundToggleTab('categories');
  this.showCategoriesList();
  this.showAzAccordion();
}

function loadRecentWords(recentWordsDiv) {
  let data = localStorage.getItem(DICT_LOCAL_KEY);

  recentWordsDiv.classList.toggle('vp-isEmpty', !data);

  if (data) data = JSON.parse(data);
  else return;

  const list = recentWordsDiv.querySelector('ul');
  list.onclick = (e) => this.onGlossClick(e, true);
  list.innerHTML = '';

  for (item of data) {
    const [gloss, label] = JSON.parse(item);
    const li = document.createElement('li');
    li.innerHTML = label;
    li.setAttribute('data-gloss', gloss);
    list.appendChild(li);
  }
}

function getRecentWords() {
  return JSON.parse(localStorage.getItem(DICT_LOCAL_KEY)) || [];
}

function saveRecentWords(list) {
  list = Array.from(new Set(list));
  localStorage.setItem(DICT_LOCAL_KEY, JSON.stringify(list));
}

module.exports = Dictionary;
