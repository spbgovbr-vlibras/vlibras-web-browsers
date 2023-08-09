const template = require('./widget-help.html').default;
require('./widget-help.scss');

function WidgetHelp(player) {
  this.element = null;
  this.player = player;
  this.enabled = false;
  this.wPosition = null;
}

WidgetHelp.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;
}

WidgetHelp.prototype.show = function () {
  this.element.classList.add('vp-enabled');
  this.enabled = true;
}

WidgetHelp.prototype.hide = function () {
  this.element.classList.remove('vp-enabled');
  this.enabled = false;
}

WidgetHelp.prototype.toggle = function () {
  this.element.classList.toggle('vp-enabled');
  this.enabled = !this.enabled;

  if (this.enabled) {
    this.wPosition = window.plugin.position;
    this.updatePos();
  } else changeWidgetPosition(this.wPosition);
}

WidgetHelp.prototype.updatePos = function () {
  const vw = document.querySelector('div[vw]');
  const position = window.plugin.position;
  const isLeft = position.includes('L');
  const isTop = position.includes('T');
  const rect = vw.getBoundingClientRect();

  const { width, height, top } = rect;

  if (window.innerWidth >= 600) {
    this.element.style.left = isLeft ? width + 20 + 'px' : 'initial';
    this.element.style.right = !isLeft ? width + 20 + 'px' : 'initial';
    this.element.style.top = top + 'px';
    this.element.style.maxWidth = '320px';

    if (!['T', 'B'].includes(position)) return;
    else {
      changeWidgetPosition(
        this.wPosition.includes('L') ?
          isTop ? 'TL' : 'BL' :
          isTop ? 'TR' : 'BR');
    }

  } else {
    changeWidgetPosition('T');
    this.element.style.left = '40px';
    this.element.style.right = '40px';
    this.element.style.top = height + 20 + 'px';
    this.element.style.maxWidth = '100vw';
  }
}

function changeWidgetPosition(position) {
  window.dispatchEvent(new CustomEvent('vp-widget-wrapper-set-side',
    { detail: position }));
}

module.exports = WidgetHelp;
