const noUiSlider = require('nouislider');
require('nouislider/distribute/nouislider.min.css');

const controlsTpl = require('./controls.html').default;
require('./controls.scss');

let firstTranslation = false;

function Controls(player, dictionary) {
  this.player = player;
  this.dictionary = dictionary;

  this.player.on(
    'animation:play',
    function () {
      this.element.classList.remove('vpw-selectText');
      this.element.classList.remove('vpw-stopped');
      this.element.classList.add('vpw-playing');
    }.bind(this)
  );

  this.player.on(
    'animation:pause',
    function () {
      this.element.classList.remove('vpw-playing');
      this.element.classList.remove('vpw-stopped');
    }.bind(this)
  );

  this.player.on(
    'animation:end',
    function () {
      this.element.classList.remove('vpw-playing');
      this.element.classList.add('vpw-stopped');
    }.bind(this)
  );

  this.player.on(
    'response:glosa',
    function (counter, glosaLenght) {
      counter = counter - 2;

      if (counter != -1) {
        const slider = this.element.querySelector(
          '.vpw-controls-slider .vpw-slider'
        );

        slider.noUiSlider.updateOptions({
          range: {
            min: 0,
            max: glosaLenght,
          },
        });

        slider.noUiSlider.set([counter, glosaLenght]);
      }
    }.bind(this)
  );

  this.player.on(
    'gloss:end',
    function (globalGlosaLenght) {
      globalGlosaLenght = globalGlosaLenght;
      const slider = this.element.querySelector(
        '.vpw-controls-slider .vpw-slider'
      );

      slider.noUiSlider.updateOptions({
        range: {
          min: 0,
          max: globalGlosaLenght,
        },
      });

      slider.noUiSlider.set([globalGlosaLenght, globalGlosaLenght]);
      this.element.classList.remove('vpw-selectText');
    }.bind(this)
  );


  this.player.on(
    'stop:welcome',
    function () {
      if (!firstTranslation) this.element.classList.add('vpw-selectText');
      firstTranslation = true;
    }.bind(this)
  );
}

Controls.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = controlsTpl;
  this.element.classList.add('vpw-controls');
  this.element.classList.add('vpw-subtitles');

  const play = this.element.querySelector('.vpw-controls-play');
  const subtitles = this.element.querySelector('.vpw-controls-subtitles');
  const speedDefault = this.element.querySelector('.vpw-speed-default');
  const elemSpeed = this.element.querySelector('.vpw-elem-speed');
  const speed05 = this.element.querySelector('.vpw-block-speed-05');
  const speed1 = this.element.querySelector('.vpw-block-speed-1');
  const speed2 = this.element.querySelector('.vpw-block-speed-2');
  const speed3 = this.element.querySelector('.vpw-block-speed-3');
  const slider = this.element.querySelector('.vpw-controls-slider .vpw-slider');
  const img = this.element.querySelector('.vpw-img-default');
  const button = this.element.querySelector('.vpw-button-speed');
  const border = this.element.querySelector('.vpw-border-default');

  noUiSlider.create(slider, {
    start: 0.0,
    step: 0.05,
    connect: 'lower',
    range: {
      min: 0.2,
      max: 200,
    },
  });
  slider.setAttribute('disabled', true);

  play.addEventListener(
    'click',
    function () {
      if (this.element.classList.contains('vpw-playing')) {
        this.player.pause();
      } else if (this.element.classList.contains('vpw-stopped')) {
        this.player.repeat();
      } else {
        this.player.continue();
      }
    }.bind(this)
  );

  subtitles.addEventListener(
    'click',
    function () {
      this.element.classList.toggle('vpw-subtitles');
      this.player.toggleSubtitle();
    }.bind(this)
  );

  let visibility = false;
  let speedValue;

  button.addEventListener('click', function () {
    if (visibility) {
      img.style.display = 'none';
      border.style.display = 'none';
      speedDefault.style.display = 'block';
      visibility = false;
      elemSpeed.style.display = 'none';
      speedDefault.innerHTML = speedValue;
    } else {
      img.style.display = 'block';
      border.style.display = 'block';
      speedDefault.style.display = 'none';

      speedValue = speedDefault.innerHTML;
      speedDefault.innerHTML = '';

      elemSpeed.style.display = 'block';
      visibility = true;
    }
  });

  speed05.addEventListener('click', () => {
    this.setSpeed(0.5, '0.5x', elemSpeed, speedDefault, img, border);
    speedDefault.style.padding = '6px 2.5px 5px 2.5px';
    speedDefault.style.fontSize = '11px';
    visibility = false;
  });

  speed1.addEventListener('click', () => {
    this.setSpeed(1.0, 'x1', elemSpeed, speedDefault, img, border);
    visibility = false;
  });

  speed2.addEventListener('click', () => {
    this.setSpeed(1.5, 'x2', elemSpeed, speedDefault, img, border);
    visibility = false;
  });
  speed3.addEventListener('click', () => {
    this.setSpeed(2.0, 'x3', elemSpeed, speedDefault, img, border);
    visibility = false;
  });
};

Controls.prototype.setSpeed = function (
  speed,
  label,
  elemSpeed,
  speedDefault,
  img,
  border
) {
  img.style.display = 'none';
  border.style.display = 'none';
  speedDefault.style.display = 'block';
  speedDefault.style.color = 'grey';
  speedDefault.style.border = '1px solid grey';
  speedDefault.style.borderRadius = '3px 3px 3px 3px';
  speedDefault.innerHTML = label;
  speedDefault.style.padding = '3px 4px';
  speedDefault.style.fontSize = '15px';
  elemSpeed.style.display = 'none';

  this.player.setSpeed(parseFloat(speed));
};

Controls.prototype.setProgress = function () {
  if (this.element != undefined) {
    const slider = this.element.querySelector(
      '.vpw-controls-slider .vpw-slider'
    );

    slider.noUiSlider.updateOptions({
      range: {
        min: 0,
        max: 2,
      },
    });

    slider.noUiSlider.set([0, 0]);
  }
};

module.exports = Controls;

