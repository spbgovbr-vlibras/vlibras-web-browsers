
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;

var infoScreenTpl = require('./info-screen.html');
require('./info-screen.scss');

function InfoScreen(box) {
  // this.settingBtnClose = settingBtnClose;
  this.visible = false;
  this.box = box;
}

inherits(InfoScreen, EventEmitter);

InfoScreen.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = infoScreenTpl;
  this.element.classList.add('info-screen');

  var main = this.element.querySelector('#info-main');
  var realizadores = this.element.querySelector('#info-realizadores');
  var left = this.element.querySelector('.arrow-left');
  var right = this.element.querySelector('.arrow-right');
  var bullets = this.element.querySelectorAll('.info-bullet');
  var bullet_src_imgs = {
    first: bullets[0].attributes['data-src'].value,
    second:bullets[1].attributes['data-src'].value
  };
  
  
  

  

  left.addEventListener('click', function() {
    realizadores.classList.remove('active');
    main.classList.add('active');

    this.classList.remove('active');
    right.classList.add('active');
    srcTmp = bullets[0].src;
    bullets[0].src = bullets[1].src;
    bullets[1].src = srcTmp;
    // bullets[0].classList.add('active');
  });

  right.addEventListener('click', function() {
    main.classList.remove('active');
    realizadores.classList.add('active');

    this.classList.remove('active');
    left.classList.add('active');

    srcTmp = bullets[0].src;
    bullets[0].src = bullets[1].src;
    bullets[1].src = srcTmp;
  });

  // this.settingBtnClose.element.firstChild.addEventListener('click', function() {
  //   this.hide();
  //   this.settingBtnClose.element.firstChild.style.visibility = 'hidden;'
  // }.bind(this));

  // this.hide();
};

InfoScreen.prototype.toggle = function () {
  if (this.visible) this.hide();
  else this.show();
};

InfoScreen.prototype.hide = function () {
  this.visible = false;
  // this.settingBtnClose.element.firstChild.style.visibility = 'hidden';
  // this.box.element.querySelector('[settings-btn]').style.visibility = 'visible';
  this.element.classList.remove('active');
  this.emit('hide');
};

InfoScreen.prototype.show = function () {
  // this.settingBtnClose.element.firstChild.style.visibility = 'visible';
  // this.box.element.querySelector('[settings-btn]').style.visibility = 'hidden';
  this.visible = true;
  this.element.classList.add('active');
  this.emit('show');
};

module.exports = InfoScreen;
