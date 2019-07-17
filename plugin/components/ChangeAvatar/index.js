var template = require('./change-avatar.html');
require('./change-avatar.scss');

function ChangeAvatar(player) {
  this.player = player;
  this.element = null;
}

ChangeAvatar.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;
  const button = this.element.querySelector('.vp-button-change-avatar');
  var female = true;


  button.addEventListener('click', () => {
    if (female){
      button.querySelector('.change-avatar-female').style.display = 'none';
      button.querySelector('.change-avatar-male').style.display = 'block';
    } else {
      button.querySelector('.change-avatar-female').style.display = 'block';
      button.querySelector('.change-avatar-male').style.display = 'none';
    }

    female = !female;

    this.player.changeAvatar();
  });
};



ChangeAvatar.prototype.show = function () {
  this.enabled = true;
  this.element.classList.add('vp-disabled');
};

ChangeAvatar.prototype.hide = function () {
  if (this.element != undefined) {
    this.enabled = false;
    this.element.classList.remove('vp-disabled');
  }
};


module.exports = ChangeAvatar;
