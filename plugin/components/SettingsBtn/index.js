var settingsBtnTpl = require('./settings-btn.html');
require('./settings-btn.scss');

function SettingsBtn(player, screen, option) {
  this.player = player;
  this.screen = screen;
  enable = option.enableMoveWindow;
}

SettingsBtn.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = settingsBtnTpl;
  this.element.classList.add('settings-btn');

  var btn_menu = this.element.querySelector('.settings-btn-menu');
  var btn_close = this.element.querySelector('.settings-btn-close');

  if (enable) {
    btn_close.style.display = 'block';
  }


  btn_menu.addEventListener('click', function () {
    this.element.classList.toggle('active');
    this.player.pause();
    this.screen.toggle();
  }.bind(this));

  btn_close.addEventListener('click', function () {
    window.dispatchEvent(new CustomEvent('vp-widget-close', {detail: {close: true}})); 
  }.bind(this));

};

module.exports = SettingsBtn;
