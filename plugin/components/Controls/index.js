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
  var configspeed = this.element.querySelector('.default');
  var speednumber = this.element.querySelector('.controls-speed-number');

  play.addEventListener('click', function () {
    if (this.element.classList.contains('playing')) {
      this.player.pause();
    } else if(this.element.classList.contains('stopped')) {
      this.player.repeat();
    } else {
      this.player.continue();
    }
  }.bind(this));

  // var speed = document.getElementById('sel-speed');

  // speed.addEventListener('change', function() {
  //     var value = speed.options[speed.selectedIndex].value;
  //     this.player.setSpeed(parseFloat(value));
  // }.bind(this));



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

  var visibility = false;



  configspeed.addEventListener('click', function() {


    if (visibility) {
        document.getElementById("elem-speed").style.display = "none";
        visibility = false;
        document.getElementById("default").style.background = "none";
        document.getElementById("default").style.border = '1px solid grey';
        document.getElementById("default").style.color = 'grey';
        document.getElementById("default").style.borderRadius = '3px 3px 3px 3px';

    } else {
        document.getElementById("default").style.background = "url('././assets/running.svg') no-repeat center";
        document.getElementById("default").style.border = '1px solid #003F86';
        document.getElementById("default").style.borderRadius = '0px 0px 3px 3px';
        document.getElementById("default").style.color = 'rgba(0,0,0,0)';
        document.getElementById("elem-speed").style.display = "block";
        visibility = true;
    }


  }.bind(this));

  var speed1 = this.element.querySelector('.block-speed-1');
  var speed2 = this.element.querySelector('.block-speed-2');
  var speed3 = this.element.querySelector('.block-speed-3');

  speed1.addEventListener('click', () => {
    this.setSpeed(1.0, '1x');
  });

  speed2.addEventListener('click', () => {
    this.setSpeed(1.5, '2x');
  });
  speed3.addEventListener('click', () => {
    this.setSpeed(2.0, '3x');
  });


};

Controls.prototype.setSpeed = function (speed, label) {
    document.getElementById("elem-speed").style.display = "none";
    document.getElementById("default").style.background = "none";
    document.getElementById("default").style.color = 'grey';
    document.getElementById("default").style.border = '1px solid grey';
    document.getElementById("default").style.borderRadius = '3px 3px 3px 3px';
    document.getElementById("default").innerHTML = label;

    visibility = false;  
    this.player.setSpeed(parseFloat(speed));
  } 

module.exports = Controls;
