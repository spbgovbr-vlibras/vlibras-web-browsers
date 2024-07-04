const template = require('./change-avatar.html').default;
require('./change-avatar.scss');

const { IcaroIcon, HosanaIcon, GugaIcon } = require('~icons');
const availableAvatars = ['icaro', 'hosana', 'guga', 'random'];

function ChangeAvatar(player, controls) {
  this.player = player;
  this.controls = controls;
  this.element = null;
}

ChangeAvatar.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;
  this.welcomeStarted = false;
  const buttons = this.element.querySelectorAll('.vp-button-change-avatar');

  // Add icons and actions
  buttons.forEach((button, i) => {
    button.innerHTML = [IcaroIcon, HosanaIcon, GugaIcon][i];

    button.onclick = () => {
      if (isSelected(button)) return;
      const avatar = availableAvatars[i];
      this.player.changeAvatar(avatar);
      this.player.avatar = avatar;
      selectButton(button);
    }
  });

  this.element.onclick = () => this.element.classList.toggle('vp-isOpen');

  if (this.player.avatar === 'random') this.player.avatar = generateRandomAvatar();
  this.player.changeAvatar(this.player.avatar);
  selectButton(getAvatarButton(this.player.avatar));

  const _ = setInterval(() => {
    if (!this.controls.loaded) return;
    setTimeout(callWelcome.bind(this), 500);
    clearInterval(_);
  }, 500)

  function changeAvatar() {
    if (this.player.avatar === 'random') this.player.avatar = generateRandomAvatar();
    this.player.changeAvatar(this.player.avatar);
    selectButton(getAvatarButton(this.player.avatar));
  }

  function callWelcome() {
    changeAvatar.bind(this)();
    if (this.controls.isWidget) this.player.playWellcome();
  }

  function selectButton(button) {
    buttons.forEach(btn => btn.classList.toggle('vp-selected', btn === button))
  }

  function isSelected(button) {
    return button.classList.contains('vp-selected');
  }

  function getAvatarButton(avatar) {
    return buttons[availableAvatars.indexOf(avatar)];
  }

};

function generateRandomAvatar() {
  return availableAvatars[Math.floor(Math.random() * 3)];
}

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
