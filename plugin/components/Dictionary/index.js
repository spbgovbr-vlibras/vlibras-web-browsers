const { backIcon } = require('../../assets/icons')

const inherits = require('inherits');
const EventEmitter = require('events').EventEmitter;

const dictionaryTpl = require('./dictionary.html').default;
require('./dictionary.scss');

const { dictionaryIcon } = require('../../assets/icons')

const Trie = require('./trie.js');

function Dictionary(player) {
  this.visible = false;
  this.player = player;
  this.closeScreen = null;
}

inherits(Dictionary, EventEmitter);

Dictionary.prototype.load = function (element, closeScreen) {
  this.element = element;
  this.element.innerHTML = dictionaryTpl;
  this.element.classList.add('vpw-dictionary');
  this.closeScreen = closeScreen;

  const backButton = this.element.querySelector('.vpw-btn-close');
  const buttons = this.element.querySelectorAll('.buttons-container button');
  const recentWords = this.element.querySelector('.vpw-recents-container');
  const dictWords = this.element.querySelector('.vpw-dict-container');
  const loadingScreen = this.element.querySelector('.vpw-loading-dictionary');
  const reloadDictButton = loadingScreen.querySelector('div button');

  reloadDictButton.onclick = getSigns.bind(this);

  this.loadRecentWords = function () {
    let value = localStorage.getItem('@vp-dict-history');
    if (value) value = JSON.parse(value);
    else return;

    const list = recentWords.querySelector('ul');
    list.innerHTML = "";

    for (word of value.reverse()) {
      const item = document.createElement('li');
      item.innerHTML = word;
      list.appendChild(item);

      item.addEventListener('click', this._onItemClick.bind(this, word));
    }
  }.bind(this);

  buttons[0].onclick = () => {
    toggleWords('dict');
  }

  buttons[1].onclick = () => {
    toggleWords('recents');
    this.loadRecentWords();
  }

  function toggleWords(words) {
    if (words === 'dict') {
      buttons[0].classList.add('vp-selected');
      buttons[1].classList.remove('vp-selected');
      recentWords.classList.remove('enabled');
      dictWords.classList.add('enabled');
    } 
    else if (words === 'recents') {
      buttons[1].classList.add('vp-selected');
      buttons[0].classList.remove('vp-selected');
      recentWords.classList.add('enabled');
      dictWords.classList.remove('enabled');
    } else return;
  }

  // Add icon
  this.element.querySelector('.vpw-icon').innerHTML = dictionaryIcon;
  this.element.querySelector('.vpw-btn-close').innerHTML = backIcon;

  backButton.addEventListener(
    'click',
    function () {
      this.hide();
    }.bind(this)
  );


  // Signs trie
  this.signs = null;

  // List
  this.list = dictWords.querySelector('ul');

  // Insert item method
  this.list._insert = function (word) {
    const item = document.createElement('li');

    if (word.indexOf('&') != -1) {
      regex = word.replace('&', '(');
      regex = regex + ')';
      item.innerHTML = regex;
      item.addEventListener('click', this._onItemClick.bind(this, word));
      this.list.appendChild(item);
    } else {
      item.innerHTML = word;
      item.addEventListener('click', this._onItemClick.bind(this, word));
      this.list.appendChild(item);
    }
  }.bind(this);

  // Request and load list
  function getSigns() {
    loadingScreen.classList.remove('vpw-dict--error');
    const xhr = new XMLHttpRequest();
    xhr.open(
      'get',
      'https://dicionario2-dth.vlibras.gov.br/signs?version=2018.3.1',
      true
    );
    xhr.responseType = 'text';
    xhr.onload = function () {
      try {
        if (xhr.status == 200) {
          const json = JSON.parse(xhr.response);
  
          this.signs = new Trie(json);
  
          this.signs.loadSigns('', this.list._insert.bind(this.list));
          loadingScreen.remove();
        } else {
          loadingScreen.classList.add('vpw-dict--error');
          console.error('Bad answer for signs, status: ' + xhr.status);
        }
      } catch (err) {
        loadingScreen.classList.add('vpw-dict--error');
        console.log(err);
      }
    }.bind(this);
    xhr.send();
  }

  getSigns.bind(this)();

  this.defaultItem = this.list.querySelector('li');

  // Clear list method
  this.list._clear = function () {
    this.list.innerHTML = '';
  }.bind(this);

  // Search
  this.element.querySelector('.vpw-panel .vpw-search input').addEventListener(
    'keydown',
    function (event) {
      this.list._clear();
      this.signs.loadSigns(
        event.target.value.toUpperCase(),
        this.list._insert.bind(this.list)
      );
      if (this.list.childNodes.length === 0) {
        this.list.innerHTML = '<span>Nenhum sinal encontrado :(</span>';
      }
      
      toggleWords('dict');

    }.bind(this)
  );
};

Dictionary.prototype._onItemClick = function (event, word) {
  this.closeScreen.closeAll();
  this.player.play(event);

  if (this.element.querySelectorAll('.buttons-container button')[1]
      .classList.contains('vp-selected')
  ) return;

  let value = localStorage.getItem("@vp-dict-history");
  if (value) {
    value = JSON.parse(value);
    value.push(event)
  } else value = [event];

  localStorage.setItem("@vp-dict-history", JSON.stringify(value));
  this.loadRecentWords();
};

Dictionary.prototype.toggle = function () {
  if (this.visible) this.hide();
  else this.show();
};

Dictionary.prototype.hide = function () {
  this.visible = false;
  this.element.classList.remove('active');
  this.emit('hide');
};

Dictionary.prototype.show = function () {
  this.visible = true;
  this.element.classList.add('active');
  this.emit('show');
};

module.exports = Dictionary;
