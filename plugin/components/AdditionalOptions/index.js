const template = require('./additional-options.html').default;
require('./additional-options.scss');

const WidgetFullscreen = require('./ToggleFullscreen');

function AdditionalOptions(player, translatorScreen) {
    this.player = player;
    this.element = null;
    this.translatorScreen = translatorScreen;
}

AdditionalOptions.prototype.load = function (element) {
    this.element = element;
    this.element.innerHTML = template;

    const translatorBtn = this.element.querySelector('.vp-translator-button');
    const fullscreenBtn = this.element.querySelector('.vp-fullscreen-button');

    // Add icons
    translatorBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>'
    fullscreenBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>'

    // Add actions
    translatorBtn.onclick = () => {
        this.translatorScreen.toggle();
    }

    fullscreenBtn.onclick = () => {
        WidgetFullscreen.toggle()
    }

    this.player.on('translate:start', () => {
        this.element.style.top = '50px';
        fullscreenBtn.style.opacity = '0.6'
        translatorBtn.style.display = 'none';
    });

    this.player.on('gloss:start', () => {
        this.element.style.top = '50px';
        fullscreenBtn.style.opacity = '0.6'
        translatorBtn.style.display = 'none';
    });

    this.player.on('gloss:end', () => {
        this.element.style.top = '92px';
        fullscreenBtn.style.opacity = '1'
        translatorBtn.style.display = 'flex';
    });

}

AdditionalOptions.prototype.show = function () {
    this.element.classList.add('vp-enabled');
}

AdditionalOptions.prototype.hide = function () {
    this.element.classList.remove('vp-enabled');
}

module.exports = AdditionalOptions;