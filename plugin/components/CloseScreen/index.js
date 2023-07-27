function CloseScreen(dictionary, info, settings) {
  this.dictionary = dictionary;
  this.info = info;
  this.settings = settings;
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

CloseScreen.prototype.closeAll = function () {
  this.closeDict();
  this.closeInfo();
  this.closeSettings();
};

module.exports = CloseScreen;
