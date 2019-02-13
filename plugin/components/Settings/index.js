var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;

var settingsTpl = require('./settings.html');
require('./settings.scss');

function Settings(player, infoScreen) {
  this.visible = false;
  this.player = player;
  this.infoScreen = infoScreen;
}

inherits(Settings, EventEmitter);

Settings.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = settingsTpl;
  this.element.classList.add('settings');

  // Localism panel
  this.localism = this.element.querySelector('.content > .localism');

  // Close events
  this.element.querySelector('.wall')
    .addEventListener('click', this.hide.bind(this));
  this.element.querySelector('.content .bar .btn-close')
    .addEventListener('click', this.hide.bind(this));

  // Selected region
  this.selectedRegion = this.element.querySelector('.content > ul .localism');
  this.selectedRegion._name = this.selectedRegion.querySelector('.abbrev');
  this.selectedRegion._flag = this.selectedRegion.querySelector('img.flag');
  this.selectedRegion.addEventListener('click', function() {
    this.localism.classList.toggle('active');
  }.bind(this));

  // About button
  this.element.querySelector('.content > ul .about')
    .addEventListener('click', function() {
      this.hide();
      this.infoScreen.show();
    }.bind(this));


  // National
  this.national = this.localism.querySelector('.national');
  this.national._data = nationalData;
  this.national.classList.add('selected');
  this.national.addEventListener('click', function() {
    this.setRegion(this.national);
  }.bind(this));

  // Selected region
  this.region = this.national;

  // Creates regions grid
  var regions = this.localism.querySelector('.regions');
  var regionHTML = require('./region.html');

  for (var i in regionsData) {
    var data = regionsData[i];

    var region = document.createElement('div');
    region.innerHTML = regionHTML;

    region._data = data;
    region._setRegion = this.setRegion.bind(this);

    region.querySelector('img.flag').src = data.flag;
    region.querySelector('.name').innerHTML = data.name;
    region.addEventListener('click', function() {
      this._setRegion(this);
    });

    regions.appendChild(region);
  }

  // Elements to apply blur filter
  this.gameContainer = document.querySelector('div#gameContainer');
  this.controlsElement = document.querySelector('.controls');

  this.hide();
};

Settings.prototype.setRegion = function (region) {
  // Deactivate localism panel
  this.localism.classList.remove('active');

  // Select new region
  this.region.classList.remove('selected');
  this.region = region;
  this.region.classList.add('selected');

  // Updates selected region
  this.selectedRegion._name.innerHTML = this.region._data.name;
  this.selectedRegion._flag.src = this.region._data.flag;

  // Sends to player
  this.player.setRegion(this.region._data.path);
};

Settings.prototype.toggle = function () {
  if (this.visible) this.hide();
  else this.show();
};

Settings.prototype.hide = function () {
  this.visible = false;
  this.element.classList.remove('active');
  this.localism.classList.remove('active');

  // Removes blur filter
  this.gameContainer.classList.remove('blur');
  this.controlsElement.classList.remove('blur');
  
  this.emit('hide');
};

Settings.prototype.show = function () {
  this.visible = true;
  this.element.classList.add('active');

  // Apply blur filter
  this.gameContainer.classList.add('blur');
  this.controlsElement.classList.add('blur');
  
  this.emit('show');
};

module.exports = Settings;

var nationalData = { name: 'BR', path: '', flag: 'assets/brazil.png' };
var regionsData = [
  { name: 'AC', path: 'AC', flag: 'assets/1AC.png' },
  { name: 'MA', path: 'MA', flag: 'assets/10MA.png' },
  { name: 'RJ', path: 'RJ', flag: 'assets/19RJ.png' },
  { name: 'AL', path: 'AL', flag: 'assets/2AL.png' },
  { name: 'MT', path: 'MT', flag: 'assets/11MT.png' },
  { name: 'RN', path: 'RN', flag: 'assets/20RN.png' },
  { name: 'AP', path: 'AP', flag: 'assets/3AP.png' },
  { name: 'MS', path: 'MS', flag: 'assets/12MS.png' },
  { name: 'RS', path: 'RS', flag: 'assets/21RS.png' },
  { name: 'AM', path: 'AM', flag: 'assets/4AM.png' },
  { name: 'MG', path: 'MG', flag: 'assets/13MG.png' },
  { name: 'RO', path: 'RO', flag: 'assets/22RO.png' },
  { name: 'BA', path: 'BA', flag: 'assets/5BA.png' },
  { name: 'PA', path: 'PA', flag: 'assets/14PA.png' },
  { name: 'RR', path: 'RR', flag: 'assets/23RR.png' },
  { name: 'DF', path: 'DF', flag: 'assets/7DF.png' },
  { name: 'PB', path: 'PB', flag: 'assets/15PB.png' },
  { name: 'SC', path: 'SC', flag: 'assets/24SC.png' },
  { name: 'CE', path: 'CE', flag: 'assets/6CE.png' },
  { name: 'PR', path: 'PR', flag: 'assets/16PR.png' },
  { name: 'SP', path: 'SP', flag: 'assets/25SP.png' },
  { name: 'ES', path: 'ES', flag: 'assets/8ES.png' },
  { name: 'PE', path: 'PE', flag: 'assets/17PE.png' },
  { name: 'SE', path: 'SE', flag: 'assets/26SE.png' },
  { name: 'GO', path: 'GO', flag: 'assets/9GO.png' },
  { name: 'PI', path: 'PI', flag: 'assets/18PI.png' },
  { name: 'TO', path: 'TO', flag: 'assets/27TO.png' }
];