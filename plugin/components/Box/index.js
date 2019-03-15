require('./box.scss');

var BoxTlp = '<span class="mes"></span>';

function Box() {
  this.element = null;
  this.message = null;
}

Box.prototype.load = function (element) {
  var self = this;

  this.element = element;
  this.element.classList.add('box');
  this.element.innerHTML = BoxTlp;
  self.element.querySelector('.mes').innerHTML = 'VLIBRAS';

  self.message = {
    text: 'message'
  };

  return this.message;

};


module.exports = Box;
