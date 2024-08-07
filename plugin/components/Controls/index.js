const noUiSlider = require('nouislider');
require('nouislider/distribute/nouislider.min.css');

const controlsTpl = require('./controls.html').default;
require('./controls.scss');

const { controlIcons } = require('~icons');
const { welcomeMessage } = require('./welcomeMessage');
const { $, hasClass, addClass, removeClass, $0, disableControlsButton } = require('~utils');

const availableSpeeds = [0.5, 1, 1.5, 2, 3];

function Controls(player, dictionary, isWidget) {
  this.player = player;
  this.dictionary = dictionary;
  this.rateBox = null;
  this.element = null;
  this.label = null;
  this.loaded = false;
  this.playerManager = player.playerManager;
  this.isWidget = isWidget;

  this.player.on('animation:play', function () {
    this.element.classList.remove('vpw-stopped');
    this.element.classList.add('vpw-playing');
  }.bind(this)
  );

  this.player.on('animation:pause', function () {
    this.element.classList.remove('vpw-playing');
    this.element.classList.remove('vpw-stopped');
  }.bind(this)
  );

  this.player.on('animation:end', function () {
    if (!this.element) return;
    this.element.classList.remove('vpw-playing');
    this.element.classList.add('vpw-stopped');
  }.bind(this)
  );

  this.player.on('response:glosa', function (counter, glosaLenght) {
    counter = counter - 1;

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

  this.player.on('gloss:end', function (globalGlosaLenght) {
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
  }.bind(this)
  );
}

Controls.prototype.load = function (element, rateBox) {
  this.element = element;
  this.rateBox = rateBox;
  this.element.innerHTML = controlsTpl;
  this.element.classList.add('vpw-controls');
  this.element.classList.add('vpw-subtitles');
  this.label = this.element.querySelector('.vpw-selectTextLabel');
  this.element.classList.toggle('vpw-selectText', this.isWidget);
  this.player.avatar = this.player.avatar || 'icaro'
  this.loaded = true;

  let welcomeFinished = false;

  const wrapper = document.querySelector('div[vw-plugin-wrapper]');
  const playBtn = this.element.querySelector('.vpw-controls-button');
  const slider = this.element.querySelector('.vpw-controls-slider .vpw-slider');
  const speedBtn = this.element.querySelector('.vpw-button-speed');
  const subtitlesBtn = this.element.querySelector('.vpw-controls-subtitles');
  const fullscreenBtn = this.element.querySelector('.vpw-controls-fullscreen');
  const skipAnimationBtn = this.element.querySelector('.vpw-skip-welcome-message');
  const boundCallWelcome = callWelcome.bind(this);
  const boundSuggestionScreen = showSuggestionScreen.bind(this);

  // Add icons
  playBtn.querySelector('.vpw-component-play').innerHTML = controlIcons.play;
  playBtn.querySelector('.vpw-component-pause').innerHTML = controlIcons.pause;
  playBtn.querySelector('.vpw-component-restart').innerHTML = controlIcons.restart;
  fullscreenBtn.innerHTML = controlIcons.maximize + controlIcons.minimize;
  skipAnimationBtn.innerHTML = controlIcons.skip + '<span>Pular</span>';
  subtitlesBtn.innerHTML = controlIcons.subtitle;

  if (!this.isWidget) fullscreenBtn.style.display = 'none';

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

  playBtn.addEventListener('click', function () {
    if (this.element.classList.contains('vpw-playing')) {
      this.player.pause();
    } else if (this.element.classList.contains('vpw-stopped')) {
      if (isSuggestionOpen()) this.player.addListener('gloss:end', boundSuggestionScreen);
      this.player.repeat();
    } else {
      this.player.continue();
    }
  }.bind(this)
  );

  subtitlesBtn.addEventListener('click', function () {
    this.element.classList.toggle('vpw-subtitles');
    subtitlesBtn.classList.toggle('actived-subtitle');
    this.player.toggleSubtitle();
  }.bind(this)
  );

  if (this.isWidget) {
    fullscreenBtn.addEventListener('click', function () {
      document.body.classList.toggle('vpw-fullscreen');
    });

    // Toggle fullscreen on double click in 'gameContainer'
    $('[vw] #gameContainer').ondblclick = () => {
      if (welcomeFinished) document.body.classList.toggle('vpw-fullscreen');
    }

    // Disable fullscreen on press 'ESC' key
    document.addEventListener('keyup', e => {
      if (e.key === 'Escape') removeClass(document.body, 'vpw-fullscreen');
    })
  }

  skipAnimationBtn.onclick = () => handleSkip.bind(this)();

  speedBtn.addEventListener('click', function () {
    this.setSpeed(speedBtn);
  }.bind(this)
  );

  this.player.addListener('gloss:start', () => {
    disableControlsButton(false);
    window.plugin.player.skipped = false;
    addClass(skipAnimationBtn, 'vp-enabled');
  });

  this.player.addListener('gloss:end', () => {
    if (this.player.text && this.player.text.trim()) this.rateBox.show();
    removeClass(skipAnimationBtn, 'vp-enabled');
  });

  this.player.on('stop:welcome', function () {
    if (welcomeFinished) return;
    removeClass(skipAnimationBtn, 'vp-enabled');
    this.setLabel('Escolha um texto para traduzir.');
    welcomeFinished = true;
  }.bind(this));

  this.player.on('start:welcome', function () {
    addClass(skipAnimationBtn, 'vp-enabled');
  }.bind(this));

  // Welcome message in control label
  this.playerManager.addListener('CounterGloss', boundCallWelcome);

  window.addEventListener('vp-widget-close', removeFullscreen);

  function isSuggestionOpen() {
    return !!$('[vp-suggestion-screen].vp-enabled');
  }

  function showSuggestionScreen() {
    addClass($('[vp-suggestion-screen]'), 'vp-enabled');
    addClass($('[vp-suggestion-screen]'), 'vp-expanded');
    this.player.removeListener('gloss:end', boundSuggestionScreen);
  }

  function callWelcome() {
    this.playerManager.removeListener('CounterGloss', boundCallWelcome);
    welcomeMessage[this.player.avatar].forEach(item => {
      setTimeout(() => !welcomeFinished && this.setLabel(item.m), item.t * 1000)
    });
  }

  function handleSkip() {
    if (!welcomeFinished) this.player.emit('stop:welcome');
    this.player.skipped = true;
    this.player.stop();
  }

  function removeFullscreen() {
    removeClass($0, 'vpw-fullscreen');
  }

  const guideIsOpen = () => hasClass($('.vp-guide-container'), 'vp-enabled');

  // Remove label when there is 'player.text' or guide is open
  const interval = setInterval(() => {
    if (this.player.text || guideIsOpen()) {
      removeClass(this.element, 'vpw-selectText');
      if (!welcomeFinished && this.isWidget) removeClass(skipAnimationBtn, 'vp-enabled');
      clearInterval(interval);
    }
  }, 600);

  // Pause or continue translation when switching tabs
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

Controls.prototype.setLabel = function (text) {
  this.label.innerHTML = text;
}

module.exports = Controls;
