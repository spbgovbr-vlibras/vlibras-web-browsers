const template = require('./template.html');
require('./styles.scss');

function PluginWrapper() { }

PluginWrapper.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;
};

module.exports = PluginWrapper;
