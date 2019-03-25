var template = require('./rate-button.html');
require('./rate-button.scss');

function RateButton(rateBox) {
  this.element = null;
  this.rateBox = rateBox;
}

RateButton.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;
  
  const button = this.element.querySelector('.vp-button');

  button.addEventListener('click', () => {
    this.rateBox.show();
  });
};

RateButton.prototype.show = function () {
  this.element.classList.add('vp-enabled');
};

RateButton.prototype.hide = function () {
  this.element.classList.remove('vp-enabled');
};

module.exports = RateButton;
