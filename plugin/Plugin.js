const VLibras = require('vlibras');

const Settings = require('components/Settings');
const SettingsBtn = require('components/SettingsBtn');
const InfoScreen = require('components/InfoScreen');
const Dictionary = require('components/Dictionary');
const Controls = require('components/Controls');

const MessageBox = require('components/MessageBox');
const Box = require('components/Box');
const SettingsCloseBtn = require('components/SettingsCloseBtn');
const CloseScreen = require('components/CloseScreen');
const RateButton = require('components/RateButton');
const RateBox = require('components/RateBox');
const SuggestionButton = require('components/SuggestionButton');
const SuggestionScreen = require('components/SuggestionScreen');
const ChangeAvatar = require('components/ChangeAvatar');

const url = require('url-join');

require('./scss/styles.scss');

function Plugin(options) {
  this.player = new VLibras.Player({
    // onLoad: options.playWellcome && (() => this.player.playWellcome()),
    targetPath: options.rootPath ? url(options.rootPath, '/target') : 'target',
    personalization: options.personalization,
    opacity: options.opacity,
    wrapper: options.wrapper,
  });

  this.opacity = options.opacity;
  this.wrapper = options.wrapper;

  if (this.opacity) {
    if (this.opacity.includes[(0.0, 0.25, 0.5, 0.75, 1.0)]) {
      this.opacity = parseFloat(this.opacity);
    } else {
      this.opacity = 0.0;
    }
  } else {
    this.opacity = 0.0;
  }

  this.rootPath = options.rootPath;
  this.personalization = options.personalization;
  this.element = document.querySelector('[vp]');

  this.dictionary = new Dictionary(this.player);
  this.controls = new Controls(this.player, this.dictionary);
  this.Box = new Box();
  this.info = new InfoScreen(this.Box);
  this.settings = new Settings(
    this.player,
    options,
    this.opacity
  );
  this.settingBtnClose = new SettingsCloseBtn();
  this.closeScreen = new CloseScreen(
    this.dictionary,
    this.info,
    this.settings,
    this.settingBtnClose
  );
  this.settingsBtn = new SettingsBtn(
    this.player,
    this.settings,
    this.dictionary,
    this.info,
    this.settingBtnClose,
    options
  );
  this.messageBox = new MessageBox();
  this.suggestionScreen = new SuggestionScreen(this.player);
  this.suggestionButton = new SuggestionButton(this.suggestionScreen);
  this.rateBox = new RateBox(this.suggestionButton, this.messageBox);
  this.rateButton = new RateButton(this.rateBox);
  this.ChangeAvatar = new ChangeAvatar(this.player);

  this.loadingRef = null;

  this.messageBox.load(this.element.querySelector('[vp-message-box]'));
  this.rateButton.load(this.element.querySelector('[vp-rate-button]'));
  this.rateBox.load(this.element.querySelector('[vp-rate-box]'));
  this.suggestionButton.load(
    this.element.querySelector('[vp-suggestion-button]')
  );
  this.suggestionScreen.load(
    this.element.querySelector('[vp-suggestion-screen]')
  );

  this.player.load(this.element);

  this.player.on('load', () => {
    if (this.personalization == undefined) {
      this.player.setPersonalization('');
    } else {
      this.player.setPersonalization(this.personalization);
    }

    if (this.wrapper) {
      this.wrapper.style.background = `rgba(235,235,235, ${1 - this.opacity})`;
    }

    this.controls.load(this.element.querySelector('[vp-controls]'));
    this.Box.load(this.element.querySelector('[vp-box]'));
    this.settingBtnClose.load(
      this.element
        .querySelector('[vp-box]')
        .querySelector('[settings-btn-close]'),
      this.closeScreen
    );
    this.settingsBtn.load(
      this.element.querySelector('[vp-box]').querySelector('[settings-btn]'),
      () =>
        this.dictionary.load(
          this.element.querySelector('[vp-dictionary]'),
          this.closeScreen
        ),
      this.element.querySelector('[vp-dictionary]'),
      this.rootPath
    );
    this.settings.load(this.element.querySelector('[vp-settings]'));
    this.info.load(this.element.querySelector('[vp-info-screen]'));
    this.ChangeAvatar.load(this.element.querySelector('[vp-change-avatar]'));

    this.loadImages();
  });

  this.info.on('show', () => {
    this.player.pause();
  });

  window.addEventListener('vp-widget-close', (event) => {
    this.player.stop();
    this.rateButton.hide();
    this.rateBox.hide();
    this.suggestionButton.hide();
    this.suggestionScreen.hide();
  });

  let control = 0;
  this.player.on('translate:start', () => {
    control = 1;
    this.ChangeAvatar.hide();
    this.rateButton.hide();
    this.controls.setProgress();
    this.loadingRef = this.messageBox.show('info', 'Traduzindo...');
  });

  this.player.on('translate:end', () => {
    this.messageBox.hide(this.loadingRef);
  });

  this.player.on('gloss:start', () => {
    control = 0;
    this.ChangeAvatar.hide();
    this.rateButton.hide();
    this.rateBox.hide();
    this.suggestionButton.hide();
    this.suggestionScreen.hide();
  });

  this.player.on('gloss:end', (globalGlosaLenght) => {
    if (control == 0) {
      this.ChangeAvatar.show();
    }

    if (this.player.translated && control == 0) {
      this.suggestionScreen.setGloss(this.player.gloss);
      this.rateBox.show();
    }

    control = 0;
  });

  this.player.on('stop:welcome', (bool) => {
    if (bool) {
      this.ChangeAvatar.show();
    }
  });

  this.player.on(
    'error',
    function (err) {
      switch (err) {
        case 'compatibility_error':
          this.messageBox.show(
            'warning',
            'O seu computador não suporta o WebGL. Por favor, atualize os drivers de vídeo.'
          );
          break;
        case 'translation_error':
          this.messageBox.show(
            'warning',
            'Não foi possível estabelecer conexão com o serviço de tradução do VLibras.',
            3000
          );
          break;
        case 'internal_error':
          this.messageBox.show(
            'warning',
            'Ops! Ocorreu um problema, por favor entre em contato com a gente.'
          );
          break;
      }
    }.bind(this)
  );

  this.loadFont();
  this.loadImages();
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
  http.open('POST', 'https://traducao2.vlibras.gov.br/review');
  http.setRequestHeader('Content-type', 'application/json');
  http.send(body);
  http.onload = () => {
    this.rateBox.hide();
    this.suggestionScreen.hide();
    this.messageBox.show('success', 'Obrigado pela contribuição!', 3000);
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

Plugin.prototype.loadFont = function () {
  const fontPath = this.buildAbsolutePath('assets/OpenSans-Semibold.ttf');
  const font = new FontFace('Open Sans', 'url(' + fontPath + ')');

  font
    .load()
    .then((loaded) => {
      document.fonts.add(loaded);
    })
    .catch((error) => {
      console.error('Error loading font face:', error);
    });
};

module.exports = Plugin;
