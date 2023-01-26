const settingsBtnTpl = require('./settings-btn.html').default;
require('./settings-btn.scss');

function SettingsBtn(player, screen, settingsBtnClose, option) {
  this.player = player;
  this.screen = screen;
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

  const btnMenu = this.element.querySelector('.vpw-settings-btn-menu');
  btnMenu.classList.add('active');
  const btnClose = this.element.querySelector('.vpw-settings-btn-close');

  if (enable) {
    btnClose.style.display = 'block';
  }

  btnMenu.addEventListener(
      'click',
      function() {
        this.element.classList.toggle('active');
        if (fistTime) {
          loadDictionary();
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

  btnClose.addEventListener('click', function() {
    window.dispatchEvent(
        new CustomEvent('vp-widget-close', {detail: {close: true}}),
    );
  });
};

module.exports = SettingsBtn;
