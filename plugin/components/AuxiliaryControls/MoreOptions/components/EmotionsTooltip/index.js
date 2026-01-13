const { $$, $ } = require('~utils');
const { emotionsMap } = require('./emotions-map');

const template = require('./emotions-tooltip.html').default;
require('./emotions-tooltip.scss');

function EmotionsTooltip(player) {
  this.player = player;
  this.isLoaded = false;
}

EmotionsTooltip.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;

  const tooltipButton = $('[vp] .vp-emotions-button');
  const emotionButtons = $$('button', this.element);

  emotionButtons.forEach((button) => {
    const emotion = button.dataset.emotion;
    const { action, icon } = emotionsMap[emotion];

    button.innerHTML = icon + button.innerHTML;

    button.addEventListener('click', () => {
      if (button.dataset.active === 'true') return;

      emotionButtons.forEach(
        (btn) => (btn.dataset.active = btn.dataset.emotion === emotion)
      );

      tooltipButton.innerHTML = icon;
      tooltipButton.dataset.emotion = emotion !== 'default';

      if (emotion === 'automatic') {
        this.player.playerManager.applyEmotion('ApplyDefaultEmotion');
      }

      this.player.applyEmotion(action);
      this.hide();
    });
  });

  document.body.addEventListener('click', () => this.hide());

  this.isLoaded = true;
};

EmotionsTooltip.prototype.show = function () {
  this.element.dataset.active = true;
};

EmotionsTooltip.prototype.hide = function () {
  this.element.dataset.active = false;
};

EmotionsTooltip.prototype.toggle = function () {
  this.element.dataset.active === 'true' ? this.hide() : this.show();
};

module.exports = EmotionsTooltip;
