const noUiSlider = require('nouislider');
require('nouislider/distribute/nouislider.min.css');

const controlsTpl = require('./controls.html').default;
require('./controls.scss');

const { controlIcons } = require('../../assets/icons');

let firstTranslation = false;
const availableSpeeds = [0.5, 1, 1.5, 2, 3];

function Controls(player, dictionary) {
  this.player = player;
  this.dictionary = dictionary;
  this.element = null;

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
      if (!this.element) return;
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
  this.rateBox = document.querySelector('div[vp-rate-box]');

  const wrapper = document.querySelector('div[vw-plugin-wrapper]');
  const play = this.element.querySelector('.vpw-controls-button');
  const slider = this.element.querySelector('.vpw-controls-slider .vpw-slider');
  const speed = this.element.querySelector('.vpw-button-speed');
  const subtitles = this.element.querySelector('.vpw-controls-subtitles');
  const fullscreen = this.element.querySelector('.vpw-controls-fullscreen');

  // Add icons
  play.querySelector('.vpw-component-play').innerHTML = controlIcons.play;
  play.querySelector('.vpw-component-pause').innerHTML = controlIcons.pause;
  play.querySelector('.vpw-component-restart').innerHTML = controlIcons.restart;
  subtitles.innerHTML = controlIcons.subtitle;
  fullscreen.innerHTML = controlIcons.maximize + controlIcons.minimize;

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

  play.addEventListener('click', function () {
    if (this.element.classList.contains('vpw-playing')) {
      this.player.pause();
    } else if (this.element.classList.contains('vpw-stopped')) {
      this.player.repeat();
      this.player.on('gloss:end', () => {
        if (!this.player.translated) this.rateBox.classList.add('vp-enabled');
      })
    } else {
      this.player.continue();
    }
  }.bind(this)
  );

  subtitles.addEventListener('click', function () {
    this.element.classList.toggle('vpw-subtitles');
    subtitles.classList.toggle('actived-subtitle');
    this.player.toggleSubtitle();
  }.bind(this)
  );

  fullscreen.addEventListener('click', function () {
    document.body.classList.toggle('vpw-fullscreen');
  });

  window.addEventListener('vp-widget-close', function () {
    document.body.classList.remove('vpw-fullscreen');
  });

  speed.addEventListener('click', function () {
    this.setSpeed(speed);
  }.bind(this)
  );

  if (!window.plugin.personalization) {
    const playWelcome = setInterval(() => {
      this.player.playWellcome();
      clearInterval(playWelcome);
    }, 0)
  }

  let playing = false;

  window.addEventListener('visibilitychange', function () {
    if (!wrapper.classList.contains('active')) return;
    if (document.visibilityState === 'visible') {
      if (!playing) return;
      setTimeout(() => window.plugin.player.continue(), 1000)
    } else {
      playing = this.element.classList.contains('vpw-playing');
      window.plugin.player.pause();
    }
  }.bind(this));
};

Controls.prototype.setSpeed = function (button) {
  const speedValue = parseFloat(button.textContent.replace('x', ''));
  let speedIndex = availableSpeeds.indexOf(speedValue);
  if (speedIndex === availableSpeeds.length - 1) speedIndex = -1;
  const newSpeed = availableSpeeds[speedIndex + 1];
  button.innerHTML = newSpeed + 'x';

  this.player.setSpeed(newSpeed);
  if (this.element.classList.contains('vpw-playing')) {
    this.player.pause();
    this.player.continue();
  }
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

