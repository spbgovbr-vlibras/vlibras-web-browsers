const inherits = require('inherits');
const EventEmitter = require('events').EventEmitter;

const settingsTpl = require('./settings.html').default;
require('./settings.scss');
require('./switch.scss');

function Settings(player, infoScreen, menu, option, opacity) {
  this.visible = false;
  this.player = player;
  this.infoScreen = infoScreen;
  this.menu = menu;

  enable = option.enableMoveWindow;
  opacityUser = opacity;
}

inherits(Settings, EventEmitter);

Settings.prototype.load = function (element) {
  this.menu = this.menu.element.querySelector('[settings-btn]').firstChild;

  this.element = element;
  this.element.innerHTML = settingsTpl;
  this.element.classList.add('vpw-settings');

  // Localism panel
  this.localism = this.element.querySelector('.vpw-content > .vpw-localism');

  // Close events

  // Selected region
  this.selectedRegion = this.element.querySelector(
    '.vpw-content > ul .vpw-localism'
  );

  if (enable) {
    this.position = this.element.querySelector(
      '.vpw-content > ul .vpw-position'
    );

    this.position.style.display = 'block';
    this.position_op = this.element.querySelector(
      '.vpw-content > ul .vpw-opacity'
    );
    this.position_op.style.display = 'block';
  }

  this.selectedRegion._name = this.selectedRegion.querySelector('.vpw-abbrev');
  this.selectedRegion._flag = this.selectedRegion.querySelector('img.vpw-flag');
  this.selectedRegion.addEventListener(
    'click',
    function () {
      this.localism.classList.toggle('active');
    }.bind(this)
  );

  let OnLeft = 1;
  const selector = this.element.querySelector('input[name=checkbox]');

  this.element
    .querySelector('.vpw-content > ul .vpw-position')
    .addEventListener('click', function () {
      if (OnLeft) {
        window.dispatchEvent(
          new CustomEvent('vp-widget-wrapper-set-side', {
            detail: { right: true },
          })
        );
        OnLeft = 0;
        selector.checked = false;
      } else {
        window.dispatchEvent(
          new CustomEvent('vp-widget-wrapper-set-side', {
            detail: { right: false },
          })
        );
        OnLeft = 1;
        selector.checked = true;
      }
    });

  //

  this.opacity = this.element.querySelector('.vpw-content > ul .vpw-opacity');
  this.opacity_button_left = this.opacity.querySelector('img.arrow-left-opac');
  this.opacity_button_right = this.opacity.querySelector(
    'img.arrow-right-opac'
  );
  this.percent = this.opacity.querySelector('span.vpw-percent');

  let opacity = opacityUser;
  this.percent.innerHTML = opacity * 100 + '%';

  this.opacity_button_right.addEventListener(
    'click',
    function () {
      if (opacity) {
        opacity -= 0.25;
      } else {
        opacity = 0;
      }
      this.percent.innerHTML = opacity * 100 + '%';
      window.dispatchEvent(
        new CustomEvent('vw-change-opacity', { detail: 1 - opacity })
      );
    }.bind(this)
  );

  this.opacity_button_left.addEventListener(
    'click',
    function () {
      if (opacity < 1.0) {
        opacity += 0.25;
      } else {
        opacity = 1.0;
      }

      if (opacity > 1) {
        opacity = 1.0;
      }

      this.percent.innerHTML = opacity * 100 + '%';
      window.dispatchEvent(
        new CustomEvent('vw-change-opacity', { detail: 1 - opacity })
      );
    }.bind(this)
  );

  this.element.querySelector('.vpw-content > ul .vpw-about').addEventListener(
    'click',
    function () {
      this.hide(false);
      this.infoScreen.show();
    }.bind(this)
  );

  // About button
  this.element.querySelector('.vpw-content > ul .vpw-about').addEventListener(
    'click',
    function () {
      this.hide(false);
      this.infoScreen.show();
    }.bind(this)
  );

  // National
  this.national = this.localism.querySelector('.vpw-national');
  this.national._data = nationalData;
  this.national.classList.add('vpw-selected');
  this.national.addEventListener(
    'click',
    function () {
      this.setRegion(this.national);
    }.bind(this)
  );

  // Selected region
  this.region = this.national;

  // Creates regions grid
  const regions = this.localism.querySelector('.vpw-regions');
  const regionHTML = require('./region.html').default;

  // eslint-disable-next-line guard-for-in
  for (const i in regionsData) {
    const data = regionsData[i];

    const region = document.createElement('div');
    region.classList.add('vpw-container-regions');
    region.innerHTML = regionHTML;

    region._data = data;
    region._setRegion = this.setRegion.bind(this);

    region.querySelector('img.vpw-flag').setAttribute('data-src', data.flag);
    region.querySelector('.vpw-name').innerHTML = data.name;
    region.addEventListener('click', function () {
      this._setRegion(this);
    });

    regions.appendChild(region);
  }

  // Elements to apply blur filter
  this.gameContainer = document.querySelector('div#gameContainer');
  this.controlsElement = document.querySelector('.vpw-controls');

  // this.hide();
};

Settings.prototype.setRegion = function (region) {
  // Deactivate localism panel
  this.localism.classList.remove('active');
  // this.menu.element.firstChild.classList.add('active');

  // Select new region
  this.region.classList.remove('vpw-selected');
  this.region = region;
  this.region.classList.add('vpw-selected');

  // Updates selected region
  this.selectedRegion._name.innerHTML = this.region._data.name;
  if (window.plugin.rootPath) {
    this.selectedRegion._flag.src =
      window.plugin.rootPath + '/' + this.region._data.flag;
  } else {
    this.selectedRegion._flag.src = this.region._data.flag;
  }

  // Sends to player
  this.player.setRegion(this.region._data.path);
};

Settings.prototype.toggle = function () {
  if (this.visible) this.hide();
  else this.show();
};

Settings.prototype.hide = function (menuOn) {
  this.visible = false;
  this.element.classList.remove('active');
  this.localism.classList.remove('active');
  // this.btnClose.element.firstChild.style.visibility = 'hidden';
  if (menuOn) {
    this.menu.classList.add('active');
  }

  // Removes blur filter
  this.gameContainer.classList.remove('vpw-blur');
  this.controlsElement.classList.remove('vpw-blur');

  this.emit('hide');
};

Settings.prototype.showMenu = function () {
  this.menu.classList.add('active');
};

Settings.prototype.show = function () {
  this.visible = true;
  this.element.classList.add('active');
  // this.btnClose.element.firstChild.style.visibility = 'visible';
  this.menu.classList.remove('active');

  // Apply blur filter
  this.gameContainer.classList.add('vpw-blur');
  this.controlsElement.classList.add('vpw-blur');

  this.emit('show');
};

module.exports = Settings;

const nationalData = { name: 'BR', path: '', flag: 'assets/brazil.png' };
const regionsData = [
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
  { name: 'TO', path: 'TO', flag: 'assets/27TO.png' },
];
