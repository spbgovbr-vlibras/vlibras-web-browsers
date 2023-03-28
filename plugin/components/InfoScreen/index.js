const { faceIcon, instaIcon, twitterIcon, webIcon, youtubeIcon, backIcon } = require('../../assets/icons')

const inherits = require('inherits');
const EventEmitter = require('events').EventEmitter;

const infoScreenTpl = require('./info-screen.html').default;
require('./info-screen.scss');

function InfoScreen(box) {
  this.visible = false;
  this.box = box;
}

inherits(InfoScreen, EventEmitter);

InfoScreen.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = infoScreenTpl;
  this.element.classList.add('vpw-info-screen');

  const main = this.element.querySelector('#vpw-info-main');
  const realizadores = this.element.querySelector('.vpw-text-realizadores');
  const backButton = this.element.querySelector('.vpw-back-button');

  //ADD ICONS
  const social = this.element.querySelector('.vpw-logo-networks').children;
  social[0].innerHTML = webIcon;
  social[1].innerHTML = faceIcon;
  social[2].innerHTML = instaIcon;
  social[3].innerHTML = twitterIcon;
  social[4].innerHTML = youtubeIcon;
  this.element.querySelector('.vpw-back-button').innerHTML = backIcon;

  backButton.addEventListener(
    'click',
    function () {
      this.hide();
    }.bind(this)
  );
};



InfoScreen.prototype.toggle = function () {
  if (this.visible) this.hide();
  else this.show();
};

InfoScreen.prototype.hide = function () {
  this.visible = false;
  this.element.classList.remove('active');
  this.emit('hide');
};

InfoScreen.prototype.show = function () {
  this.visible = true;
  this.element.classList.add('active');
  this.emit('show');
};

module.exports = InfoScreen;
