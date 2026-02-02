const IcaroIcon = require('./avatars/icaro.svg');
const HosanaIcon = require('./avatars/hosana.svg');
const GugaIcon = require('./avatars/guga.svg');
const aboutIcon = require('./header/about.svg');
const closeIcon = require('./header/close.svg');
const dictionaryIcon = require('./header/dictionary.svg');
const searchIcon = require('./header/search.svg');
const settingsIcon = require('./header/settings.svg');
const backIcon = require('./back.svg');
const arrowIcon = require('./feedback/arrow-up.svg');
const likeLineIcon = require('./feedback/like-line.svg');
const likeSolidIcon = require('./feedback/like-solid.svg');
const loadingIcon = require('./loading.svg');
const translatorIcon = require('./aux-controls/translator.svg');
const accessibilityIcon = require('./aux-controls/accessibility.svg');
const moreOptionsIcon = require('./aux-controls/more-options.svg');
const guideIcon = require('./aux-controls/guide.svg');
const arrowOutward = require('./feedback/arrow-outward.svg');
const deleteIcon = require('./delete.svg');
const chevronDownIcon = require('./chevron-down.svg');
const handsTranslateIcon = require('./dictionary/union.svg');


const emotions = {
  default: require('./emotions/default.svg'),
  happy: require('./emotions/happy.svg'),
  sad: require('./emotions/sad.svg'),
  doubt: require('./emotions/doubt.svg'),
  surprise: require('./emotions/surprise.svg'),
  angry: require('./emotions/angry.svg'),
  fear: require('./emotions/fear.svg'),
  disgust: require('./emotions/disgust.svg'),
  automatic: require('./emotions/automatic.svg'),
};

const controlIcons = {
  play: require('./controls/play.svg'),
  pause: require('./controls/pause.svg'),
  restart: require('./controls/restart.svg'),
  subtitle: require('./controls/subtitle.svg'),
  maximize: require('./controls/maximize.svg'),
  minimize: require('./controls/minimize.svg'),
  skip: require('./controls/skip.svg'),
};

const socialIcons = {
  face: require('./social/facebook.svg'),
  website: require('./social/website.svg'),
  twitter: require('./social/twitter.svg'),
  insta: require('./social/instagram.svg'),
  youtube: require('./social/youtube.svg'),
};

const positionIcons = [
  require('./positions/top-left.svg'),
  require('./positions/top.svg'),
  require('./positions/top-right.svg'),
  require('./positions/left.svg'),
  null,
  require('./positions/right.svg'),
  require('./positions/bottom-left.svg'),
  require('./positions/bottom.svg'),
  require('./positions/bottom-right.svg'),
];

const categoryIcons = {
  'animais': require('./dictionary/animais.svg'),
  'comidas': require('./dictionary/comidas.svg'),
  'corpo': require('./dictionary/corpo.svg'),
  'esporte': require('./dictionary/esporte.svg'),
  'familia': require('./dictionary/familia.svg'),
  'frutas': require('./dictionary/frutas.svg'),
  'lugares': require('./dictionary/lugares.svg'),
  'medidas': require('./dictionary/medidas.svg'),
  'natureza': require('./dictionary/natureza.svg'),
  'numeros': require('./dictionary/numeros.svg'),
  'pais': require('./dictionary/pais.svg'),
  'saude': require('./dictionary/saude.svg'),
  'sentimentos': require('./dictionary/sentimentos.svg'),
  'verbos': require('./dictionary/verbos.svg'),
  'alfabeto': require('./dictionary/alfabeto.svg'),
  'trabalho': require('./dictionary/trabalho.svg'),
  'maquinas': require('./dictionary/maquinas.svg'),
};

module.exports = {
  IcaroIcon,
  HosanaIcon,
  GugaIcon,
  aboutIcon,
  closeIcon,
  dictionaryIcon,
  searchIcon,
  settingsIcon,
  backIcon,
  socialIcons,
  positionIcons,
  arrowIcon,
  likeLineIcon,
  likeSolidIcon,
  loadingIcon,
  translatorIcon,
  moreOptionsIcon,
  guideIcon,
  controlIcons,
  arrowOutward,
  deleteIcon,
  emotions,
  accessibilityIcon,
  categoryIcons,
  chevronDownIcon,
  handsTranslateIcon,
};
