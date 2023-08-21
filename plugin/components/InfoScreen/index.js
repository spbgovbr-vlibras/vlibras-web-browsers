const inherits = require('inherits');
const EventEmitter = require('events').EventEmitter;

const { socialIcons, backIcon } = require('~icons');

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

  const backButton = this.element.querySelector('.vpw-back-button');
  const social = this.element.querySelector('.vpw-info__networks-container').children;

  // ADD ICONS
  backButton.innerHTML = backIcon;
  social[0].innerHTML = socialIcons.website;
  social[1].innerHTML = socialIcons.face;
  social[2].innerHTML = socialIcons.insta;
  social[3].innerHTML = socialIcons.twitter;
  social[4].innerHTML = socialIcons.youtube;

  backButton.addEventListener(
    'click',
    function () {
      this.hide();
      document.querySelector('.vpw-header-btn-about')
        .classList.remove('selected');
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
