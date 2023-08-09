const AccessButton = require('./components/AccessButton');
const PluginWrapper = require('./components/PluginWrapper');

require('./scss/reset.scss');
require('./scss/styles.scss');

const widgetPosition = ['TL', 'T', 'TR', 'L', 'R', 'BL', 'B', 'BR'];

module.exports = function Widget(rootPath, personalization, opacity, position) {
  if (!widgetPosition.includes(position)) position = 'R';
  const widgetWrapper = new PluginWrapper();
  const accessButton = new AccessButton(
    rootPath,
    widgetWrapper,
    personalization,
    opacity,
    position
  );
  let tempF;

  if (window.onload) {
    tempF = window.onload;
  }

  window.onload = () => {
    if (tempF) {
      tempF();
    }

    this.element = document.querySelector('[vw]');

    const wrapper = document.querySelector('[vw-plugin-wrapper]');
    const access = document.querySelector('[vw-access-button]');

    accessButton.load(
      document.querySelector('[vw-access-button]'),
      this.element
    );
    widgetWrapper.load(document.querySelector('[vw-plugin-wrapper]'));

    window.addEventListener('vp-widget-wrapper-set-side', (event) => {
      const position = event.detail;
      if (!position || !widgetPosition.includes(position)) return;

      this.element.style.left = position.includes('L')
        ? '0' : ['T', 'B'].includes(position) ? '50%' : 'initial';

      this.element.style.right = position.includes('R')
        ? '0' : 'initial';

      this.element.style.top = position.includes('T')
        ? '0' : ['L', 'R'].includes(position) ? '50%' : 'initial';

      this.element.style.bottom = position.includes('B')
        ? '0' : 'initial';

      this.element.style.transform = ['L', 'R'].includes(position)
        ? 'translateY(calc(-50% - 10px))' : ['T', 'B'].includes(position)
          ? 'translateX(calc(-50% - 10px))' : 'initial';

      document.querySelector('[vw-access-button]')
        .style.margin = position.includes('R')
          ? '0' : '0px 0px 0px -120px';

      if (position.includes('R')) access.querySelector('.pop-up')
        .classList.remove('left');

      else access.querySelector('.pop-up')
        .classList.add('left')

      // Set position
      if (window.plugin) window.plugin.position = position;
    });

    window.addEventListener('vp-widget-close', (event) => {
      access.classList.toggle('active');
      wrapper.classList.toggle('active');

      document.body.removeChild(document.querySelector('.vw-links'));

      const tagsTexts = document.querySelectorAll('.vw-text');
      for (let i = 0; i < tagsTexts.length; i++) {
        const parent = tagsTexts[i].parentNode;
        parent.innerHTML = tagsTexts[i].innerHTML;
      }
    });

    window.addEventListener('vw-change-opacity', (event) => {
      wrapper.style.background = `rgba(235,235,235, ${event.detail})`;
    });

    this.element.querySelectorAll('img[data-src]').forEach((image) => {
      const imagePath = image.attributes['data-src'].value;
      image.src = rootPath ? rootPath + '/' + imagePath : imagePath;
    });

    // Apply Widget default position
    if (widgetPosition.includes(position)) {
      window.dispatchEvent(
        new CustomEvent('vp-widget-wrapper-set-side', { detail: position }));
    }

  };
};

new MutationObserver((mutations) => {
  if (!document.querySelector('vlibraswidget')) return;
  const vw = document.querySelector('[vw]');

  mutations.forEach(mut => {
    if (mut.addedNodes.length === 0) return;

    try {
      mut.addedNodes.forEach(node => {
        node.querySelectorAll(
          'span, h1, h2, h3, h4, h5, h6, label, p, button, div'
        ).forEach(el => {
          if (vw.contains(el)) return;
          const firstChild = el.children[0];

          if (firstChild || !el.textContent) return;

          el.innerHTML = '<vlibraswidget class="vw-text">'
            + el.textContent + '</vlibraswidget>';

          el.addEventListener('click',
            () => window.plugin.player.translate(el.textContent));
        });
      });
    } catch { }
  })

}).observe(document.body, { childList: true, subtree: true });
