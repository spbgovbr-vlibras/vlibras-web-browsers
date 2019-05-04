var noUiSlider = require('nouislider');
require('nouislider/distribute/nouislider.min.css');

var controlsTpl = require('./controls.html');
require('./controls.scss');

function Controls(player, dictionary) {
  this.player = player;
  this.dictionary = dictionary;

  this.player.on('animation:play', function () {
    console.log('animation:play');
    this.element.classList.remove('vpw-stopped');
    this.element.classList.add('vpw-playing');
  }.bind(this));

  this.player.on('animation:pause', function () {
    console.log('animation:pause');
    this.element.classList.remove('vpw-playing');
    this.element.classList.remove('vpw-stopped');
  }.bind(this));

  this.player.on('animation:end', function () {
    console.log('animation:end');
    this.element.classList.remove('vpw-playing');
    this.element.classList.add('vpw-stopped');
  }.bind(this));
}

Controls.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = controlsTpl;
  this.element.classList.add('vpw-controls');
  this.element.classList.add('vpw-subtitles');

  var play = this.element.querySelector('.vpw-controls-play');
  var subtitles = this.element.querySelector('.vpw-controls-subtitles');
  var speed_default = this.element.querySelector('.vpw-speed-default');
  var speednumber = this.element.querySelector('.vpw-controls-speed-number');
  var elem_speed = this.element.querySelector('.vpw-elem-speed');
  var speed05 = this.element.querySelector('.vpw-block-speed-05');
  var speed1 = this.element.querySelector('.vpw-block-speed-1');
  var speed2 = this.element.querySelector('.vpw-block-speed-2');
  var speed3 = this.element.querySelector('.vpw-block-speed-3');
  var slider = this.element.querySelector('.vpw-controls-slider .vpw-slider');
  var img = this.element.querySelector('.vpw-img-default');
  var button = this.element.querySelector('.vpw-button-speed');
  var border = this.element.querySelector('.vpw-border-default');


    noUiSlider.create(slider, {
      start: 0.0,
      step: 0.05,
      connect: 'lower',
      range: {
        min: 0.2,
        max: 2
      }
    });

    // slider.noUiSlider.on('update', function (value) {
    //   this.player.setSpeed(Number(value[0]));
    // }.bind(this));


  play.addEventListener('click', function () {
    if (this.element.classList.contains('vpw-playing')) {
      this.player.pause();
    } else if(this.element.classList.contains('vpw-stopped')) {
      this.player.repeat();
    } else {
      this.player.continue();
    }
  }.bind(this));

  subtitles.addEventListener('click', function () {
    this.element.classList.toggle('vpw-subtitles');
    this.player.toggleSubtitle();
  }.bind(this));


  var visibility = false;
  var speed_value;


  button.addEventListener('click', function() {
    if (visibility) {
        img.style.display = 'none';
        border.style.display = 'none';
        speed_default.style.display = 'block';
        visibility = false;
        elem_speed.style.display = "none";
        //speed_default.style.background = "none";
        // speed_default.style.border = '1px solid grey';
        // speed_default.style.color = 'grey';
        // speed_default.style.borderRadius = '3px 3px 3px 3px';
        // speed_default.style.paddingRight = '3.5px';
        // speed_default.style.paddingLeft = '3.5px';

        speed_default.innerHTML = speed_value;

    } else {
        // speed_default.style.background = "url('././assets/running.svg') no-repeat center";
        img.style.display = 'block';
        border.style.display = 'block';
        speed_default.style.display = 'none';

        // speed_default.style.border = '1px solid #003F86';
        // speed_default.style.borderRadius = '0px 0px 3px 3px';
        speed_value = speed_default.innerHTML;
        speed_default.innerHTML = '';

        // speed_default.style.paddingRight = '4px';
        // speed_default.style.paddingLeft = '19px';
        elem_speed.style.display = "block";
        visibility = true;

    }


  }.bind(this));

  speed05.addEventListener('click', () => {
    this.setSpeed(0.5, '0.5x', elem_speed, speed_default, img, border);
    speed_default.style.padding = '6px 2.5px 5px 2.5px'
    speed_default.style.fontSize = '11px'
    visibility = false;  

  });

  speed1.addEventListener('click', () => {
    this.setSpeed(1.0, 'x1', elem_speed, speed_default, img, border);
    visibility = false;  
  });

  speed2.addEventListener('click', () => {
    this.setSpeed(1.5, 'x2', elem_speed, speed_default, img, border);
    visibility = false;  

  });
  speed3.addEventListener('click', () => {
    this.setSpeed(2.0, 'x3', elem_speed, speed_default, img, border);
    visibility = false;  

  });


};


Controls.prototype.setSpeed = function (speed, label, elem_speed, speed_default, img, border) {
    img.style.display = 'none';
    border.style.display = 'none';
    speed_default.style.display = 'block';
    speed_default.style.color = 'grey';
    speed_default.style.border = '1px solid grey';
    speed_default.style.borderRadius = '3px 3px 3px 3px';
    speed_default.innerHTML = label;
    speed_default.style.padding = '3px 4px';
    speed_default.style.fontSize = '15px';
    elem_speed.style.display = "none";

    this.player.setSpeed(parseFloat(speed));
  } 

module.exports = Controls;
