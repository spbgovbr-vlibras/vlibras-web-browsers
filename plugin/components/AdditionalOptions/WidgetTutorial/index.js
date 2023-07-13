const template = require('./widget-tutorial.html').default;
require('./widget-tutorial.scss');

function WidgetTutorial(player) {
  this.element = null;
  this.player = player;
}

WidgetTutorial.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;
}

module.exports = TranslatorScreen;
