const playIcon = require('./play.svg');
const pauseIcon = require('./pause.svg');
const restartIcon = require('./restart.svg');
const subtitleIcon = require('./subtitle.svg');
const IcaroIcon = require('./avatars/icaro.svg');
const hozanaIcon = require('./avatars/hozana.svg');
const gugaIcon = require('./avatars/guga.svg');
const aboutIcon = require('./header/about.svg');
const closeIcon = require('./header/close.svg');
const dictionaryIcon = require('./header/dictionary.svg');
const settingsIcon = require('./header/settings.svg');
const backIcon = require('./back.svg');
const arrowIcon = require('./feedback/arrow-up.svg');
const likeLineIcon = require('./feedback/like-line.svg');
const likeSolidIcon = require('./feedback/like-solid.svg');
const loadingIcon = require('./loading.svg');
const fullscreenIcon = require('./fullscreen.svg');
const translatorIcon = require('./additionalOptions/translator.svg');
const helpIcon = require('./additionalOptions/help.svg');

const socialIcons = {
  face: require('./facebook.svg'),
  web: require('./web.svg'),
  twitter: require('./twitter.svg'),
  insta: require('./instagram.svg'),
  youtube: require('./youtube.svg'),
}

const positionIcons = [
  require('./positions/top-left.svg'), require('./positions/top.svg'),
  require('./positions/top-right.svg'), require('./positions/left.svg'),
  null, require('./positions/right.svg'), require('./positions/bottom-left.svg'),
  require('./positions/bottom.svg'), require('./positions/bottom-right.svg')
]

module.exports = {
  playIcon, pauseIcon, restartIcon, subtitleIcon, IcaroIcon,
  hozanaIcon, gugaIcon, aboutIcon, closeIcon, dictionaryIcon,
  settingsIcon, backIcon, socialIcons, positionIcons,
  arrowIcon, likeLineIcon, likeSolidIcon, loadingIcon,
  fullscreenIcon, translatorIcon, helpIcon
}

