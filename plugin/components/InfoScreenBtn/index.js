require('./info-screen-btn.scss');

function InfoScreenBtn(screen) {
  this.screen = screen;
}

InfoScreenBtn.prototype.load = function (element) {
  this.element = element;
  this.element.classList.add('vpw-info-screen-btn');

  this.element.addEventListener('click', function () {
    this.element.classList.toggle('active');
    this.screen.toggle();
  }.bind(this));
};

module.exports = InfoScreenBtn;
