const inherits = require('inherits');
const EventEmitter = require('events').EventEmitter;

const settingsTpl = require('./settings.html').default;
require('./settings.scss');
require('./regionalism.scss');
require('./switch.scss');

const regionsData = require('./data');
const { backIcon, positionIcons } = require('../../assets/icons')

function Settings(player, option, opacity) {
  this.visible = false;
  this.player = player;

  enable = option.enableMoveWindow;
  opacityUser = opacity;
}

inherits(Settings, EventEmitter);

Settings.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = settingsTpl;
  this.element.classList.add('vpw-settings');
  this.localism = this.element.querySelector('.vpw-regions-container');
  this.toggleHeader = toggleHeader;

  // Header element
  const header = this.element.querySelector('.vpw-screen-header span');

  // Config back button
  const backButton = this.element.querySelector('.vpw-screen-header button');
  backButton.innerHTML = backIcon;
  backButton.onclick = handleReturn.bind(this);

  // Access regionalism button
  const regionalismBtn = this.element.querySelector('.vpw-selected-region');
  regionalismBtn.onclick = accessRegionalism.bind(this);

  // Opacity option
  const opacityInput = this.element.querySelector('.vpw-opacity-range input');
  const opacitySlider = this.element.querySelector('.vpw-opacity-range vpw-slider');
  const opacityValue = this.element.querySelector('.vpw-opacity-value');
  opacityInput.oninput = setOpacity;

  // Position option box
  const positionBox = this.element.querySelector('.vpw-position-box');

  // Creates regions grid
  const regionHTML = require('./region.html').default;
  let activeRegion = null;

  // eslint-disable-next-line guard-for-in
  for (const region of regionsData) {

    const element = document.createElement('div');
    element.classList.add('vpw-region');
    element.innerHTML = regionHTML;

    if (region === regionsData[0]) {
      element.classList.add('selected');
      activeRegion = element;
    }

    element.querySelector('.vpw-flag').setAttribute('data-src', region.flag);
    element.querySelector('.vpw-name').innerHTML = 
      region === regionsData[0] 
      ? 'Brasil (Padrão Nacional)'
      : `${region.name} - ${region.path}`
    
    element.onclick = () => {
      if (activeRegion === element) return;
      element.classList.add('selected');
      activeRegion.classList.remove('selected');
      activeRegion = element;

      // Set region in button
      regionalismBtn.querySelector('img').src = region.flag;
      regionalismBtn.querySelector('span').innerHTML = region.path;

      // Send to player
      this.player.setRegion(region.path);

      handleReturn.bind(this)();
    }
    this.localism.appendChild(element);
  }

  // Add positions in box
  for (const position of widgetPositions) {
    const span = document.createElement('span');

    if (position) span.innerHTML = 
    positionIcons[widgetPositions.indexOf(position)];

    if (position === 'R') span.classList.add('vpw-select-pos');
    
    positionBox.appendChild(span);
    
    if (!position) span.style.visibility = 'hidden';
    else span.onclick = () => {
      window.dispatchEvent(
        new CustomEvent('vp-widget-wrapper-set-side', { 
          detail: { position }
        }));
      
      positionBox.querySelector('.vpw-select-pos')
      .classList.remove('vpw-select-pos');

      span.classList.add('vpw-select-pos');
    }
  }

  // Elements to apply blur filter
  this.gameContainer = document.querySelector('div#gameContainer');
  this.controlsElement = document.querySelector('.vpw-controls');
  
  function setOpacity() {
    const value = Number(opacityInput.value);
    const percent = value < 25 ? value + 5 : value;

    opacitySlider.style.width = percent + '%';
    opacityValue.innerHTML = value + '%';

    window.dispatchEvent(
      new CustomEvent('vw-change-opacity', { detail: value / 100 })
    );
  }

  function accessRegionalism() {
    this.localism.classList.add('active');
    toggleHeader();
  }

  const panelIsOpen = function() {
    return this.localism.classList.contains('active');
  }.bind(this);

  function handleReturn() {
     if (panelIsOpen()) {
      this.localism.scrollTo(0, 0);
      this.localism.classList.remove('active');
    } else {
      this.hide();
      document.querySelector('.vpw-header-btn-settings')
      .classList.remove('selected');
    }
    toggleHeader();
  }

  function toggleHeader() {
    header.innerHTML = panelIsOpen() 
    ? 'Regionalismo' 
    : 'Configurações';
  }

};

Settings.prototype.setRegion = function (region) {

  // Updates selected region
  // if (window.plugin.rootPath) {
  //   this.selectedRegion._flag.src =
  //     window.plugin.rootPath + '/' + this.region._data.flag;
  // } else {
  //   this.selectedRegion._flag.src = this.region._data.flag;
  // }

};

Settings.prototype.toggle = function () {
  if (this.visible) this.hide();
  else this.show();
};

Settings.prototype.hide = function (menuOn) {
  this.visible = false;
  this.element.classList.remove('active');
  this.localism.classList.remove('active');

  // Removes blur filter
  this.gameContainer.classList.remove('vpw-blur');
  this.controlsElement.classList.remove('vpw-blur');

  this.toggleHeader();

  this.emit('hide');
};

Settings.prototype.show = function () {
  this.visible = true;
  this.element.classList.add('active');

  // Apply blur filter
  this.gameContainer.classList.add('vpw-blur');
  this.controlsElement.classList.add('vpw-blur');

  this.emit('show');
};

module.exports = Settings;


const widgetPositions = [
    'TL', 'T', 'TR',
    'L', null, 'R',
    'BL', 'B', 'BR'
]

// Sends to player
  // this.player.setRegion(this.region._data.path);
  // window.dispatchEvent(
  //   new CustomEvent('vp-widget-wrapper-set-side', {
  //     detail: { right: true },
  //   })
