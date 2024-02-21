const VLibras = require('vlibras');

const Settings = require('components/Settings');
const SettingsBtn = require('components/SettingsBtn');
const InfoScreen = require('components/InfoScreen');
const Dictionary = require('components/Dictionary');
const Controls = require('components/Controls');

const MessageBox = require('components/MessageBox');
const Box = require('components/Box');
const CloseScreen = require('components/CloseScreen');
const RateBox = require('components/RateBox');
const SuggestionScreen = require('components/SuggestionScreen');
const Translator = require('components/AdditionalOptions/Translator');
const AdditionalOptions = require('components/AdditionalOptions');
const ChangeAvatar = require('components/AdditionalOptions/ChangeAvatar');
const Guide = require('components/AdditionalOptions/Guide');
const MainGuideScreen = require('components/AdditionalOptions/Guide/MainScreen');

const url = require('url-join');
const { REVIEW_URL } = require('./config');
const { ALERT_MESSAGES } = require('./alert-messages');

require('./scss/global.scss');
require('./scss/styles.scss');
require('./scss/text-capture.scss');

function Plugin(options) {
  this.player = new VLibras.Player({
    // onLoad: options.playWellcome && (() => this.player.playWellcome()),
    targetPath: options.rootPath ? url(options.rootPath, '/target') : 'target',
    personalization: options.personalization,
    opacity: options.opacity,
    wrapper: options.wrapper,
    // enableWelcome: options.enableWelcome
  });

  this.player.avatar = options.avatar;
  this.isWidget = options.enableMoveWindow;

  this.opacity = options.opacity;
  this.wrapper = options.wrapper;
  this.position = options.position;

  this.rootPath = options.rootPath;
  this.personalization = options.personalization;
  this.element = document.querySelector('[vp]');

  this.dictionary = new Dictionary(this.player, this.isWidget);
  this.controls = new Controls(this.player, this.dictionary, this.isWidget);
  this.Box = new Box();
  this.info = new InfoScreen(this.Box);
  this.settings = new Settings(this.player, this.opacity, this.position, options);

  this.messageBox = new MessageBox();
  this.suggestionScreen = new SuggestionScreen(this.player);
  this.guide = this.isWidget && new Guide(this.player);
  this.translator = new Translator(this.player);
  this.rateBox = new RateBox(this.messageBox, this.suggestionScreen, this.player);
  this.ChangeAvatar = new ChangeAvatar(this.player, this.controls);
  this.additionalOptions = new AdditionalOptions(this.player, this.translator, this.guide, this.isWidget);
  this.closeScreen = new CloseScreen(this.dictionary, this.info, this.settings, this.translator);
  this.settingsBtn = new SettingsBtn(this.player, this.settings, this.dictionary, this.info, this.translator, options);

  this.loadingRef = null;

  this.mainGuideScreen = this.isWidget && new MainGuideScreen(this.guide, this.player, this.closeScreen);
  this.additionalOptions.load(this.element.querySelector('[vp-additional-options]'));
  this.messageBox.load(this.element.querySelector('[vp-message-box]'));
  this.rateBox.load(this.element.querySelector('[vp-rate-box]'));
  this.suggestionScreen.load(this.element.querySelector('[vp-suggestion-screen]'));
  this.translator.load(this.element.querySelector('[vp-translator-screen]'));

  this.guide && this.guide.load(createGuideContainer());
  this.mainGuideScreen && this.mainGuideScreen.load(document.querySelector('[vp-main-guide-screen]'))

  this.player.load(this.element);

  this.player.on('load', () => {
    if (this.personalization == undefined) {
      this.player.setPersonalization('');
    } else {
      this.player.setPersonalization(this.personalization);
    }

    this.player.toggleSubtitle(false);

    this.controls.load(this.element.querySelector('[vp-controls]'), this.rateBox);
    this.Box.load(this.element.querySelector('[vp-box]'));

    this.settingsBtn.load(this.element.querySelector('[vp-box]').querySelector('[settings-btn]'),
      () => this.dictionary.load(this.element.querySelector('[vp-dictionary]'), this.closeScreen, this.mainGuideScreen),
      this.element.querySelector('[vp-dictionary]'),
      this.rootPath
    );
    this.settings.load(this.element.querySelector('[vp-settings]'));
    this.info.load(this.element.querySelector('[vp-info-screen]'));
    this.ChangeAvatar.load(this.element.querySelector('[vp-change-avatar]'));

    this.loadFonts();
    this.loadImages();
  });

  window.addEventListener('vp-widget-close', (event) => {
    if (!this.isWidget) return;
    this.player.stop();
    this.rateBox.hide();
    this.closeScreen.closeAll();
  });

  let control = 0;
  this.player.on('translate:start', () => {
    control = 1;
    this.player.fromDictionary = false;
    this.ChangeAvatar.hide();
    this.additionalOptions.hide();
    this.controls.setProgress();
    this.loadingRef = this.messageBox.show('info', ALERT_MESSAGES.TRANSLATING_TEXT);
    this.closeScreen.closeAll();
  });

  this.player.on('translate:end', () => {
    this.messageBox.hide(this.loadingRef);
    this.translator.hide();
    this.isWidget && this.mainGuideScreen.hide();
  });

  this.player.on('gloss:start', () => {
    control = 0;
    this.ChangeAvatar.hide();
    this.additionalOptions.hide();
    this.suggestionScreen.hide();
    this.rateBox.hide();
  });

  this.player.on('gloss:end', (globalGlosaLenght) => {
    if (control == 0) {
      this.ChangeAvatar.show();
      this.additionalOptions.show();
    }

    if (this.player.translated && control == 0) {
      this.suggestionScreen.setGloss(this.player.gloss);
      this.rateBox.show();
    }

    control = 0;
  });

  this.player.on('stop:welcome', (bool) => {
    if (bool) {
      this.isWidget && this.mainGuideScreen.show();
      this.ChangeAvatar.show();
      this.additionalOptions.show();
    }
  });

  this.player.on(
    'error',
    function (err) {
      switch (err) {
        case 'compatibility_error':
          this.messageBox.show('warning', ALERT_MESSAGES.COMPATIBILITY_ERROR);
          break;
        case 'translation_error':
          this.messageBox.show('warning', ALERT_MESSAGES.TRANSLATION_ERROR, 3000);
          break;
        case 'internal_error':
          this.messageBox.show('warning', ALERT_MESSAGES.INTERNAL_ERROR, 3000);
          break;
        case 'timeout_error':
          this.messageBox.show('warning', ALERT_MESSAGES.TIMEOUT_ERROR, 3000);
          break;
      }
    }.bind(this)
  );

  this.loadFonts();
  this.loadImages();
}

