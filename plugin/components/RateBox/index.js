var template = require('./rate-box.html');
require('./rate-box.scss');

function RateBox(suggestionButton, messageBox) {
  this.element = null;
  this.suggestionButton = suggestionButton;
  this.messageBox = messageBox;
}

RateBox.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;

  const thumbUp = this.element.querySelector('.vp-thumb-up');
  const thumbDown = this.element.querySelector('.vp-thumb-down');

  thumbUp.addEventListener('click', () => {
    this.hide();
    this.messageBox.show('success', 'Obrigado por avaliar!', 3000);
  });

  thumbDown.addEventListener('click', () => {
    this.hide();
    this.suggestionButton.show();
  });
};

RateBox.prototype.show = function () {
  this.element.classList.add('vp-enabled');
};

RateBox.prototype.hide = function () {
  this.element.classList.remove('vp-enabled');
};

module.exports = RateBox;
