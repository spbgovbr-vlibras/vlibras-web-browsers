
const template = require('./widget-guide.html').default;
require('./widget-guide.scss');

const { closeIcon } = require('~icons');
const { tutorialElements } = require('./tutorialElements');
const { isFullscreen, $, addClass, removeClass, getRect } = require('~utils');

let vw = null;

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
  this.helpButton = $('.vpw-help-button', $('div[vw]'));
  this.message = $('.vpw-tutorial__message', this.element);
  this.backButton = $('.vpw-tutorial__back-btn', this.element);
  this.nextButton = $('.vpw-tutorial__next-btn', this.element);
  this.closeButton = $('.vpw-tutorial__close-btn', this.element);
  this.tabSlider = $('.vpw-tutorial__tab-slider', this.element);

  this.closeButton.innerHTML = closeIcon;

  this.closeButton.onclick = () => this.hide();
  this.backButton.onclick = () => this.back();
  this.nextButton.onclick = () => this.next();

  vw = $('div[vw]');
  tutorialElements.forEach(({ path }) => this.$elements.push($(path)));
}

WidgetGuide.prototype.show = function () {
  this.element.classList.add('vp-enabled');
  this.enabled = true;
  this.wPosition = window.plugin.position;
  this.updatePos();
  callWidgetTranslator.bind(this)();
  fixedButtons();
  addClickBlocker(true);
  addClass(this.helpButton, 'vp-selected');
  removeClass($('div[vp-change-avatar]'), 'vp-change-avatar-openned');
}

WidgetGuide.prototype.hide = function () {
  this.element.classList.remove('vp-enabled');
  this.enabled = false;
  this.restart();
  this.player.stop();
  this.player.gloss = undefined;
  resetItems();
  addClickBlocker(false);
  removeClass(this.helpButton, 'vp-selected');
  changeWidgetPosition(this.wPosition);
}

WidgetGuide.prototype.toggle = function () {
  if (this.enabled) this.hide();
  else this.show();
}

WidgetGuide.prototype.next = function () {
  if (this.tab === tutorialElements.length - 1) return this.hide();
  this.tab++;
  this.updatePos();
  updateButtons.bind(this)();
  callWidgetTranslator.bind(this)();
}

WidgetGuide.prototype.back = function () {
  if (this.tab === 0) return;
  this.tab--;
  this.updatePos();
  updateButtons.bind(this)();
  callWidgetTranslator.bind(this)();
}

WidgetGuide.prototype.restart = function () {
  this.message.innerHTML = tutorialElements[0].text;
  this.backButton.setAttribute('disabled', true);
  this.nextButton.innerHTML = 'Avançar';
  this.tab = 0;
}

WidgetGuide.prototype.updatePos = function () {
  const position = window.plugin.position;
  const isLeft = position.includes('L');
  const item = this.$elements[this.tab];
  const { top: wTop, width: wWidth, height: wHeight } = getRect(vw);
  const { top: iTop, height: iHeight } = getRect(item);
  const { width: eWidth, height: eHeight } = getRect(this.element);

  // Set tab id
  this.tabSlider.innerHTML = `${this.tab + 1}/${this.$elements.length}`;

  // Check if element position is in lower viewport
  const isLowerView = iTop > wHeight / 2 + wTop;

  const width = wWidth;
  const height = wHeight;
  const top = !item ? wTop : isLowerView ? (iTop - eHeight + iHeight) : iTop;

  if (!isFullscreen()) {
    if (fitInHalfWindow() && 'TB'.includes(this.wPosition)) {
      addClass(this.element, 'vw-centered');
      this.element.style.top = top + 'px';
      changeWidgetPosition(this.wPosition);
      updateArrow.bind(this)();

    } else if (window.innerWidth >= 600) {
      removeClass(this.element, 'vw-centered');
      this.element.style.left = isLeft ? width + 30 + 'px' : 'initial';
      this.element.style.right = !isLeft ? width + 30 + 'px' : 'initial';
      this.element.style.top = top + 'px';
      this.element.style.maxWidth = '340px';
      this.element.style.bottom = 'initial';
      updateArrow.bind(this)();

      const wp = this.wPosition;
      changeWidgetPosition('TB'.includes(wp) ? wp + 'R' : wp)

    } else {
      changeWidgetPosition('T');
      removeClass(this.element, 'vw-centered');
      maxWidth.bind(this)(40);
      this.element.style.top = height + 20 + 'px';
      this.element.style.bottom = 'initial';
    }
  } else {
    // is fullscreen
    maxWidth.bind(this)(10);
    removeClass(this.element, 'vw-centered');
    this.element.style.top = 'initial';
    this.element.style.bottom = '58px';
  }

  function maxWidth(margin) {
    this.element.style.left = margin + 'px';
    this.element.style.right = margin + 'px';
    this.element.style.maxWidth = '100vw';
    addClass(this.element, 'not-arrow');
  }

  function updateArrow() {
    addClass(this.element, `vw-${isLeft ? 'left' : 'right'}`);
    removeClass(this.element, `vw-${!isLeft ? 'left' : 'right'}`);
    addClass(this.element, `vw-${isLowerView ? 'bottom' : 'top'}`);
    removeClass(this.element, `vw-${!isLowerView ? 'bottom' : 'top'}`);
    removeClass(this.element, 'not-arrow');
  }

  function fitInHalfWindow() {
    return window.innerWidth / 2 >= eWidth + 20 + (wWidth / 2);
  }

}

function updateButtons() {
  if (this.tab === 0) this.backButton.setAttribute('disabled', true);
  else this.backButton.removeAttribute('disabled');
  this.message.innerHTML = tutorialElements[this.tab].text;
  this.nextButton.innerHTML = this.tab === tutorialElements.length - 1 ?
    'Concluir' : 'Avançar';
}

function callWidgetTranslator() {
  this.player.translate(tutorialElements[this.tab].text);
}

function changeWidgetPosition(position) {
  window.dispatchEvent(new CustomEvent('vp-widget-wrapper-set-side',
    { detail: position }));
}

function addClickBlocker(bool) {
  const element = $('span[vp-click-blocker]');
  if (bool) addClass(element, 'vp-enabled');
  else removeClass(element, 'vp-enabled');
}

function resetItems() {
  $('div[vp-rate-box]').style.display = 'block';
  removeClass($('div[vp-rate-box]'), 'vp-enabled');
  removeClass($('div[vp-change-avatar]'), 'vp-fixed');
  removeClass($('div[vp-additional-options]'), 'vp-fixed');

}

function fixedButtons() {
  $('div[vp-rate-box]').style.display = 'none';
  addClass($('div[vp-change-avatar]'), 'vp-fixed');
  addClass($('div[vp-additional-options]'), 'vp-fixed');
}

module.exports = WidgetGuide;
