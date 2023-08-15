const template = require('./additional-options.html').default;
require('./additional-options.scss');

const { translatorIcon, helpIcon } = require('~icons');
const { $ } = require('~utils');

function AdditionalOptions(player, translatorScreen, widgetGuide) {
  this.player = player;
  this.element = null;
  this.translatorScreen = translatorScreen;
  this.widgetGuide = widgetGuide;
}

AdditionalOptions.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;

  const translatorBtn = $('.vpw-translator-button', this.element);
  const helpBtn = $('.vpw-help-button', this.element);

  // Add icons
  translatorBtn.innerHTML = translatorIcon;
  helpBtn.innerHTML = helpIcon;

  // Add actions
  translatorBtn.onclick = () => this.translatorScreen.toggle();
  helpBtn.onclick = () => this.widgetGuide.toggle();

  window.addEventListener('resize', () => {
    if (!this.widgetGuide.enabled) return;
    this.widgetGuide.updatePos()
  })

  this.player.on('translate:start', _start.bind(this));
  this.player.on('gloss:start', _start.bind(this));

  this.player.on('gloss:end', _end.bind(this));
  this.player.on('stop:welcome', _end.bind(this));

  function _start() {
    translatorBtn.style.display = 'none';
    helpBtn.style.display = 'none';
  }

  function _end() {
    translatorBtn.style.display = 'flex';
    helpBtn.style.display = 'flex';
  }

}

AdditionalOptions.prototype.show = function () {
  this.element.classList.add('vp-enabled');
}

AdditionalOptions.prototype.hide = function () {
  this.element.classList.remove('vp-enabled');
}

module.exports = AdditionalOptions;
