var template = require("./screen-position.html").default;
require("./screen-position.scss");


function ScreenPosition() {
  this.element = null;
}

ScreenPosition.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;
  this.back = this.element.querySelector('.vpw-arrow-left');

  this.back.addEventListener("click", (evt) => {
    this.hide()
  })

  document.querySelectorAll("input[name='widget-position']").forEach((input) => {
    input.addEventListener("click", (evt) => {
      window.dispatchEvent(new CustomEvent('vp-widget-wrapper-set-side', { detail: input.value }));
    });
  });
}

ScreenPosition.prototype.show = function (window) {
  this.element.classList.add('vp-enabled');
  this.window = window;
};

ScreenPosition.prototype.hide = function () {
  this.element.classList.remove('vp-enabled');
};

module.exports = ScreenPosition;
