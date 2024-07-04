const template = require('./template.html').default;

require('./styles.scss');

const { canTranslate, toggleUnityMainLoop } = require('~utils');

function AccessButton(props) {
  this.personalization = props.personalization;
  this.rootPath = props.rootPath;
  this.enableWelcome = props.enableWelcome;
  this.pluginWrapper = props.pluginWrapper;
  this.opacity = props.opacity;
  this.position = props.position;
  this.avatar = props.avatar;
  this.vw_links = null;
  this.currentElement = null;
  this.currentSpanElement = null;
  this.ready = false;
}

AccessButton.prototype.load = function (element, vw) {
  this.element = element;
  this.element.innerHTML = template;
  this.element.addEventListener('click', async () => {
    this.element.classList.toggle('active');
    this.pluginWrapper.element.classList.toggle('active');
    if (this.ready) toggleUnityMainLoop(true);

    // Dynamic imports
    const { Plugin } = await import('../../../../plugin/');
    const { loadTextCaptureScript } = await import('./text-capture');

    window.VLibras.Plugin = Plugin;

    const config = {
      enableMoveWindow: true,
      enableWelcome: true,
      personalization: this.personalization,
      wrapper: this.pluginWrapper.element,
      position: this.position,
      rootPath: this.rootPath,
      opacity: this.opacity,
      avatar: this.avatar,
    };

    if (!window.plugin) window.plugin = new window.VLibras.Plugin(config);

    if (this.ready) loadTextCaptureScript();
    else {
      const _canTranslate = setInterval(() => {
        if (!canTranslate()) return;
        loadTextCaptureScript();
        this.ready = true;
        clearInterval(_canTranslate);
      }, 1000);
    }
  });
};

module.exports = AccessButton;