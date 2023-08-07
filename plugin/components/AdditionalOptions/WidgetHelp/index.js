const template = require('./widget-help.html').default;
require('./widget-help.scss');

function WidgetHelp(player) {
  this.element = null;
  this.player = player;
}

WidgetHelp.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;
}

WidgetHelp.prototype.show = function () {
  this.element.classList.add('vp-enabled');
}

WidgetHelp.prototype.hide = function () {
  this.element.classList.remove('vp-enabled');
}

WidgetHelp.prototype.toggle = function () {
  this.element.classList.toggle('vp-enabled');
}

module.exports = WidgetHelp;
