require('./fullscreen.scss');

function apply() {
  document.body.classList.add('vp-fullscreen');
  updateFullscreenBtn();
}

function remove() {
  document.body.classList.remove('vp-fullscreen')
  updateFullscreenBtn();
}

function toggle() {
  document.body.classList.toggle('vp-fullscreen');
  updateFullscreenBtn();
}

function updateFullscreenBtn() {
  document.querySelector('.vp-fullscreen-button')
    .setAttribute('data-title',
      document.body.classList.contains('vp-fullscreen')
        ? 'Sair de tela cheia' : 'Tela cheia'
    )
}

module.exports = { apply, remove, toggle }
