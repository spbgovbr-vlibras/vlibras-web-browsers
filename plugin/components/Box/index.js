var BoxTlp = require('./box.html').default;
require('./box.scss');


function Box() {
  this.element = null;
  this.message = null;
}

Box.prototype.load = function (element) {
  

  this.element = element;
  this.element.classList.add('vpw-box');
  this.element.innerHTML = BoxTlp;
  // this.element.querySelector('.mes').innerHTML = 'VLIBRAS';

  // this.message = {
  //   text: 'message'
  // };

  // return this.message;

};




module.exports = Box;
