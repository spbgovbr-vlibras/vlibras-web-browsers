function CloseScreen(dictionary, info, settings, translator) {
  this.dictionary = dictionary;
  this.info = info;
  this.settings = settings;
  this.translator = translator;
}

CloseScreen.prototype.closeDict = function () {
  if (this.dictionary.visible) {
    this.dictionary.hide();
  }
};

CloseScreen.prototype.closeInfo = function () {
  if (this.info.visible) {
    this.info.hide();
  }
};


CloseScreen.prototype.closeSettings = function () {
  if (this.settings.visible) {
    this.settings.hide(true);
  }
};

CloseScreen.prototype.closeTranslator = function () {
  if (this.translator.enabled) {
    this.translator.hide();
  }
}

CloseScreen.prototype.closeAll = function () {
  this.closeDict();
  this.closeInfo();
  this.closeSettings();
  this.closeTranslator();
};

module.exports = CloseScreen;
