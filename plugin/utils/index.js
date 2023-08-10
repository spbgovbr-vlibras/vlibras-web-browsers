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

const hasClass = (element, clss) => {
  return element ? element.classList.contains(clss) : undefined;
}

export { isPlaying, isFullscreen, $, hasClass, widgetPosition }
