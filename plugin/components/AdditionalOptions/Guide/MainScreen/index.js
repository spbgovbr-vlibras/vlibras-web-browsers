const template = require('./main-guide-screen.html').default;
require('./main-guide-screen.scss');

const u = require('~utils');
const LOCAL_KEY = '@vp-guide';
const GUIDE_INTRO_MESSAGE = 'PRIMEIRO&ORDINAL VEZ AQUI [INTERROGAÇÃO] ' +
  'QUE APRENDER MAIS&QUANTIDADE SOBRE&ASSUNTO FUNCIONAL [INTERROGAÇÃO]'

let boundUpdatePos = null;
let vwPlayer = null;
let boundHide = null;

function MainGuideScreen(guide, player, closeScreen) {
  this.element = null;
  this.enabled = false;
  this.closeScreen = closeScreen;
  this.player = player;
  this.guide = guide;
}

MainGuideScreen.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;

  const acceptButton = u.$('.vpw-guide__main__accept-btn');
  const denyButton = u.$('.vpw-guide__main__deny-btn');
  boundUpdatePos = updatePosition.bind(this);
  vwPlayer = this.player;
  boundHide = () => this.hide();

  acceptButton.onclick = () => {
    this.hide();
    this.guide.show();
  }

  denyButton.onclick = () => {
    this.hide();
  }

}

MainGuideScreen.prototype.show = function () {
  if (!getDefault() || this.enabled) return;
  this.enabled = true;
  this.closeScreen.closeAll();
  u.addClass(this.element, 'vp-enabled')
  u.addClickBlocker(true);
  updatePosition.bind(this)();
  hideAdditionalOptions(true);
  addEvents();

  vwPlayer.play(GUIDE_INTRO_MESSAGE);
}

MainGuideScreen.prototype.hide = function () {
  if (!this.enabled) return saveDefault(false);
  this.enabled = false;
  vwPlayer.gloss = undefined;
  u.removeClass(this.element, 'vp-enabled');
  u.addClickBlocker(false);
  saveDefault(false);
  hideAdditionalOptions(false);
  removeEvents();
}

MainGuideScreen.prototype.toggle = function () {
  if (this.enabled) this.hide();
  else this.show();
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

function hideAdditionalOptions(bool) {
  u.toggleClass(u.$('[vp-change-avatar]'), 'vp--off', bool);
  u.toggleClass(u.$('[vp-additional-options]'), 'vp--off', bool);
}

function saveDefault(bool) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(bool));
}

function addEvents() {
  u._on(window, 'resize', boundUpdatePos);
  u._on(window, 'vp-widget-wrapper-set-side', boundUpdatePos);
  u._vwOn(vwPlayer, 'translate:start', boundHide)
}

function removeEvents() {
  u._off(window, 'resize', boundUpdatePos);
  u._off(window, 'vp-widget-wrapper-set-side', boundUpdatePos);
  u._vwOff(vwPlayer, 'translate:start', boundHide)
}

module.exports = MainGuideScreen;
