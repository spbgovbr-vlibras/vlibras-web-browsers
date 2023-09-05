const template = require('./additional-options.html').default;
require('./additional-options.scss');

const { translatorIcon, helpIcon } = require('~icons');
const { $, hasClass, toggleClass, removeClass } = require('~utils');

function AdditionalOptions(player, translator, guide) {
  this.player = player;
  this.element = null;
  this.translator = translator;
  this.guide = guide;
}

AdditionalOptions.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;

  const translatorBtn = $('.vpw-translator-button', this.element);
  const helpBtn = $('.vpw-help-button', this.element);
  const clickBlocker = $('[vp-click-blocker]');

  // Add icons
  translatorBtn.innerHTML = translatorIcon;
  helpBtn.innerHTML = helpIcon;

  // Add actions
  translatorBtn.onclick = () => this.translator.toggle();
  helpBtn.onclick = () => this.guide.toggle();
  clickBlocker.onclick = applyShaker;

  window.addEventListener('resize', () => {
    if (!this.guide.enabled) return;
    this.guide.updatePosition();
  })

}

AdditionalOptions.prototype.show = function () {
  this.element.classList.add('vp-enabled');
}

AdditionalOptions.prototype.hide = function () {
  this.element.classList.remove('vp-enabled');
}

function applyShaker() {
  const mainScreenGuide = $('[vp-main-guide-screen');
  const has = hasClass(mainScreenGuide, 'vp-enabled');
  toggleClass(mainScreenGuide, 'vp--shaker', has);
  setTimeout(() => removeClass(mainScreenGuide, 'vp--shaker'), 500);
}

module.exports = AdditionalOptions;
