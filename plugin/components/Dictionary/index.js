var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;

var dictionaryTpl = require('./dictionary.html');
require('./dictionary.scss');

var Trie = require('./trie.js');
var NonBlockingProcess = require('./non-blocking-process.js');

function Dictionary(player)
{
  this.visible = false;
  this.player = player;
}

inherits(Dictionary, EventEmitter);

Dictionary.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = dictionaryTpl;
  this.element.classList.add('dictionary');

  // Close button
  this.element.querySelector('.panel .bar .btn-close')
    .addEventListener('click', this.hide.bind(this));

  // Signs trie
  this.signs = new Trie(characters);

  // List
  this.list = this.element.querySelector('ul');

  // Clear list method
  this.list._clear = function()
  {
    this.list.innerHTML = '';
    this.list.appendChild(this.defaultItem);
  }.bind(this);

  // Insert item method
  this.list._insert = function(word)
  {
    var item = document.createElement('li');
    item.innerHTML = word;
    item.addEventListener('click', this._onItemClick.bind(this));

    this.list.appendChild(item);
  }.bind(this);

  // Default first item
  this.defaultItem = this.list.querySelector('li');

  // Search
  this.element.querySelector('.panel .search input')
    .addEventListener('keyup', function(event) {
      console.log(event.target.value);

      this.list._clear();
      this.signs.feed(event.target.value.toUpperCase(), this.list._insert.bind(this.list));
    }.bind(this));

  // Request and load list
  this.process = null;
  var xhr = new XMLHttpRequest();
  xhr.open('get', 'http://150.165.205.206:3000/signs', true);
  xhr.responseType = 'json';
  xhr.onload = function()
  {
    if (xhr.status == 200)
    {
      console.log('Starting trie processing.');

      this.process = new NonBlockingProcess(
        xhr.response,
        this.signs.add.bind(this.signs),
        4,
        60,
        function() {
          console.log('Starting list processing.');
          this.signs.feed('', this.list._insert.bind(this.list));
          document.querySelector('.controls .controls-dictionary')
            .classList.remove('loading-dictionary');
        }.bind(this)
      );
      this.process.start();
    }
    else console.log('Bad answer for signs, status: ' + xhr.status);
  }.bind(this);
  xhr.send();

  this.hide();
};

Dictionary.prototype._onItemClick = function(event) {
  this.hide();
  this.player.play(event.target.innerHTML);
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


var characters = [
  ',', '_', '!', '?',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'A', 'Á', 'Â', 'Ã', 'À', 'B', 'C', 'Ç', 'D', 'E',
  'É', 'Ê', 'F', 'G', 'H', 'I', 'Í', 'J', 'K', 'L',
  'M', 'N', 'O', 'Ó', 'Ô', 'Õ', 'P', 'Q', 'R', 'S',
  'T', 'U', 'Ú', 'V', 'W', 'X', 'Y', 'Z'
];