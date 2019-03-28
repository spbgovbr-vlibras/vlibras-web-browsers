const window = require('window');
const template = require('./template.html');
require('./styles.scss');

function AccessButton(pluginWrapper) {
  this.pluginWrapper = pluginWrapper;
}

AccessButton.prototype.load = function (element, vw) {
  this.element = element;
  this.element.innerHTML = template;

  this.element.addEventListener('click', () => {
    this.element.classList.toggle('active');
    this.pluginWrapper.element.classList.toggle('active');

    window.plugin = (window.plugin || new window.VLibras.Plugin({
      enableMoveWindow: true,
      playWellcome: true,
    }));

    addTagsTexts(vw);
  });
};

module.exports = AccessButton;

// function hasParent(el, fn) {
//   var node = el.parentNode;
//   while ( node != null ) {
//     if (fn(node)) return node;
//     node = node.parentNode;
//   }
  
//   return false;
// }

// function showLinks(content) {
//   var links = Array.prototype.slice.call(content.querySelectorAll('a'));
//   var linksList = vwLinks.querySelector('ul');
  
//   var link = hasParent(content, function (parent) { return parent.tagName == 'A'; });
//   if (link) {
//     links.push(link);
//   }

//   linksList.innerHTML = '';
//   for(var i = 0; i < links.length; i++) {
//     var link = links[i];
//     var li = document.createElement('li');
//     li.innerHTML = '<a href="' + (link.href || '') + '" target="' + link.target + '">' + link.textContent + '</a>';
//     linksList.appendChild(li);
//   }

//   if (links.length > 0) {
//     vwLinks.classList.add('active');
//   } else {
//     vwLinks.classList.remove('active');
//   }
// }

function addTagsTexts(vw) {
  getAllNodeTexts(document.body, function (node) {
    if (vw.contains(node)) return;

    node.innerHTML = '<span>' + node.innerHTML + '</span>';

    const span = node.querySelector('span');
    span.classList.add('vw-text');

    span.addEventListener('click', function (e) {
      e.preventDefault();

      // vwProgress.style.width = 0;
      // VLibrasWeb.lastTextElement = this.parentNode;

      // showLinks(this);

      window.plugin.player.stop();
      window.plugin.player.translate(this.textContent);

      deactivateAll();

      this.classList.add('vw-text-active');
    });
  });
}

function getAllNodeTexts(root, callback) {
  var noop = function () {};
  var headElements = ['SCRIPT', 'TITLE', 'META', 'STYLE', 'LINK', 'BASE'];

  for(var i = 0; i < root.childNodes.length; i++) {
    var node    = root.childNodes[i];
    var anyText = false;

    if (headElements.indexOf(node.tagName) != -1) {
      continue;
    }

    for(var j = 0; j < node.childNodes.length; j++) {
      var child = node.childNodes[j];
      if (child.nodeType == Node.TEXT_NODE && child.nodeValue.trim() != '') {
        anyText = true;
        break;
      }
    }

    if (anyText) {
      (callback || noop)(node);
    } else {
      getAllNodeTexts(node, callback);
    }
  }
}

function deactivateAll() {
  var active = document.querySelector('.vw-text.vw-text-active');
  if (active) {
    active.classList.remove('vw-text-active');
  }
}
