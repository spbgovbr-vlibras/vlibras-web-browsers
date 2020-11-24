var template = require("./suggestion-screen.html").default;
require("./suggestion-screen.scss");
var TrieSearch = require("trie-search");

function SuggestionScreen(player) {
  this.element = null;
  this.player = player;
}

SuggestionScreen.prototype.load = function (element) {
  this.element = element;
  this.element.innerHTML = template;

  this.rate = null;

  this.textElement = this.element.querySelector(".vp-text");

  const send = this.element.querySelector(".vp-send-button");
  const visualize = this.element.querySelector(".vp-visualize-signal-button");
  const close = this.element.querySelector(".vp-close-button");

  send.addEventListener("click", () => {
    window.plugin.sendReview(this.rate, this.textElement.value);
  });

  close.addEventListener("click", () => {
    this.hide();
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

  this.textElement.addEventListener("input", () => {
    const data = ["JOAO", "MARIA", "SUANNY", "SELENA", "XUXA"];
    const newData = data.map((item) => ({ name: item }));
    var ts = new TrieSearch("name");
    ts.addAll(newData);
    const actualText = this.textElement.value.split(" ")[
      this.textElement.value.split(" ").length - 1
    ];
  });
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
