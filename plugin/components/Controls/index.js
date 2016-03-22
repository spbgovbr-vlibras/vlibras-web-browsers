var noUiSlider = require('nouislider');
require('nouislider/distribute/nouislider.min.css');

var controlsTpl = require('./controls.html');
require('./controls.scss');

function Controls(player) {
  this.player = player;

  this.player.on('animation:play', function () {
    console.log('animation:play');
    this.element.classList.remove('stopped');
    this.element.classList.add('playing');
  }.bind(this));

  this.player.on('animation:pause', function () {
    console.log('animation:pause');
    this.element.classList.remove('playing');
    this.element.classList.remove('stopped');
  }.bind(this));

  this.player.on('animation:end', function () {
    console.log('animation:end');
    this.element.classList.remove('playing');
    this.element.classList.add('stopped');
  }.bind(this));
}

Controls.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = controlsTpl;
  this.element.classList.add('controls');
  this.element.classList.add('subtitles');

  var play = this.element.querySelector('.controls-play');
  var stop = this.element.querySelector('.controls-stop');
  var slider = this.element.querySelector('.controls-slider .slider');
  var subtitles = this.element.querySelector('.controls-subtitles');

  play.addEventListener('click', function () {
    if (this.element.classList.contains('playing')) {
      this.player.pause();
    } else if(this.element.classList.contains('stopped')) {
      this.player.repeat();
    } else {
      this.player.continue();
    }
  }.bind(this));

  stop.addEventListener('click', function () {
    this.player.stop();
  }.bind(this));

  noUiSlider.create(slider, {
    start: 1.1,
    step: 0.05,
    connect: 'lower',
    range: {
      min: 0,
      max: 2
    }
  });

  slider.noUiSlider.on('update', function (value) {
    this.player.setSpeed(Number(value[0]));
  }.bind(this));

  subtitles.addEventListener('click', function () {
    this.element.classList.toggle('subtitles');
    this.player.toggleSubtitle();
  }.bind(this));
};

module.exports = Controls;
