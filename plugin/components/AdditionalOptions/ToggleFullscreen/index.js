require('./fullscreen.scss');

const WidgetFullscreen = {
    apply: () => document.body.classList.add('vp-fullscreen'),
    remove: () => document.body.classList.remove('vp-fullscreen'),
    toggle: () => document.body.classList.toggle('vp-fullscreen')
}

module.exports = WidgetFullscreen