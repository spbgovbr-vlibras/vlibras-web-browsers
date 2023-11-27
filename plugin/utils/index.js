// Check if the widget is in fullscreen mode
export const isFullscreen = () => {
  return hasClass(document.body, 'vpw-fullscreen');
}

// Check if the widget is playing
export const isPlaying = () => {
  return hasClass($('div[vp-controls]'), 'vpw-playing');
}

// Get Widget's current avatar
export const getAvatar = () => {
  return window.plugin.player.avatar;
}

// Get Widget's current position
export const getWidgetPosition = () => {
  return window.plugin ? window.plugin.position : undefined;
}

// Format the gloss => EXAMPLE&EXAMPLE to EXAMPLE(EXAMPLE)
export const formatGloss = gloss => {
  return gloss.indexOf('&') != -1 ? gloss.replace('&', '(') + ')' : gloss;
}

// Get a valid Widget element
// * www.correios.com.br
export const getWidget = () => {
  return $('[vp]').closest('[vw]');
}

// Set Widget's position
export const setWidgetPosition = (position) => {
  window.dispatchEvent(new CustomEvent('vp-widget-wrapper-set-side',
    { detail: position }));
}

// Select an element using a CSS selector, optionally within a specific parent element
export const $ = (path, element = null) => {
  return element ? element.querySelector(path) : $(path, document);
}

// Select multiple elements using a CSS selector, optionally within a specific parent element
export const $$ = (path, element = null) => {
  return element ? element.querySelectorAll(path) : $$(path, document);
}

// Shortcut for selecting the body element
export const $0 = document.body;

// Check if an element has a specific class
export const hasClass = (element, clss) => {
  return element ? element.classList.contains(clss) : undefined;
}

// Add a class to an element
export const addClass = (element, clss) => {
  element.classList.add(clss);
}

// Get the dimensions of the document's client area
export const getDocumentDim = () => {
  const { clientWidth, clientHeight } = document.documentElement;
  return { w: clientWidth, h: clientHeight }
}

// Remove a class from an element
export const removeClass = (element, clss) => {
  element.classList.remove(clss);
}

// Toggle a class on an element, optionally controlled by a boolean
export const toggleClass = (element, clss, bool = undefined) => {
  element.classList.toggle(clss, bool);
}

// Get the bounding rectangle of an element
export const getRect = (element) => {
  return element.getBoundingClientRect();
}

// Enable or disable Widget's clicks
export const addClickBlocker = (bool) => {
  toggleClass($('.vpw-skip-welcome-message'), 'vp-disabled', bool);
  toggleClass($('[vp-click-blocker]'), 'vp-enabled', bool);
}

// Check if translation is possible (used in text capture)
export const canTranslate = () => {
  return hasClass($('[vp-controls]'), 'vpw-controls')
    && !hasClass($('.vp-guide-container'), 'vp-enabled')
    && hasClass($('[vw-plugin-wrapper]'), 'active');
}

// Add an event listener to an element
export const _on = (element, event, callback) => {
  element.addEventListener(event, callback);
}

// Remove an event listener from an element
export const _off = (element, event, callback) => {
  element.removeEventListener(event, callback);
}

// Add an listener to an Plugin element (ex.: player or playerManager)
// That's equivalent, ex., to: player.on('gloss:end', callback)
export const _vwOn = (element, event, callback) => {
  element.addListener(event, callback)
}

// Remove an listener from an Plugin element (ex.: player or playerManager)
export const _vwOff = (element, event, callback) => {
  element.removeListener(event, callback)
}
