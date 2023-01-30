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
  const realizadores = this.element.querySelector('#vpw-info-realizadores');
  const left = this.element.querySelector('.vpw-arrow-left');
  const right = this.element.querySelector('.vpw-arrow-right');
  const bullets = this.element.querySelectorAll('.vpw-info-bullet');

  left.addEventListener('click', function () {
    realizadores.classList.remove('active');
    main.classList.add('active');

    this.classList.remove('active');
    right.classList.add('active');
    srcTmp = bullets[0].src;
    bullets[0].src = bullets[1].src;
    bullets[1].src = srcTmp;
  });

  right.addEventListener('click', function () {
    main.classList.remove('active');
    realizadores.classList.add('active');

    this.classList.remove('active');
    left.classList.add('active');

    srcTmp = bullets[0].src;
    bullets[0].src = bullets[1].src;
    bullets[1].src = srcTmp;
  });
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
