const settingsBtnTpl = require('./settings-btn.html').default;
require('./settings-btn.scss');

const { settingsIcon, dictionaryIcon, aboutIcon, closeIcon } = require('~icons');

function SettingsBtn(player, screen, dictionary, infoScreen, option) {
  this.player = player;
  this.screen = screen;
  this.dictionary = dictionary;
  this.infoScreen = infoScreen;
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

  let loadedDict = false;

  const settingsBtn = this.element.querySelector('.vpw-header-btn-settings');
  const dictionaryBtn = this.element.querySelector('.vpw-header-btn-dictionary');
  const aboutBtn = this.element.querySelector('.vpw-header-btn-about');
  const closeBtn = this.element.querySelector('.vpw-header-btn-close');

  // Add icons
  settingsBtn.innerHTML = settingsIcon;
  dictionaryBtn.innerHTML = dictionaryIcon;
  aboutBtn.innerHTML = aboutIcon;
  closeBtn.innerHTML = closeIcon;

  settingsBtn.addEventListener(
    'click',
    function () {
      showScreen(this.screen, settingsBtn);
      settingsBtn.blur();
    }.bind(this),
  );

  dictionaryBtn.addEventListener(
    'click',
    function () {
      showScreen(this.dictionary, dictionaryBtn);
      dictionaryBtn.blur();
    }.bind(this)
  );

  aboutBtn.addEventListener(
    'click',
    function () {
      showScreen(this.infoScreen, aboutBtn);
      aboutBtn.blur();
    }.bind(this)
  );

  closeBtn.addEventListener('click', function () {
    showScreen(null, null);

    window.dispatchEvent(
      new CustomEvent('vp-widget-close', { detail: { close: true } }),
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

    if (screen) screen.toggle();
    selectButton(btn);
  }.bind(this);

};

module.exports = SettingsBtn;
