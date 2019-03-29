var template = require('./suggestion-screen.html');
require('./suggestion-screen.scss');

function sendRate(text, gloss, rate, review) {
  const body = JSON.stringify({ text, gloss, rate, review });

  const http = new XMLHttpRequest();
  http.open('POST', 'http://104.197.183.69/review');
  http.setRequestHeader('Content-type', 'application/json');
  http.send(body);
  http.onload = function () {
    // Do whatever with response
    console.log('Review', http.responseText);
  };
}

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
  this.rate = rate;
  this.element.classList.add('vp-enabled');
};

SuggestionScreen.prototype.hide = function () {
  this.element.classList.remove('vp-enabled');
};

module.exports = SuggestionScreen;
