const inherits = require('inherits');
const EventEmitter = require('events').EventEmitter;

const template = require('./translator-screen.html').default;
require('./translator-screen.scss');

const { closeIcon } = require('~icons');

function Translator(player) {
  this.element = null;
  this.player = player;
  this.enabled = false;
}

inherits(Translator, EventEmitter);

Translator.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;

  const closeBtn = this.element.querySelector('.vp-translator-screen-header button');
  const userText = this.element.querySelector('.vp-text');
  const visualizeBtn = this.element.querySelector('.vp-visualize-signal-button');

  // Add icons
  closeBtn.innerHTML = closeIcon;

  // Add actions
  closeBtn.onclick = () => this.hide();
  visualizeBtn.onclick = () => this.player.translate(userText.value.trim());

  userText.addEventListener('input', function () {

    if (!userText.value.replace(/[^a-z0-9]/gi, '')) {
      visualizeBtn.setAttribute('disabled', true);
    } else {
      visualizeBtn.removeAttribute('disabled');
    }

  });

  userText.addEventListener('keypress', e => {
    if (e.key === 'Enter' && !visualizeBtn.disabled) {
      e.preventDefault();
      visualizeBtn.click();
    }
  })

}

Translator.prototype.show = function () {
  this.element.classList.add('vp-enabled');
  this.enabled = true;
  this.emit('show');
}

Translator.prototype.hide = function () {
  this.element.classList.remove('vp-enabled');
  this.enabled = false;
  this.emit('hide');
}

Translator.prototype.toggle = function () {
  if (this.enabled) this.hide();
  else this.show();
}

module.exports = Translator;
