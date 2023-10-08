const template = require('./rate-box.html').default;
require('./rate-box.scss');

const { arrowIcon, likeLineIcon, likeSolidIcon, arrowOutward, closeIcon } = require('~icons');

function RateBox(messageBox, suggestionScreen, player) {
  this.element = null;
  this.suggestionScreen = suggestionScreen;
  this.messageBox = messageBox;
  this.player = player;
}

RateBox.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;
  this.isOpenWikiContainer = false;
  this.content = this.element.querySelector('.vp-rate-box-content');
  this.headerButton = this.element.querySelector('.vp-rate-box-header button');
  this.boxGloss = this.content.querySelector('box-gloss');
  const likeBtn = this.element.querySelector('.vp-rate-btns--like');
  const deslikeBtn = this.element.querySelector('.vp-rate-btns--deslike');
  const wikiLink = this.element.querySelector('.vp-rate-box__gloss a');

  // Add icon
  this.headerButton.innerHTML = arrowIcon;
  likeBtn.innerHTML = likeLineIcon + likeSolidIcon + likeBtn.innerHTML;
  deslikeBtn.innerHTML = likeLineIcon + likeSolidIcon + deslikeBtn.innerHTML;
  wikiLink.innerHTML += arrowOutward;

  this.headerButton.onclick = function () {
    if (this.isOpenWikiContainer) window.plugin.sendReview('bad');
    this.element.classList.toggle('vp-expanded');
  }.bind(this);

  likeBtn.onclick = () => window.plugin.sendReview('good');
  wikiLink.onclick = () => window.plugin.sendReview('bad');

  deslikeBtn.onclick = function () {
    if (this.player.fromDictionary) return this.toggleWikiContainer(true);
    else this.toggleWikiContainer(false);
    this.suggestionScreen.show();
    this.suggestionScreen.setGloss(this.player.gloss);
  }.bind(this);

  this.player.addListener('gloss:end', () => {
    this.toggleWikiContainer(false);
  })

};

RateBox.prototype.reload = function () {
  this.suggestionScreen.hide();
  this.headerButton.innerHTML = arrowIcon;
};

RateBox.prototype.show = function () {
  if (this.player.gloss == undefined || this.player.skipped) return;
  this.element.classList.add('vp-enabled');
};

RateBox.prototype.hide = function () {
  this.reload();
  this.element.classList.remove('vp-enabled');
  this.element.classList.remove('vp-expanded');
};

RateBox.prototype.toggleWikiContainer = function (bool) {
  this.isOpenWikiContainer = bool;
  this.content.classList.toggle('vp-from-dictionary', bool);
  this.boxGloss.title = this.player.gloss;
  this.boxGloss.innerHTML = `"${formatGloss(this.player.gloss)}"`;
  this.headerButton.innerHTML = this.isOpenWikiContainer ? closeIcon : arrowIcon;
}

RateBox.prototype.getElement = function () {
  return this.element;
}

function formatGloss(gloss) {
  return gloss.length < 15 ? gloss : gloss.substring(0, 15) + "...";
}

module.exports = RateBox;
