const AccessButton = require('./components/AccessButton');
const PluginWrapper = require('./components/PluginWrapper');

require('./scss/reset.scss');
require('./scss/styles.scss');

const { addClass, $, removeClass, getWidget } = require('~utils');
const widgetPosition = ['TL', 'T', 'TR', 'L', 'R', 'BL', 'B', 'BR'];

module.exports = function Widget(rootPath, personalization, opacity, position) {
  if (!widgetPosition.includes(position)) position = 'R';
  const widgetWrapper = new PluginWrapper();
  const accessButton = new AccessButton(
    rootPath,
    widgetWrapper,
    personalization,
    opacity,
    position
  );
  let tempF;

  if (window.onload) {
    tempF = window.onload;
  }

  window.onload = () => {
    if (tempF) {
      tempF();
    }

    this.element = document.querySelector('[vw-plugin-wrapper]').closest('[vw]');

    const wrapper = document.querySelector('[vw-plugin-wrapper]');
    const access = document.querySelector('[vw-access-button]');

    accessButton.load(
      document.querySelector('[vw-access-button]'),
      this.element
    );
    widgetWrapper.load(document.querySelector('[vw-plugin-wrapper]'));

    window.addEventListener('vp-widget-wrapper-set-side', (event) => {
      const position = event.detail;
      if (!position || !widgetPosition.includes(position)) return;

      this.element = getWidget();

      this.element.style.left = position.includes('L')
        ? '0' : ['T', 'B'].includes(position) ? '50%' : 'initial';

      this.element.style.right = position.includes('R')
        ? '0' : 'initial';

      this.element.style.top = position.includes('T')
        ? '0' : ['L', 'R'].includes(position) ? '50%' : 'initial';

      this.element.style.bottom = position.includes('B')
        ? '0' : 'initial';

      this.element.style.transform = ['L', 'R'].includes(position)
        ? 'translateY(calc(-50% - 10px))' : ['T', 'B'].includes(position)
          ? 'translateX(calc(-50% - 10px))' : 'initial';

      access.classList.toggle('isLeft', position.includes('L'));
      access.classList.toggle('isTopOrBottom', 'TB'.includes(position));

      // Set position
      if (window.plugin) window.plugin.position = position;
    });

    window.addEventListener('vp-widget-close', (event) => {
      access.classList.toggle('active');
      wrapper.classList.toggle('active');
      addClass($('div[vp-change-avatar]'), 'active');
      addClass($('div[vp-additional-options]'), 'vp-enabled');
      removeClass($('div[vp-controls]'), 'vpw-selectText');

      const tagsTexts = document.querySelectorAll('.vw-text');
      for (let i = 0; i < tagsTexts.length; i++) {
        const parent = tagsTexts[i].parentNode;
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

    // Apply Widget default position
    if (widgetPosition.includes(position)) {
      window.dispatchEvent(
        new CustomEvent('vp-widget-wrapper-set-side', { detail: position }));
    }

  };
};
