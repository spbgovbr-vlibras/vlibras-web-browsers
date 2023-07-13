const template = require('./change-avatar.html').default;
require('./change-avatar.scss');

const { IcaroIcon, hozanaIcon, gugaIcon } = require('../../../assets/icons');

const avatars = ['icaro', 'hozana', 'guga'];

function ChangeAvatar(player, callbackWelcome) {
  this.player = player;
  this.element = null;
}

ChangeAvatar.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;
  const buttons = this.element.querySelectorAll('.vp-button-change-avatar');

  buttons.forEach((button, i) => {
    button.innerHTML = [IcaroIcon, hozanaIcon, gugaIcon][i];

    button.onclick = () => {
      if (button.classList.contains('vp-selected')) return;
      this.player.changeAvatar(avatars[i]);
      selectButton(button);
    }
  });

  this.element.onclick = () => this.element.classList.toggle('vp-change-avatar-openned');
  this.element.onmouseenter = () => !onMobile() && this.element.classList.add('vp-change-avatar-openned');
  this.element.onmouseleave = () => !onMobile() && this.element.classList.remove('vp-change-avatar-openned');

  function onMobile() {
    return window.innerWidth < 450;
  }

  function selectButton(button) {
    button.classList.add('vp-selected');
    buttons.forEach(btn => {
      if (btn !== button) btn.classList.remove('vp-selected');
    })
  }

  this.player.on(
    'GetAvatar',
    function (avatar) {
      buttons[avatars.indexOf(avatar)]
        .classList.add('vp-selected');

      this.player.playWellcome();
    }.bind(this)
  );

  this.player.on(
    'stop:welcome',
    function () {
      this.element.classList.add('active');
    }.bind(this)
  );
};

ChangeAvatar.prototype.show = function () {
  this.enabled = true;
  this.element.classList.add('active');
};

ChangeAvatar.prototype.hide = function () {
  if (this.element != undefined) {
    this.enabled = false;
    this.element.classList.remove('active');
  }
};

module.exports = ChangeAvatar;
