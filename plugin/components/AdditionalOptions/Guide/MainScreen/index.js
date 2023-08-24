const template = require('./guide-main-screen.html').default;
require('./guide-main-screen.scss');

const u = require('~utils');
const LOCAL_KEY = '@vp-guide';

let boundUpdatePos = null;
let boundPlayer = null;

function GuideMainScreen(guide, player) {
  this.element = null;
  this.enabled = false;
  this.player = player;
  this.guide = guide;
}

GuideMainScreen.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;

  const acceptButton = u.$('.vpw-guide-main__accept-btn');
  const denyButton = u.$('.vpw-guide-main__deny-btn');
  boundUpdatePos = updatePosition.bind(this);
  boundPlayer = this.player;

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

GuideMainScreen.prototype.show = function () {
  if (!getDefault()) return;
  this.enabled = true;
  u.addClass(this.element, 'vp-enabled')
  updatePosition.bind(this)();
  addEvents();
}

GuideMainScreen.prototype.hide = function () {
  if (!this.enabled) return;
  this.enabled = false;
  u.removeClass(this.element, 'vp-enabled');
  removeEvents();
}

GuideMainScreen.prototype.toggle = function () {
  if (this.enabled) this.hide();
  else this.show();
}

GuideMainScreen.prototype.disable = function () {
  saveDefault(false);
  this.enabled = false;
  this.hide();
}

function updatePosition() {
  if (!this.enabled) return;
  const wPosition = u.getWidgetPosition();
  const isLeft = wPosition.includes('L');
  const isTop = wPosition === 'T';
  const isBottom = wPosition === 'B';
  const wWidth = u.$('[vw]').clientWidth;
  const _innerWidth = u.getDocumentDim().w;

  u.toggleClass(this.element, 'vw-isLeft', isLeft);
  u.toggleClass(this.element, 'vw-isTopOrBottom', isTop || isBottom);

  if (isTop || isBottom) {
    const eHeight = this.element.clientHeight;
    this.element.style.top = isTop ? 'calc(100% + 10px)' : `-${eHeight + 10}px`;
    this.element.style.maxWidth = 'none';
    this.element.style.left = 'auto';
    this.element.style.right = 'auto';
  } else {
    this.element.style.top = 0;
    this.element.style.maxWidth = _innerWidth - wWidth - 30 + 'px';
    this.element.style.left = isLeft ? wWidth + 10 + 'px' : 'auto';
    this.element.style.right = !isLeft ? wWidth + 10 + 'px' : 'auto';
  }

}

function getDefault() {
  const value = localStorage.getItem(LOCAL_KEY);
  return value !== 'false';
}

function clickToDisable() {
  u.$('.vpw-guide-main__deny-btn').click()
}

function saveDefault(bool) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(bool));
}

function addEvents() {
  u._on(window, 'resize', boundUpdatePos);
  u._on(window, 'click', clickToDisable);
  u._on(window, 'vp-widget-wrapper-set-side', boundUpdatePos);
  boundPlayer.addListener('translate:start', clickToDisable);
}

function removeEvents() {
  u._off(window, 'resize', boundUpdatePos);
  u._off(window, 'click', clickToDisable);
  u._off(window, 'vp-widget-wrapper-set-side', boundUpdatePos);
  boundPlayer.removeListener('translate:start', clickToDisable);
}

module.exports = GuideMainScreen;
