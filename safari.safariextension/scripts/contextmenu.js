document.addEventListener('contextmenu', function(event) {
  safari.self.tab.setContextMenuEventUserInfo(event, window.getSelection().toString());
}, false);