function createGuideContainer() {
  const container = document.createElement('div');
  container.classList.add('vp-guide-container');
  document.body.appendChild(container);
  return container;
}

Plugin.prototype.translate = function (text) {
  this.player.translate(text);
};

Plugin.prototype.sendReview = function (rate, review) {
  const body = JSON.stringify({
    text: this.player.text,
    translation: this.player.gloss,
    rating: rate,
    review,
  });

  const http = new XMLHttpRequest();
  http.open('POST', REVIEW_URL);
  http.setRequestHeader('Content-type', 'application/json');
  http.send(body);
  http.onload = () => {
    this.rateBox.hide();
    this.suggestionScreen.hide();
    this.messageBox.show('success', ALERT_MESSAGES.REVIEW_THANKS, 3000);

    // Thanks message
    const oldGloss = this.player.gloss;
    const boundToggleSubtitle = toggleSubtitle.bind(this);
    const skipButton = this.controls.element.querySelector('.vpw-skip-welcome-message');
    const subtitleIsActived = this.controls.element.querySelector('.actived-subtitle');

    this.player.play('AGRADECER');
    this.player.gloss = undefined;

    skipButton.classList.add('vp-disabled');
    subtitleIsActived && this.player.toggleSubtitle();
    this.player.addListener("gloss:end", boundToggleSubtitle);

    function toggleSubtitle() {
      skipButton.classList.remove('vp-disabled');
      subtitleIsActived && this.player.toggleSubtitle();
      this.player.removeListener("gloss:end", boundToggleSubtitle);
      this.player.gloss = oldGloss;
    }
  };
};

Plugin.prototype.buildAbsolutePath = function (path) {
  return this.rootPath ? this.rootPath + '/' + path : path;
};

Plugin.prototype.loadImages = function () {
  this.element.querySelectorAll('img[data-src]').forEach((image) => {
    const imagePath = image.attributes['data-src'].value;
    image.src = this.buildAbsolutePath(imagePath);
  });
};

Plugin.prototype.loadFonts = function () {
  const fontVariations = [
    { style: 'normal', weight: 400, url: 'assets/fonts/rawline-400.woff' },
    { style: 'italic', weight: 400, url: 'assets/fonts/rawline-400i.woff' },
    { style: 'normal', weight: 500, url: 'assets/fonts/rawline-500.woff' },
    { style: 'normal', weight: 600, url: 'assets/fonts/rawline-600.woff' },
    { style: 'normal', weight: 700, url: 'assets/fonts/rawline-700.woff' },
  ];

  fontVariations.forEach(variation => {
    const font = new FontFace('rawline', `url(${this.buildAbsolutePath(variation.url)})`, {
      style: variation.style,
      weight: variation.weight,
    });

    font.load()
      .then((loaded) => document.fonts.add(loaded))
      .catch((error) => {
        console.error(`Error loading Rawline font ${variation.style} ${variation.weight}:`, error);
      });
  });
}

module.exports = Plugin;
