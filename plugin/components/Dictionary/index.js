const inherits = require('inherits');
const EventEmitter = require('events').EventEmitter;

const dictionaryTpl = require('./dictionary.html').default;
require('./dictionary.scss');

const Trie = require('./trie.js');

const { backIcon, loadingIcon, dictionaryIcon } = require('~icons');
const { DICTIONARY_URL } = require('../../config');
const DICT_LOCAL_KEY = "@vp-dict-history";

function Dictionary(player) {
  this.visible = false;
  this.player = player;
  this.closeScreen = null;
  this.button = null;
}

inherits(Dictionary, EventEmitter);

Dictionary.prototype.load = function (element, closeScreen) {
  this.element = element;
  this.element.innerHTML = dictionaryTpl;
  this.element.classList.add('vpw-dictionary');
  this.button = document.querySelector('.vpw-header-btn-dictionary');
  this.closeScreen = closeScreen;
  this.searchInput = element.querySelector('.vpw-search input')


  const backButton = this.element.querySelector('.vpw-btn-close');
  const dictBtn = this.element.querySelectorAll('.vp-dictionary-btn')[0];
  const recentBtn = this.element.querySelectorAll('.vp-dictionary-btn')[1];
  const recentWords = this.element.querySelector('.vpw-recents-container');
  const dictWords = this.element.querySelector('.vpw-dict-container');
  const loadingScreen = this.element.querySelector('.vpw-loading-dictionary');
  const reloadDictButton = loadingScreen.querySelector('div button');
  let reqCounter = 0;

  this.boundLoadRecentWords = () => loadRecentWords.bind(this)(recentWords);
  this.boundToggleWords = (aba) => toggleWords(aba);

  reloadDictButton.onclick = () => {
    getSigns.bind(this)();
  }

  dictBtn.onclick = () => {
    toggleWords('dict');
  }

  recentBtn.onclick = () => {
    toggleWords('recents');
    this.boundLoadRecentWords();
  }

  // Add icon
  this.element.querySelector('.vpw-icon').innerHTML = dictionaryIcon;
  this.element.querySelector('.vpw-btn-close').innerHTML = backIcon;
  document.querySelector('.vpw-loading__img').innerHTML = loadingIcon;

  backButton.addEventListener(
    'click',
    function () {
      this.hide();
      document.querySelector('.vpw-header-btn-dictionary')
        .classList.remove('selected');
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

  const addRetryBtn = () => loadingScreen.classList.add('vpw-dict--error');
  const removeRetryBtn = () => loadingScreen.classList.remove('vpw-dict--error');
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
    }

    xhr.onerror = err => checkRequests(err);

    xhr.onload = function () {
      try {
        if (xhr.status == 200) {
          const json = JSON.parse(xhr.response);

          this.signs = new Trie(json);

          this.signs.loadSigns('', this.list._insert.bind(this.list));
          loadingScreen.remove();
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

  function toggleWords(words) {
    const isDict = words === 'dict';

    dictBtn.classList.toggle('vp-selected', isDict);
    recentBtn.classList.toggle('vp-selected', !isDict);
    dictWords.classList.toggle('vp-enabled', isDict);
    recentWords.classList.toggle('vp-enabled', !isDict);
  }

  getSigns.bind(this)();

  this.defaultItem = this.list.querySelector('li');

  // Clear list method
  this.list._clear = function () {
    this.list.innerHTML = '';
  }.bind(this);

  // Search
  this.searchInput.addEventListener('input', function (event) {
    this.list._clear();
    this.signs.loadSigns(
      event.target.value.toUpperCase(),
      this.list._insert.bind(this.list)
    );

    this.list.parentElement.classList.toggle(
      'vp-isEmpty', this.list.childNodes.length === 0
    )

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

  const recentWords = getRecentWords();
  recentWords.push(event);

  saveRecentWords.bind(this)(recentWords);
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
  this.emit('show');
};

function resetDictionary() {
  if (!this.signs) return;
  this.list._clear();
  this.signs.loadSigns('', this.list._insert.bind(this.list));
  this.searchInput.value = '';
  this.boundToggleWords('dict');
}

function loadRecentWords(recentWordsDiv) {
  let value = localStorage.getItem(DICT_LOCAL_KEY);

  recentWordsDiv.classList.toggle('vp-isEmpty', !value);

  if (value) value = JSON.parse(value);
  else return;

  const list = recentWordsDiv.querySelector('ul');
  list.innerHTML = "";

  for (word of value.reverse()) {
    const item = document.createElement('li');
    item.innerHTML = word;
    list.appendChild(item);

    item.addEventListener('click', this._onItemClick.bind(this, word));
  }
}

function getRecentWords() {
  return JSON.parse(localStorage.getItem(DICT_LOCAL_KEY)) || []
}

function saveRecentWords(list) {
  localStorage.setItem(DICT_LOCAL_KEY, JSON.stringify(list));
  this.boundLoadRecentWords();
}

module.exports = Dictionary;
