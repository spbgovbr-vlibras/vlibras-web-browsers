var settingsBtnTpl = require('./settings-btn.html').default;
require('./settings-btn.scss');

function SettingsBtn(player, screen, settingsBtnClose,option) {
  this.player = player;
  this.screen = screen;
  this.settingsBtnClose = settingsBtnClose;
  enable = option.enableMoveWindow;
}

SettingsBtn.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = settingsBtnTpl;
  this.element.classList.add('vpw-settings-btn');

  var btn_menu = this.element.querySelector('.vpw-settings-btn-menu');
  btn_menu.classList.add('active');
  var btn_close = this.element.querySelector('.vpw-settings-btn-close');

  if (enable) {
    btn_close.style.display = 'block';
  }


  btn_menu.addEventListener('click', function () {
    this.element.classList.toggle('active');
    if(this.settingsBtnClose.element.classList.contains('active')){
      this.settingsBtnClose.element.classList.remove('active');
    }else{
      this.settingsBtnClose.element.classList.add('active');
    }
    this.player.pause();
    this.screen.toggle();
  }.bind(this));

  btn_close.addEventListener('click', function () {
    window.dispatchEvent(new CustomEvent('vp-widget-close', {detail: {close: true}})); 
  }.bind(this));

};

module.exports = SettingsBtn;
