const window = require('window');

const AccessButton = require('./components/AccessButton');
const PluginWrapper = require('./components/PluginWrapper');
require('./styles.scss');

module.exports = function Widget() {
  const widgetWrapper = new PluginWrapper();
  const accessButton = new AccessButton(widgetWrapper);
  
  window.onload = () => {
    const vw = document.querySelector('[vw]');
  
    accessButton.load(document.querySelector('[vw-access-button]'), vw);
    widgetWrapper.load(document.querySelector('[vw-plugin-wrapper]'));
  };
}
