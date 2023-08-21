const template = require('./change-avatar.html').default;
require('./change-avatar.scss');

const { IcaroIcon, HosanaIcon, GugaIcon } = require('~icons');
const avatars = ['icaro', 'hozana', 'guga'];

function ChangeAvatar(player) {
  this.player = player;
  this.element = null;
}

ChangeAvatar.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;
  this.player.avatar = 'icaro';
  const buttons = this.element.querySelectorAll('.vp-button-change-avatar');

  buttons.forEach((button, i) => {
    button.innerHTML = [IcaroIcon, HosanaIcon, GugaIcon][i];

    button.onclick = () => {
      if (button.classList.contains('vp-selected')) return;
      this.player.changeAvatar(avatars[i]);
      selectButton(button);
    }
  });

  this.element.onclick = () => this.element.classList.toggle('vp-change-avatar-openned');

  function selectButton(button) {
    button.classList.add('vp-selected');
    buttons.forEach(btn => {
      if (btn !== button) btn.classList.remove('vp-selected');
    })
  }

  selectButton(buttons[0]);

  this.player.on(
    'GetAvatar',
    function (avatar) {
      selectButton(buttons[avatars.indexOf(avatar)])
      this.player.playWellcome();
      this.player.avatar = avatar;
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
