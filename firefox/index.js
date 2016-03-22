'use strict';

// Imports
let self = require('sdk/self');
let { Ci } = require('chrome');

let cm = require("sdk/context-menu");
let pm = require('sdk/page-mod');

let browser = require('sdk/window/utils').getMostRecentBrowserWindow();

//Globals
let app = {
  window: null,
  worker: null,
  selectedText: ""
};

// Context menu
cm.Item({
  label: "Traduzir para LIBRAS",
  context: cm.SelectionContext(),
  contentScript: 'self.on("context", function () {' +
                 '  var text = window.getSelection().toString();' +
                 '  if (text.length > 20)' +
                 '    text = text.substr(0, 20) + "...";' +
                 '  return "Traduzir \'" + text + "\' para LIBRAS";' +
                 '});' +
                 'self.on("click", function (node, data) {' +
                 '  self.postMessage( window.getSelection().toString() );' +
                 '});',
  onMessage: function(selectedText) {
    app.selectedText = selectedText;

    if ( !(app.window instanceof Ci.nsIDOMWindow) ) {
      app.window = browser.open(
        self.data.url('player/index.html'),
        'VLibras Plugin',
        'width=540,height=450,menubar=no,resizable=yes'
      );
    } else {
      app.worker.port.emit('selectedText', app.selectedText);
      app.window.focus();
    }
  }
});

// Page mod
pm.PageMod({
  include: self.data.url('player/index.html'),
  contentScriptWhen: 'end',
  contentScriptFile: self.data.url('delegator.js'),
  onAttach: function(worker) {
    app.worker = worker;

    app.worker.port.emit('selectedText', app.selectedText);

    app.worker.on('detach', function () {
      app.worker = undefined;
    });
  }
});
