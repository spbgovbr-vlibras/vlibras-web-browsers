const AccessButton = require('./components/AccessButton');
const PluginWrapper = require('./components/PluginWrapper');

require('./scss/styles.scss');

const { $, $$, addClass, toggleUnityMainLoop, removeClass, getWidget } = require('~utils');
const { ROOT_PATH: DEFAULT_ROOT_PATH } = require('~constants');

const availablePositions = ['TL', 'T', 'TR', 'L', 'R', 'BL', 'B', 'BR'];
const availableAvatars = ['icaro', 'hosana', 'guga', 'random'];

module.exports = function Widget(...args) {
  const optObject = typeof args[0] === 'object' && args[0];

  const personalization = optObject ? optObject.personalization : args[1];
  let rootPath = optObject ? optObject.rootPath : args[0];
  let position = optObject ? optObject.position : args[3];
  let opacity = optObject ? optObject.opacity : args[2];
  let avatar = optObject.avatar;

  if (rootPath === undefined) rootPath = DEFAULT_ROOT_PATH;
  else if (rootPath && !rootPath.endsWith('/')) rootPath += '/';
  if (isNaN(opacity) || opacity < 0 || opacity > 1) opacity = 1;
  if (!availablePositions.includes(position)) position = 'R';
  if (!availableAvatars.includes(avatar)) avatar = 'icaro';

  const pluginWrapper = new PluginWrapper();
  const accessButton = new AccessButton({
    rootPath, pluginWrapper, personalization,
    opacity, position, avatar
  });

  let tempF;

  if (window.onload) {
    tempF = window.onload;
  }

  window.onload = () => {
    resolveMultipleWidgetsIssue();

    if (tempF) tempF();

    this.element = $('[vw-plugin-wrapper]').closest('[vw]');

    const wrapper = $('[vw-plugin-wrapper]');
    const access = $('[vw-access-button]');

    accessButton.load($('[vw-access-button]'), this.element);
    pluginWrapper.load($('[vw-plugin-wrapper]'));

    window.addEventListener('vp-widget-wrapper-set-side', (event) => {
      const position = event.detail;
      if (!position || !availablePositions.includes(position)) return;

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

      const access = $('[vw-access-button]');

      access.classList.toggle('isLeft', position.includes('L'));
      access.classList.toggle('isTopOrBottom', 'TB'.includes(position));

      // Set position
      if (window.plugin) window.plugin.position = position;
    });

    $$('img[data-src]', this.element).forEach((image) => {
      const imagePath = image.attributes['data-src'].value;
      image.src = rootPath ? rootPath + '/' + imagePath : imagePath;
    });

    window.addEventListener('vp-widget-close', (event) => {
      access.classList.toggle('active');
      wrapper.classList.toggle('active');
      addClass($('div[vp-change-avatar]'), 'active');
      addClass($('div[vp-additional-options]'), 'vp-enabled');
      removeClass($('div[vp-controls]'), 'vpw-selectText');
      toggleUnityMainLoop(false);
    });
  
    window.addEventListener('vw-change-opacity', (event) => {
      wrapper.style.background = `rgba(235,235,235, ${event.detail})`;
    });

    // Apply Widget default position
    if (availablePositions.includes(position)) {
      window.dispatchEvent(
        new CustomEvent('vp-widget-wrapper-set-side', { detail: position }));
    }
  };

  function resolveMultipleWidgetsIssue() {
    $$('[vw]').forEach(vw => {
      if (!($('[vp]'), vw)) {
        vw.removeAttribute('vw');

         if (location.hostname.includes('correios.com.br')) {
          removeClass(vw, 'enabled');
        }
      }
    })
  }

};
