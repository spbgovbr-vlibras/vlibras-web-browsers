const template = require('./suggestion-button.html').default;
require('./suggestion-button.scss');

function SuggestionButton(suggestionScreen) {
  this.element = null;
  this.suggestionScreen = suggestionScreen;
}

SuggestionButton.prototype.load = function(element) {
  this.element = element;
  this.element.innerHTML = template;

  const openScreen = this.element.querySelector('.vp-open-screen-button');
  const close = this.element.querySelector('.vp-close-button');

  openScreen.addEventListener('click', () => {
    this.suggestionScreen.show(this.rate);
    this.hide();
  });

  close.addEventListener('click', () => {
    this.hide();
  });
};

SuggestionButton.prototype.show = function(rate) {
  this.rate = rate;
  this.element.classList.add('vp-enabled');
};

SuggestionButton.prototype.hide = function() {
  this.element.classList.remove('vp-enabled');
};

module.exports = SuggestionButton;
