var template = require('./suggestion-sent-screen.html').default;
require('./suggestion-sent-screen.scss');

function SuggestionSentScreen() {
  this.element = null;
}

SuggestionSentScreen.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;

  const close = this.element.querySelector('.vp-ratebox-close');

  close.addEventListener('click', () => {
    this.hide();
  });

  this.element.addEventListener("click", (evt) => {
    const menu = this.element.querySelector('.vp-container');
    let targetElement = evt.target;

    do {
      if (targetElement == menu) {
        return;
      }
      targetElement = targetElement.parentNode;
    } while (targetElement);

    this.hide();
  });

};

SuggestionSentScreen.prototype.show = function () {
  this.element.classList.add('vp-enabled');
};

SuggestionSentScreen.prototype.hide = function () {
  this.element.classList.remove('vp-enabled');
};

module.exports = SuggestionSentScreen;
