const window = require('window');

const AccessButton = require('./components/AccessButton');
const PluginWrapper = require('./components/PluginWrapper');
require('./styles.scss');

module.exports = function Widget() {
  const widgetWrapper = new PluginWrapper();
  const accessButton = new AccessButton(widgetWrapper);
  
  window.onload = () => {
    const vw = document.querySelector('[vw]');
	const wrapper = document.querySelector('[vw-plugin-wrapper]');
	const access = document.querySelector('[vw-access-button]');

    accessButton.load(document.querySelector('[vw-access-button]'), vw);
    widgetWrapper.load(document.querySelector('[vw-plugin-wrapper]'));

	window.addEventListener('vp-widget-wrapper-set-side', (event) => { console.log(':', event.detail)
		if(event.detail.right) {
			vw.style.left = '0';
			vw.style.right = 'initial';
		} else {
			vw.style.right = '0';
			vw.style.left = 'initial';
		}

	});


	window.addEventListener('vp-widget-close', (event) => { 
		access.classList.toggle('active');
    	wrapper.classList.toggle('active');
	});

    
  };
}
