const template = require('./template.html').default;
require('./styles.scss');

function PluginWrapper() { 
	
}

PluginWrapper.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;
};

module.exports = PluginWrapper;
