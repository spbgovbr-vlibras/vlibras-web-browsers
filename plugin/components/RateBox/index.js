var template = require('./rate-box.html').default;
require('./rate-box.scss');

function RateBox(suggestionButton, messageBox) {
  this.element = null;
  this.suggestionButton = suggestionButton;
  this.messageBox = messageBox;
}

RateBox.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;

  const thumbUp = this.element.querySelector('.vp-thumb-up').parentNode;
  const thumbDown = this.element.querySelector('.vp-thumb-down').parentNode;
  const exitButton = this.element.querySelector('.vp-ratebox-close');

  thumbUp.addEventListener('click', () => {
    this.hide();
    window.plugin.sendReview('good');
    this.suggestionButton.show('good');
  });

  thumbDown.addEventListener('click', () => {
    this.hide();
    this.suggestionButton.show('bad');
  });

  exitButton.addEventListener('click', () => {
    this.hide();
  });

  this.element.addEventListener("click", (evt) => {
    const menu = this.element.querySelector('.vp-container');
    let targetElement = evt.target;

    do {
      if (targetElement == menu) {
        return;
      }
      targetElement = targetElement.parentNode;
    } while (targetElement);

    this.hide();
  });

};

RateBox.prototype.show = function () {
  this.element.classList.add('vp-enabled');
};

RateBox.prototype.hide = function () {
  this.element.classList.remove('vp-enabled');
};

module.exports = RateBox;
