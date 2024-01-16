const template = require('./translator-screen.html').default;
require('./translator-screen.scss');

const { closeIcon } = require('~icons');

function Translator(player) {
  this.element = null;
  this.player = player;
  this.enabled = false;
}

Translator.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;

  const closeBtn = this.element.querySelector('.vp-translator-screen-header button');
  const visualizeBtn = this.element.querySelector('.vp-play-gloss-button');
  const clearBtn = this.element.querySelector('.vp-clear-textarea');
  const userText = this.element.querySelector('.vp-user-textarea');

  // Add icons
  closeBtn.innerHTML = closeIcon;

  // Add actions
  closeBtn.onclick = () => this.hide();
  visualizeBtn.onclick = () => this.player.translate(userText.value.trim());
  clearBtn.onclick = clearUserText;

  userText.addEventListener('input', function () {
    clearBtn.disabled = !userText.value.trim();
    visualizeBtn.disabled = !userText.value.replace(/[^a-z0-9]/gi, '');
  });

  userText.addEventListener('keypress', e => {
    if (e.key === 'Enter' && !visualizeBtn.disabled) {
      e.preventDefault();
      visualizeBtn.click();
    }
  });

  function clearUserText() {
    userText.value = '';
    visualizeBtn.disabled = true;
    clearBtn.disabled = true;
  }
}

Translator.prototype.show = function () {
  this.element.classList.add('vp-enabled');
  this.enabled = true;
}

Translator.prototype.hide = function () {
  this.element.classList.remove('vp-enabled');
  this.enabled = false;
}

Translator.prototype.toggle = function () {
  if (this.enabled) this.hide();
  else this.show();
}

module.exports = Translator;
