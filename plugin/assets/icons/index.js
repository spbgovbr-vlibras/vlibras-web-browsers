const IcaroIcon = require('./avatars/icaro.svg');
const HosanaIcon = require('./avatars/hosana.svg');
const GugaIcon = require('./avatars/guga.svg');
const aboutIcon = require('./header/about.svg');
const closeIcon = require('./header/close.svg');
const dictionaryIcon = require('./header/dictionary.svg');
const settingsIcon = require('./header/settings.svg');
const backIcon = require('./back.svg');
const arrowIcon = require('./feedback/arrow-up.svg');
const likeLineIcon = require('./feedback/like-line.svg');
const likeSolidIcon = require('./feedback/like-solid.svg');
const loadingIcon = require('./loading.svg');
const translatorIcon = require('./additionalOptions/translator.svg');
const helpIcon = require('./additionalOptions/help.svg');

const controlIcons = {
  play: require('./controls/play.svg'),
  pause: require('./controls/pause.svg'),
  restart: require('./controls/restart.svg'),
  subtitle: require('./controls/subtitle.svg'),
  maximize: require('./controls/maximize.svg'),
  minimize: require('./controls/minimize.svg'),
  skip: require('./controls/skip.svg'),
}

const socialIcons = {
  face: require('./social/facebook.svg'),
  website: require('./social/website.svg'),
  twitter: require('./social/twitter.svg'),
  insta: require('./social/instagram.svg'),
  youtube: require('./social/youtube.svg'),
}

const positionIcons = [
  require('./positions/top-left.svg'), require('./positions/top.svg'),
  require('./positions/top-right.svg'), require('./positions/left.svg'),
  null, require('./positions/right.svg'), require('./positions/bottom-left.svg'),
  require('./positions/bottom.svg'), require('./positions/bottom-right.svg')
]

module.exports = {
  IcaroIcon, HosanaIcon, GugaIcon, aboutIcon, closeIcon,
  dictionaryIcon, settingsIcon, backIcon, socialIcons,
  positionIcons, arrowIcon, likeLineIcon, likeSolidIcon,
  loadingIcon, translatorIcon, helpIcon, controlIcons
}

