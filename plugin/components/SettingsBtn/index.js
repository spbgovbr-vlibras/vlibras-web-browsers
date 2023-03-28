const settingsBtnTpl = require('./settings-btn.html').default;
require('./settings-btn.scss');

const { settingsIcon, dictionaryIcon, aboutIcon, closeIcon } = require('../../assets/icons');

function SettingsBtn(player, screen, dictionary, infoScreen, settingsBtnClose, option) {
  this.player = player;
  this.screen = screen;
  this.dictionary = dictionary;
  this.infoScreen = infoScreen;
  this.settingsBtnClose = settingsBtnClose;
  enable = option.enableMoveWindow;
}

SettingsBtn.prototype.load = function(
    element,
    loadDictionary,
    elementDict,
    rootPath,
) {
  this.element = element;
  this.element.innerHTML = settingsBtnTpl;
  this.element.classList.add('vpw-settings-btn');

  let loadedDict = false;

  const settingsBtn = this.element.querySelector('.vpw-header-btn-settings');
  const dictionaryBtn = this.element.querySelector('.vpw-header-btn-dictionary');
  const aboutBtn = this.element.querySelector('.vpw-header-btn-about');
  const closeBtn = this.element.querySelector('.vpw-header-btn-close');
  
  settingsBtn.classList.add('active');

  // Add icons
  settingsBtn.innerHTML = settingsIcon;
  dictionaryBtn.innerHTML = dictionaryIcon;
  aboutBtn.innerHTML = aboutIcon;
  closeBtn.innerHTML = closeIcon;

  if (enable) {
    closeBtn.style.display = 'flex';
  }

  settingsBtn.addEventListener(
    'click',
    function() {
      showScreen(this.screen, settingsBtn);
    }.bind(this),
);

  dictionaryBtn.addEventListener(
    'click',
    function () {
       showScreen(this.dictionary, dictionaryBtn);
    }.bind(this)
  );
  
  aboutBtn.addEventListener(
    'click',
    function () {
      showScreen(this.infoScreen, aboutBtn);
    }.bind(this)
  );

  closeBtn.addEventListener('click', function() {
    hideAllScreens();

    window.dispatchEvent(
        new CustomEvent('vp-widget-close', {detail: {close: true}}),
    );
  });

  function selectButton(button) {
    if (button) button.classList.toggle('selected');

    [settingsBtn, dictionaryBtn, aboutBtn]
    .filter(btn => btn !== button)
    .forEach(btn => btn.classList.remove('selected'));
  }

  const showScreen = function (screen, btn) {
    if (screen == this.dictionary && !loadedDict) {
      loadDictionary();
      loadedDict = true;
    }

    [this.screen, this.dictionary,
    this.infoScreen]
    .filter(sc => sc !== screen)
    .forEach(sc => {
      if (sc == this.dictionary && !loadedDict) return;
      sc.hide();
    });

    screen.toggle();
    selectButton(btn);
    this.player.pause();
  }.bind(this);

  const hideAllScreens = function () {
    selectButton(null);
    [this.screen, this.dictionary, this.infoScreen]
    .forEach(sc => {
      if (sc === this.dictionary && !loadedDict) return;
      sc.hide();
    });
  }.bind(this);
};

module.exports = SettingsBtn;
