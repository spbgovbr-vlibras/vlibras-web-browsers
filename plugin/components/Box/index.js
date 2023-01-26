const BoxTlp = require('./box.html').default;
require('./box.scss');

function Box() {
  this.element = null;
  this.message = null;
}

Box.prototype.load = function (element) {
  this.element = element;
  this.element.classList.add('vpw-box');
  this.element.innerHTML = BoxTlp;
};

module.exports = Box;
