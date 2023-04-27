const template = require('./change-avatar.html').default;
require('./change-avatar.scss');

const { IcaroIcon, hozanaIcon, gugaIcon } = require('../../assets/icons');

const avatars = ['icaro', 'hozana', 'guga'];

function ChangeAvatar(player, callbackWelcome) {
  this.player = player;
  this.element = null;
}

ChangeAvatar.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;
  const buttons = this.element.querySelectorAll('.vp-button-change-avatar');

  // Add icon
  buttons.forEach((button, i) => {
    button.innerHTML = [IcaroIcon, hozanaIcon, gugaIcon][i];

    button.onclick = () => {
      if (button.classList.contains('selected')) return;
      this.player.changeAvatar(avatars[i]);
      selectButton(button);
    }
  });
  
  function selectButton(button) {
    button.classList.add('selected');
    buttons.forEach(btn => {
      if (btn !== button) btn.classList.remove('selected');
    })
  }

  this.player.on(
    'GetAvatar',
    function () {
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
