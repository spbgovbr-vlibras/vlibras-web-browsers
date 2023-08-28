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
  this.welcomeStarted = false;
  this.player.avatar = 'icaro';
  const buttons = this.element.querySelectorAll('.vp-button-change-avatar');

  // Add icons and actions
  buttons.forEach((button, i) => {
    button.innerHTML = [IcaroIcon, HosanaIcon, GugaIcon][i];

    button.onclick = () => {
      if (isSelected(button)) return;
      this.player.changeAvatar(avatars[i]);
      selectButton(button);
    }
  });

  this.element.onclick = () => this.element.classList.toggle('vp-isOpen');

  function selectButton(button) {
    buttons.forEach(btn => btn.classList.toggle('vp-selected', btn === button))
  }

  function isSelected(button) {
    return button.classList.contains('vp-selected');
  }

  this.player.on('GetAvatar', avatar => {
    selectButton(buttons[avatars.indexOf(avatar)]);
    this.welcomeStarted = true;
    this.player.avatar = avatar;
    this.player.playWellcome();
  });

  setTimeout(() => !this.welcomeStarted && this.player.playWellcome(), 300);
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
