var template = require('./suggestion-screen.html').default;
require('./suggestion-screen.scss');

function SuggestionScreen(suggestionScreen) {
  this.element = null;
  this.suggestionScreen = suggestionScreen;
}

SuggestionScreen.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;

  this.rate = null;

  this.textElement = this.element.querySelector('.vp-text');

  const send = this.element.querySelector('.vp-send-button');
  const close = this.element.querySelector('.vp-close-button');

  send.addEventListener('click', () => {
    window.plugin.sendReview(this.rate, this.textElement.value);
  });

  close.addEventListener('click', () => {
    this.hide();
  });
};

SuggestionScreen.prototype.setGloss = function (gloss) {
  this.textElement.value = gloss;
};

SuggestionScreen.prototype.show = function (rate) {
  this.element.querySelector('.vp-text').style.display = 'block';
  // console.log(this.element.querySelector('.vp-text'));
  this.rate = rate;
  this.element.classList.add('vp-enabled');

};

SuggestionScreen.prototype.hide = function () {
  this.element.querySelector('.vp-text').style.display = 'none';
  this.element.classList.remove('vp-enabled');
};

module.exports = SuggestionScreen;
