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

  // Add icon
  this.element.querySelector('.vpw-icon').innerHTML = dictionaryIcon;

  // Signs trie
  this.signs = null;

  // List
  this.list = this.element.querySelector('ul');

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
  const xhr = new XMLHttpRequest();
  xhr.open(
    'get',
    'https://dicionario2.vlibras.gov.br/signs?version=2018.3.1',
    true
  );
  xhr.responseType = 'text';
  xhr.onload = function () {
    if (xhr.status == 200) {
      const json = JSON.parse(xhr.response);

      this.signs = new Trie(json);

      this.signs.loadSigns('', this.list._insert.bind(this.list));
      document
        .querySelector('.vpw-loading-dictionary').remove()
    } else console.error('Bad answer for signs, status: ' + xhr.status);
  }.bind(this);
  xhr.send();

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
        this.list.innerHTML = '<span>Nada encontrado :(</span>';
      }
    }.bind(this)
  );
};

Dictionary.prototype._onItemClick = function (event, word) {
  this.closeScreen.closeAll();
  this.player.play(event);
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
