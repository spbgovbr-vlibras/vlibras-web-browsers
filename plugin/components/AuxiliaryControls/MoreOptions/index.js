const template = require('./more-options.html').default;
require('./more-options.scss');

const {
  closeIcon,
  translatorIcon,
  bugReportIcon,
  emotions,
} = require('~icons');
const { $ } = require('~utils');

function MoreOptions(translator) {
  this.translator = translator;
  this.active = false;
  this.isLoaded = false;
}

MoreOptions.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;

  const closeBtn = $('.vp-more-options-header button', this.element);
  const translatorBtn = $('.vp-translator-button', this.element);
  const emotionsBtn = $('.vp-emotions-button', this.element);
  const reportBugBtn = $('.vp-report-bug-button', this.element);

  // add icons
  closeBtn.innerHTML = closeIcon;
  translatorBtn.innerHTML += translatorIcon;
  emotionsBtn.innerHTML += emotions.satisfied;
  reportBugBtn.innerHTML += bugReportIcon;

  // add actions
  closeBtn.onclick = () => this.hide();
  translatorBtn.onclick = () => this.translator.toggle();

  this.isLoaded = true;
};

MoreOptions.prototype.show = function () {
  this.active = true;
  this.element.dataset.active = true;
};

MoreOptions.prototype.hide = function () {
  this.active = false;
  this.element.dataset.active = false;
};

MoreOptions.prototype.toggle = function () {
  this.active ? this.hide() : this.show();
};

module.exports = MoreOptions;
