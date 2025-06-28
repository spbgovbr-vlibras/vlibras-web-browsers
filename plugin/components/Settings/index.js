const inherits = require('inherits');
const EventEmitter = require('events').EventEmitter;

const settingsTpl = require('./settings.html').default;
require('./settings.scss');
require('./regionalism.scss');

const regionsData = require('./data');
const { backIcon, positionIcons } = require('~icons');
const { setWidgetPosition, removeClass, addClass, $ } = require('~utils');

function Settings(player, opacity, position, options) {
  this.visible = false;
  this.player = player;
  this.opacityUser = isNaN(opacity) ? 100 : opacity * 100;
  this.button = null;
  this.positionUser = widgetPositions.includes(position) ? position : 'R';

  isWidget = options.enableMoveWindow;
}

inherits(Settings, EventEmitter);

Settings.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = settingsTpl;
  this.element.classList.add('vpw-settings');
  this.localism = $('.vpw-regions-container', this.element);
  this.toggleHeader = toggleHeader;
  this.button = $('.vpw-header-btn-settings');

  const toggleThemeButton = $('#vw-toggle-theme', this.element);
  toggleThemeButton.onclick = toggleTheme;

  // Header element
  const headerTitle = $('.vpw-screen-header span', this.element);

  // Config back button
  const backButton = $('.vpw-screen-header button', this.element);
  backButton.innerHTML = backIcon;
  backButton.onclick = handleReturn.bind(this);

  // Access regionalism button
  const regionalismCont = $('.vpw-option__regionalism div', this.element);
  const regionalismBtn = $('.vpw-selected-region', this.element);
  regionalismCont.onclick = accessRegionalism.bind(this);
  regionalismBtn.onclick = accessRegionalism.bind(this);
  setRegion.bind(this)({ path: 'BR', flag: 'assets/brazil.png' });

  // Opacity option
  const opacityInput = $('.vpw-opacity-range input', this.element);
  const opacitySlider = $('.vpw-opacity-range vpw-slider', this.element);
  const opacityValue = $('.vpw-opacity-value', this.element);

  opacityInput.oninput = (e) => setOpacity(e.target.value);
  setOpacity(this.opacityUser);

  // Position option box
  const positionBox = $('.vpw-position-box', this.element);

  // Creates regions grid
  const regionHTML = require('./region.html').default;
  let activeRegion = null;

  if (!isWidget) {
    $('.vpw-widget-exclusive-opacity', this.element).style.display = 'none';
    $('.vpw-widget-exclusive-position', this.element).style.display = 'none';
  }

  // eslint-disable-next-line guard-for-in
  for (const region of regionsData) {
    const element = document.createElement('div');
    element.classList.add('vpw-region');
    element.innerHTML = regionHTML;

    if (region === regionsData[0]) {
      element.classList.add('selected');
      activeRegion = element;
    }

    $('.vpw-flag', element).setAttribute('data-src', region.flag);
    $('.vpw-name', element).innerHTML =
      region.path === 'BR'
        ? region.name
        : `${region.name}<span> - ${region.path}</span>`;

    element.onclick = () => {
      if (activeRegion === element) return;
      element.classList.add('selected');
      activeRegion.classList.remove('selected');
      activeRegion = element;

      // Set region button/player
      setRegion.bind(this)(region);

      handleReturn.bind(this)();
    };
    this.localism.appendChild(element);
  }

  // Add positions in box
  for (const position of widgetPositions) {
    const span = document.createElement('span');

    if (position)
      span.innerHTML = positionIcons[widgetPositions.indexOf(position)];

    if (position === this.positionUser) addClass(span, 'vpw-select-pos');

    positionBox.appendChild(span);

    if (!position) span.style.visibility = 'hidden';
    else {
      span.onclick = () => {
        setWidgetPosition(position);
        removeClass($('.vpw-select-pos', positionBox), 'vpw-select-pos');
        addClass(span, 'vpw-select-pos', span);
      };
    }
  }

  // Elements to apply blur filter
  this.gameContainer = $('div#gameContainer');
  this.controlsElement = $('.vpw-controls');

  function toggleTheme() {
    $('[vp]').classList.toggle('vp-dark-theme');
  }

  function setOpacity(opacity) {
    const value = Number(opacity > 100 ? 100 : opacity < 0 ? 0 : opacity);
    const percent = value < 25 && !isFullscreen() ? value + 5 : value;

    opacityInput.value = opacity;
    opacitySlider.style.width = percent + '%';
    opacityValue.innerHTML = value + '%';

    window.dispatchEvent(
      new CustomEvent('vw-change-opacity', { detail: value / 100 })
    );
  }

  function isFullscreen() {
    return document.body.classList.contains('vpw-fullscreen');
  }

  function setRegion(region) {
    regionalismBtn.querySelector('span').innerHTML = region.path;
    regionalismBtn.querySelector('img').src = window.plugin.rootPath
      ? window.plugin.rootPath + '/' + region.flag
      : region.flag;

    this.player.setRegion(region.path);
  }

  function accessRegionalism() {
    this.localism.classList.add('active');
    toggleHeader();
  }

  const isRegionalismOpen = () => {
    return this.localism.classList.contains('active');
  };

  function handleReturn() {
    if (isRegionalismOpen()) {
      this.localism.scrollTo(0, 0);
      this.localism.classList.remove('active');
    } else {
      this.hide();
      $('.vpw-header-btn-settings').classList.remove('selected');
    }
    toggleHeader();
  }

  function toggleHeader() {
    if (isRegionalismOpen()) {
      headerTitle.innerHTML = 'Regionalismo';
      toggleThemeButton.style.display = 'none';
    } else {
      headerTitle.innerHTML = 'Configurações';
      toggleThemeButton.style.display = 'flex';
    }
  }
};

Settings.prototype.toggle = function () {
  if (this.visible) this.hide();
  else this.show();
};

Settings.prototype.hide = function () {
  this.visible = false;
  this.element.classList.remove('active');
  this.localism.classList.remove('active');
  this.button.classList.remove('selected');

  // Removes blur filter
  this.gameContainer.classList.remove('vpw-blur');
  this.controlsElement.classList.remove('vpw-blur');

  this.toggleHeader();

  this.emit('hide');
};

Settings.prototype.show = function () {
  this.visible = true;
  this.element.classList.add('active');
  this.button.classList.add('selected');

  // Apply blur filter
  this.gameContainer.classList.add('vpw-blur');
  this.controlsElement.classList.add('vpw-blur');

  this.emit('show');
};

module.exports = Settings;

const widgetPositions = ['TL', 'T', 'TR', 'L', null, 'R', 'BL', 'B', 'BR'];
