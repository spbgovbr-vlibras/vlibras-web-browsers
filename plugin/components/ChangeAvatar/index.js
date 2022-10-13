const template = require('./change-avatar.html').default;
require('./change-avatar.scss');

function ChangeAvatar(player) {
  this.player = player;
  this.element = null;
}

ChangeAvatar.prototype.load = function(element) {
  this.element = element;
  this.element.innerHTML = template;
  const button = this.element.querySelector('.vp-button-change-avatar');
  let actualAvatar = 1;

  button.addEventListener('click', () => {
    switch (actualAvatar) {
      case 1:
        button.querySelector('.avatar-female').classList.remove('active');
        button.querySelector('.avatar-children').classList.add('active');
        this.player.changeAvatar('hozana');
        break;
      case 2:
        button.querySelector('.avatar-children').classList.remove('active');
        button.querySelector('.avatar-male').classList.add('active');
        this.player.changeAvatar('guga');
        break;
      case 3:
        button.querySelector('.avatar-male').classList.remove('active');
        button.querySelector('.avatar-female').classList.add('active');
        this.player.changeAvatar('icaro');
        break;
    }
    actualAvatar = (actualAvatar % 3) + 1;
  });
};


ChangeAvatar.prototype.show = function() {
  this.enabled = true;
  this.element.classList.add('vp-disabled');
};

ChangeAvatar.prototype.hide = function() {
  if (this.element != undefined) {
    this.enabled = false;
    this.element.classList.remove('vp-disabled');
  }
};


module.exports = ChangeAvatar;
