require('./progress.scss');
var progressTpl = require('./progress.html');

function Progress(wrapper) {
  this.progress = 0.0;
  this.message = '';

  this.element = document.createElement('div');
  this.element.classList.add('progress');
  this.element.innerHTML = progressTpl;

  wrapper.appendChild(this.element);

  this.Update();
}

Progress.prototype.SetProgress = function (progress) {
  if (this.progress < progress) {
    this.progress = progress;
  }

  this.Update();
};

Progress.prototype.SetMessage = function (message) {
  this.message = message;
  this.Update();
};

Progress.prototype.Clear = function() {
  var parent = this.element.parentNode;
  parent.removeChild(this.element);
};

Progress.prototype.Update = function() {
  var progress = this.element.querySelector('.progressbar > .bar');
  progress.style.width = (this.progress * 100) + '%';
};

module.exports = Progress;
