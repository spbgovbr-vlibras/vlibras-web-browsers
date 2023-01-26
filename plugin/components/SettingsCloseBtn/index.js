const btnCloseTpl = require('./settings-close-btn.html').default;
require('./settings-close-btn.scss');

function SettingsCloseBtn() {
  this.closeScreen = null;
  this.element = null;
}

SettingsCloseBtn.prototype.load = function(element, closeScreen) {
  this.element = element;
  this.closeScreen = closeScreen;
  this.element.innerHTML = btnCloseTpl;
  this.element.classList.add('vpw-btn-close');
  this.element.addEventListener('click', function() {
    this.closeScreen.closeAll();
    this.element.classList.remove('active');
  }.bind(this));
};


module.exports = SettingsCloseBtn;
