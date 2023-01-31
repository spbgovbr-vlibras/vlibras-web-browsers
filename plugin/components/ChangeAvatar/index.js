const template = require('./change-avatar.html').default;
require('./change-avatar.scss');

function ChangeAvatar(player, callbackWelcome) {
  this.player = player;
  this.element = null;
}

const mapAvatar = {
  icaro: 1,
  hozana: 2,
  guga: 3,
};

const mapNextAvatar = {
  icaro: 'hozana',
  hozana: 'guga',
  guga: 'icaro',
};

ChangeAvatar.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;
  const button = this.element.querySelector('.vp-button-change-avatar');
  const label = this.element.querySelector('.vp-avatars-intro-label');

  let actualAvatar = '';
  this.player.on(
    'GetAvatar',
    function (avatar) {
      if (!actualAvatar) {
        this.player.playWellcome();
        button
          .querySelector(`.avatar-${mapNextAvatar[avatar]}`)
          .classList.add('active');
        actualAvatar = mapAvatar[avatar];
      }
    }.bind(this)
  );

  this.player.on(
    'stop:welcome',
    function () {
      label.classList.add('active');
    }.bind(this)
  );

  button.addEventListener('click', () => {
    label.classList.remove('active');
    switch (actualAvatar) {
      case 1:
        button.querySelector('.avatar-hozana').classList.remove('active');
        button.querySelector('.avatar-icaro').classList.remove('active');

        button.querySelector('.avatar-guga').classList.add('active');
        this.player.changeAvatar('hozana');
        break;
      case 2:
        button.querySelector('.avatar-guga').classList.remove('active');
        button.querySelector('.avatar-hozana').classList.remove('active');

        button.querySelector('.avatar-icaro').classList.add('active');
        this.player.changeAvatar('guga');
        break;
      case 3:
        button.querySelector('.avatar-icaro').classList.remove('active');
        button.querySelector('.avatar-guga').classList.remove('active');

        button.querySelector('.avatar-hozana').classList.add('active');
        this.player.changeAvatar('icaro');
        break;
    }
    actualAvatar = (actualAvatar % 3) + 1;
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
