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


function Plugin(option) {
  this.player = new VLibras.Player({
    progress: Progress
  });

  this.element = document.querySelector('[vp]');
  this.settingBtnClose = new SettingsCloseBtn();
  
  this.dictionary = new Dictionary(this.player);
  this.controls = new Controls(this.player, this.dictionary);
  this.Box = new Box();
  this.info = new InfoScreen(this.settingBtnClose);
  this.settings = new Settings(this.player, this.info, this.settingBtnClose, this.Box);

  this.settingsBtn = new SettingsBtn(this.player, this.settings);
  this.messageBox = new MessageBox();
  
  this.loadingRef = null;

  this.messageBox.load(this.element.querySelector('[vp-message-box]'));

  this.player.load(this.element);

  this.player.on('load', function () {
    // Loading components
    this.controls.load(this.element.querySelector('[vp-controls]'));
    this.Box.load(this.element.querySelector('[vp-box]'));
    this.settingBtnClose.load(this.element.querySelector('[vp-box]').querySelector('[settings-btn-close]'))
    this.settingsBtn.load(this.element.querySelector('[vp-box]').querySelector('[settings-btn]'));
    
    this.settings.load(this.element.querySelector('[vp-settings]'));    
    this.info.load(this.element.querySelector('[vp-info-screen]'));
    // this.dictionary.load(this.element.querySelector('[vp-dictionary]'));
    

  }.bind(this));

  this.info.on('show', function () {
    this.player.pause();
  }.bind(this));

  this.player.on('translate:start', function () {
    this.loadingRef = this.messageBox.show('info', 'Traduzindo...');
  }.bind(this));

  this.player.on('translate:end', function () {
    this.messageBox.hide(this.loadingRef);
  }.bind(this));

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

module.exports = Plugin;
