var noUiSlider = require('nouislider');
require('nouislider/distribute/nouislider.min.css');

var controlsTpl = require('./controls.html').default;
require('./controls.scss');

function Controls(player, dictionary) {
  this.player = player;
  this.dictionary = dictionary;
  let count = 0;

  this.player.on('animation:play', function () {
    this.element.querySelector('.vpw-controls-waiting').classList.remove('active');
    this.element.querySelector('.vpw-controls-translate').classList.add('active');
    this.element.classList.remove('vpw-stopped');
    this.element.classList.add('vpw-playing');
  }.bind(this));

  this.player.on('animation:pause', function () {
    // console.log('animation:pause');
    this.element.classList.remove('vpw-playing');
    this.element.classList.remove('vpw-stopped');
  }.bind(this));

  this.player.on('animation:end', function () {
    // console.log('animation:end');
    this.element.classList.remove('vpw-playing');
    this.element.classList.add('vpw-stopped');
    if (count < 2) {
      this.element.querySelector('.vpw-controls-waiting').classList.add('active')
      this.element.querySelector('.vpw-controls-translate').classList.remove('active');
      count++
    }

  }.bind(this));

  this.player.on('response:glosa', function (counter, glosaLenght) {
    counter = counter - 2

    //console.log(counter + ' ' + glosaLenght);
    if (counter != -1) {
      var slider = this.element.querySelector('.vpw-controls-slider .vpw-slider');

      slider.noUiSlider.updateOptions({
        range: {
          'min': 0,
          'max': glosaLenght
        }
      });

      slider.noUiSlider.set([counter, glosaLenght]);
    }

  }.bind(this));

  this.player.on('gloss:end', function (globalGlosaLenght) {
    globalGlosaLenght = globalGlosaLenght
    var slider = this.element.querySelector('.vpw-controls-slider .vpw-slider');

    slider.noUiSlider.updateOptions({
      range: {
        'min': 0,
        'max': globalGlosaLenght
      }
    });
    slider.noUiSlider.set([globalGlosaLenght, globalGlosaLenght]);

  }.bind(this));

}

Controls.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = controlsTpl;
  this.element.classList.add('vpw-controls');
  this.element.classList.add('vpw-subtitles');


  var play = this.element.querySelector('.vpw-controls-play');
  var subtitles = this.element.querySelector('.vpw-controls-subtitles');
  var elem_speed = this.element.querySelector('.vpw-elem-speed');
  var speed_block = this.element.querySelectorAll('.vpw-block-speed');
  var speed05 = this.element.querySelector('.vpw-block-speed-05');
  var speed1 = this.element.querySelector('.vpw-block-speed-1');
  var speed2 = this.element.querySelector('.vpw-block-speed-2');
  var speed3 = this.element.querySelector('.vpw-block-speed-3');
  var slider = this.element.querySelector('.vpw-controls-slider .vpw-slider');
  var img_default = this.element.querySelector('.vpw-img-default');
  var img_selected = this.element.querySelector('.vpw-img-selected');
  var button = this.element.querySelector('.vpw-button-speed');

  noUiSlider.create(slider, {
    start: 0.0,
    step: 0.05,
    connect: 'lower',
    range: {
      min: 0.2,
      max: 200
    }
  });
  slider.setAttribute('disabled', true);

  play.addEventListener('click', function () {
    if (this.element.classList.contains('vpw-playing')) {
      this.player.pause();
    } else if (this.element.classList.contains('vpw-stopped')) {
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

  button.addEventListener('mouseover', function () {
    if (visibility) {
      visibility = false;
      elem_speed.style.display = "none";
      img_default.style.display = 'block';
      img_selected.style.display = 'none';
    } else {
      elem_speed.style.display = "block";
      visibility = true;
      img_default.style.display = 'none';
      img_selected.style.display = 'block';
    }
  }.bind(this));

  elem_speed.addEventListener('mouseout', function () {
    if (visibility) {
      visibility = false;
      elem_speed.style.display = "none";
      img_default.style.display = 'block';
      img_selected.style.display = 'none';
    } else {
      elem_speed.style.display = "block";
      visibility = true;
      img_default.style.display = 'none';
      img_selected.style.display = 'block';
    }

  }.bind(this));

  speed05.addEventListener('click', () => {
    this.setSpeed(speed05, 0.5, '0.5x', elem_speed, img_default, img_selected, speed_block);
    visibility = false;
  });

  speed1.addEventListener('click', () => {
    this.setSpeed(speed1, 1.0, 'x1', elem_speed, img_default, img_selected, speed_block);
    visibility = false;
  });

  speed2.addEventListener('click', () => {
    this.setSpeed(speed2, 1.5, 'x2', elem_speed, img_default, img_selected, speed_block);
    visibility = false;
  });
  speed3.addEventListener('click', () => {
    this.setSpeed(speed3, 2.0, 'x3', elem_speed, img_default, img_selected, speed_block);
    visibility = false;
  });
};

Controls.prototype.setSpeed = function (speed_n, speed, label, elem_speed, img_default, img_selected, speed_block) {
  speed_block.forEach(el => {
    el.style.backgroundColor = 'white'
    el.style.color = 'black'
  })
  speed_n.style.backgroundColor = '#D6E5F9'
  speed_n.style.color = '#1447A6'
  elem_speed.style.display = 'none';
  img_default.style.display = 'block';
  img_selected.style.display = 'none';

  visibility = false;

  this.player.setSpeed(parseFloat(speed));
  this.player.pause()
  this.player.continue()
}

Controls.prototype.setProgress = function () {
  if (this.element != undefined) {
    var slider = this.element.querySelector('.vpw-controls-slider .vpw-slider');

    slider.noUiSlider.updateOptions({
      range: {
        'min': 0,
        'max': 2
      }
    });

    slider.noUiSlider.set([0, 0]);
  }
}

module.exports = Controls;
