const template = require('./rate-box.html').default;
require('./rate-box.scss');

const { arrowIcon, likeLineIcon, likeSolidIcon } = require('../../assets/icons/');

function RateBox(messageBox, suggestionScreen) {
  this.element = null;
  this.suggestionScreen = suggestionScreen;
  this.messageBox = messageBox;
}

RateBox.prototype.load = function(element) {
  this.element = element;
  this.element.innerHTML = template;

  this.headerButton = this.element.querySelector('.vp-rate-box-header button');
  const likeBtn = this.element.querySelector('.vp-rate-btns--like');
  const deslikeBtn = this.element.querySelector('.vp-rate-btns--deslike');

  // Add icon
  this.headerButton.innerHTML = arrowIcon;
  likeBtn.innerHTML =  likeLineIcon + likeSolidIcon + likeBtn.innerHTML;
  deslikeBtn.innerHTML = likeLineIcon + likeSolidIcon + deslikeBtn.innerHTML;

  this.headerButton.addEventListener('click', function () {
    this.element.classList.toggle('vp-expanded');
  }.bind(this));

  likeBtn.addEventListener('click', function () {
    window.plugin.sendReview('good');
  }.bind(this));

  deslikeBtn.addEventListener('click', function () {
    this.suggestionScreen.show();
    this.suggestionScreen.setGloss(window.plugin.player.gloss);
  }.bind(this));
  
};

RateBox.prototype.reload = function() {
  this.suggestionScreen.hide();
  this.headerButton.innerHTML = arrowIcon;
};

RateBox.prototype.show = function() {
  this.element.classList.add('vp-enabled');
};

RateBox.prototype.hide = function() {
  this.reload();
  this.element.classList.remove('vp-enabled');
  this.element.classList.remove('vp-expanded');
};

RateBox.prototype.getElement = function () {
  return this.element;
}

module.exports = RateBox;
