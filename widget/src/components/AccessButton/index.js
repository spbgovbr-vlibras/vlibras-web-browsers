const window = require('window');
const template = require('./template.html');
require('./styles.scss');

function AccessButton(rootPath, pluginWrapper) {
  this.rootPath = rootPath;
  this.pluginWrapper = pluginWrapper;
  this.vw_links = null;
  this.currentElement = null;
  this.currentSpanElement = null;
  
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
    }));

    this.addTagsTexts(vw);
    
    
  });
  
};

module.exports = AccessButton;


function updatePosition(){
  if(this.currentElement != null && this.vw_links!= null && this.currentSpanElement != null){
    positionElement = getPosition(this.currentElement);
    var width = this.currentSpanElement.offsetWidth;
    var height = this.currentSpanElement.offsetHeight;
    this.vw_links.style.top = (positionElement.y + (height/2)) + 'px';
    this.vw_links.style.left = (positionElement.x + (width/2)) + 'px';
  }
}
// 
// AccessButton.prototype.showLinks = function(content) {
//   console.log('Anchors: ' + content);
//   var links = Array.prototype.slice.call(content.querySelectorAll('a'));
//   console.log('links: ' + links);
//   // console.log(links);
//   // console.log(content);
//   // console.log(this);
//   var linksList = this.vw_links.querySelector('ul');
//   console.log(this.vw_links);
  
//   var link = hasParent(content, function (parent) { 
//     console.log('Node name: ' + parent.nodeName);
//     return parent.nodeName == 'A'; 
//   });
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
//     this.vw_links.classList.querySelector('tooltip').add('active');
//   } else {
//     this.vw_links.classList.querySelector('tooltip').remove('active');
//   }
// };

function hasParent(el, fn) {
  var node = el.parentElement;
  console.log('Node parent: ' + node);
  
  while ( node != null  ) { 
    if (fn(node)) return node;
    node = node.parentElement;
    console.log(node);
  }
  
  return false;
}

function getPosition(elem) {
  var xPos = 0;
  var yPos = 0;
 
 
  // while (el) {
  //   if (el.tagName == "BODY") {
  //     // deal with browser quirks with body/window/document and page scroll
  //     // var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
  //     // var yScroll = el.scrollTop || document.documentElement.scrollTop;
  //       var yScroll = window.scrollTop;
  //       var yScroll = window.scrollLeft;
  //     xPos += (el.offsetLeft - xScroll + el.clientLeft);
  //     yPos += (el.offsetTop - yScroll + el.clientTop);
  //   } else {
  //     // for all other non-BODY elements
  //     xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
  //     yPos += (el.offsetTop - el.scrollTop + el.clientTop);
  //   }
 
  //   el = el.offsetParent;
  // }
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
  // var topPos = el.getBoundingClientRect().top + window.scrollY;
  // var leftPos = el.getBoundingClientRect().left + window.scrollX;
  return {
    x: xPos,
    y: yPos
  };
}

function createAccessLinkBox(){
  // <div class="vw-links">
  //     <a href="">Acessar Link</a>
  //   </div>

  var template = require('./tooltip.html');
  
  
  let div = document.createElement('div');
  div.className = 'vw-links';
  div.innerHTML = template;
  document.body.appendChild(div);
}

AccessButton.prototype.divBox = function(linkContent, event){
  nodeAnchor = hasParent(linkContent, function (parent) { 
    // console.log('Node name: ' + parent.nodeName);
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
  // var showL = showLinks.bind(this);
  self = this;
  getAllNodeTexts(document.body, function (node) {
    if (vw.contains(node)) return;
    
    
    node.innerHTML = '<span>' + node.innerHTML + '</span>';

    const span = node.querySelector('span');
    span.classList.add('vw-text');

    
    span.addEventListener('click', function (e) {
      // e.stopPropagation();
      e.preventDefault();
      

      // vwProgress.style.width = 0;
      // VLibrasWeb.lastTextElement = this.parentNode;
      // showL(this);
      // self.showLinks(this);
      self.divBox(this, e);

      

      window.plugin.player.stop();
      window.plugin.player.translate(this.textContent);

      deactivateAll();

      this.classList.add('vw-text-active');
    });
  });
  createAccessLinkBox();
  this.vw_links = document.body.getElementsByClassName('vw-links')[0];
    // console.log('qusjaushausss');
    document.body.onclick = function(e){
      if(this.vw_links!= null){
        this.vw_links.firstChild.classList.remove('active');
      }
      // document.body.onclick = null;
      // console.log("Click to close");      
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
