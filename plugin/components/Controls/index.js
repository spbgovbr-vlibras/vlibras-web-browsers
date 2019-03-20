var noUiSlider = require('nouislider');
require('nouislider/distribute/nouislider.min.css');

var controlsTpl = require('./controls.html');
require('./controls.scss');

function Controls(player, dictionary) {
  this.player = player;
  this.dictionary = dictionary;

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
  var subtitles = this.element.querySelector('.controls-subtitles');
  var dictionary = this.element.querySelector('.controls-dictionary');

  play.addEventListener('click', function () {
    if (this.element.classList.contains('playing')) {
      this.player.pause();
    } else if(this.element.classList.contains('stopped')) {
      this.player.repeat();
    } else {
      this.player.continue();
    }
  }.bind(this));

  var speed = document.getElementById('sel-speed');

  speed.addEventListener('change', function() {
      var value = speed.options[speed.selectedIndex].value;
      this.player.setSpeed(parseFloat(value));
  }.bind(this));



  subtitles.addEventListener('click', function () {
    this.element.classList.toggle('subtitles');
    this.player.toggleSubtitle();
  }.bind(this));

  dictionary.addEventListener('click', function (event) {
    console.log(event.target);

    if (!event.target.classList.contains('loading-dictionary'))
    {
      this.dictionary.show();
      this.player.pause();
    }
  }.bind(this));
};

module.exports = Controls;
