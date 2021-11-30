var template = require('./suggestion-button.html').default;
require('./suggestion-button.scss');

function SuggestionButton(suggestionScreen) {
  this.element = null;
  this.suggestionScreen = suggestionScreen;
}

SuggestionButton.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;

  const openScreen = this.element.querySelector('.vp-open-screen-button');
  const close = this.element.querySelector('.vp-ratebox-close');


  openScreen.addEventListener('click', () => {
    this.suggestionScreen.show(this.rate);
    this.hide();
  });

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

SuggestionButton.prototype.show = function (rate) {
  this.rate = rate;
  this.element.classList.add('vp-enabled');

  const good = this.element.querySelector('.vp-ratebox-good');
  const bad = this.element.querySelector('.vp-ratebox-bad');

  if (rate == "good") {
    good.style.display = "flex"
    bad.style.display = "none"
  } else {
    good.style.display = "none"
    bad.style.display = "flex"
  }
};

SuggestionButton.prototype.hide = function () {
  this.element.classList.remove('vp-enabled');
};

module.exports = SuggestionButton;
