const template = require('./rate-box.html').default;
require('./rate-box.scss');

function RateBox(suggestionButton, messageBox) {
  this.element = null;
  this.suggestionButton = suggestionButton;
  this.messageBox = messageBox;
}

RateBox.prototype.load = function(element) {
  this.element = element;
  this.element.innerHTML = template;

  const thumbUp = this.element.querySelector('.vp-thumb-up');
  const thumbDown = this.element.querySelector('.vp-thumb-down');

  thumbUp.addEventListener('click', () => {
    window.plugin.sendReview('good');
  });

  thumbDown.addEventListener('click', () => {
    this.hide();
    this.suggestionButton.show('bad');
  });
};

RateBox.prototype.show = function() {
  this.element.classList.add('vp-enabled');
};

RateBox.prototype.hide = function() {
  this.element.classList.remove('vp-enabled');
};

module.exports = RateBox;
