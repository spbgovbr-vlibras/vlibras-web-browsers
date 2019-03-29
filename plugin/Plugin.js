var VLibras = require('vlibras');

var Settings = require('components/Settings');
var SettingsBtn = require('components/SettingsBtn');
var InfoScreen = require('components/InfoScreen');
var Dictionary = require('components/Dictionary');
var Controls = require('components/Controls');
var Progress = require('components/Progress');
var MessageBox = require('components/MessageBox');
var Box = require('components/Box');
var SettingsCloseBtn = require('components/SettingsCloseBtn');
var CloseScreen = require('components/CloseScreen');
var RateButton = require('components/RateButton');
var RateBox = require('components/RateBox');
var SuggestionButton = require('components/SuggestionButton');
var SuggestionScreen = require('components/SuggestionScreen');

require('./scss/styles.scss');

function Plugin(option) {
  this.player = new VLibras.Player({
    progress: Progress,
    onLoad: option.playWellcome && (() => this.player.playWellcome()),
  });

  this.element = document.querySelector('[vp]');
  
  this.dictionary = new Dictionary(this.player);
  this.controls = new Controls(this.player, this.dictionary);
  this.Box = new Box();
  this.info = new InfoScreen(this.Box);
  this.settings = new Settings(this.player, this.info, this.Box, this.dictionary, option);
  this.settingBtnClose = new SettingsCloseBtn();
  this.closeScreen = new CloseScreen(this.dictionary, this.info, this.settings, this.settingBtnClose);
  this.settingsBtn = new SettingsBtn(this.player, this.settings,this.settingBtnClose ,option);
  this.messageBox = new MessageBox();
  this.suggestionScreen = new SuggestionScreen();
  this.suggestionButton = new SuggestionButton(this.suggestionScreen);
  this.rateBox = new RateBox(this.suggestionButton, this.messageBox);
  this.rateButton = new RateButton(this.rateBox);
  
  this.loadingRef = null;

  this.messageBox.load(this.element.querySelector('[vp-message-box]'));

  this.player.load(this.element);

  this.player.on('load', () => {
    this.controls.load(this.element.querySelector('[vp-controls]'));
    this.Box.load(this.element.querySelector('[vp-box]'));
    this.settingBtnClose.load(this.element.querySelector('[vp-box]').querySelector('[settings-btn-close]'), this.closeScreen);
    this.settingsBtn.load(this.element.querySelector('[vp-box]').querySelector('[settings-btn]'));
    this.settings.load(this.element.querySelector('[vp-settings]'));    
    this.info.load(this.element.querySelector('[vp-info-screen]'));
    this.dictionary.load(this.element.querySelector('[vp-dictionary]'), this.closeScreen);
    this.rateButton.load(this.element.querySelector('[vp-rate-button]'));
    this.rateBox.load(this.element.querySelector('[vp-rate-box]'));
    this.suggestionButton.load(this.element.querySelector('[vp-suggestion-button]'));
    this.suggestionScreen.load(this.element.querySelector('[vp-suggestion-screen]'));
  });

  this.info.on('show', () => {
    this.player.pause();
  });

  this.player.on('translate:start', () => {
    this.loadingRef = this.messageBox.show('info', 'Traduzindo...');
  });

  this.player.on('translate:end', () => {
    this.messageBox.hide(this.loadingRef);
  });

  this.player.on('gloss:start', () => {
    console.log('GLOSS : START');

    this.rateButton.hide();
    this.rateBox.hide();
    this.suggestionButton.hide();
    this.suggestionScreen.hide();
  });

  this.player.on('gloss:end', () => {
    console.log('GLOSS : END');

    if (this.player.translated) {
      this.suggestionScreen.setGloss(this.player.gloss);
      this.rateButton.show();
    }
  });

  this.player.on('error', function (err) {
    switch(err) {
      case 'compatibility_error':
        this.messageBox.show(
          'warning',
          'O seu computador não suporta o WebGL. Por favor, atualize os drivers de vídeo.'
        );
        break;
      case 'translation_error':
        this.messageBox.show(
          'warning',
          'Não foi possivel traduzir. Por favor, verifique sua internet.',
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
  }.bind(this));
};

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
  http.open('POST', 'http://150.165.138.78:3000/review');
  http.setRequestHeader('Content-type', 'application/json');
  http.send(body);
  http.onload = () => {
    console.log('Review response', http.responseText);
    this.rateBox.hide();
    this.suggestionScreen.hide();
    this.messageBox.show('success', 'Obrigado por avaliar!', 3000);
  };
}

module.exports = Plugin;
