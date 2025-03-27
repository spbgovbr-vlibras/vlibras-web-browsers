const template = require('./more-options.html').default;
require('./more-options.scss');

const {
  closeIcon,
  translatorIcon,
  accessibilityIcon,
  emotions,
} = require('~icons');
const { $ } = require('~utils');
const EmotionsTooltip = require('./components/EmotionsTooltip');

function MoreOptions(player, translator, rateBox) {
  this.player = player;
  this.translator = translator;
  this.rateBox = rateBox;
  this.active = false;
  this.emotionsTooltip = null;
  this.isLoaded = false;
}

MoreOptions.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;

  this.emotionsTooltip = new EmotionsTooltip(this.player);

  const closeBtn = $('.vp-more-options-header button', this.element);
  const translatorBtn = $('.vp-translator-button', this.element);
  const emotionsBtn = $('.vp-emotions-button', this.element);
  const otherResourcesBtn = $('.vp-other-resources-button', this.element);

  // add icons
  closeBtn.innerHTML = closeIcon;
  translatorBtn.innerHTML += translatorIcon;
  emotionsBtn.innerHTML += emotions.satisfied;
  otherResourcesBtn.innerHTML += accessibilityIcon;

  // add actions
  closeBtn.addEventListener('click', () => {
    this.hide();
  });

  translatorBtn.addEventListener('click', () => {
    this.translator.toggle();
  });

  emotionsBtn.addEventListener('click', (e) => {
    e.stopPropagation();

    if (!this.emotionsTooltip.isLoaded) {
      this.emotionsTooltip.load($('[vp-emotions-tooltip]'));
    }
    this.emotionsTooltip.toggle();
  });

  otherResourcesBtn.addEventListener('click', () => {
    if (!window?.VLibrasWidgetPlus?.isOpen) {
      window?.VLibrasWidgetPlusAccessButton?.element?.click();
    }
  });

  this.isLoaded = true;
};

MoreOptions.prototype.show = function () {
  this.active = true;
  this.element.dataset.active = true;
  this.rateBox.element.classList.remove('vp-expanded');
};

MoreOptions.prototype.hide = function () {
  this.active = false;
  this.element.dataset.active = false;
  if (this.emotionsTooltip.isLoaded) this.emotionsTooltip.hide();
};

MoreOptions.prototype.toggle = function () {
  this.active ? this.hide() : this.show();
};

module.exports = MoreOptions;
