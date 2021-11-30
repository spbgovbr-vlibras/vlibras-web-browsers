require('./message-box.scss');

var messageBoxTlp = '<span class="vpw-message"></span>';

function MessageBox() {
  this.element = null;
  this.message = null;
}

MessageBox.LEVELS = ['info', 'warning', 'success', 'default'];

MessageBox.prototype.load = function (element) {
  this.element = element;
  this.element.classList.add('vpw-message-box');
  this.element.innerHTML = messageBoxTlp;

  this.hide();
};

MessageBox.prototype.hide = function (message) {
  if (message !== this.message) return;

  this.message = null;
  this.element.classList.remove('active');

  MessageBox.LEVELS.forEach(function (level) {
    this.element.classList.remove(level);
  }, this);
};

MessageBox.prototype.show = function (level, message, time) {
  var self = this;

  level = MessageBox.LEVELS.indexOf(level) == -1 ? 'info' : level;

  this.hide();

  self.element.classList.add('active');
  self.element.classList.add(level);
  self.element.querySelector('.vpw-message').innerHTML = message;

  self.message = {
    text: message
  };

  var ref = self.message;
  if (time) {
    setTimeout(function () {
      self.hide(ref);
    }, time + 1);
  }

  return this.message;
};

module.exports = MessageBox;
