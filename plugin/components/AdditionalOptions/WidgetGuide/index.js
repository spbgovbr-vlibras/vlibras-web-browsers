
const template = require('./widget-guide.html').default;
require('./widget-guide.scss');

const utils = require('~utils');
const { closeIcon } = require('~icons');
const { guideElements } = require('./guide-elements');

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
  this.helpButton = utils.$('.vpw-help-button', utils.$('div[vw]'));
  this.message = utils.$('.vpw-tutorial__message', this.element);
  this.backButton = utils.$('.vpw-tutorial__back-btn', this.element);
  this.nextButton = utils.$('.vpw-tutorial__next-btn', this.element);
  this.closeButton = utils.$('.vpw-tutorial__close-btn', this.element);
  this.tabSlider = utils.$('.vpw-tutorial__tab-slider', this.element);

  this.closeButton.innerHTML = closeIcon;

  this.closeButton.onclick = () => this.hide();
  this.backButton.onclick = () => this.back();
  this.nextButton.onclick = () => this.next();

  vw = utils.$('div[vw]');
  guideElements.forEach(({ path }) => this.$elements.push(utils.$(path)));
}

WidgetGuide.prototype.show = function () {
  this.element.classList.add('vp-enabled');
  this.enabled = true;
  this.wPosition = window.plugin.position;
  this.updatePos();
  callWidgetTranslator.bind(this)();
  fixedButtons();
  addClickBlocker(true);
  utils.addClass(this.helpButton, 'vp-selected');
  utils.removeClass(utils.$('div[vp-change-avatar]'), 'vp-change-avatar-openned');
}

WidgetGuide.prototype.hide = function () {
  this.element.classList.remove('vp-enabled');
  this.enabled = false;
  this.restart();
  this.player.stop();
  this.player.gloss = undefined;
  resetItems();
  addClickBlocker(false);
  utils.removeClass(this.helpButton, 'vp-selected');
  utils.setWidgetPosition(this.wPosition);
}

WidgetGuide.prototype.toggle = function () {
  if (this.enabled) this.hide();
  else this.show();
}

WidgetGuide.prototype.next = function () {
  if (this.tab === guideElements.length - 1) return this.hide();
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
  this.message.innerHTML = guideElements[0].text;
  this.backButton.setAttribute('disabled', true);
  this.nextButton.innerHTML = 'Avançar';
  this.tab = 0;
}

WidgetGuide.prototype.updatePos = function () {
  const position = window.plugin.position;
  const isLeft = position.includes('L');
  const item = this.$elements[this.tab];
  const { top: wTop, width: wWidth, height: wHeight } = utils.getRect(vw);
  const { top: iTop, height: iHeight } = utils.getRect(item);
  const { width: eWidth, height: eHeight } = utils.getRect(this.element);

  // Set tab id
  this.tabSlider.innerHTML = `${this.tab + 1}/${this.$elements.length}`;

  // Check if element position is in lower viewport
  const isLowerView = iTop > wHeight / 2 + wTop;

  const width = wWidth;
  const height = wHeight;
  const top = !item ? wTop : isLowerView ? (iTop - eHeight + iHeight) : iTop;

  if (!utils.isFullscreen()) {
    if (fitInHalfWindow() && 'TB'.includes(this.wPosition)) {
      utils.addClass(this.element, 'vw-centered');
      this.element.style.top = top + 'px';
      utils.setWidgetPosition(this.wPosition);
      updateArrow.bind(this)();

    } else if (window.innerWidth >= 600) {
      utils.removeClass(this.element, 'vw-centered');
      this.element.style.left = isLeft ? width + 30 + 'px' : 'initial';
      this.element.style.right = !isLeft ? width + 30 + 'px' : 'initial';
      this.element.style.top = top + 'px';
      this.element.style.maxWidth = '340px';
      this.element.style.bottom = 'initial';
      updateArrow.bind(this)();

      const wp = this.wPosition;
      utils.setWidgetPosition('TB'.includes(wp) ? wp + 'R' : wp)

    } else {
      utils.setWidgetPosition('T');
      utils.removeClass(this.element, 'vw-centered');
      expandGuide.bind(this)(40);
      this.element.style.top = height + 20 + 'px';
      this.element.style.bottom = 'initial';
    }
  } else {
    // is fullscreen
    expandGuide.bind(this)(10);
    utils.removeClass(this.element, 'vw-centered');
    this.element.style.top = 'initial';
    this.element.style.bottom = '58px';
  }

  function expandGuide(margin) {
    this.element.style.left = margin + 'px';
    this.element.style.right = margin + 'px';
    this.element.style.maxWidth = '100vw';
    utils.addClass(this.element, 'not-arrow');
  }

  function updateArrow() {
    utils.addClass(this.element, `vw-${isLeft ? 'left' : 'right'}`);
    utils.removeClass(this.element, `vw-${!isLeft ? 'left' : 'right'}`);
    utils.addClass(this.element, `vw-${isLowerView ? 'bottom' : 'top'}`);
    utils.removeClass(this.element, `vw-${!isLowerView ? 'bottom' : 'top'}`);
    utils.removeClass(this.element, 'not-arrow');
  }

  function fitInHalfWindow() {
    return window.innerWidth / 2 >= eWidth + 20 + (wWidth / 2);
  }

}

function updateButtons() {
  if (this.tab === 0) this.backButton.setAttribute('disabled', true);
  else this.backButton.removeAttribute('disabled');
  this.message.innerHTML = guideElements[this.tab].text;
  this.nextButton.innerHTML = this.tab === guideElements.length - 1 ?
    'Concluir' : 'Avançar';
}

function callWidgetTranslator() {
  this.player.translate(guideElements[this.tab].text);
}

function addClickBlocker(bool) {
  const element = utils.$('span[vp-click-blocker]');
  if (bool) utils.addClass(element, 'vp-enabled');
  else utils.removeClass(element, 'vp-enabled');
}

function resetItems() {
  utils.$('div[vp-rate-box]').style.display = 'block';
  utils.removeClass(utils.$('div[vp-rate-box]'), 'vp-enabled');
  utils.removeClass(utils.$('div[vp-change-avatar]'), 'vp-fixed');
  utils.removeClass(utils.$('div[vp-additional-options]'), 'vp-fixed');

}

function fixedButtons() {
  utils.$('div[vp-rate-box]').style.display = 'none';
  utils.addClass(utils.$('div[vp-change-avatar]'), 'vp-fixed');
  utils.addClass(utils.$('div[vp-additional-options]'), 'vp-fixed');
}

module.exports = WidgetGuide;
