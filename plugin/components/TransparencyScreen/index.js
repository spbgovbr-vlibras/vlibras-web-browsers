var template = require("./transparency-screen.html").default;
require("./transparency-screen.scss");


function TransparencyScreen() {
  this.element = null;
}

TransparencyScreen.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;
  this.back = this.element.querySelector('.vpw-arrow-left');
  this.minus = this.element.querySelector('.vpw-minus');
  this.plus = this.element.querySelector('.vpw-plus');
  this.button = this.element.querySelector('.vpw-transparency-button');
  this.background = this.element.querySelector('.vpw-transparency-background');
  this.transparency_value = this.element.querySelector('.vpw-transparency-value');
  let opacity = 50
  this.transparency_value.innerHTML = opacity + '%';

  this.back.addEventListener("click", (evt) => {
    window.dispatchEvent(new CustomEvent('vw-change-opacity', { detail: (opacity / 100) }));
    this.hide()
  })

  this.minus.addEventListener("click", (evt) => {
    if (opacity > 0) {
      this.plus.style.visibility = "visible"
      opacity -= 10

      this.background.style.opacity = (opacity / 100)
      this.transparency_value.innerHTML = opacity + '%';

      if (opacity == 0) {
        this.minus.style.visibility = "hidden"
      }
    }
  })

  this.plus.addEventListener("click", (evt) => {
    if (opacity < 100) {
      this.minus.style.visibility = "visible"
      opacity += 10

      this.background.style.opacity = (opacity / 100)
      this.transparency_value.innerHTML = opacity + '%';

      if (opacity == 100) {
        this.plus.style.visibility = "hidden"
      }
    }
  })

}

TransparencyScreen.prototype.show = function (window) {
  this.element.classList.add('vp-enabled');
  this.window = window
};

TransparencyScreen.prototype.hide = function () {
  this.element.classList.remove('vp-enabled');
};

module.exports = TransparencyScreen;
