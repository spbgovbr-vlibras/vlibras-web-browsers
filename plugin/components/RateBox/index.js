const template = require('./rate-box.html').default;
require('./rate-box.scss');

const { arrowIcon } = require('../../assets/icons/');

function RateBox(suggestionButton, messageBox) {
  this.element = null;
  this.suggestionButton = suggestionButton;
  this.messageBox = messageBox;
}

RateBox.prototype.load = function(element) {
  this.element = element;
  this.element.innerHTML = template;

  const collapseBtn = this.element.querySelector('.vp-rate-box-header button');

  // Add icon
  collapseBtn.innerHTML = arrowIcon;

  collapseBtn.onclick = () => {
    collapseBtn.classList.toggle('vp-expanded');
    this.element.classList.toggle('vp-expanded');
  }

  // thumbDown.addEventListener('click', () => {
  //   this.hide();
  //   this.suggestionButton.show('bad');
  // });
};

RateBox.prototype.show = function() {
  this.element.classList.add('vp-enabled');
};

RateBox.prototype.hide = function() {
  this.element.classList.remove('vp-enabled');
  this.element.classList.remove('vp-expanded');
};

module.exports = RateBox;
