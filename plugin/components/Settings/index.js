var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;

var settingsTpl = require('./settings.html').default;
require('./settings.scss');
require('./switch.scss');

function Settings(player, infoScreen, menu, dictionary, option, opacity, widget_position, transparency_screen) {
  this.visible = false;
  this.player = player;
  this.infoScreen = infoScreen;
  // this.btnClose = btnClose;
  this.menu = menu;
  this.dictionary = dictionary;

  this.closeScreen = null;
  this.widget_position = widget_position;
  this.transparency_screen = transparency_screen;

  enable = option.enableMoveWindow;
  opacity_user = opacity;
}

inherits(Settings, EventEmitter);

Settings.prototype.load = function (element, closeScreen) {
  this.menu = this.menu.element.querySelector('[settings-btn]').firstChild;
  this.closeScreen = closeScreen

  this.element = element;
  this.element.innerHTML = settingsTpl;
  this.element.classList.add('vpw-settings');

  this.element.addEventListener("click", (evt) => {
    const menu = document.getElementById("vpw-content");
    let targetElement = evt.target;

    do {
      if (targetElement == menu) {
        return;
      }
      targetElement = targetElement.parentNode;
    } while (targetElement);

    this.closeScreen.closeAll()
  });

  // Localism panel
  this.localism = this.element.querySelector('.vpw-content > .vpw-localism');

  this.dictionaryBtn = this.element.querySelector('.vpw-dict');

  // Translate panel
  this.translate = this.element.querySelector('.vpw-translate');
  this.translate.addEventListener("click", (evt) => {
    this.closeScreen.closeAll()
  })

  // Close events
  this.exit = this.element.querySelector('.vpw-arrow-left');
  this.exit.addEventListener("click", (evt) => {
    this.closeScreen.closeAll()
  })

  // this.btnClose.element.firstChild.addEventListener('click',this.hide.bind(this))
  // Selected region
  this.selectedRegion = this.element.querySelector('.vpw-content > ul .vpw-localism');

  if (enable) {
    this.position = this.element.querySelector('.vpw-content > ul .vpw-position');
    this.position.style.display = 'block';
    this.position_op = this.element.querySelector('.vpw-content > ul .vpw-opacity');
    this.position_op.style.display = 'block';
  }

  this.selectedRegion._name = this.selectedRegion.querySelector('.vpw-abbrev');
  this.selectedRegion._flag = this.selectedRegion.querySelector('img.vpw-flag');
  this.selectedRegion.addEventListener('click', function () {
    this.localism.classList.toggle('active');
  }.bind(this));

  this.dictionaryBtn.addEventListener('click', function (event) {
    // console.log(event.target);
    this.loadingDic = this.element.querySelector('.vpw-controls-dictionary');
    if (!(this.loadingDic.classList.contains('vpw-loading-dictionary'))) {
      this.element.classList.remove('active');
      this.dictionary.show();
      this.player.pause();
    }
  }.bind(this));

  var OnLeft = 1;
  var selector = this.element.querySelector('input[name=checkbox]')

  this.element.querySelector('.vpw-content > ul .vpw-position')
    .addEventListener('click', function () {
      this.widget_position.show(window);
      // if (OnLeft) {
      window.dispatchEvent(new CustomEvent('vp-widget-wrapper-set-side', { detail: { right: true } }));
      // OnLeft = 0;
      // selector.checked = false;
      // }
      // else {
      //   window.dispatchEvent(new CustomEvent('vp-widget-wrapper-set-side', { detail: { right: false } }));
      //   OnLeft = 1;
      //   selector.checked = true;
      // }
    }.bind(this));

  //

  this.opacity = this.element.querySelector('.vpw-content > ul .vpw-opacity');
  // this.opacity_button_left = this.opacity.querySelector('img.arrow-left-opac');
  // this.opacity_button_right = this.opacity.querySelector('img.arrow-right-opac');
  // this.percent = this.opacity.querySelector('span.vpw-percent');


  this.opacity.addEventListener('click', function () {
    this.transparency_screen.show(window);
  }.bind(this))


  // var opacity = opacity_user;
  // this.percent.innerHTML = opacity * 100 + '%';

  // this.opacity_button_right.addEventListener('click', function () {

  //   if (opacity) {
  //     opacity -= 0.25
  //   } else {
  //     opacity = 0
  //   }
  //   this.percent.innerHTML = opacity * 100 + '%';
  //   window.dispatchEvent(new CustomEvent('vw-change-opacity', { detail: 1 - opacity }));

  // }.bind(this));

  // this.opacity_button_left.addEventListener('click', function () {

  //   if (opacity < 1.0) {
  //     opacity += 0.25
  //   } else {
  //     opacity = 1.0
  //   }

  //   if (opacity > 1) {
  //     opacity = 1.0
  //   }

  //   this.percent.innerHTML = opacity * 100 + '%';
  //   window.dispatchEvent(new CustomEvent('vw-change-opacity', { detail: 1 - opacity }));

  // }.bind(this));


  this.element.querySelector('.vpw-content > ul .vpw-about')
    .addEventListener('click', function () {
      this.hide(false);
      this.infoScreen.show();
    }.bind(this));


  // About button
  this.element.querySelector('.vpw-content > ul .vpw-about')
    .addEventListener('click', function () {
      this.hide(false);
      this.infoScreen.show();
    }.bind(this));


  // National
  this.national = this.localism.querySelector('.vpw-national');
  this.national._data = nationalData;
  this.national.classList.add('vpw-selected');
  this.national.addEventListener('click', function () {
    this.setRegion(this.national);
    this.national.querySelector(".vpw-localism-radio").checked = true
  }.bind(this));

  // Selected region
  this.region = this.national;

  // Creates regions grid
  var regions = this.localism.querySelector('.vpw-regions');
  var regionHTML = require('./region.html').default;

  for (var i in regionsData) {
    var data = regionsData[i];

    var region = document.createElement('div');
    region.classList.add('vpw-container-regions');
    region.innerHTML = regionHTML;

    region._data = data;
    region._setRegion = this.setRegion.bind(this);

    var radio = document.createElement("input");
    radio.setAttribute("type", "radio");
    radio.setAttribute("id", "localism" + i);
    radio.setAttribute("name", "localism");
    radio.setAttribute("class", "vpw-localism-radio");

    region.querySelector('img.vpw-flag').setAttribute("data-src", data.flag);
    region.querySelector('.vpw-name').innerHTML = data.name;
    region.appendChild(radio);

    region.addEventListener('click', function () {
      this._setRegion(this);
      this.querySelector(".vpw-localism-radio").checked = true
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
    this.selectedRegion._flag.src = window.plugin.rootPath + '/' + this.region._data.flag;
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

var nationalData = { name: 'Brasil', path: '', flag: 'assets/brazil.png' };
var regionsData = [
  { name: 'Acre', path: 'AC', flag: 'assets/1AC.png' },
  { name: 'Alagoas', path: 'AL', flag: 'assets/2AL.png' },
  { name: 'Amapá', path: 'AP', flag: 'assets/3AP.png' },
  { name: 'Amazonas', path: 'AM', flag: 'assets/4AM.png' },
  { name: 'Bahia', path: 'BA', flag: 'assets/5BA.png' },
  { name: 'Ceará', path: 'CE', flag: 'assets/6CE.png' },
  { name: 'Distrito Federal', path: 'DF', flag: 'assets/7DF.png' },
  { name: 'Espírito Santo', path: 'ES', flag: 'assets/8ES.png' },
  { name: 'Goiás', path: 'GO', flag: 'assets/9GO.png' },
  { name: 'Maranhão', path: 'MA', flag: 'assets/10MA.png' },
  { name: 'Mato Grosso', path: 'MT', flag: 'assets/11MT.png' },
  { name: 'Mato Grosso do Sul', path: 'MS', flag: 'assets/12MS.png' },
  { name: 'Minas Gerais', path: 'MG', flag: 'assets/13MG.png' },
  { name: 'Pará', path: 'PA', flag: 'assets/14PA.png' },
  { name: 'Paraíba', path: 'PB', flag: 'assets/15PB.png' },
  { name: 'Paraná', path: 'PR', flag: 'assets/16PR.png' },
  { name: 'Pernambuco', path: 'PE', flag: 'assets/17PE.png' },
  { name: 'Piauí', path: 'PI', flag: 'assets/18PI.png' },
  { name: 'Rio de Janeiro', path: 'RJ', flag: 'assets/19RJ.png' },
  { name: 'Rio Grande do Norte', path: 'RN', flag: 'assets/20RN.png' },
  { name: 'Rio Grande do Sul', path: 'RS', flag: 'assets/21RS.png' },
  { name: 'Rondônia', path: 'RO', flag: 'assets/22RO.png' },
  { name: 'Roraima', path: 'RR', flag: 'assets/23RR.png' },
  { name: 'Santa Catarina', path: 'SC', flag: 'assets/24SC.png' },
  { name: 'São Paulo', path: 'SP', flag: 'assets/25SP.png' },
  { name: 'Sergipe', path: 'SE', flag: 'assets/26SE.png' },
  { name: 'Tocantins', path: 'TO', flag: 'assets/27TO.png' }
];
