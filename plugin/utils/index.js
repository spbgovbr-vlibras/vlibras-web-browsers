const isFullscreen = () => {
  return hasClass(document.body, 'vpw-fullscreen');
}

const isPlaying = () => {
  return hasClass($('div[vp-controls]'), 'vpw-playing');
}

const widgetPosition = () => {
  return window.plugin ? window.plugin.position : undefined;
}

const $ = (path, element = null) => {
  return element ? element.querySelector(path) : $(path, document);
}

const $$ = (path, element = null) => {
  return element ? element.querySelectorAll(path) : $(path, document);
}

const $0 = document.body;

const hasClass = (element, clss) => {
  return element ? element.classList.contains(clss) : undefined;
}

const addClass = (element, clss) => {
  element.classList.add(clss);
}

const removeClass = (element, clss) => {
  element.classList.remove(clss);
}

const toggleClass = (element, clss) => {
  element.classList.toggle(clss);
}

const getRect = (element) => {
  return element.getBoundingClientRect();
}

export {
  isPlaying, isFullscreen, $, $$, $0,
  hasClass, addClass, removeClass,
  toggleClass, widgetPosition, getRect
}
