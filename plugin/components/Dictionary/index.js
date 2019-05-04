var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;

var dictionaryTpl = require('./dictionary.html');
require('./dictionary.scss');

var Trie = require('./trie.js');
// var NonBlockingProcess = require('./non-blocking-process.js');

function Dictionary(player)
{
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

  // Close button
  // this.element.querySelector('.panel .bar .btn-close')
  //   .addEventListener('click', this.hide.bind(this));

  // Signs trie
  this.signs = null;

  // List
  this.list = this.element.querySelector('ul');
  // Default first item
  

  // Insert item method
  this.list._insert = function(word)
  {
    var item = document.createElement('li');
    item.innerHTML = word;
    item.addEventListener('click', this._onItemClick.bind(this));

    this.list.appendChild(item);
  }.bind(this);

 

  // Request and load list
  var xhr = new XMLHttpRequest();
  xhr.open('get', 'http://150.165.204.184:8083/signs', true);
  //xhr.open('get', 'http://35.202.17.202:80/signs', true);
  xhr.responseType = 'text';
  xhr.onload = function()
  {
    if (xhr.status == 200)
    {
      console.log('Starting trie processing.');

      var json = JSON.parse(xhr.response);
      console.log(json);
      
      this.signs = new Trie().fromJSON(json);

      var basicSigns = [
        'A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'H', 'I',
        'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
        'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        ','
      ];

      for (var i in basicSigns)
        this.signs.add(basicSigns[i]);

      console.log(this.signs);

      this.signs.feed('', this.list._insert.bind(this.list));
      document.querySelector('.vpw-controls-dictionary.vpw-loading-dictionary').classList.remove('vpw-loading-dictionary');
    }
    else console.log('Bad answer for signs, status: ' + xhr.status);
  }.bind(this);
  xhr.send();

  this.defaultItem = this.list.querySelector('li');
  console.log(this.defaultItem);

  // Clear list method
  this.list._clear = function()
  {
    this.list.innerHTML = '';
    // this.list.appendChild(this.defaultItem);
  }.bind(this);

  // Search
  this.element.querySelector('.vpw-panel .vpw-search input')
    .addEventListener('keydown', function(event) {
      console.log(event.target.value);

      this.list._clear();
      this.signs.feed(event.target.value.toUpperCase(), this.list._insert.bind(this.list));
    }.bind(this));

  // this.hide();
};

Dictionary.prototype._onItemClick = function(event) {
  this.closeScreen.closeAll();
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
