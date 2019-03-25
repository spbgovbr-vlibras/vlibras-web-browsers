var template = require('./suggestion-screen.html');
require('./suggestion-screen.scss');

function SuggestionScreen(suggestionScreen) {
  this.element = null;
  this.suggestionScreen = suggestionScreen;
}

SuggestionScreen.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;

  const send = this.element.querySelector('.vp-send-button');
  const close = this.element.querySelector('.vp-close-button');

  send.addEventListener('click', () => {
    this.hide();
  });

  close.addEventListener('click', () => {
    this.hide();
  });
};

SuggestionScreen.prototype.show = function () {
  this.element.classList.add('vp-enabled');
};

SuggestionScreen.prototype.hide = function () {
  this.element.classList.remove('vp-enabled');
};

module.exports = SuggestionScreen;
