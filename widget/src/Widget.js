const AccessButton = require('./components/AccessButton');
const PluginWrapper = require('./components/PluginWrapper');

require('./scss/reset.scss');
require('./scss/styles.scss');

module.exports = function Widget(rootPath, personalization, opacity) {
    const widgetWrapper = new PluginWrapper();
    const accessButton = new AccessButton(rootPath, widgetWrapper, personalization, opacity);
    var temp_f;


    if(window.onload) {
    	temp_f = window.onload;
  	}

    window.onload = () => {

	  	if(temp_f) {
	        temp_f();
	    }

    	this.element = document.querySelector('[vw]');

		const wrapper = document.querySelector('[vw-plugin-wrapper]');
		const access = document.querySelector('[vw-access-button]');

		accessButton.load(document.querySelector('[vw-access-button]'), this.element);
		widgetWrapper.load(document.querySelector('[vw-plugin-wrapper]'));

		window.addEventListener('vp-widget-wrapper-set-side', (event) => {
			if (event.detail.right) {
				this.element.style.left = '0';
				this.element.style.right = 'initial';
				access.querySelector('.access-button').classList.add("left");
				access.querySelector('.pop-up').classList.add("left");
				document.querySelector('[vw-access-button]').style.margin = "0px -100px 0px 0px"; 

			} else {
				this.element.style.right = '0';
				this.element.style.left = 'initial';
				access.querySelector('.access-button').classList.remove("left");
				access.querySelector('.pop-up').classList.remove("left");
				document.querySelector('[vw-access-button]').style.margin = "0px 0px 0px -100px"; 
			}
		});

		window.addEventListener('vp-widget-close', (event) => {
			access.classList.toggle('active');
			wrapper.classList.toggle('active');

			document.body.removeChild(document.querySelector('.vw-links'))

			var tagsTexts = document.querySelectorAll('.vw-text');
			for (var i = 0; i < tagsTexts.length; i++) {
				var parent  = tagsTexts[i].parentNode;
				parent.innerHTML = tagsTexts[i].innerHTML;
			}	
    });

	window.addEventListener('vw-change-opacity', (event) => {
		wrapper.style.background = `rgba(235,235,235, ${event.detail})`;
		//wrapper.setAttribute( 'style', `background: rgba(235, 235, 235, ${event.detail})`);
	});


    this.element.querySelectorAll('img[data-src]').forEach((image) => {
			const imagePath = image.attributes['data-src'].value;
      image.src = rootPath ? rootPath + '/' + imagePath : imagePath;
    });
  };
}
