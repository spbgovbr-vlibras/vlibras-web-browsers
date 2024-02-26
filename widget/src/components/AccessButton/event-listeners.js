const { addClass, $, removeClass, toggleUnityMainLoop } = require('~utils');

export function createWidgetEventListeners() {
  const wrapper = document.querySelector('[vw-plugin-wrapper]');
  const access = document.querySelector('[vw-access-button]');

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
}
