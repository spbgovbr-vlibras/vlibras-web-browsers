const { loadTextCaptureScript } = require('./text-capture');
const { canTranslate, toggleUnityMainLoop } = require('~utils');

const template = require('./template.html').default;
require('./styles.scss');

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
  this.loadImages();
  this.element.addEventListener('click', async () => {
    this.element.classList.toggle('active');
    this.pluginWrapper.element.classList.toggle('active');
    if (this.ready) toggleUnityMainLoop(true);

    window.plugin =
      window.plugin || new (await import(/* webpackPrefetch: true */ '../../../../plugin/')).Plugin({
        enableMoveWindow: true,
        enableWelcome: true,
        personalization: this.personalization,
        wrapper: this.pluginWrapper.element,
        position: this.position,
        rootPath: this.rootPath,
        opacity: this.opacity,
        avatar: this.avatar
      })



    if (this.ready) loadTextCaptureScript();
    else {
      const _canTranslate = setInterval(() => {
        if (!canTranslate()) return;
        loadTextCaptureScript();
        this.ready = true;
        clearInterval(_canTranslate);
      }, 1000)
    }

  });
};

AccessButton.prototype.loadImages = function () {
  this.element.querySelectorAll('img[data-src]').forEach((image) => {
    image.onload = () => {
      image.src = buildAbsolutePath.bind(this)(image.getAttribute('data-src'));
      image.onload = null;
    }
  });

  function buildAbsolutePath(path) {
    return this.rootPath ? this.rootPath + '/' + path : path;
  };
};

module.exports = AccessButton;
