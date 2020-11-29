var template = require("./suggestion-screen.html").default;
require("./suggestion-screen.scss");

var TrieSearch = require("trie-search");
var getCaretCoordinates = require("textarea-caret");

function SuggestionScreen(player) {
  this.element = null;
  this.player = player;
  this.signsList = [];
}

function getInputSelection(el) {
  var start = 0,
    end = 0;

  if (!el) {
    return { start: start, end: end };
  }

  if (
    typeof el.selectionStart == "number" &&
    typeof el.selectionEnd == "number"
  ) {
    return { start: el.selectionStart, end: el.selectionEnd };
  }

  if (!document) {
    return { start: start, end: end };
  }

  var range = document.selection.createRange();

  if (!range && range.parentElement() !== el) {
    return { start: start, end: end };
  }

  var len = el.value.length;
  var normalizedValue = el.value.replace(/\r\n/g, "\n");
  var textInputRange = el.createTextRange();

  textInputRange.moveToBookmark(range.getBookmark());

  var endRange = el.createTextRange();

  endRange.collapse(false);

  if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
    start = end = len;
  } else {
    start = -textInputRange.moveStart("character", -len);
    start += normalizedValue.slice(0, start).split("\n").length - 1;

    if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
      end = len;
    } else {
      end = -textInputRange.moveEnd("character", -len);
      end += normalizedValue.slice(0, end).split("\n").length - 1;
    }
  }

  return { start: start, end: end };
}

function setCaretPosition(elem, caretPos) {
  if (elem) {
    if (elem.createTextRange) {
      var range = elem.createTextRange();

      range.move("character", caretPos);
      range.select();
    } else {
      if (elem.selectionStart) {
        elem.focus();
        elem.setSelectionRange(caretPos, caretPos);
      } else {
        elem.focus();
      }
    }
  }
}

const getWordBySelectionIndex = (sentence, index) => {
  if (sentence.charAt(index) === " ")
    return { wordToSuggest: "", begin: 0, newEnd: 0 };

  const lastSpaceBeforeSelection = sentence
    .substring(0, index + 1)
    .lastIndexOf(" ");
  const lastIndexOfSpace = sentence
    .substring(index + 1, sentence.length)
    .indexOf(" ");
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

  this.rate = null;
  this.textElement = this.element.querySelector(".vp-text");

  const send = this.element.querySelector(".vp-send-button");
  const visualize = this.element.querySelector(".vp-visualize-signal-button");
  const close = this.element.querySelector(".vp-close-button");
  const dropdownSuggest = this.element.querySelector(".vp-dropdown-suggest");
  let actualBegin = 0;
  let actualEnd = 0;

  send.addEventListener("click", () => {
    window.plugin.sendReview(this.rate, this.textElement.value);
  });

  close.addEventListener("click", () => {
    this.hide();
  });

  dropdownSuggest.addEventListener("change", (e) => {
    this.textElement.value = replaceByStartAndEnd(
      this.textElement.value,
      dropdownSuggest.value,
      actualBegin,
      actualEnd
    ).toUpperCase();

    dropdownSuggest.classList.remove("vp-enabled");
  });

  visualize.addEventListener("click", () => {
    let openAfterEnd = true;
    this.hide();
    this.player.play(this.textElement.value);
    this.player.on("gloss:end", () => {
      if (openAfterEnd) this.show();
      openAfterEnd = false;
    });
  });

  const buildSelect = (listOfSuggestions, end) => {
    const caret = getCaretCoordinates(this.textElement, end);

    listOfSuggestions.map((item) => {
      const opt = document.createElement("option");
      opt.appendChild(document.createTextNode(item.name));
      opt.value = item.name;
      dropdownSuggest.appendChild(opt);
    });

    dropdownSuggest.classList.add("vp-enabled");
    dropdownSuggest.style.left = (caret.left + 30).toString() + "px";
    dropdownSuggest.style.top = (caret.top + 60).toString() + "px";
  };

  const setWordToReplace = (begin, newEnd) => {
    actualBegin = begin;
    actualEnd = newEnd;
  };

  this.textElement.addEventListener("input", () => {
    const { end } = getInputSelection(this.textElement);

    const { wordToSuggest, begin, newEnd } = getWordBySelectionIndex(
      this.textElement.value,
      end - 1
    );
    setWordToReplace(begin, newEnd);

    while (dropdownSuggest.firstChild) {
      dropdownSuggest.removeChild(dropdownSuggest.firstChild);
    }

    if (wordToSuggest && wordToSuggest.length >= 2) {
      var ts = new TrieSearch("name");
      ts.addAll(this.signsList);
      const listOfSuggestions = ts.get(wordToSuggest);
      if (listOfSuggestions.length == 0)
        dropdownSuggest.classList.remove("vp-enabled");
      else buildSelect(listOfSuggestions, end);
    } else {
      dropdownSuggest.classList.remove("vp-enabled");
    }
  });

  var xhr = new XMLHttpRequest();
  xhr.open("get", "http://192.168.1.10:8081/signs.json", true);
  xhr.responseType = "text";
  xhr.onload = function () {
    if (xhr.status == 200) {
      this.signsList = JSON.parse(xhr.response).map((item) => ({ name: item }));
    } else {
      console.error("Bad answer for get signs list, status: " + xhr.status);
    }
  }.bind(this);
  xhr.send();
};

SuggestionScreen.prototype.setGloss = function (gloss) {
  this.textElement.value = gloss;
};

SuggestionScreen.prototype.show = function (rate) {
  this.element.querySelector(".vp-text").style.display = "block";
  this.rate = rate;
  this.element.classList.add("vp-enabled");
};

SuggestionScreen.prototype.hide = function () {
  this.element.querySelector(".vp-text").style.display = "none";
  this.element.classList.remove("vp-enabled");
};

module.exports = SuggestionScreen;
