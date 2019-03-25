var template = require('./suggestion-button.html');
require('./suggestion-button.scss');

function SuggestionButton(suggestionScreen) {
  this.element = null;
  this.suggestionScreen = suggestionScreen;
}

SuggestionButton.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;

  const openScreen = this.element.querySelector('.vp-open-screen-button');
  const close = this.element.querySelector('.vp-close-button');

  openScreen.addEventListener('click', () => {
    this.suggestionScreen.show();
    this.hide();
  });

  close.addEventListener('click', () => {
    this.hide();
  });

  this.show();
};

SuggestionButton.prototype.show = function () {
  this.element.classList.add('vp-enabled');
};

SuggestionButton.prototype.hide = function () {
  this.element.classList.remove('vp-enabled');
};

module.exports = SuggestionButton;
