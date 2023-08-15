
const template = require('./widget-guide.html').default;
require('./widget-guide.scss');

const u = require('~utils');
const { closeIcon } = require('~icons');
const { guideElements } = require('./guide-elements');

let $vw = null;

function WidgetGuide(player) {
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

WidgetGuide.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;
  this.helpButton = u.$('.vpw-help-button', u.$('div[vw]'));
  this.message = u.$('.vpw-tutorial__message', this.element);
  this.backButton = u.$('.vpw-tutorial__back-btn', this.element);
  this.nextButton = u.$('.vpw-tutorial__next-btn', this.element);
  this.closeButton = u.$('.vpw-tutorial__close-btn', this.element);
  this.tabSlider = u.$('.vpw-tutorial__tab-slider', this.element);
  $vw = u.$('div[vw]');

  // Add icon
  this.closeButton.innerHTML = closeIcon;

  // Add actions
  this.closeButton.onclick = () => this.hide();
  this.backButton.onclick = () => this.back();
  this.nextButton.onclick = () => this.next();

  // Get all guide elements (HTMLElements) and push them into "$elements"
  guideElements.forEach(({ path }) => this.$elements.push(u.$(path)));

  // Create slider element
  const { length } = guideElements;
  this.tabSlider.innerHTML = Array.from({ length }, () => '<span></span>').join('');
}

WidgetGuide.prototype.show = function () {
  this.element.classList.add('vp-enabled');
  this.enabled = true;
  this.wPosition = window.plugin.position;
  this.updatePosition();
  this.updateFooter();
  fixedButtons();
  addClickBlocker(true);
  u.addClass(this.helpButton, 'vp-selected');
  u.removeClass(u.$('div[vp-change-avatar]'), 'vp-change-avatar-openned');
  callWidgetTranslator.bind(this)();
}

WidgetGuide.prototype.hide = function () {
  this.element.classList.remove('vp-enabled');
  this.enabled = false;
  this.restart();
  this.player.stop();
  this.player.gloss = undefined;
  resetItems();
  addClickBlocker(false);
  u.removeClass(this.helpButton, 'vp-selected');
  u.setWidgetPosition(this.wPosition);
}

WidgetGuide.prototype.toggle = function () {
  if (this.enabled) this.hide();
  else this.show();
}

WidgetGuide.prototype.next = function () {
  if (this.tab === guideElements.length - 1) return this.hide();
  else this.tab++;
  this.updatePosition();
  this.updateFooter();
  callWidgetTranslator.bind(this)();
}

WidgetGuide.prototype.back = function () {
  if (this.tab === 0) return;
  else this.tab--;
  this.updatePosition();
  this.updateFooter();
  callWidgetTranslator.bind(this)();
}

WidgetGuide.prototype.restart = function () {
  this.message.innerHTML = guideElements[0].text;
  this.backButton.setAttribute('disabled', true);
  this.nextButton.innerHTML = 'Avançar';
  this.tab = 0;
}

WidgetGuide.prototype.updatePosition = function () {
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

    } else if (window.innerWidth >= 600) {
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
    u.removeClass(this.element, `vw-${!isLeft ? 'left' : 'right'}`);
    u.addClass(this.element, `vw-${isLowerView ? 'bottom' : 'top'}`);
    u.removeClass(this.element, `vw-${!isLowerView ? 'bottom' : 'top'}`);
    u.removeClass(this.element, 'not-arrow');
  }

  function fitInHalfWindow() {
    return window.innerWidth / 2 >= eWidth + 20 + (wWidth / 2);
  }

}

WidgetGuide.prototype.updateFooter = function () {
  if (this.tab === 0) this.backButton.setAttribute('disabled', true);
  else this.backButton.removeAttribute('disabled');

  const { length } = guideElements;
  const activedTab = u.$('.vp-actived', this.tabSlider);

  this.message.innerHTML = guideElements[this.tab].text;
  this.nextButton.innerHTML = this.tab === length - 1 ? 'Concluir' : 'Avançar';

  // Toggle actived tab in slider
  if (activedTab) u.removeClass(activedTab, 'vp-actived');
  u.addClass(this.tabSlider.children[this.tab], 'vp-actived');
}

function callWidgetTranslator() {
  const { text } = guideElements[this.tab];
  this.player.translate(text);
}

function addClickBlocker(bool) {
  const element = u.$('span[vp-click-blocker]');
  if (bool) u.addClass(element, 'vp-enabled');
  else u.removeClass(element, 'vp-enabled');
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

module.exports = WidgetGuide;
