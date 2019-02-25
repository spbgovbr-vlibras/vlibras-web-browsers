var settingsBtnTpl = require('./settings-btn.html');
require('./settings-btn.scss');

function SettingsBtn(player, screen) {
  this.player = player;
  this.screen = screen;
}

SettingsBtn.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = settingsBtnTpl;
  this.element.classList.add('settings-btn');

  this.element.addEventListener('click', function () {
    this.element.classList.toggle('active');
    this.player.pause();
    this.screen.toggle();
  }.bind(this));
};

module.exports = SettingsBtn;
