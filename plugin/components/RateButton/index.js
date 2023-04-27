const template = require('./rate-button.html').default;
require('./rate-button.scss');

function RateButton(rateBox) {
  this.element = null;
  this.rateBox = rateBox;
}

RateButton.prototype.load = function(element) {
  this.element = element;
  this.element.innerHTML = template;

  this.enabled = false;

  const button = this.element.querySelector('.vp-button');

  button.addEventListener('click', () => {
    if (this.enabled) {
      this.hide();
    }
  });
};

RateButton.prototype.show = function() {
  this.enabled = true;
  this.element.classList.add('vp-enabled');
};

RateButton.prototype.hide = function() {
  this.enabled = false;
  this.element.classList.remove('vp-enabled');
};

module.exports = RateButton;
