const template = require('./translator-screen.html').default;
require('./translator-screen.scss');

const { closeIcon } = require('~icons');

function TranslatorScreen(player) {
  this.element = null;
  this.player = player;
}

TranslatorScreen.prototype.load = function (element) {
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

TranslatorScreen.prototype.show = function () {
  this.element.classList.add('vp-enabled');
}

TranslatorScreen.prototype.hide = function () {
  this.element.classList.remove('vp-enabled');
}

TranslatorScreen.prototype.toggle = function () {
  this.element.classList.toggle('vp-enabled');
}

module.exports = TranslatorScreen;
