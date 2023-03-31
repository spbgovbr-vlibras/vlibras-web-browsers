const AccessButton = require('./components/AccessButton');
const PluginWrapper = require('./components/PluginWrapper');

require('./scss/reset.scss');
require('./scss/styles.scss');

const widgetPosition = ['TL', 'T', 'TR', 'L', 'R', 'BL', 'B', 'BR'];

module.exports = function Widget(rootPath, personalization, opacity) {
  const widgetWrapper = new PluginWrapper();
  const accessButton = new AccessButton(
    rootPath,
    widgetWrapper,
    personalization,
    opacity
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
      const { position } = event.detail;
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
      .classList.remove('left')

      else access.querySelector('.pop-up')
      .classList.add('left')

      // if (event.detail.right) {
      //   this.element.style.left = '0';
      //   this.element.style.right = 'initial';
      //   access.querySelector('.access-button').classList.add('left');
      //   access.querySelector('.pop-up').classList.add('left');
      //   document.querySelector('[vw-access-button]').style.margin =
      //     '0px -100px 0px 0px';
      // } else {
      //   this.element.style.right = '0';
      //   this.element.style.left = 'initial';
      //   access.querySelector('.access-button').classList.remove('left');
      //   access.querySelector('.pop-up').classList.remove('left');
      //   document.querySelector('[vw-access-button]').style.margin =
      //     '0px 0px 0px -100px';
      // }
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
  };
};


new MutationObserver((mutations) => {
  if (!document.querySelector('vlibraswidget')) return;

  try {
    const accessButton = document.querySelector('div[vw-access-button]');
    const closeButton = document.querySelector('.vpw-settings-btn-close');
    let run = true;

    mutations.forEach(mut => {
      if (mut.addedNodes.length === 0) return;
      mut.addedNodes.forEach(node => {
        if (node.tagName === 'SCRIPT' ||
          node.tagName === 'VLIBRASWIDGET') {
          run = false;
          return;
        }

        node.classList.forEach(_class => {
          if (_class === 'vw-links') run = false;
        })
      })
    })

    if (run) {
      closeButton.click();
      accessButton.click();
    }
  } catch { }
}).observe(document.body, { childList: true, subtree: true });
