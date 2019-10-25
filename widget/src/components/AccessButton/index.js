const window = require('window');
const template = require('./template.html');
require('./styles.scss');

function AccessButton(rootPath, pluginWrapper, personalization, opacity) {
  this.personalization = personalization;
  this.rootPath = rootPath;
  this.pluginWrapper = pluginWrapper;
  this.vw_links = null;
  this.currentElement = null;
  this.currentSpanElement = null;
  this.opacity = opacity;
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
      rootPath: this.rootPath,
      personalization: this.personalization,
      opacity: this.opacity,
      wrapper: this.pluginWrapper.element
    }));

    this.addTagsTexts(vw);
    
  });
  
};

module.exports = AccessButton;

var control = 0;

function updatePosition(){
  if(this.currentElement != null && this.vw_links!= null && this.currentSpanElement != null){
    positionElement = getPosition(this.currentElement);
    var width = this.currentSpanElement.offsetWidth;
    var height = this.currentSpanElement.offsetHeight;
    this.vw_links.style.top = (positionElement.y + (height/2)) + 'px';
    this.vw_links.style.left = (positionElement.x + (width/2)) + 'px';
  }
}

function hasParent(el, fn) {
  var node = el.parentElement;
  
  while ( node != null  ) { 
    if (fn(node)) return node;
    node = node.parentElement;
  }
  
  return false;
}

function getPosition(elem) {
  var xPos = 0;
  var yPos = 0;
 
  var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top  = box.top +  scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { y: Math.round(top), x: Math.round(left) };
  return {
    x: xPos,
    y: yPos
  };
}

function createAccessLinkBox(){
  var template = require('./tooltip.html');  
  let div = document.createElement('div');
  div.className = 'vw-links';
  div.innerHTML = template;
  document.body.appendChild(div);
}

AccessButton.prototype.divBox = function(linkContent, event){
  nodeAnchor = hasParent(linkContent, function (parent) { 
    return parent.nodeName == 'A'; 
  });
  if(!nodeAnchor){
    return;
  }
  event.stopPropagation();
  this.currentElement = nodeAnchor;
  this.currentSpanElement = linkContent;
  positionElement = getPosition(nodeAnchor);
  var width = linkContent.offsetWidth;
  var height = linkContent.offsetHeight;

  anchorElement = this.vw_links.querySelector('a');
  anchorElement.href = nodeAnchor.href;
  this.vw_links.style.top = (positionElement.y + (height/2)) + 'px';
  this.vw_links.style.left = (positionElement.x + (width/2)) + 'px';
  this.vw_links.firstChild.classList.add('active');

}

AccessButton.prototype.addTagsTexts = function (vw) {
  self = this;
  getAllNodeTexts(document.body, function (node) {
    if (vw.contains(node)) return;
    node.innerHTML = '<vlibraswidget>' + node.innerHTML + '</vlibraswidget>';
    const span = node.querySelector('vlibraswidget');
    if(!span)
      return;
    span.classList.add('vw-text');
    span.addEventListener('click', function (e) {
      e.preventDefault();
      self.divBox(this, e);     
      if (control) window.plugin.player.stop();
      window.plugin.player.translate(this.textContent);
      deactivateAll();
      this.classList.add('vw-text-active');
      control++;
    });
  }, function(textNode, parent) {
    if (/^\s+$/.test(textNode.nodeValue)) {
      return true;
    }
    return false;
  });
  createAccessLinkBox();
  this.vw_links = document.body.getElementsByClassName('vw-links')[0];
    document.body.onclick = function(e){
      if(this.vw_links!= null){
        this.vw_links.firstChild.classList.remove('active');
      }
    }.bind(this);
    window.addEventListener("scroll", updatePosition.bind(this), false);
    window.addEventListener("resize", updatePosition.bind(this), false);
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
