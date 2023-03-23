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

  let fistTime = true;

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
      this.element.classList.toggle('active');
      if (fistTime) {
        elementDict.querySelectorAll('img[data-src]').forEach((image) => {
          const imagePath = image.attributes['data-src'].value;
          image.src = rootPath ? rootPath + '/' + imagePath : imagePath;
        });
        fistTime = false;
      }
      if (this.settingsBtnClose.element.classList.contains('active')) {
        this.settingsBtnClose.element.classList.remove('active');
      } else {
        this.settingsBtnClose.element.classList.add('active');
      }
      this.player.pause();
      this.screen.toggle();
    }.bind(this),
);

  dictionaryBtn.addEventListener(
    'click',
    function () {
       if (fistTime) loadDictionary();
       fistTime = false;
       this.infoScreen.hide();
       this.dictionary.show();
       this.player.pause();
    }.bind(this)
  );
  
  aboutBtn.addEventListener(
    'click',
    function () {
      if (!fistTime) this.dictionary.hide();
       this.infoScreen.show();
       this.player.pause();
    }.bind(this)
  );

  closeBtn.addEventListener('click', function() {
    window.dispatchEvent(
        new CustomEvent('vp-widget-close', {detail: {close: true}}),
    );
  });
};

module.exports = SettingsBtn;
