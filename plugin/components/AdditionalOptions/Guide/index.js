
const template = require('./guide.html').default;
require('./guide.scss');

const u = require('~utils');
const { closeIcon } = require('~icons');
const { guideElements } = require('./guide-elements');
const { formatGlossWithU200E } = require('./utils');

let $vw = null;

function Guide(player) {
  this.player = player;
  this.element = null;
  this.enabled = false;
  this.helpButton = null;
  this.wPosition = null;
  this.tabSlider = null;
  this.closeButton = null;
  this.nextButton = null;
  this.backButton = null;
  this.message = '';
  this.tab = 0;
  this.$elements = [];
}

Guide.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;
  this.helpButton = u.$('.vpw-help-button');
  this.message = u.$('.vpw-guide__message', this.element);
  this.backButton = u.$('.vpw-guide__back-btn', this.element);
  this.nextButton = u.$('.vpw-guide__next-btn', this.element);
  this.closeButton = u.$('.vpw-guide__close-btn', this.element);
  this.tabSlider = u.$('.vpw-guide__tab-slider', this.element);
  $vw = u.getWidget();

  // Add icon
  this.closeButton.innerHTML = closeIcon;

  // Add actions
  this.closeButton.onclick = () => this.hide();
  this.backButton.onclick = () => this.back();
  this.nextButton.onclick = () => this.next();

  // Function to populate "$elements" list with HTMLElements using the paths of guide elements.
  this.populateList = () => guideElements.forEach(({ path }) => this.$elements.push(u.$(path)));

  // Create slider element
  this.tabSlider.innerHTML = '<span></span>'.repeat(guideElements.length);
}

Guide.prototype.show = function () {
  if (!this.$elements.length) this.populateList();

  this.element.classList.add('vp-enabled');
  this.enabled = true;
  this.wPosition = window.plugin.position;
  this.updatePosition();
  this.updateFooter();
  this.addHighlight();
  fixedButtons();
  roundedWrapper(true);
  u.addClickBlocker(true);
  u.addClass(this.helpButton, 'vp-selected');
  u.removeClass(u.$('div[vp-change-avatar]'), 'vp-isOpen');
  callWidgetTranslator.bind(this)();

  // Dispath custom event to disable text capture
  window.dispatchEvent(new CustomEvent('vp-disable-text-capture'));
}

Guide.prototype.hide = function () {
  this.element.classList.remove('vp-enabled');
  this.enabled = false;
  this.reset();
  this.player.stop();
  this.player.gloss = undefined;
  this.removeHighlight();
  resetItems();
  roundedWrapper(false);
  u.disableControlsButton();
  u.addClickBlocker(false);
  u.removeClass(this.helpButton, 'vp-selected');
  u.setWidgetPosition(this.wPosition);

  // Dispath custom event to disable text capture
  window.dispatchEvent(new CustomEvent('vp-enable-text-capture'));
}

Guide.prototype.toggle = function () {
  if (this.enabled) this.hide();
  else this.show();
}

Guide.prototype.next = function () {
  if (this.tab === guideElements.length - 1) return this.hide();
  else this.tab++;
  this.updateFooter();
  this.updatePosition();
  this.addHighlight();
  callWidgetTranslator.bind(this)();
}

Guide.prototype.back = function () {
  if (this.tab === 0) return;
  else this.tab--;
  this.updateFooter();
  this.updatePosition();
  this.addHighlight();
  callWidgetTranslator.bind(this)();
}

Guide.prototype.reset = function () {
  this.message.innerHTML = guideElements[0].text.replace('//', '');
  this.backButton.setAttribute('disabled', true);
  this.nextButton.innerHTML = 'Avançar';
  this.tab = 0;
}

