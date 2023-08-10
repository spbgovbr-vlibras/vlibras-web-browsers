
const template = require('./widget-help.html').default;
require('./widget-help.scss');

const { closeIcon } = require('../../../assets/icons/');
const { tutorialElements } = require('./tutorialElements');
const { isFullscreen, $, addClass, removeClass, hasClass } = require('../../../utils');

let feedbackOn = false;

function WidgetHelp(player) {
  this.element = null;
  this.player = player;
  this.enabled = false;
  this.helpButton = null;
  this.wPosition = null;
  this.tab = 0;
  this.message = '';
}

WidgetHelp.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;
  this.message = $('.vpw-tutorial__message', this.element);
  this.helpButton = $('.vpw-help-button', $('div[vw]'));

  const closeButton = $('.vpw-tutorial__close-btn', this.element);

  closeButton.innerHTML = closeIcon;
  closeButton.onclick = () => this.hide();
}

WidgetHelp.prototype.show = function () {
  this.element.classList.add('vp-enabled');
  this.enabled = true;
  this.wPosition = window.plugin.position;
  this.updatePos();
  addClickBlocker(true);
  addClass(this.helpButton, 'vp-selected');

  feedbackOn = isFeedbackEnabled();
  disableFeedback();
}

WidgetHelp.prototype.hide = function () {
  this.element.classList.remove('vp-enabled');
  this.enabled = false;
  addClickBlocker(false);
  removeClass(this.helpButton, 'vp-selected');
  changeWidgetPosition(this.wPosition);

  if (feedbackOn) enabledFeedback();
}

WidgetHelp.prototype.toggle = function () {
  if (this.enabled) this.hide();
  else this.show();
}

WidgetHelp.prototype.updatePos = function () {
  const vw = $('div[vw]');
  const position = window.plugin.position;
  const isLeft = position.includes('L');
  const isTop = position.includes('T');
  const rect = vw.getBoundingClientRect();
  const { width, height, top } = rect;

  if (!isFullscreen()) {
    if (window.innerWidth >= 600) {
      this.element.style.left = isLeft ? width + 20 + 'px' : 'initial';
      this.element.style.right = !isLeft ? width + 20 + 'px' : 'initial';
      this.element.style.top = top + 'px';
      this.element.style.maxWidth = '340px';

      if (!['T', 'B'].includes(position)) return;
      else changeWidgetPosition(this.wPosition.includes('L') ?
        isTop ? 'TL' : 'BL' : isTop ? 'TR' : 'BR')

    } else {
      changeWidgetPosition('T');
      maxWidth.bind(this)(40);
      this.element.style.top = height + 20 + 'px';
    }
  } else {
    // is fullscreen
    maxWidth.bind(this)(10);
  }

  function maxWidth(margin) {
    this.element.style.left = margin + 'px';
    this.element.style.right = margin + 'px';
    this.element.style.maxWidth = '100vw';
  }
}

WidgetHelp.prototype.next = function () {

}

WidgetHelp.prototype.back = function () {

}

WidgetHelp.prototype.restart = function () {
  this.message.innerHTML = '';
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

function isFeedbackEnabled() {
  return hasClass($('div[vp-rate-box]'), 'vp-enabled');
}

function enabledFeedback() {
  addClass($('div[vp-rate-box]'), 'vp-enabled');
}

function disableFeedback() {
  removeClass($('div[vp-rate-box]'), 'vp-enabled');
}

module.exports = WidgetHelp;
