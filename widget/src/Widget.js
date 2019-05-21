const window = require('window');

const AccessButton = require('./components/AccessButton');
const PluginWrapper = require('./components/PluginWrapper');

require('./scss/reset.scss');
require('./scss/styles.scss');

module.exports = function Widget(rootPath) {
  const widgetWrapper = new PluginWrapper();
  const accessButton = new AccessButton(rootPath, widgetWrapper);
  
  window.onload = () => {
    this.element = document.querySelector('[vw]');

		const wrapper = document.querySelector('[vw-plugin-wrapper]');
		const access = document.querySelector('[vw-access-button]');

		accessButton.load(document.querySelector('[vw-access-button]'), this.element);
		widgetWrapper.load(document.querySelector('[vw-plugin-wrapper]'));

		window.addEventListener('vp-widget-wrapper-set-side', (event) => {
			if (event.detail.right) {
				this.element.style.left = '0';
				this.element.style.right = 'initial';
			} else {
				this.element.style.right = '0';
				this.element.style.left = 'initial';
			}
		});

		window.addEventListener('vp-widget-close', (event) => {
			access.classList.toggle('active');
			wrapper.classList.toggle('active');

			var tagsTexts = document.querySelectorAll('.vw-text');
			for (var i = 0; i < tagsTexts.length; i++) {
				var parent  = tagsTexts[i].parentNode;
				parent.innerHTML = tagsTexts[i].innerHTML;
			}	
    });

    this.element.querySelectorAll('img[data-src]').forEach((image) => {
			const imagePath = image.attributes['data-src'].value;
      image.src = rootPath ? rootPath + '/' + imagePath : imagePath;
    });
  };
}
