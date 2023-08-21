const template = require('./guide-main-screen.html').default;
require('./guide-main-screen.scss');

const { $ } = require('~utils');
const LOCAL_KEY = '@vp-guide';

function WidgetGuideMainScreen(widgetGuide) {
  this.element = null;
  this.guide = widgetGuide;
  this.init = true;
}

WidgetGuideMainScreen.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;

  const acceptButton = $('.vpw-guide-main__accept-btn');
  const denyButton = $('.vpw-guide-main__deny-btn');

  acceptButton.onclick = () => {
    this.hide();
    this.guide.show();
    saveDefault(false);
  }

  denyButton.onclick = () => {
    this.hide();
    saveDefault(false);
  }

}

WidgetGuideMainScreen.prototype.show = function () {
  if (!getDefault()) return;
  this.element.classList.add('vp-enabled');
}

WidgetGuideMainScreen.prototype.hide = function () {
  this.element.classList.remove('vp-enabled');
}

WidgetGuideMainScreen.prototype.toggle = function () {
  this.element.classList.toggle('vp-enabled');
}

WidgetGuideMainScreen.prototype.disable = function () {
  saveDefault(false);
  this.hide();
}

function getDefault() {
  const value = localStorage.getItem(LOCAL_KEY);
  return value === 'true';
}

function saveDefault(bool) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(bool));
}

module.exports = WidgetGuideMainScreen;
