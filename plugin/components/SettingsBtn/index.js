const settingsBtnTpl = require('./settings-btn.html').default;
require('./settings-btn.scss');

const { settingsIcon, dictionaryIcon, aboutIcon, closeIcon } = require('~icons');

function SettingsBtn(player, settings, dictionary, infoScreen, translator, option) {
  this.player = player;
  this.settings = settings;
  this.dictionary = dictionary;
  this.infoScreen = infoScreen;
  this.translator = translator;
  this.allScreens = [settings, dictionary, infoScreen, translator]
  enable = option.enableMoveWindow;
}

SettingsBtn.prototype.load = function (
  element,
  loadDictionary,
  elementDict,
  rootPath,
) {
  this.element = element;
  this.element.innerHTML = settingsBtnTpl;
  this.element.classList.add('vpw-settings-btn');

  const settingsBtn = this.element.querySelector('.vpw-header-btn-settings');
  const dictionaryBtn = this.element.querySelector('.vpw-header-btn-dictionary');
  const aboutBtn = this.element.querySelector('.vpw-header-btn-about');
  const closeBtn = this.element.querySelector('.vpw-header-btn-close');
  let loadedDict = false;

  // Add icons
  settingsBtn.innerHTML = settingsIcon;
  dictionaryBtn.innerHTML = dictionaryIcon;
  aboutBtn.innerHTML = aboutIcon;
  closeBtn.innerHTML = closeIcon;

  // Add actions
  settingsBtn.onclick = () => showScreen(this.settings, settingsBtn);
  dictionaryBtn.onclick = () => showScreen(this.dictionary, dictionaryBtn);
  aboutBtn.onclick = () => showScreen(this.infoScreen, aboutBtn);
  closeBtn.onclick = () => {
    window.dispatchEvent(
      new CustomEvent('vp-widget-close', { detail: { close: true } }),
    );
  }

  const showScreen = function (screen, button) {
    button.blur();

    if (screen === this.dictionary && !loadedDict) {
      loadDictionary();
      loadedDict = true;
    }

    this.allScreens
      .filter(sc => sc !== screen && !(sc === this.dictionary && !loadedDict))
      .forEach(sc => sc.hide());

    screen.toggle();

  }.bind(this);

};

module.exports = SettingsBtn;
