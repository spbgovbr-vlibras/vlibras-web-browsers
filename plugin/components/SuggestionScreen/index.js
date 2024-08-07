const template = require('./suggestion-screen.html').default;
require('./suggestion-screen.scss');

const { arrowIcon } = require('~icons/');
const { SIGNS_URL } = require('~constants');

const TrieSearch = require('trie-search');
const getCaretCoordinates = require('textarea-caret');

function SuggestionScreen(player) {
  this.element = null;
  this.player = player;
  this.signsList = [];
}

function getInputSelection(el) {
  let start = 0;
  let end = 0;

  if (!el) {
    return { start: start, end: end };
  }

  if (
    typeof el.selectionStart == 'number' &&
    typeof el.selectionEnd == 'number'
  ) {
    return { start: el.selectionStart, end: el.selectionEnd };
  }

  if (!document) {
    return { start: start, end: end };
  }

  const range = document.selection.createRange();

  if (!range && range.parentElement() !== el) {
    return { start: start, end: end };
  }

  const len = el.value.length;
  const normalizedValue = el.value.replace(/\r\n/g, '\n');
  const textInputRange = el.createTextRange();

  textInputRange.moveToBookmark(range.getBookmark());

  const endRange = el.createTextRange();

  endRange.collapse(false);

  if (textInputRange.compareEndPoints('StartToEnd', endRange) > -1) {
    start = end = len;
  } else {
    start = -textInputRange.moveStart('character', -len);
    start += normalizedValue.slice(0, start).split('\n').length - 1;

    if (textInputRange.compareEndPoints('EndToEnd', endRange) > -1) {
      end = len;
    } else {
      end = -textInputRange.moveEnd('character', -len);
      end += normalizedValue.slice(0, end).split('\n').length - 1;
    }
  }

  return { start: start, end: end };
}

const getWordBySelectionIndex = (sentence, index) => {
  if (sentence.charAt(index) === ' ') {
    return { wordToSuggest: '', begin: 0, newEnd: 0 };
  }

  const lastSpaceBeforeSelection = sentence
    .substring(0, index + 1)
    .lastIndexOf(' ');
  const lastIndexOfSpace = sentence
    .substring(index + 1, sentence.length)
    .indexOf(' ');
  const firstSpaceAfterSelection =
    lastIndexOfSpace === -1 ? sentence.length : index + 1 + lastIndexOfSpace;

  return {
    wordToSuggest: sentence.substring(
      lastSpaceBeforeSelection + 1,
      firstSpaceAfterSelection
    ),
    begin: lastSpaceBeforeSelection + 1,
    newEnd: firstSpaceAfterSelection,
  };
};

const replaceByStartAndEnd = (string, replacement, start, end) => {
  return `${string.substring(0, start)}${replacement}${string.substring(
    end,
    string.length
  )}`;
};

