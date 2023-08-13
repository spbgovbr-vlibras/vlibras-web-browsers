
const template = require('./widget-help.html').default;
require('./widget-help.scss');

const { closeIcon } = require('../../../assets/icons/');
const { tutorialElements } = require('./tutorialElements');
const { isFullscreen, $, addClass, removeClass } = require('../../../utils');

function WidgetHelp(player) {
  this.player = player;
  this.element = null;
  this.enabled = false;
  this.helpButton = null;
  this.wPosition = null;
  this.closeButton = null;
  this.nextButton = null;
  this.backButton = null;
  this.message = '';
  this.tab = 0;
}

WidgetHelp.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;
  this.helpButton = $('.vpw-help-button', $('div[vw]'));
  this.message = $('.vpw-tutorial__message', this.element);
  this.backButton = $('.vpw-tutorial__back-btn', this.element);
  this.nextButton = $('.vpw-tutorial__next-btn', this.element);
  this.closeButton = $('.vpw-tutorial__close-btn', this.element);

  this.closeButton.innerHTML = closeIcon;

  this.closeButton.onclick = () => this.hide();
  this.backButton.onclick = () => this.back();
  this.nextButton.onclick = () => this.next();
}

WidgetHelp.prototype.show = function () {
  this.element.classList.add('vp-enabled');
  this.enabled = true;
  this.wPosition = window.plugin.position;
  this.updatePos();
  this.callWidgetTranslator();
  fixedItems();
  addClickBlocker(true);
  addClass(this.helpButton, 'vp-selected');
}

WidgetHelp.prototype.hide = function () {
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

WidgetHelp.prototype.toggle = function () {
  if (this.enabled) this.hide();
  else this.show();
}

WidgetHelp.prototype.next = function () {
  if (this.tab === tutorialElements.length - 1) return this.hide();
  this.tab++;
  this.updateButtons();
  this.callWidgetTranslator();
}

WidgetHelp.prototype.back = function () {
  if (this.tab === 0) return;
  this.tab--;
  this.updateButtons();
  this.callWidgetTranslator();
}

WidgetHelp.prototype.updateButtons = function () {
  if (this.tab === 0) this.backButton.setAttribute('disabled', true);
  else this.backButton.removeAttribute('disabled');
  this.nextButton.innerHTML = this.tab === tutorialElements.length - 1 ?
    'Concluir' : 'Avançar';

  this.message.innerHTML = tutorialElements[this.tab].text;
}

WidgetHelp.prototype.restart = function () {
  this.message.innerHTML = tutorialElements[0].text;
  this.backButton.setAttribute('disabled', true);
  this.nextButton.innerHTML = 'Avançar';
  this.tab = 0;
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

WidgetHelp.prototype.callWidgetTranslator = function () {
  console.log(tutorialElements[this.tab].text);
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

function fixedItems() {
  $('div[vp-rate-box]').style.display = 'none';
  addClass($('div[vp-change-avatar]'), 'vp-fixed');
  addClass($('div[vp-additional-options]'), 'vp-fixed');
}

module.exports = WidgetHelp;