Guide.prototype.updatePosition = function () {
  const position = window.plugin.position;
  const isLeft = position.includes('L');
  const item = this.$elements[this.tab];
  const { top: wTop, width: wWidth, height: wHeight } = u.getRect($vw);
  const { top: iTop, height: iHeight } = u.getRect(item);
  const { width: eWidth, height: eHeight } = u.getRect(this.element);

  // Check if element position is in lower viewport
  const isLowerView = iTop > wHeight / 2 + wTop;

  const width = wWidth;
  const height = wHeight;
  const top = !item ? wTop : isLowerView ? (iTop - eHeight + iHeight) : iTop;

  if (!u.isFullscreen()) {
    if (fitInHalfWindow() && 'TB'.includes(this.wPosition)) {
      u.addClass(this.element, 'vw-centered');
      this.element.style.top = top + 'px';
      u.setWidgetPosition(this.wPosition);
      updateArrow.bind(this)();

    } else if (innerWidth >= 600) {
      this.element.style.left = isLeft ? width + 30 + 'px' : 'initial';
      this.element.style.right = !isLeft ? width + 30 + 'px' : 'initial';
      this.element.style.top = top + 'px';
      this.element.style.maxWidth = '340px';
      this.element.style.bottom = 'initial';
      u.removeClass(this.element, 'vw-centered');
      updateArrow.bind(this)();

      const wp = this.wPosition;
      u.setWidgetPosition('TB'.includes(wp) ? wp + 'R' : wp)

    } else {
      this.element.style.top = height + 20 + 'px';
      this.element.style.bottom = 'initial';
      u.setWidgetPosition('T');
      u.removeClass(this.element, 'vw-centered');
      expandGuide.bind(this)(40);
    }
  } else {
    // Fullscreen widget
    expandGuide.bind(this)(10);
    u.removeClass(this.element, 'vw-centered');
    this.element.style.top = 'initial';
    this.element.style.bottom = '58px';
  }

  function expandGuide(margin) {
    this.element.style.left = margin + 'px';
    this.element.style.right = margin + 'px';
    this.element.style.maxWidth = '100vw';
    u.addClass(this.element, 'not-arrow');
  }

  function updateArrow() {
    u.addClass(this.element, `vw-${isLeft ? 'left' : 'right'}`);
    u.addClass(this.element, `vw-${isLowerView ? 'bottom' : 'top'}`);
    u.removeClass(this.element, `vw-${!isLeft ? 'left' : 'right'}`);
    u.removeClass(this.element, `vw-${!isLowerView ? 'bottom' : 'top'}`);
    u.removeClass(this.element, 'not-arrow');
  }

  function fitInHalfWindow() {
    return innerWidth / 2 >= eWidth + 30 + (wWidth / 2);
  }

}

Guide.prototype.addHighlight = function () {
  const element = this.$elements[this.tab];
  this.$elements.forEach(e => {
    u.removeClass(e, 'vp-guide-highlight');
    u.addClass(e, 'vp-guide-transition');
  });
  u.addClass(element, 'vp-guide-highlight');
}

Guide.prototype.removeHighlight = function () {
  this.$elements.forEach(e => {
    u.removeClass(e, 'vp-guide-highlight');
    u.removeClass(e, 'vp-guide-transition');
  })
}

Guide.prototype.updateFooter = function () {
  if (this.tab === 0) this.backButton.setAttribute('disabled', true);
  else this.backButton.removeAttribute('disabled');

  const { length } = guideElements;
  const activedTab = u.$('.vp-actived', this.tabSlider);

  this.message.innerHTML = guideElements[this.tab].text.replace('//', '');
  this.nextButton.innerHTML = this.tab === length - 1 ? 'Concluir' : 'Avançar';

  // Toggle actived tab in slider
  if (activedTab) u.removeClass(activedTab, 'vp-actived');
  u.addClass(this.tabSlider.children[this.tab], 'vp-actived');
}

function callWidgetTranslator() {
  const { gloss } = guideElements[this.tab];
  this.player.play(formatGlossWithU200E(gloss), { isEnabledStats: false });
}

function resetItems() {
  u.$('div[vp-rate-box]').style.display = 'block';
  u.removeClass(u.$('div[vp-rate-box]'), 'vp-enabled');
  u.removeClass(u.$('div[vp-change-avatar]'), 'vp-fixed');
  u.removeClass(u.$('div[vp-additional-options]'), 'vp-fixed');
}

function fixedButtons() {
  u.$('div[vp-rate-box]').style.display = 'none';
  u.addClass(u.$('div[vp-change-avatar]'), 'vp-fixed');
  u.addClass(u.$('div[vp-additional-options]'), 'vp-fixed');
}

function roundedWrapper(bool) {
  u.toggleClass(u.$('[vw-plugin-wrapper]'), 'vp-rounded', bool)
}

module.exports = Guide;