SuggestionScreen.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;
  this.rateBox = document.querySelector('div[vp-rate-box]');
  this.gloss = null;

  this.textElement = this.element.querySelector('.vp-user-textarea');

  this.send = this.element.querySelector('.vp-send-gloss-button');
  this.visualize = this.element.querySelector('.vp-play-gloss-button');

  const close = this.element.querySelector('.vp-suggestion-screen-header button');
  const dropdownSuggest = this.element.querySelector('.vp-dropdown-suggest');
  let actualBegin = 0;
  let actualEnd = 0;

  // Add icons
  close.innerHTML = arrowIcon;

  this.send.addEventListener('click', () => {
    window.plugin.sendReview('bad', this.textElement.value.trim());
  });

  close.addEventListener('click', function () {
    this.rateBox.classList.remove('vp-expanded');
    this.hide();
  }.bind(this));

  const setOption = (name) => {
    this.textElement.value = replaceByStartAndEnd(
      this.textElement.value,
      name,
      actualBegin,
      actualEnd
    ).toUpperCase();

    dropdownSuggest.classList.remove('vp-enabled');
  };

  this.visualize.addEventListener('click', () => {
    const oldGloss = this.player.gloss;
    const boundOpenAfterEnd = openAfterEnd.bind(this);

    this.hide();
    this.player.play(this.textElement.value.trim());
    this.player.on('gloss:end', boundOpenAfterEnd);

    function openAfterEnd() {
      this.player.removeListener('gloss:end', boundOpenAfterEnd);
      this.rateBox.classList.add('vp-enabled');
      this.player.gloss = oldGloss;
      this.show();
    }
  });

  const buildSelect = (listOfSuggestions, end) => {
    const caret = getCaretCoordinates(this.textElement, end);

    listOfSuggestions.map((item) => {
      const opt = document.createElement('li');
      opt.appendChild(document.createTextNode(item.name));
      opt.value = item.name;
      opt.classList.add('vp-dropdown-item');
      opt.onclick = () => {
        setOption(item.name);
      };
      dropdownSuggest.appendChild(opt);
    });

    if (listOfSuggestions.length === 1) dropdownSuggest.style.height = '24px';
    else if (listOfSuggestions.length === 2) {
      dropdownSuggest.style.height = '40px';
    } else dropdownSuggest.style.height = '54px';

    dropdownSuggest.classList.add('vp-enabled');
    let left = caret.left + 25;
    if (left > 180) left = left - 50;
    dropdownSuggest.style.left = left.toString() + 'px';
    dropdownSuggest.style.top = (caret.top + 60).toString() + 'px';
  };

  const setWordToReplace = (begin, newEnd) => {
    actualBegin = begin;
    actualEnd = newEnd;
  };

  this.textElement.addEventListener('input', function () {
    const { end } = getInputSelection(this.textElement);

    if (!this.textElement.value.replace(/[^a-z0-9]/gi, '')) {
      this.visualize.setAttribute('disabled', true);
      this.send.setAttribute('disabled', true);
    } else {
      this.visualize.removeAttribute('disabled');
      this.send.removeAttribute('disabled');
    }

    const { wordToSuggest, begin, newEnd } = getWordBySelectionIndex(
      this.textElement.value,
      end - 1
    );
    setWordToReplace(begin, newEnd);

    while (dropdownSuggest.firstChild) {
      dropdownSuggest.removeChild(dropdownSuggest.firstChild);
    }

    if (wordToSuggest && wordToSuggest.length >= 2) {
      const ts = new TrieSearch('name');
      ts.addAll(this.signsList);
      const listOfSuggestions = ts.get(wordToSuggest);
      if (listOfSuggestions.length == 0) {
        dropdownSuggest.classList.remove('vp-enabled');
      } else buildSelect(listOfSuggestions, end);
    } else {
      dropdownSuggest.classList.remove('vp-enabled');
    }
  }.bind(this));

  this.textElement.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !this.send.disabled) {
      e.preventDefault();
      this.visualize.click();
    }
  }.bind(this));

  const xhr = new XMLHttpRequest();
  xhr.open('get', SIGNS_URL, true);
  xhr.responseType = 'text';
  xhr.onload = function () {
    if (xhr.status == 200) {
      this.signsList = JSON.parse(xhr.response).map((item) => ({ name: item }));
    } else {
      console.error('Bad answer for get signs list, status: ' + xhr.status);
    }
  }.bind(this);
  xhr.send();
};

SuggestionScreen.prototype.setGloss = function (gloss) {
  this.textElement.value = this.gloss || gloss;
  this.gloss = gloss;
  this.send.removeAttribute('disabled');
  this.visualize.removeAttribute('disabled');
};

SuggestionScreen.prototype.show = function () {
  this.element.classList.add('vp-enabled');
  this.element.classList.add('vp-expanded');
  this.element.querySelector('.vp-dropdown-suggest').classList.remove('vp-enabled');
};

SuggestionScreen.prototype.hide = function () {
  this.element.classList.remove('vp-expanded');
  this.element.classList.remove('vp-enabled');
};

module.exports = SuggestionScreen;
