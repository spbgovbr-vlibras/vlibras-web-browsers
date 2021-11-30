const AccessButton = require('./components/AccessButton');
const PluginWrapper = require('./components/PluginWrapper');

require('./scss/reset.scss');
require('./scss/styles.scss');

module.exports = function Widget(rootPath, personalization, opacity) {
	const widgetWrapper = new PluginWrapper();
	const accessButton = new AccessButton(rootPath, widgetWrapper, personalization, opacity);
	var temp_f;


	if (window.onload) {
		temp_f = window.onload;
	}

	window.onload = () => {

		if (temp_f) {
			temp_f();
		}

		this.element = document.querySelector('[vw]');

		const wrapper = document.querySelector('[vw-plugin-wrapper]');
		const access = document.querySelector('[vw-access-button]');

		accessButton.load(document.querySelector('[vw-access-button]'), this.element);
		widgetWrapper.load(document.querySelector('[vw-plugin-wrapper]'));

		window.addEventListener('vp-widget-wrapper-set-side', (event) => {

			if (event.detail == "top-left" || event.detail == "middle-left" || event.detail == "bottom-left") {
				this.element.style.left = '0';
				this.element.style.right = 'initial';
				access.querySelector('.widget-container').classList.add("left");
				document.querySelector('[vw-access-button]').style.margin = "0px 80px 0px 0px";

				if (event.detail == "top-left") this.element.style.top = "32%"
				if (event.detail == "middle-left") this.element.style.top = "60%"
				if (event.detail == "bottom-left") this.element.style.top = "82%"
			}
			else if (event.detail == "top-right" || event.detail == "middle-right" || event.detail == "bottom-right") {
				this.element.style.right = '0';
				this.element.style.left = 'initial';
				access.querySelector('.widget-container').classList.remove("left");
				document.querySelector('[vw-access-button]').style.margin = "0px 0px 0px -100px";

				if (event.detail == "top-right") this.element.style.top = "32%"
				if (event.detail == "middle-right") this.element.style.top = "60%"
				if (event.detail == "bottom-right") this.element.style.top = "82%"
			}
			else if (event.detail == "bottom-middle" || event.detail == "top-middle") {
				this.element.style.right = '42%';
				access.querySelector('.widget-container').classList.remove("left");

				if (event.detail == "top-middle") this.element.style.top = "32%"
				if (event.detail == "bottom-middle") this.element.style.top = "82%"
			}
		});

		window.addEventListener('vp-widget-close', (event) => {
			access.classList.toggle('active');
			wrapper.classList.toggle('active');

			document.body.removeChild(document.querySelector('.vw-links'))

			var tagsTexts = document.querySelectorAll('.vw-text');
			for (var i = 0; i < tagsTexts.length; i++) {
				var parent = tagsTexts[i].parentNode;
				parent.innerHTML = tagsTexts[i].innerHTML;
			}
		});

		window.addEventListener('vw-change-opacity', (event) => {
			wrapper.style.background = `rgba(235,235,235, ${event.detail})`;
		});

		this.element.querySelectorAll('img[data-src]').forEach((image) => {
			const imagePath = image.attributes['data-src'].value;
			image.src = rootPath ? rootPath + '/' + imagePath : imagePath;
		});
	};
}
