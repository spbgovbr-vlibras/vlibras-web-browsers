const template = require('./aux-controls.html').default;
require('./aux-controls.scss');

const MoreOptions = require('./MoreOptions');

const { moreOptionsIcon, helpIcon } = require('~icons');
const { $, hasClass, toggleClass, removeClass } = require('~utils');

function AuxiliaryControls(player, guide, translator, isWidget) {
  this.player = player;
  this.element = null;
  this.guide = guide;
  this.translator = translator;
  this.isWidget = isWidget;
  this.isActive = false;

  this.state = {
    prevMoreOptionsActive: false,
  };
}

AuxiliaryControls.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;

  this.moreOptions = new MoreOptions(this.translator);

  const helpBtn = $('.vpw-help-button', this.element);
  const moreOptionsBtn = $('.vpw-more-options-button', this.element);
  const clickBlocker = $('[vp-click-blocker]');

  // Add icons
  moreOptionsBtn.innerHTML = moreOptionsIcon;
  helpBtn.innerHTML = helpIcon;

  // Add actions
  moreOptionsBtn.onclick = () => {
    if (!this.moreOptions.isLoaded)
      this.moreOptions.load($('[vp-more-options-screen]'));
    this.moreOptions.toggle();
  };

  helpBtn.onclick = () => this.isWidget && this.guide.toggle();
  clickBlocker.onclick = applyShaker;

  window.addEventListener('resize', () => {
    if (!this.isWidget || !this.guide.enabled) return;
    this.guide.updatePosition();
  });

  if (!this.isWidget) helpBtn.style.display = 'none';
};

AuxiliaryControls.prototype.show = function () {
  if (this.active) return;
  this.element.classList.add('vp-enabled');
  this.active = true;

  if (this.moreOptions.isLoaded && this.state.prevMoreOptionsActive) {
    this.moreOptions.show();
  }
};

AuxiliaryControls.prototype.hide = function () {
  if (!this.active) return;
  this.element.classList.remove('vp-enabled');
  this.active = false;

  if (this.moreOptions.isLoaded) {
    this.state.prevMoreOptionsActive = this.moreOptions.active;
    this.moreOptions.hide();
  }
};

function applyShaker() {
  const mainScreenGuide = $('[vp-main-guide-screen');
  const has = hasClass(mainScreenGuide, 'vp-enabled');
  toggleClass(mainScreenGuide, 'vp--shaker', has);
  setTimeout(() => removeClass(mainScreenGuide, 'vp--shaker'), 500);
}

module.exports = AuxiliaryControls;
