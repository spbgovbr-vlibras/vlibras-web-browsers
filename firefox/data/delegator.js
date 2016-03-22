'use strict';

self.port.on('selectedText', function(selectedText) {
  var event = new CustomEvent('plugin:selectedText', { 'detail': selectedText });

  document.dispatchEvent(event);
});
