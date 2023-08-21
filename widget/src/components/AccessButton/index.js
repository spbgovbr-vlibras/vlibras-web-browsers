const { loadTextCaptureScript } = require('./text-capture');

const template = require('./template.html').default;
require('./styles.scss');

function AccessButton(rootPath, pluginWrapper, personalization, opacity, position) {
  this.personalization = personalization;
  this.rootPath = rootPath;
  this.pluginWrapper = pluginWrapper;
  this.vw_links = null;
  this.currentElement = null;
  this.currentSpanElement = null;
  this.opacity = opacity || 1;
  this.position = position || 'R';
}

AccessButton.prototype.load = function (element, vw) {
  this.element = element;
  this.element.innerHTML = template;
  this.element.addEventListener('click', () => {
    this.element.classList.toggle('active');
    this.pluginWrapper.element.classList.toggle('active');

    window.plugin =
      window.plugin ||
      new window.VLibras.Plugin({
        enableMoveWindow: true,
        playWellcome: true,
        rootPath: this.rootPath,
        personalization: this.personalization,
        opacity: this.opacity,
        wrapper: this.pluginWrapper.element,
        position: this.position
      });

    loadTextCaptureScript();
  });
};

module.exports = AccessButton;
