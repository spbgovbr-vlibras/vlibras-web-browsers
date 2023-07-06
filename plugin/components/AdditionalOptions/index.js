const template = require('./additional-options.html').default;
require('./additional-options.scss');

const { translatorIcon } = require('../../assets/icons/')

function AdditionalOptions(player, translatorScreen) {
  this.player = player;
  this.element = null;
  this.translatorScreen = translatorScreen;
}

AdditionalOptions.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;

  const translatorBtn = this.element.querySelector('.vp-translator-button');

  // Add icons
  translatorBtn.innerHTML = translatorIcon;

  // Add actions
  translatorBtn.onclick = () => {
    this.translatorScreen.toggle();
  }

  this.player.on('translate:start', _start.bind(this));
  this.player.on('gloss:start', _start.bind(this));

  this.player.on('gloss:end', _end.bind(this));
  this.player.on('stop:welcome', _end.bind(this));

  function _start() {
    this.element.style.top = '50px';
    translatorBtn.style.display = 'none';
  }

  function _end() {
    this.element.style.top = '96px';
    translatorBtn.style.display = 'flex';
  }

}

AdditionalOptions.prototype.show = function () {
  this.element.classList.add('vp-enabled');
}

AdditionalOptions.prototype.hide = function () {
  this.element.classList.remove('vp-enabled');
}

module.exports = AdditionalOptions;
