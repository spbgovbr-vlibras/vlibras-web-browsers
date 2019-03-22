/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	const window = __webpack_require__(1);

	const Plugin = __webpack_require__(2);
	const Widget = __webpack_require__(64);

	window.VLibras.Plugin = Plugin;
	window.VLibras.Widget = Widget;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = window;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var VLibras = __webpack_require__(3);

	var Settings = __webpack_require__(18);
	var SettingsBtn = __webpack_require__(28);
	var InfoScreen = __webpack_require__(32);
	var Dictionary = __webpack_require__(36);
	var Controls = __webpack_require__(42);
	var Progress = __webpack_require__(49);
	var MessageBox = __webpack_require__(53);
	var Box = __webpack_require__(56);
	var SettingsCloseBtn = __webpack_require__(60);


	function Plugin(option) {
	  this.player = new VLibras.Player({
	    progress: Progress
	  });

	  this.element = document.querySelector('[vp]');
	  this.settingBtnClose = new SettingsCloseBtn();
	  
	  this.dictionary = new Dictionary(this.player);
	  this.controls = new Controls(this.player, this.dictionary);
	  this.Box = new Box();
	  this.info = new InfoScreen(this.settingBtnClose);
	  this.settings = new Settings(this.player, this.info, this.settingBtnClose, this.Box, option);

	  this.settingsBtn = new SettingsBtn(this.player, this.settings, option);
	  this.messageBox = new MessageBox();
	  
	  this.loadingRef = null;

	  this.messageBox.load(this.element.querySelector('[vp-message-box]'));

	  this.player.load(this.element);

	  this.player.on('load', function () {
	    // Loading components
	    this.controls.load(this.element.querySelector('[vp-controls]'));
	    this.Box.load(this.element.querySelector('[vp-box]'));
	    this.settingBtnClose.load(this.element.querySelector('[vp-box]').querySelector('[settings-btn-close]'))
	    this.settingsBtn.load(this.element.querySelector('[vp-box]').querySelector('[settings-btn]'));
	    
	    this.settings.load(this.element.querySelector('[vp-settings]'));    
	    this.info.load(this.element.querySelector('[vp-info-screen]'));
	    // this.dictionary.load(this.element.querySelector('[vp-dictionary]'));
	    

	  }.bind(this));

	  this.info.on('show', function () {
	    this.player.pause();
	  }.bind(this));

	  this.player.on('translate:start', function () {
	    this.loadingRef = this.messageBox.show('info', 'Traduzindo...');
	  }.bind(this));

	  this.player.on('translate:end', function () {
	    this.messageBox.hide(this.loadingRef);
	  }.bind(this));

	  this.player.on('error', function (err) {
	    switch(err) {
	      case 'compatibility_error':
	        this.messageBox.show(
	          'warning',
	          'O seu computador não suporta o WebGL. Por favor, atualize os drivers de vídeo.'
	        );
	        break;
	      case 'translation_error':
	        this.messageBox.show(
	          'warning',
	          'Não foi possivel traduzir. Por favor, verifique sua internet.',
	          3000
	        );
	        break;
	      case 'internal_error':
	        this.messageBox.show(
	          'warning',
	          'Ops! Ocorreu um problema, por favor entre em contato com a gente.'
	        );
	        break;
	    }
	  }.bind(this));
	};

	Plugin.prototype.translate = function (text) {
	  this.player.translate(text);
	};

	module.exports = Plugin;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	var window = __webpack_require__(1);
	var Player = __webpack_require__(4);

	var VLibras = {
	  Player: Player
	};

	window.VLibras = VLibras;
	module.exports = VLibras;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	var window = __webpack_require__(1);
	var document = window.document;

	var assign = __webpack_require__(5);
	var inherits = __webpack_require__(6);
	var path = __webpack_require__(7);

	var EventEmitter = __webpack_require__(9).EventEmitter;
	var PlayerManagerAdapter = __webpack_require__(10);
	var GlosaTranslator = __webpack_require__(11);

	function Player(options) {
	  this.options = assign({
	    translator: 'http://35.232.189.139:8080/translate',
	    targetPath: 'target',
	  }, options);

	  this.playerManager = new PlayerManagerAdapter();
	  this.translator = new GlosaTranslator(this.options.translator);

	  this.glosa = undefined;
	  this.loaded = false;
	  this.progress = null;
	  this.gameContainer = null;
	  this.player = null;

	  this.playerManager.on('load', () => {
	    this.loaded = true;
	    this.emit('load');
	    this.play();
	  });

	  this.playerManager.on('progress', (progress) => {
	    this.emit('animation:progress', progress);
	  });

	  this.playerManager.on('stateChange', (isPlaying, isPaused, isLoading) => {
	    if (isPaused) {
	      this.emit('animation:pause');
	    } else if (isPlaying && !isPaused) {
	      this.emit('animation:play');
	    } else if (!isPlaying && !isLoading) {
	      this.emit('animation:end');
	    }
	  });
	}

	inherits(Player, EventEmitter);

	Player.prototype.translate = function (text) {
	  this.emit('translate:start');
	  if (this.loaded) this.stop();
	  this.translator.translate(text, function (gloss, err) {
	    if (err) {
	      this.emit('error', 'translation_error');
	      this.play(text.toUpperCase());
	      return;
	    }

	    console.log('Translator answer:', gloss);
	    this.play(gloss);
	    this.emit('translate:end');
	  }.bind(this));
	};

	Player.prototype.play = function (glosa) {
	  this.glosa = glosa || this.glosa;
	  if (this.glosa !== undefined && this.loaded) {
	    this.playerManager.play(this.glosa);
	  }
	};

	Player.prototype.continue = function () {
	  this.playerManager.play();
	};

	Player.prototype.repeat = function () {
	  this.play();
	};

	Player.prototype.pause = function () {
	  this.playerManager.pause();
	};

	Player.prototype.stop = function () {
	  this.playerManager.stop();
	};

	Player.prototype.setSpeed = function (speed) {
	  this.playerManager.setSpeed(speed);
	};

	Player.prototype.toggleSubtitle = function () {
	  this.playerManager.toggleSubtitle();
	};

	Player.prototype.setRegion = function (region) {
	  this.playerManager.setRegion(region);
	};

	Player.prototype.load = function (wrapper) {
	  this.gameContainer = document.createElement('div');
	  this.gameContainer.setAttribute("id", "gameContainer");
	  this.gameContainer.classList.add('emscripten');

	  if ('function' == typeof this.options.progress) {
	    this.progress = new this.options.progress(wrapper);
	  }

	  wrapper.appendChild(this.gameContainer);

	  this._initializeTarget();
	};

	Player.prototype._getTargetScript = function () {
	  return path.join(this.options.targetPath, 'UnityLoader.js');
	};

	Player.prototype._initializeTarget = function () {
	  const targetSetup = path.join(this.options.targetPath, 'playerweb.json');
	  const targetScript = document.createElement('script');

	  targetScript.src = this._getTargetScript();
	  targetScript.onload = () => {
	    this.player = UnityLoader.instantiate("gameContainer", targetSetup);
	    this.playerManager.setPlayerReference(this.player);
	  };

	  document.body.appendChild(targetScript);
	};

	module.exports = Player;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

	/*
	object-assign
	(c) Sindre Sorhus
	@license MIT
	*/

	'use strict';
	/* eslint-disable no-unused-vars */
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (err) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (getOwnPropertySymbols) {
				symbols = getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// resolves . and .. elements in a path array with directory names there
	// must be no slashes, empty elements, or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	function normalizeArray(parts, allowAboveRoot) {
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = parts.length - 1; i >= 0; i--) {
	    var last = parts[i];
	    if (last === '.') {
	      parts.splice(i, 1);
	    } else if (last === '..') {
	      parts.splice(i, 1);
	      up++;
	    } else if (up) {
	      parts.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (allowAboveRoot) {
	    for (; up--; up) {
	      parts.unshift('..');
	    }
	  }

	  return parts;
	}

	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	var splitPathRe =
	    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	var splitPath = function(filename) {
	  return splitPathRe.exec(filename).slice(1);
	};

	// path.resolve([from ...], to)
	// posix version
	exports.resolve = function() {
	  var resolvedPath = '',
	      resolvedAbsolute = false;

	  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	    var path = (i >= 0) ? arguments[i] : process.cwd();

	    // Skip empty and invalid entries
	    if (typeof path !== 'string') {
	      throw new TypeError('Arguments to path.resolve must be strings');
	    } else if (!path) {
	      continue;
	    }

	    resolvedPath = path + '/' + resolvedPath;
	    resolvedAbsolute = path.charAt(0) === '/';
	  }

	  // At this point the path should be resolved to a full absolute path, but
	  // handle relative paths to be safe (might happen when process.cwd() fails)

	  // Normalize the path
	  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
	    return !!p;
	  }), !resolvedAbsolute).join('/');

	  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
	};

	// path.normalize(path)
	// posix version
	exports.normalize = function(path) {
	  var isAbsolute = exports.isAbsolute(path),
	      trailingSlash = substr(path, -1) === '/';

	  // Normalize the path
	  path = normalizeArray(filter(path.split('/'), function(p) {
	    return !!p;
	  }), !isAbsolute).join('/');

	  if (!path && !isAbsolute) {
	    path = '.';
	  }
	  if (path && trailingSlash) {
	    path += '/';
	  }

	  return (isAbsolute ? '/' : '') + path;
	};

	// posix version
	exports.isAbsolute = function(path) {
	  return path.charAt(0) === '/';
	};

	// posix version
	exports.join = function() {
	  var paths = Array.prototype.slice.call(arguments, 0);
	  return exports.normalize(filter(paths, function(p, index) {
	    if (typeof p !== 'string') {
	      throw new TypeError('Arguments to path.join must be strings');
	    }
	    return p;
	  }).join('/'));
	};


	// path.relative(from, to)
	// posix version
	exports.relative = function(from, to) {
	  from = exports.resolve(from).substr(1);
	  to = exports.resolve(to).substr(1);

	  function trim(arr) {
	    var start = 0;
	    for (; start < arr.length; start++) {
	      if (arr[start] !== '') break;
	    }

	    var end = arr.length - 1;
	    for (; end >= 0; end--) {
	      if (arr[end] !== '') break;
	    }

	    if (start > end) return [];
	    return arr.slice(start, end - start + 1);
	  }

	  var fromParts = trim(from.split('/'));
	  var toParts = trim(to.split('/'));

	  var length = Math.min(fromParts.length, toParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (fromParts[i] !== toParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }

	  var outputParts = [];
	  for (var i = samePartsLength; i < fromParts.length; i++) {
	    outputParts.push('..');
	  }

	  outputParts = outputParts.concat(toParts.slice(samePartsLength));

	  return outputParts.join('/');
	};

	exports.sep = '/';
	exports.delimiter = ':';

	exports.dirname = function(path) {
	  var result = splitPath(path),
	      root = result[0],
	      dir = result[1];

	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }

	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }

	  return root + dir;
	};


	exports.basename = function(path, ext) {
	  var f = splitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};


	exports.extname = function(path) {
	  return splitPath(path)[3];
	};

	function filter (xs, f) {
	    if (xs.filter) return xs.filter(f);
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        if (f(xs[i], i, xs)) res.push(xs[i]);
	    }
	    return res;
	}

	// String.prototype.substr - negative index don't work in IE8
	var substr = 'ab'.substr(-1) === 'b'
	    ? function (str, start, len) { return str.substr(start, len) }
	    : function (str, start, len) {
	        if (start < 0) start = str.length + start;
	        return str.substr(start, len);
	    }
	;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;

	process.listeners = function (name) { return [] }

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),
/* 9 */
/***/ (function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      } else {
	        // At least give some kind of context to the user
	        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
	        err.context = er;
	        throw err;
	      }
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	var window = __webpack_require__(1);
	var inherits = __webpack_require__(6);
	var EventEmitter = __webpack_require__(9).EventEmitter;

	var GAME_OBJECT = 'PlayerManager';

	function PlayerManagerAdapter() {
	  if (PlayerManagerAdapter.instance) return PlayerManagerAdapter.instance;

	  this.subtitle = true;

	  this.on('load', function () {
	    this._send('initRandomAnimationsProcess');
	  }.bind(this));

	  PlayerManagerAdapter.instance = this;
	}

	inherits(PlayerManagerAdapter, EventEmitter);

	PlayerManagerAdapter.prototype.setPlayerReference = function (player) {
	  this.player = player;
	};

	PlayerManagerAdapter.prototype._send = function (method, params) {
	  this.player.SendMessage(GAME_OBJECT, method, params);
	};

	PlayerManagerAdapter.prototype.play = function (glosa) {
	  if (glosa) {
	    this._send('playNow', glosa);
	  } else {
	    this._send('setPauseState', 0);
	  }
	};

	PlayerManagerAdapter.prototype.pause = function () {
	  this._send('setPauseState', 1);
	};

	PlayerManagerAdapter.prototype.stop = function () {
	  this._send('stopAll');
	};

	PlayerManagerAdapter.prototype.setSpeed = function (speed) {
	  this._send('setSlider', speed);
	};

	PlayerManagerAdapter.prototype.toggleSubtitle = function () {
	  this.subtitle = !this.subtitle;
	  this._send('setSubtitlesState', toInt(this.subtitle));
	};

	PlayerManagerAdapter.prototype.setRegion = function (region) {
	  this._send('setRegion', region);
	};

	window.onLoadPlayer = function () {
	  PlayerManagerAdapter.instance.emit('load');
	};

	window.updateProgress = function (progress) {
	  PlayerManagerAdapter.instance.emit('progress', progress);
	};

	window.onPlayingStateChange = function (
	  isPlaying, isPaused, isPlayingIntervalAnimation, isLoading, isRepeatable) {
	  PlayerManagerAdapter.instance.emit(
	    'stateChange', toBoolean(isPlaying), toBoolean(isPaused), toBoolean(isLoading)
	  );
	};

	function toInt(boolean) {
	  return !boolean ? 0 : 1;
	};

	function toBoolean(bool) {
	  return bool != 'False';
	};

	module.exports = PlayerManagerAdapter;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	var request = __webpack_require__(12);

	function GlosaTranslator(endpoint) {
	  this.endpoint = endpoint;
	}

	GlosaTranslator.prototype.translate = function (text, callback) {
	  console.log('GT.t:', 'Text: ' + text);

	  request.get(this.endpoint).query({ text: text }).end(
	    function (err, response) {
	      if (err) {
	        callback(undefined, err);
	        return;
	      }

	      callback(response.text);
	    }
	  );
	};

	module.exports = GlosaTranslator;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var Emitter = __webpack_require__(13);
	var reduce = __webpack_require__(14);
	var requestBase = __webpack_require__(15);
	var isObject = __webpack_require__(16);

	/**
	 * Root reference for iframes.
	 */

	var root;
	if (typeof window !== 'undefined') { // Browser window
	  root = window;
	} else if (typeof self !== 'undefined') { // Web Worker
	  root = self;
	} else { // Other environments
	  root = this;
	}

	/**
	 * Noop.
	 */

	function noop(){};

	/**
	 * Check if `obj` is a host object,
	 * we don't want to serialize these :)
	 *
	 * TODO: future proof, move to compoent land
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */

	function isHost(obj) {
	  var str = {}.toString.call(obj);

	  switch (str) {
	    case '[object File]':
	    case '[object Blob]':
	    case '[object FormData]':
	      return true;
	    default:
	      return false;
	  }
	}

	/**
	 * Expose `request`.
	 */

	var request = module.exports = __webpack_require__(17).bind(null, Request);

	/**
	 * Determine XHR.
	 */

	request.getXHR = function () {
	  if (root.XMLHttpRequest
	      && (!root.location || 'file:' != root.location.protocol
	          || !root.ActiveXObject)) {
	    return new XMLHttpRequest;
	  } else {
	    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
	  }
	  return false;
	};

	/**
	 * Removes leading and trailing whitespace, added to support IE.
	 *
	 * @param {String} s
	 * @return {String}
	 * @api private
	 */

	var trim = ''.trim
	  ? function(s) { return s.trim(); }
	  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

	/**
	 * Serialize the given `obj`.
	 *
	 * @param {Object} obj
	 * @return {String}
	 * @api private
	 */

	function serialize(obj) {
	  if (!isObject(obj)) return obj;
	  var pairs = [];
	  for (var key in obj) {
	    if (null != obj[key]) {
	      pushEncodedKeyValuePair(pairs, key, obj[key]);
	        }
	      }
	  return pairs.join('&');
	}

	/**
	 * Helps 'serialize' with serializing arrays.
	 * Mutates the pairs array.
	 *
	 * @param {Array} pairs
	 * @param {String} key
	 * @param {Mixed} val
	 */

	function pushEncodedKeyValuePair(pairs, key, val) {
	  if (Array.isArray(val)) {
	    return val.forEach(function(v) {
	      pushEncodedKeyValuePair(pairs, key, v);
	    });
	  }
	  pairs.push(encodeURIComponent(key)
	    + '=' + encodeURIComponent(val));
	}

	/**
	 * Expose serialization method.
	 */

	 request.serializeObject = serialize;

	 /**
	  * Parse the given x-www-form-urlencoded `str`.
	  *
	  * @param {String} str
	  * @return {Object}
	  * @api private
	  */

	function parseString(str) {
	  var obj = {};
	  var pairs = str.split('&');
	  var parts;
	  var pair;

	  for (var i = 0, len = pairs.length; i < len; ++i) {
	    pair = pairs[i];
	    parts = pair.split('=');
	    obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
	  }

	  return obj;
	}

	/**
	 * Expose parser.
	 */

	request.parseString = parseString;

	/**
	 * Default MIME type map.
	 *
	 *     superagent.types.xml = 'application/xml';
	 *
	 */

	request.types = {
	  html: 'text/html',
	  json: 'application/json',
	  xml: 'application/xml',
	  urlencoded: 'application/x-www-form-urlencoded',
	  'form': 'application/x-www-form-urlencoded',
	  'form-data': 'application/x-www-form-urlencoded'
	};

	/**
	 * Default serialization map.
	 *
	 *     superagent.serialize['application/xml'] = function(obj){
	 *       return 'generated xml here';
	 *     };
	 *
	 */

	 request.serialize = {
	   'application/x-www-form-urlencoded': serialize,
	   'application/json': JSON.stringify
	 };

	 /**
	  * Default parsers.
	  *
	  *     superagent.parse['application/xml'] = function(str){
	  *       return { object parsed from str };
	  *     };
	  *
	  */

	request.parse = {
	  'application/x-www-form-urlencoded': parseString,
	  'application/json': JSON.parse
	};

	/**
	 * Parse the given header `str` into
	 * an object containing the mapped fields.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */

	function parseHeader(str) {
	  var lines = str.split(/\r?\n/);
	  var fields = {};
	  var index;
	  var line;
	  var field;
	  var val;

	  lines.pop(); // trailing CRLF

	  for (var i = 0, len = lines.length; i < len; ++i) {
	    line = lines[i];
	    index = line.indexOf(':');
	    field = line.slice(0, index).toLowerCase();
	    val = trim(line.slice(index + 1));
	    fields[field] = val;
	  }

	  return fields;
	}

	/**
	 * Check if `mime` is json or has +json structured syntax suffix.
	 *
	 * @param {String} mime
	 * @return {Boolean}
	 * @api private
	 */

	function isJSON(mime) {
	  return /[\/+]json\b/.test(mime);
	}

	/**
	 * Return the mime type for the given `str`.
	 *
	 * @param {String} str
	 * @return {String}
	 * @api private
	 */

	function type(str){
	  return str.split(/ *; */).shift();
	};

	/**
	 * Return header field parameters.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */

	function params(str){
	  return reduce(str.split(/ *; */), function(obj, str){
	    var parts = str.split(/ *= */)
	      , key = parts.shift()
	      , val = parts.shift();

	    if (key && val) obj[key] = val;
	    return obj;
	  }, {});
	};

	/**
	 * Initialize a new `Response` with the given `xhr`.
	 *
	 *  - set flags (.ok, .error, etc)
	 *  - parse header
	 *
	 * Examples:
	 *
	 *  Aliasing `superagent` as `request` is nice:
	 *
	 *      request = superagent;
	 *
	 *  We can use the promise-like API, or pass callbacks:
	 *
	 *      request.get('/').end(function(res){});
	 *      request.get('/', function(res){});
	 *
	 *  Sending data can be chained:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' })
	 *        .end(function(res){});
	 *
	 *  Or passed to `.send()`:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' }, function(res){});
	 *
	 *  Or passed to `.post()`:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' })
	 *        .end(function(res){});
	 *
	 * Or further reduced to a single call for simple cases:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' }, function(res){});
	 *
	 * @param {XMLHTTPRequest} xhr
	 * @param {Object} options
	 * @api private
	 */

	function Response(req, options) {
	  options = options || {};
	  this.req = req;
	  this.xhr = this.req.xhr;
	  // responseText is accessible only if responseType is '' or 'text' and on older browsers
	  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
	     ? this.xhr.responseText
	     : null;
	  this.statusText = this.req.xhr.statusText;
	  this.setStatusProperties(this.xhr.status);
	  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
	  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
	  // getResponseHeader still works. so we get content-type even if getting
	  // other headers fails.
	  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
	  this.setHeaderProperties(this.header);
	  this.body = this.req.method != 'HEAD'
	    ? this.parseBody(this.text ? this.text : this.xhr.response)
	    : null;
	}

	/**
	 * Get case-insensitive `field` value.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api public
	 */

	Response.prototype.get = function(field){
	  return this.header[field.toLowerCase()];
	};

	/**
	 * Set header related properties:
	 *
	 *   - `.type` the content type without params
	 *
	 * A response of "Content-Type: text/plain; charset=utf-8"
	 * will provide you with a `.type` of "text/plain".
	 *
	 * @param {Object} header
	 * @api private
	 */

	Response.prototype.setHeaderProperties = function(header){
	  // content-type
	  var ct = this.header['content-type'] || '';
	  this.type = type(ct);

	  // params
	  var obj = params(ct);
	  for (var key in obj) this[key] = obj[key];
	};

	/**
	 * Parse the given body `str`.
	 *
	 * Used for auto-parsing of bodies. Parsers
	 * are defined on the `superagent.parse` object.
	 *
	 * @param {String} str
	 * @return {Mixed}
	 * @api private
	 */

	Response.prototype.parseBody = function(str){
	  var parse = request.parse[this.type];
	  if (!parse && isJSON(this.type)) {
	    parse = request.parse['application/json'];
	  }
	  return parse && str && (str.length || str instanceof Object)
	    ? parse(str)
	    : null;
	};

	/**
	 * Set flags such as `.ok` based on `status`.
	 *
	 * For example a 2xx response will give you a `.ok` of __true__
	 * whereas 5xx will be __false__ and `.error` will be __true__. The
	 * `.clientError` and `.serverError` are also available to be more
	 * specific, and `.statusType` is the class of error ranging from 1..5
	 * sometimes useful for mapping respond colors etc.
	 *
	 * "sugar" properties are also defined for common cases. Currently providing:
	 *
	 *   - .noContent
	 *   - .badRequest
	 *   - .unauthorized
	 *   - .notAcceptable
	 *   - .notFound
	 *
	 * @param {Number} status
	 * @api private
	 */

	Response.prototype.setStatusProperties = function(status){
	  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
	  if (status === 1223) {
	    status = 204;
	  }

	  var type = status / 100 | 0;

	  // status / class
	  this.status = this.statusCode = status;
	  this.statusType = type;

	  // basics
	  this.info = 1 == type;
	  this.ok = 2 == type;
	  this.clientError = 4 == type;
	  this.serverError = 5 == type;
	  this.error = (4 == type || 5 == type)
	    ? this.toError()
	    : false;

	  // sugar
	  this.accepted = 202 == status;
	  this.noContent = 204 == status;
	  this.badRequest = 400 == status;
	  this.unauthorized = 401 == status;
	  this.notAcceptable = 406 == status;
	  this.notFound = 404 == status;
	  this.forbidden = 403 == status;
	};

	/**
	 * Return an `Error` representative of this response.
	 *
	 * @return {Error}
	 * @api public
	 */

	Response.prototype.toError = function(){
	  var req = this.req;
	  var method = req.method;
	  var url = req.url;

	  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
	  var err = new Error(msg);
	  err.status = this.status;
	  err.method = method;
	  err.url = url;

	  return err;
	};

	/**
	 * Expose `Response`.
	 */

	request.Response = Response;

	/**
	 * Initialize a new `Request` with the given `method` and `url`.
	 *
	 * @param {String} method
	 * @param {String} url
	 * @api public
	 */

	function Request(method, url) {
	  var self = this;
	  this._query = this._query || [];
	  this.method = method;
	  this.url = url;
	  this.header = {}; // preserves header name case
	  this._header = {}; // coerces header names to lowercase
	  this.on('end', function(){
	    var err = null;
	    var res = null;

	    try {
	      res = new Response(self);
	    } catch(e) {
	      err = new Error('Parser is unable to parse the response');
	      err.parse = true;
	      err.original = e;
	      // issue #675: return the raw response if the response parsing fails
	      err.rawResponse = self.xhr && self.xhr.responseText ? self.xhr.responseText : null;
	      // issue #876: return the http status code if the response parsing fails
	      err.statusCode = self.xhr && self.xhr.status ? self.xhr.status : null;
	      return self.callback(err);
	    }

	    self.emit('response', res);

	    if (err) {
	      return self.callback(err, res);
	    }

	    if (res.status >= 200 && res.status < 300) {
	      return self.callback(err, res);
	    }

	    var new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
	    new_err.original = err;
	    new_err.response = res;
	    new_err.status = res.status;

	    self.callback(new_err, res);
	  });
	}

	/**
	 * Mixin `Emitter` and `requestBase`.
	 */

	Emitter(Request.prototype);
	for (var key in requestBase) {
	  Request.prototype[key] = requestBase[key];
	}

	/**
	 * Abort the request, and clear potential timeout.
	 *
	 * @return {Request}
	 * @api public
	 */

	Request.prototype.abort = function(){
	  if (this.aborted) return;
	  this.aborted = true;
	  this.xhr && this.xhr.abort();
	  this.clearTimeout();
	  this.emit('abort');
	  return this;
	};

	/**
	 * Set Content-Type to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.xml = 'application/xml';
	 *
	 *      request.post('/')
	 *        .type('xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 *      request.post('/')
	 *        .type('application/xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 * @param {String} type
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.type = function(type){
	  this.set('Content-Type', request.types[type] || type);
	  return this;
	};

	/**
	 * Set responseType to `val`. Presently valid responseTypes are 'blob' and 
	 * 'arraybuffer'.
	 *
	 * Examples:
	 *
	 *      req.get('/')
	 *        .responseType('blob')
	 *        .end(callback);
	 *
	 * @param {String} val
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.responseType = function(val){
	  this._responseType = val;
	  return this;
	};

	/**
	 * Set Accept to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.json = 'application/json';
	 *
	 *      request.get('/agent')
	 *        .accept('json')
	 *        .end(callback);
	 *
	 *      request.get('/agent')
	 *        .accept('application/json')
	 *        .end(callback);
	 *
	 * @param {String} accept
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.accept = function(type){
	  this.set('Accept', request.types[type] || type);
	  return this;
	};

	/**
	 * Set Authorization field value with `user` and `pass`.
	 *
	 * @param {String} user
	 * @param {String} pass
	 * @param {Object} options with 'type' property 'auto' or 'basic' (default 'basic')
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.auth = function(user, pass, options){
	  if (!options) {
	    options = {
	      type: 'basic'
	    }
	  }

	  switch (options.type) {
	    case 'basic':
	      var str = btoa(user + ':' + pass);
	      this.set('Authorization', 'Basic ' + str);
	    break;

	    case 'auto':
	      this.username = user;
	      this.password = pass;
	    break;
	  }
	  return this;
	};

	/**
	* Add query-string `val`.
	*
	* Examples:
	*
	*   request.get('/shoes')
	*     .query('size=10')
	*     .query({ color: 'blue' })
	*
	* @param {Object|String} val
	* @return {Request} for chaining
	* @api public
	*/

	Request.prototype.query = function(val){
	  if ('string' != typeof val) val = serialize(val);
	  if (val) this._query.push(val);
	  return this;
	};

	/**
	 * Queue the given `file` as an attachment to the specified `field`,
	 * with optional `filename`.
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .attach(new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
	 *   .end(callback);
	 * ```
	 *
	 * @param {String} field
	 * @param {Blob|File} file
	 * @param {String} filename
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.attach = function(field, file, filename){
	  this._getFormData().append(field, file, filename || file.name);
	  return this;
	};

	Request.prototype._getFormData = function(){
	  if (!this._formData) {
	    this._formData = new root.FormData();
	  }
	  return this._formData;
	};

	/**
	 * Send `data` as the request body, defaulting the `.type()` to "json" when
	 * an object is given.
	 *
	 * Examples:
	 *
	 *       // manual json
	 *       request.post('/user')
	 *         .type('json')
	 *         .send('{"name":"tj"}')
	 *         .end(callback)
	 *
	 *       // auto json
	 *       request.post('/user')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // manual x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send('name=tj')
	 *         .end(callback)
	 *
	 *       // auto x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // defaults to x-www-form-urlencoded
	  *      request.post('/user')
	  *        .send('name=tobi')
	  *        .send('species=ferret')
	  *        .end(callback)
	 *
	 * @param {String|Object} data
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.send = function(data){
	  var obj = isObject(data);
	  var type = this._header['content-type'];

	  // merge
	  if (obj && isObject(this._data)) {
	    for (var key in data) {
	      this._data[key] = data[key];
	    }
	  } else if ('string' == typeof data) {
	    if (!type) this.type('form');
	    type = this._header['content-type'];
	    if ('application/x-www-form-urlencoded' == type) {
	      this._data = this._data
	        ? this._data + '&' + data
	        : data;
	    } else {
	      this._data = (this._data || '') + data;
	    }
	  } else {
	    this._data = data;
	  }

	  if (!obj || isHost(data)) return this;
	  if (!type) this.type('json');
	  return this;
	};

	/**
	 * @deprecated
	 */
	Response.prototype.parse = function serialize(fn){
	  if (root.console) {
	    console.warn("Client-side parse() method has been renamed to serialize(). This method is not compatible with superagent v2.0");
	  }
	  this.serialize(fn);
	  return this;
	};

	Response.prototype.serialize = function serialize(fn){
	  this._parser = fn;
	  return this;
	};

	/**
	 * Invoke the callback with `err` and `res`
	 * and handle arity check.
	 *
	 * @param {Error} err
	 * @param {Response} res
	 * @api private
	 */

	Request.prototype.callback = function(err, res){
	  var fn = this._callback;
	  this.clearTimeout();
	  fn(err, res);
	};

	/**
	 * Invoke callback with x-domain error.
	 *
	 * @api private
	 */

	Request.prototype.crossDomainError = function(){
	  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
	  err.crossDomain = true;

	  err.status = this.status;
	  err.method = this.method;
	  err.url = this.url;

	  this.callback(err);
	};

	/**
	 * Invoke callback with timeout error.
	 *
	 * @api private
	 */

	Request.prototype.timeoutError = function(){
	  var timeout = this._timeout;
	  var err = new Error('timeout of ' + timeout + 'ms exceeded');
	  err.timeout = timeout;
	  this.callback(err);
	};

	/**
	 * Enable transmission of cookies with x-domain requests.
	 *
	 * Note that for this to work the origin must not be
	 * using "Access-Control-Allow-Origin" with a wildcard,
	 * and also must set "Access-Control-Allow-Credentials"
	 * to "true".
	 *
	 * @api public
	 */

	Request.prototype.withCredentials = function(){
	  this._withCredentials = true;
	  return this;
	};

	/**
	 * Initiate request, invoking callback `fn(res)`
	 * with an instanceof `Response`.
	 *
	 * @param {Function} fn
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.end = function(fn){
	  var self = this;
	  var xhr = this.xhr = request.getXHR();
	  var query = this._query.join('&');
	  var timeout = this._timeout;
	  var data = this._formData || this._data;

	  // store callback
	  this._callback = fn || noop;

	  // state change
	  xhr.onreadystatechange = function(){
	    if (4 != xhr.readyState) return;

	    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
	    // result in the error "Could not complete the operation due to error c00c023f"
	    var status;
	    try { status = xhr.status } catch(e) { status = 0; }

	    if (0 == status) {
	      if (self.timedout) return self.timeoutError();
	      if (self.aborted) return;
	      return self.crossDomainError();
	    }
	    self.emit('end');
	  };

	  // progress
	  var handleProgress = function(e){
	    if (e.total > 0) {
	      e.percent = e.loaded / e.total * 100;
	    }
	    e.direction = 'download';
	    self.emit('progress', e);
	  };
	  if (this.hasListeners('progress')) {
	    xhr.onprogress = handleProgress;
	  }
	  try {
	    if (xhr.upload && this.hasListeners('progress')) {
	      xhr.upload.onprogress = handleProgress;
	    }
	  } catch(e) {
	    // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
	    // Reported here:
	    // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
	  }

	  // timeout
	  if (timeout && !this._timer) {
	    this._timer = setTimeout(function(){
	      self.timedout = true;
	      self.abort();
	    }, timeout);
	  }

	  // querystring
	  if (query) {
	    query = request.serializeObject(query);
	    this.url += ~this.url.indexOf('?')
	      ? '&' + query
	      : '?' + query;
	  }

	  // initiate request
	  if (this.username && this.password) {
	    xhr.open(this.method, this.url, true, this.username, this.password);
	  } else {
	    xhr.open(this.method, this.url, true);
	  }

	  // CORS
	  if (this._withCredentials) xhr.withCredentials = true;

	  // body
	  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !isHost(data)) {
	    // serialize stuff
	    var contentType = this._header['content-type'];
	    var serialize = this._parser || request.serialize[contentType ? contentType.split(';')[0] : ''];
	    if (!serialize && isJSON(contentType)) serialize = request.serialize['application/json'];
	    if (serialize) data = serialize(data);
	  }

	  // set header fields
	  for (var field in this.header) {
	    if (null == this.header[field]) continue;
	    xhr.setRequestHeader(field, this.header[field]);
	  }

	  if (this._responseType) {
	    xhr.responseType = this._responseType;
	  }

	  // send stuff
	  this.emit('request', this);

	  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
	  // We need null here if data is undefined
	  xhr.send(typeof data !== 'undefined' ? data : null);
	  return this;
	};


	/**
	 * Expose `Request`.
	 */

	request.Request = Request;

	/**
	 * GET `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} data or fn
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.get = function(url, data, fn){
	  var req = request('GET', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.query(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * HEAD `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} data or fn
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.head = function(url, data, fn){
	  var req = request('HEAD', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * DELETE `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	function del(url, fn){
	  var req = request('DELETE', url);
	  if (fn) req.end(fn);
	  return req;
	};

	request['del'] = del;
	request['delete'] = del;

	/**
	 * PATCH `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} data
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.patch = function(url, data, fn){
	  var req = request('PATCH', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * POST `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} data
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.post = function(url, data, fn){
	  var req = request('POST', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * PUT `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} data or fn
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.put = function(url, data, fn){
	  var req = request('PUT', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	
	/**
	 * Expose `Emitter`.
	 */

	if (true) {
	  module.exports = Emitter;
	}

	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */

	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};

	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */

	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}

	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
	    .push(fn);
	  return this;
	};

	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.once = function(event, fn){
	  function on() {
	    this.off(event, on);
	    fn.apply(this, arguments);
	  }

	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};

	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};

	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }

	  // specific event
	  var callbacks = this._callbacks['$' + event];
	  if (!callbacks) return this;

	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks['$' + event];
	    return this;
	  }

	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};

	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */

	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks['$' + event];

	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }

	  return this;
	};

	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */

	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks['$' + event] || [];
	};

	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */

	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

	
	/**
	 * Reduce `arr` with `fn`.
	 *
	 * @param {Array} arr
	 * @param {Function} fn
	 * @param {Mixed} initial
	 *
	 * TODO: combatible error handling?
	 */

	module.exports = function(arr, fn, initial){  
	  var idx = 0;
	  var len = arr.length;
	  var curr = arguments.length == 3
	    ? initial
	    : arr[idx++];

	  while (idx < len) {
	    curr = fn.call(null, curr, arr[idx], ++idx, arr);
	  }
	  
	  return curr;
	};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Module of mixed-in functions shared between node and client code
	 */
	var isObject = __webpack_require__(16);

	/**
	 * Clear previous timeout.
	 *
	 * @return {Request} for chaining
	 * @api public
	 */

	exports.clearTimeout = function _clearTimeout(){
	  this._timeout = 0;
	  clearTimeout(this._timer);
	  return this;
	};

	/**
	 * Force given parser
	 *
	 * Sets the body parser no matter type.
	 *
	 * @param {Function}
	 * @api public
	 */

	exports.parse = function parse(fn){
	  this._parser = fn;
	  return this;
	};

	/**
	 * Set timeout to `ms`.
	 *
	 * @param {Number} ms
	 * @return {Request} for chaining
	 * @api public
	 */

	exports.timeout = function timeout(ms){
	  this._timeout = ms;
	  return this;
	};

	/**
	 * Faux promise support
	 *
	 * @param {Function} fulfill
	 * @param {Function} reject
	 * @return {Request}
	 */

	exports.then = function then(fulfill, reject) {
	  return this.end(function(err, res) {
	    err ? reject(err) : fulfill(res);
	  });
	}

	/**
	 * Allow for extension
	 */

	exports.use = function use(fn) {
	  fn(this);
	  return this;
	}


	/**
	 * Get request header `field`.
	 * Case-insensitive.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api public
	 */

	exports.get = function(field){
	  return this._header[field.toLowerCase()];
	};

	/**
	 * Get case-insensitive header `field` value.
	 * This is a deprecated internal API. Use `.get(field)` instead.
	 *
	 * (getHeader is no longer used internally by the superagent code base)
	 *
	 * @param {String} field
	 * @return {String}
	 * @api private
	 * @deprecated
	 */

	exports.getHeader = exports.get;

	/**
	 * Set header `field` to `val`, or multiple fields with one object.
	 * Case-insensitive.
	 *
	 * Examples:
	 *
	 *      req.get('/')
	 *        .set('Accept', 'application/json')
	 *        .set('X-API-Key', 'foobar')
	 *        .end(callback);
	 *
	 *      req.get('/')
	 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
	 *        .end(callback);
	 *
	 * @param {String|Object} field
	 * @param {String} val
	 * @return {Request} for chaining
	 * @api public
	 */

	exports.set = function(field, val){
	  if (isObject(field)) {
	    for (var key in field) {
	      this.set(key, field[key]);
	    }
	    return this;
	  }
	  this._header[field.toLowerCase()] = val;
	  this.header[field] = val;
	  return this;
	};

	/**
	 * Remove header `field`.
	 * Case-insensitive.
	 *
	 * Example:
	 *
	 *      req.get('/')
	 *        .unset('User-Agent')
	 *        .end(callback);
	 *
	 * @param {String} field
	 */
	exports.unset = function(field){
	  delete this._header[field.toLowerCase()];
	  delete this.header[field];
	  return this;
	};

	/**
	 * Write the field `name` and `val` for "multipart/form-data"
	 * request bodies.
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .field('foo', 'bar')
	 *   .end(callback);
	 * ```
	 *
	 * @param {String} name
	 * @param {String|Blob|File|Buffer|fs.ReadStream} val
	 * @return {Request} for chaining
	 * @api public
	 */
	exports.field = function(name, val) {
	  this._getFormData().append(name, val);
	  return this;
	};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

	/**
	 * Check if `obj` is an object.
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */

	function isObject(obj) {
	  return null != obj && 'object' == typeof obj;
	}

	module.exports = isObject;


/***/ }),
/* 17 */
/***/ (function(module, exports) {

	// The node and browser modules expose versions of this with the
	// appropriate constructor function bound as first argument
	/**
	 * Issue a request:
	 *
	 * Examples:
	 *
	 *    request('GET', '/users').end(callback)
	 *    request('/users').end(callback)
	 *    request('/users', callback)
	 *
	 * @param {String} method
	 * @param {String|Function} url or callback
	 * @return {Request}
	 * @api public
	 */

	function request(RequestConstructor, method, url) {
	  // callback
	  if ('function' == typeof url) {
	    return new RequestConstructor('GET', method).end(url);
	  }

	  // url first
	  if (2 == arguments.length) {
	    return new RequestConstructor('GET', method);
	  }

	  return new RequestConstructor(method, url);
	}

	module.exports = request;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	var inherits = __webpack_require__(19);
	var EventEmitter = __webpack_require__(9).EventEmitter;

	var settingsTpl = __webpack_require__(20);
	__webpack_require__(21);
	__webpack_require__(25);

	function Settings(player, infoScreen, btnClose, box, option) {
	  this.visible = false;
	  this.player = player;
	  this.infoScreen = infoScreen;
	  this.btnClose = btnClose;
	  this.box = box;
	  enable = option.enableMoveWindow;
	}

	inherits(Settings, EventEmitter);

	Settings.prototype.load = function (element) {
	  this.element = element;
	  this.element.innerHTML = settingsTpl;
	  this.element.classList.add('settings');


	  // Localism panel
	  this.localism = this.element.querySelector('.content > .localism');

	  // Close events
	  this.element.querySelector('.wall')
	    .addEventListener('click', this.hide.bind(this));

	  this.btnClose.element.firstChild.addEventListener('click',this.hide.bind(this))
	  // Selected region
	  this.selectedRegion = this.element.querySelector('.content > ul .localism');

	  if (enable) {
	    this.position = this.element.querySelector('.content > ul .position');
	    this.position.style.display = 'block';
	  }

	  this.selectedRegion._name = this.selectedRegion.querySelector('.abbrev');
	  this.selectedRegion._flag = this.selectedRegion.querySelector('img.flag');
	  this.selectedRegion.addEventListener('click', function() {
	  this.localism.classList.toggle('active');


	  }.bind(this));

	  var OnLeft = 1;
	  var selector = this.element.querySelector('input[name=checkbox]')

	  this.element.querySelector('.content > ul .position')
	    .addEventListener('click', function() {
	      if(OnLeft){
	        window.dispatchEvent(new CustomEvent('vp-widget-wrapper-set-side', {detail: {right: true}})); 
	        OnLeft=0;
	        selector.checked = false;
	      }
	      else{
	        window.dispatchEvent(new CustomEvent('vp-widget-wrapper-set-side', {detail: {right: false}})); 
	        OnLeft=1;
	        selector.checked = true;
	      }
	    }.bind(this));


	  // About button
	  this.element.querySelector('.content > ul .about')
	    .addEventListener('click', function() {
	      this.hide();
	      this.infoScreen.show();
	    }.bind(this));


	  // National
	  this.national = this.localism.querySelector('.national');
	  this.national._data = nationalData;
	  this.national.classList.add('selected');
	  this.national.addEventListener('click', function() {
	    this.setRegion(this.national);
	  }.bind(this));

	  // Selected region
	  this.region = this.national;

	  // Creates regions grid
	  var regions = this.localism.querySelector('.regions');
	  var regionHTML = __webpack_require__(27);

	  for (var i in regionsData) {
	    var data = regionsData[i];

	    var region = document.createElement('div');
	    region.classList.add('container');
	    region.innerHTML = regionHTML;

	    region._data = data;
	    region._setRegion = this.setRegion.bind(this);

	    region.querySelector('img.flag').src = data.flag;
	    region.querySelector('.name').innerHTML = data.name;
	    region.addEventListener('click', function() {
	      this._setRegion(this);
	    });

	    regions.appendChild(region);
	  }

	  // Elements to apply blur filter
	  this.gameContainer = document.querySelector('div#gameContainer');
	  this.controlsElement = document.querySelector('.controls');

	  this.hide();
	};

	Settings.prototype.setRegion = function (region) {
	  // Deactivate localism panel
	  this.localism.classList.remove('active');

	  // Select new region
	  this.region.classList.remove('selected');
	  this.region = region;
	  this.region.classList.add('selected');

	  // Updates selected region
	  this.selectedRegion._name.innerHTML = this.region._data.name;
	  this.selectedRegion._flag.src = this.region._data.flag;

	  // Sends to player
	  this.player.setRegion(this.region._data.path);
	};

	Settings.prototype.toggle = function () {
	  if (this.visible) this.hide();
	  else this.show();
	};

	Settings.prototype.hide = function () {
	  this.visible = false;
	  this.element.classList.remove('active');
	  this.localism.classList.remove('active');
	  this.btnClose.element.firstChild.style.visibility = 'hidden';
	  this.box.element.firstChild.style.visibility = 'visible';

	  // Removes blur filter
	  this.gameContainer.classList.remove('blur');
	  this.controlsElement.classList.remove('blur');
	  
	  this.emit('hide');
	};

	Settings.prototype.show = function () {
	  this.visible = true;
	  this.element.classList.add('active');
	  this.btnClose.element.firstChild.style.visibility = 'visible';
	  this.box.element.firstChild.style.visibility = 'hidden';
	  

	  // Apply blur filter
	  this.gameContainer.classList.add('blur');
	  this.controlsElement.classList.add('blur');
	  
	  this.emit('show');
	};

	module.exports = Settings;

	var nationalData = { name: 'BR', path: '', flag: 'assets/brazil.png' };
	var regionsData = [
	  { name: 'AC', path: 'AC', flag: 'assets/1AC.png' },
	  { name: 'MA', path: 'MA', flag: 'assets/10MA.png' },
	  { name: 'RJ', path: 'RJ', flag: 'assets/19RJ.png' },
	  { name: 'AL', path: 'AL', flag: 'assets/2AL.png' },
	  { name: 'MT', path: 'MT', flag: 'assets/11MT.png' },
	  { name: 'RN', path: 'RN', flag: 'assets/20RN.png' },
	  { name: 'AP', path: 'AP', flag: 'assets/3AP.png' },
	  { name: 'MS', path: 'MS', flag: 'assets/12MS.png' },
	  { name: 'RS', path: 'RS', flag: 'assets/21RS.png' },
	  { name: 'AM', path: 'AM', flag: 'assets/4AM.png' },
	  { name: 'MG', path: 'MG', flag: 'assets/13MG.png' },
	  { name: 'RO', path: 'RO', flag: 'assets/22RO.png' },
	  { name: 'BA', path: 'BA', flag: 'assets/5BA.png' },
	  { name: 'PA', path: 'PA', flag: 'assets/14PA.png' },
	  { name: 'RR', path: 'RR', flag: 'assets/23RR.png' },
	  { name: 'DF', path: 'DF', flag: 'assets/7DF.png' },
	  { name: 'PB', path: 'PB', flag: 'assets/15PB.png' },
	  { name: 'SC', path: 'SC', flag: 'assets/24SC.png' },
	  { name: 'CE', path: 'CE', flag: 'assets/6CE.png' },
	  { name: 'PR', path: 'PR', flag: 'assets/16PR.png' },
	  { name: 'SP', path: 'SP', flag: 'assets/25SP.png' },
	  { name: 'ES', path: 'ES', flag: 'assets/8ES.png' },
	  { name: 'PE', path: 'PE', flag: 'assets/17PE.png' },
	  { name: 'SE', path: 'SE', flag: 'assets/26SE.png' },
	  { name: 'GO', path: 'GO', flag: 'assets/9GO.png' },
	  { name: 'PI', path: 'PI', flag: 'assets/18PI.png' },
	  { name: 'TO', path: 'TO', flag: 'assets/27TO.png' }
	];

/***/ }),
/* 19 */
/***/ (function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ }),
/* 20 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"content\">\n    <ul>\n        <li class=\"localism clickable\">\n            <div class=\"container\">\n                <span class=\"name\">Regionalismo</span>\n                <img class=\"flag\" src=\"assets/brazil.png\">\n                <span class=\"abbrev\">BR</span>\n                <!-- <img class=\"arrow\" src=\"assets/expander.png\"> -->\n            </div>\n        </li>\n\n        <li class=\"position clickable\">\n            <div class=\"container\">\n                <span class=\"name\">Posicionamento da tela</span>\n                <label class=\"switch\">\n                    <input checked disabled type=\"checkbox\" name=\"checkbox\">\n                    <span class=\"slider-check round\"></span>\n                </label>\n            </div>\n        </li>\n\n        <li class=\"about clickable\">\n            <div class=\"container\">\n                <span class=\"name\">Sobre</span>\n            </div>\n        </li>\n    </ul>\n\n    <div class=\"localism\">\n        <div class=\"national clickable\">\n            <img class=\"flag\" src=\"assets/brazil.png\">\n            <span class=\"name\">BR - Padrão Nacional</span>\n        </div>\n\n        <div class=\"regions\"></div>\n    </div>\n    <div class=\"vlibras-logo\">\n        <span>VLIBRAS</span>\n        <img class=\"logo\" src=\"assets/logoicon.png\">\n    </div>\n</div>\n\n<div class=\"wall\"></div>"

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(22);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(24)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../node_modules/css-loader/index.js?-url!../../../node_modules/sass-loader/index.js!./settings.scss", function() {
				var newContent = require("!!../../../node_modules/css-loader/index.js?-url!../../../node_modules/sass-loader/index.js!./settings.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(23)();
	// imports


	// module
	exports.push([module.id, ".settings {\n  position: absolute;\n  top: 10%;\n  width: 100%;\n  height: 90%; }\n  .settings .content {\n    position: relative;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    z-index: 6;\n    background-color: #003F86;\n    color: white; }\n    .settings .content .flag {\n      position: absolute;\n      height: 24px;\n      margin-top: -12px;\n      margin-left: 4px;\n      border: none;\n      border-radius: 5px; }\n    .settings .content > .bar {\n      position: absolute;\n      width: 100%;\n      height: 54px; }\n      .settings .content > .bar .title {\n        position: absolute;\n        top: 16px;\n        left: 50px;\n        color: #6481b8;\n        font-size: 0.9em;\n        font-weight: bold; }\n    .settings .content > ul {\n      list-style-type: none;\n      margin: 0;\n      padding: 0 11%; }\n      .settings .content > ul li {\n        position: relative;\n        padding: 19px 0;\n        border-bottom: 0; }\n        .settings .content > ul li .name {\n          position: absolute;\n          left: 0px;\n          margin-top: -10px;\n          font-size: 14px; }\n      .settings .content > ul .position {\n        display: none; }\n      .settings .content > ul .localism {\n        padding: 24px 0; }\n        .settings .content > ul .localism .flag {\n          right: 27px;\n          height: 24px; }\n        .settings .content > ul .localism .abbrev {\n          position: absolute;\n          right: 0px;\n          margin-top: -9px;\n          font-size: 14px;\n          font-weight: bold; }\n        .settings .content > ul .localism .arrow {\n          position: absolute;\n          right: 16px;\n          height: 13px;\n          margin-top: -6px; }\n    .settings .content > .localism {\n      position: absolute;\n      top: 0;\n      left: 0;\n      width: 100%;\n      height: 100%;\n      z-index: 7;\n      background-color: white;\n      border: 1px solid rgba(0, 0, 0, 0.2);\n      border-radius: 2px; }\n      .settings .content > .localism:not(.active) {\n        visibility: hidden;\n        opacity: 0;\n        -webkit-transition: visibility 0s, opacity 0.3s;\n        transition: visibility 0s, opacity 0.3s; }\n      .settings .content > .localism.active {\n        visibility: visible;\n        opacity: 1;\n        -webkit-transition: visibility 0s, opacity 0.3s;\n        transition: visibility 0s, opacity 0.3s; }\n      .settings .content > .localism .name {\n        position: absolute;\n        margin-top: -7px;\n        margin-left: 9px;\n        font-size: 14px;\n        font-weight: bold; }\n      .settings .content > .localism .national {\n        position: relative;\n        margin-top: 6px;\n        padding: 16px 8px;\n        display: flex;\n        flex-direction: row;\n        flex-wrap: wrap; }\n        .settings .content > .localism .national .name {\n          color: black;\n          text-align: center;\n          transform: translate(50%); }\n        .settings .content > .localism .national .flag {\n          transform: translate(40%); }\n      .settings .content > .localism .regions {\n        position: relative;\n        width: 100%;\n        height: 100%;\n        padding: 0px 8px 0px 8px;\n        left: 0;\n        top: 50%;\n        transform: translateY(-50%); }\n        .settings .content > .localism .regions > .container {\n          display: inline-block;\n          position: relative;\n          width: 33.33%;\n          margin-bottom: 1px;\n          padding: 6px 0;\n          margin-top: 1%;\n          cursor: pointer;\n          opacity: 0.5;\n          -webkit-transition: opacity 0.3s;\n          transition: opacity 0.3s; }\n          .settings .content > .localism .regions > .container.selected, .settings .content > .localism .regions > .container:hover {\n            opacity: 1;\n            -webkit-transition: opacity 0.3s;\n            transition: opacity 0.3s; }\n          .settings .content > .localism .regions > .container .cont {\n            display: flex;\n            flex-direction: row;\n            justify-content: center;\n            align-items: center; }\n          .settings .content > .localism .regions > .container > .cont .flag {\n            position: relative;\n            margin: 0; }\n          .settings .content > .localism .regions > .container > .cont .name {\n            position: relative;\n            margin: 0 10px 0;\n            color: grey; }\n    .settings .content .vlibras-logo {\n      position: absolute;\n      left: 50%;\n      transform: translateX(-50%);\n      bottom: 0;\n      z-index: 6; }\n      .settings .content .vlibras-logo span {\n        left: 50%;\n        transform: translateX(-50%);\n        position: absolute;\n        bottom: 15%;\n        align-items: center;\n        font-size: 14px; }\n      .settings .content .vlibras-logo .logo {\n        width: 100%;\n        height: 100%; }\n  .settings > .wall {\n    position: absolute;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    right: 0;\n    z-index: 5; }\n  .settings.active .content {\n    left: 0;\n    -webkit-transition: left 0.3s;\n    transition: left 0.3s; }\n  .settings.active .wall {\n    visibility: visible; }\n  .settings:not(.active) .content {\n    left: 0;\n    visibility: hidden;\n    -webkit-transition: left 0.3s;\n    transition: left 0.3s; }\n  .settings:not(.active) .wall {\n    visibility: hidden; }\n  .settings .clickable {\n    cursor: pointer; }\n    .settings .clickable:not(:hover) {\n      background-color: inherit;\n      -webkit-transition: 0.12s background-color;\n      transition: 0.12s background-color; }\n    .settings .clickable:hover {\n      -webkit-transition: 0.2s background-color;\n      transition: 0.2s background-color; }\n\n/*@media (min-width: 600px) {\n  .settings {\n    &.active {\n      visibility: visible;\n      left: 0;\n\n      -webkit-transition: visibility 0s, left 0.3s;\n      transition: visibility 0s, left 0.3s;\n    }\n\n    &:not(.active) {\n      visibility: hidden;\n      left: -220px;\n\n      -webkit-transition: visibility 0.3s, left 0.3s;\n      transition: visibility 0.3s, left 0.3s;\n    }\n\n    .content {\n      left: -220px;\n      width: 220px;\n\n\n      .bar {\n        height: 66px;\n\n\n        .btn-back {\n          width: 30px;\n          height: 30px;\n          margin-top: 18px;\n          margin-left: 18px;\n        }\n\n        .title {\n          top: 25px;\n          left: 60px;\n          font-size: 1em;\n        }\n      }\n    }\n  }\n}*/\n", ""]);

	// exports


/***/ }),
/* 23 */
/***/ (function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(26);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(24)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../node_modules/css-loader/index.js?-url!../../../node_modules/sass-loader/index.js!./switch.scss", function() {
				var newContent = require("!!../../../node_modules/css-loader/index.js?-url!../../../node_modules/sass-loader/index.js!./switch.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(23)();
	// imports


	// module
	exports.push([module.id, ".switch {\n  position: relative;\n  display: inline-block;\n  width: 60px;\n  height: 21px;\n  float: right;\n  margin-top: -10px; }\n\n/* Hide default HTML checkbox */\n.switch input {\n  opacity: 0;\n  width: 0;\n  height: 0; }\n\n/* The slider */\n.slider-check {\n  position: absolute;\n  cursor: pointer;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: #2196F3; }\n\n.slider-check:before {\n  position: absolute;\n  content: \"\";\n  height: 26px;\n  width: 26px;\n  left: 4px;\n  bottom: 4px;\n  background-color: white; }\n\ninput:checked + .slider-check {\n  background-color: #2196F3; }\n\ninput:focus + .slider-check {\n  box-shadow: 0 0 1px #ccc; }\n\ninput:checked + .slider-check:before {\n  -webkit-transform: translateX(26px);\n  -ms-transform: translateX(26px);\n  transform: translateX(26px); }\n\n/* Rounded sliders */\n.slider-check.round {\n  border-radius: 34px; }\n\n.slider-check.round:before {\n  border-radius: 50%;\n  top: -3px; }\n", ""]);

	// exports


/***/ }),
/* 27 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"cont\">\n    <img class=\"flag\">\n    <span class=\"name\"></span>\n</div>\n\n\n"

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	var settingsBtnTpl = __webpack_require__(29);
	__webpack_require__(30);

	function SettingsBtn(player, screen, option) {
	  this.player = player;
	  this.screen = screen;
	  enable = option.enableMoveWindow;
	}

	SettingsBtn.prototype.load = function (element) {
	  this.element = element;
	  this.element.innerHTML = settingsBtnTpl;
	  this.element.classList.add('settings-btn');

	  var btn_menu = this.element.querySelector('.settings-btn-menu');
	  var btn_close = this.element.querySelector('.settings-btn-close');

	  if (enable) {
	    btn_close.style.display = 'block';
	  }


	  btn_menu.addEventListener('click', function () {
	    this.element.classList.toggle('active');
	    this.player.pause();
	    this.screen.toggle();
	  }.bind(this));

	  btn_close.addEventListener('click', function () {
	    window.dispatchEvent(new CustomEvent('vp-widget-close', {detail: {close: true}})); 
	  }.bind(this));

	};

	module.exports = SettingsBtn;


/***/ }),
/* 29 */
/***/ (function(module, exports) {

	module.exports = "<img class=\"settings-btn-menu\" src=\"assets/component-menu.png\">\n<img class=\"settings-btn-close\" src=\"assets/close.svg\">\n"

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(31);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(24)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../node_modules/css-loader/index.js?-url!../../../node_modules/sass-loader/index.js!./settings-btn.scss", function() {
				var newContent = require("!!../../../node_modules/css-loader/index.js?-url!../../../node_modules/sass-loader/index.js!./settings-btn.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(23)();
	// imports


	// module
	exports.push([module.id, ".settings-btn {\n  position: absolute;\n  z-index: 1;\n  height: 100%;\n  margin-left: 20px;\n  cursor: pointer; }\n  .settings-btn .settings-btn-menu {\n    position: absolute;\n    top: 50%;\n    transform: translateY(-50%);\n    width: 20px;\n    height: 18px;\n    left: 0; }\n  .settings-btn .settings-btn-close {\n    display: none;\n    position: absolute;\n    top: 50%;\n    transform: translateY(-50%);\n    margin-left: 240px; }\n", ""]);

	// exports


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	var inherits = __webpack_require__(19);
	var EventEmitter = __webpack_require__(9).EventEmitter;

	var infoScreenTpl = __webpack_require__(33);
	__webpack_require__(34);

	function InfoScreen(settingBtnClose) {
	  this.settingBtnClose = settingBtnClose;
	  this.visible = false;
	}

	inherits(InfoScreen, EventEmitter);

	InfoScreen.prototype.load = function (element) {
	  this.element = element;
	  this.element.innerHTML = infoScreenTpl;
	  this.element.classList.add('info-screen');

	  var main = this.element.querySelector('#info-main');
	  var realizadores = this.element.querySelector('#info-realizadores');
	  var left = this.element.querySelector('.arrow-left');
	  var right = this.element.querySelector('.arrow-right');
	  var bullets = this.element.querySelectorAll('.info-bullet');
	  
	  
	  

	  

	  left.addEventListener('click', function() {
	    realizadores.classList.remove('active');
	    main.classList.add('active');

	    this.classList.remove('active');
	    right.classList.add('active');

	    bullets[1].classList.remove('active');
	    bullets[0].classList.add('active');
	  });

	  right.addEventListener('click', function() {
	    main.classList.remove('active');
	    realizadores.classList.add('active');

	    this.classList.remove('active');
	    left.classList.add('active');

	    bullets[0].classList.remove('active');
	    bullets[1].classList.add('active');
	  });

	  this.settingBtnClose.element.firstChild.addEventListener('click', function() {
	    this.hide();
	    this.settingBtnClose.element.firstChild.style.visibility = 'hidden;'
	  }.bind(this));

	  // this.hide();
	};

	InfoScreen.prototype.toggle = function () {
	  if (this.visible) this.hide();
	  else this.show();
	};

	InfoScreen.prototype.hide = function () {
	  this.visible = false;
	  this.settingBtnClose.element.firstChild.style.visibility = 'hidden';
	  this.element.classList.remove('active');
	  this.emit('hide');
	};

	InfoScreen.prototype.show = function () {
	  this.settingBtnClose.element.firstChild.style.visibility = 'visible';
	  this.visible = true;
	  this.element.classList.add('active');
	  this.emit('show');
	};

	module.exports = InfoScreen;


/***/ }),
/* 33 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"arrow arrow-left\">\n    <img src=\"assets/ToLeft-2019.png\" />\n</div>\n<div id=\"info-tabset\">\n    <div id=\"info-main\" class=\"info-tab active\">\n        <div id=\"info-logo\">\n            <img src=\"assets/logo.png\"/>\n        </div>\n        <div id=\"info-meta\">\n            <p>Versão 3.0.2</p>\n            <a href=\"http://vlibras.gov.br\" target=\"_blank\">vlibras.gov.br</a>\n        </div>\n        <div id=\"info-text\">\n            <p>O VLibras é uma ferramenta aberta de distribuição livre, desenvolvida para melhorar o acesso à informação das pessoas surdas brasileiras.</p>\n            <p>Qualquer dúvida ou questionamento, envie uma mensagem para o Núcleo de Pesquisa e Extensão LAViD - Centro de Informática - UFPB através do e-mail. contato@lavid.ufpb.br</p>\n        </div>\n    </div>\n    <div id=\"info-realizadores\" class=\"info-tab\">\n        <h3>Realizadores</h3>\n\n        <div class=\"logo-group\">\n            <img class=\"logo\" src=\"assets/about_sti.png\">\n            <img class=\"logo\" src=\"assets/about_min-plan.png\">\n            <img class=\"logo\" src=\"assets/about_min-jus.png\">\n            <img class=\"logo\" src=\"assets/about_gov.png\">\n        </div>\n\n        <div class=\"logo-group\">\n            <img class=\"logo\" src=\"assets/about_lavid.png\">\n            <img class=\"logo\" src=\"assets/about_ufpb.png\">\n            <img class=\"logo\" src=\"assets/about_rnp.png\">\n        </div>\n\n        <div class=\"logo-group\">\n            <img class=\"logo\" src=\"assets/about_ufcg.png\">\n            <img class=\"logo\" src=\"assets/about_camara.png\">\n        </div>\n    </div>\n    <div id=\"info-tab-bullets\">\n        <span class=\"info-bullet active\"></span>\n        <span class=\"info-bullet\"></span>\n    </div>\n</div>\n<div class=\"arrow arrow-right active\">\n    <img src=\"assets/ToRight-2019.png\" />\n</div>"

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(35);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(24)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../node_modules/css-loader/index.js?-url!../../../node_modules/sass-loader/index.js!./info-screen.scss", function() {
				var newContent = require("!!../../../node_modules/css-loader/index.js?-url!../../../node_modules/sass-loader/index.js!./info-screen.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(23)();
	// imports


	// module
	exports.push([module.id, ".info-screen {\n  position: absolute;\n  left: 0;\n  top: 10%;\n  padding: 1em;\n  width: 100%;\n  height: 90%;\n  background-color: white;\n  color: black;\n  font-family: Arial, sans-serif;\n  text-align: center;\n  align-items: center;\n  -webkit-align-items: center;\n  font-size: 14px;\n  display: none;\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box; }\n  .info-screen.active {\n    display: -webkit-flex;\n    display: flex; }\n  .info-screen .arrow {\n    flex-grow: 1;\n    -webkit-flex-grow: 1;\n    visibility: hidden; }\n  .info-screen .arrow.active {\n    visibility: visible; }\n  .info-screen #info-tabset {\n    position: relative;\n    top: 0;\n    flex-grow: 4;\n    display: -webkit-flex;\n    display: flex;\n    flex-direction: column;\n    -webkit-flex-direction: column;\n    padding: 0;\n    height: 100%;\n    width: 100%;\n    align-items: center;\n    -webkit-align-items: center; }\n  .info-screen #info-main {\n    max-width: 600px;\n    flex-direction: column;\n    -webkit-flex-direction: column; }\n    .info-screen #info-main #info-text {\n      font-size: 3.2vh; }\n  .info-screen #info-logo img {\n    height: 90px; }\n  .info-screen #info-realizadores {\n    height: 100%;\n    flex-direction: column;\n    align-items: stretch;\n    -webkit-flex-direction: column;\n    -webkit-align-items: stretch; }\n    .info-screen #info-realizadores.active {\n      display: flex; }\n    .info-screen #info-realizadores .logo {\n      margin: 0.5em 0.35em;\n      min-width: 10%;\n      max-width: 30%;\n      max-height: 15vh; }\n      .info-screen #info-realizadores .logo .short-ver {\n        max-width: none;\n        min-height: 16px; }\n    .info-screen #info-realizadores .logo-group {\n      display: flex;\n      padding: 0.5% 2%;\n      flex-direction: row;\n      flex-wrap: wrap;\n      align-items: center;\n      justify-content: space-around;\n      -webkit-flex-direction: row;\n      -webkit-flex-wrap: wrap;\n      -webkit-align-items: center;\n      -webkit-justify-content: space-around; }\n  .info-screen .info-tab {\n    flex-grow: 3;\n    -webkit-flex-grow: 3;\n    display: none; }\n  .info-screen .info-tab.active {\n    display: block; }\n  .info-screen #info-meta p {\n    margin: .5em 0 0; }\n  .info-screen #info-meta a {\n    text-decoration: none; }\n  .info-screen .info-bullet:before {\n    content: url(assets/CounterOff.png); }\n  .info-screen .info-bullet.active:before {\n    content: url(assets/CounterOn.png); }\n  .info-screen #info-tab-bullets {\n    width: 100%;\n    height: auto;\n    position: absolute;\n    bottom: 3%;\n    text-align: center;\n    flex-grow: 1;\n    -webkit-flex-grow: 1; }\n  .info-screen .close-btn {\n    position: absolute;\n    top: 8px;\n    right: 6px;\n    z-index: 4; }\n    .info-screen .close-btn img.icon {\n      width: 34px;\n      height: 34px; }\n\n@media only screen and (-moz-min-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2 / 1), only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {\n  #info-realizadores .logo {\n    margin: 0.5em 0.35em;\n    min-width: 10%;\n    max-width: 50%;\n    max-height: 18vh; } }\n\n@media only screen and (max-height: 360px) {\n  #info-main {\n    font-size: 0.84em; } }\n", ""]);

	// exports


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	var inherits = __webpack_require__(19);
	var EventEmitter = __webpack_require__(9).EventEmitter;

	var dictionaryTpl = __webpack_require__(37);
	__webpack_require__(38);

	var Trie = __webpack_require__(40);
	var NonBlockingProcess = __webpack_require__(41);

	function Dictionary(player)
	{
	  this.visible = false;
	  this.player = player;
	}

	inherits(Dictionary, EventEmitter);

	Dictionary.prototype.load = function (element) {
	  this.element = element;
	  this.element.innerHTML = dictionaryTpl;
	  this.element.classList.add('dictionary');

	  // Close button
	  this.element.querySelector('.panel .bar .btn-close')
	    .addEventListener('click', this.hide.bind(this));

	  // Signs trie
	  this.signs = null;

	  // List
	  this.list = this.element.querySelector('ul');

	  // Clear list method
	  this.list._clear = function()
	  {
	    this.list.innerHTML = '';
	    this.list.appendChild(this.defaultItem);
	  }.bind(this);

	  // Insert item method
	  this.list._insert = function(word)
	  {
	    var item = document.createElement('li');
	    item.innerHTML = word;
	    item.addEventListener('click', this._onItemClick.bind(this));

	    this.list.appendChild(item);
	  }.bind(this);

	  // Default first item
	  this.defaultItem = this.list.querySelector('li');

	  // Search
	  this.element.querySelector('.panel .search input')
	    .addEventListener('keyup', function(event) {
	      console.log(event.target.value);

	      this.list._clear();
	      this.signs.feed(event.target.value.toUpperCase(), this.list._insert.bind(this.list));
	    }.bind(this));

	  // Request and load list
	  var xhr = new XMLHttpRequest();
	  xhr.open('get', 'http://dicionario.vlibras.gov.br/signs', true);
	  xhr.responseType = 'text';
	  xhr.onload = function()
	  {
	    if (xhr.status == 200)
	    {
	      console.log('Starting trie processing.');

	      var json = JSON.parse(xhr.response);
	      console.log(json);
	      
	      this.signs = new Trie().fromJSON(json);

	      var basicSigns = [
	        'A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'H', 'I',
	        'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
	        'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
	        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
	        ','
	      ];

	      for (var i in basicSigns)
	        this.signs.add(basicSigns[i]);

	      console.log(this.signs);

	      this.signs.feed('', this.list._insert.bind(this.list));
	      document.querySelector('.controls-dictionary.loading-dictionary').classList.remove('loading-dictionary');
	    }
	    else console.log('Bad answer for signs, status: ' + xhr.status);
	  }.bind(this);
	  xhr.send();

	  this.hide();
	};

	Dictionary.prototype._onItemClick = function(event) {
	  this.hide();
	  this.player.play(event.target.innerHTML);
	};

	Dictionary.prototype.toggle = function () {
	  if (this.visible) this.hide();
	  else this.show();
	};

	Dictionary.prototype.hide = function () {
	  this.visible = false;
	  this.element.classList.remove('active');
	  this.emit('hide');
	};

	Dictionary.prototype.show = function () {
	  this.visible = true;
	  this.element.classList.add('active');
	  this.emit('show');
	};

	module.exports = Dictionary;

/***/ }),
/* 37 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"panel\"> \n    <div class=\"bar\">\n        <span class=\"title\">Dicionario</span>\n        <img class=\"btn-close\" src=\"assets/Close.png\">\n    </div>\n\n    <div class=\"search\">\n        <input type=\"text\">\n        <span class=\"icon\">\n            <img src=\"assets/search.jpg\">\n        </span>\n    </div>\n</div>\n\n<ul>\n    <li class=\"margin\"></li>\n</ul>"

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(39);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(24)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../node_modules/css-loader/index.js?-url!../../../node_modules/sass-loader/index.js!./dictionary.scss", function() {
				var newContent = require("!!../../../node_modules/css-loader/index.js?-url!../../../node_modules/sass-loader/index.js!./dictionary.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(23)();
	// imports


	// module
	exports.push([module.id, ".dictionary {\n  display: none;\n  position: relative;\n  width: 100%;\n  height: 100%;\n  min-width: 300px;\n  min-height: 300px;\n  background-color: white; }\n  .dictionary.active {\n    display: block; }\n  .dictionary .panel {\n    position: absolute;\n    top: 0;\n    left: 0;\n    right: 8px;\n    height: 114px;\n    padding: 0 0 0 40px;\n    background-color: white; }\n    .dictionary .panel .bar {\n      padding-top: 20px; }\n      .dictionary .panel .bar .btn-close {\n        position: absolute;\n        top: 20px;\n        right: 14px;\n        width: 34px;\n        height: 34px; }\n    .dictionary .panel .search {\n      position: relative;\n      width: 46%;\n      max-width: 260px;\n      margin-top: 20px; }\n      .dictionary .panel .search input {\n        width: 100%;\n        padding: 10px 38px 10px 10px;\n        border-radius: 6px;\n        border: 1px solid #DDD;\n        outline: none; }\n        .dictionary .panel .search input:focus {\n          border: 1px solid #00ddf9; }\n      .dictionary .panel .search .icon {\n        display: block;\n        position: absolute;\n        top: 50%;\n        bottom: 50%;\n        left: 0;\n        right: 0; }\n        .dictionary .panel .search .icon img {\n          position: absolute;\n          right: 10px;\n          width: 24px;\n          margin-top: -12px; }\n  .dictionary > ul {\n    height: 100%;\n    margin: 0;\n    padding: 0;\n    overflow-y: scroll;\n    list-style-type: none; }\n    .dictionary > ul::-webkit-scrollbar {\n      width: 8px; }\n    .dictionary > ul::-webkit-scrollbar-track {\n      background-color: #DDD; }\n    .dictionary > ul::-webkit-scrollbar-thumb {\n      background-color: #BCBCBC; }\n    .dictionary > ul li {\n      font-size: 14px;\n      cursor: pointer; }\n      .dictionary > ul li:hover {\n        background-color: #EAEAEA;\n        -webkit-transition: brackground-color 0.3s;\n        transition: brackground-color 0.4s; }\n      .dictionary > ul li.margin {\n        height: 114px; }\n      .dictionary > ul li:not(.margin) {\n        padding: 9px 0 9px 40px; }\n\n@media (max-width: 480px) {\n  .dictionary .panel .search {\n    width: 76%; } }\n", ""]);

	// exports


/***/ }),
/* 40 */
/***/ (function(module, exports) {

	function Node(end)
	{
	  this.end = end === undefined ? false : end;
	  this.children = [];
	}

	function StackItem(trieNode, dataNode, index)
	{
	  this.trieNode = trieNode;
	  this.dataNode = dataNode;
	  this.index = index === undefined ? 0 : index;
	}

	function Trie(characters, data)
	{
	  this.root = new Node();

	  if (characters !== undefined)
	  {
	    this._setCharacters(characters);

	    if (data !== undefined)
	      for (var i in data)
	        this.add(data[i]);
	  }
	}

	Trie.prototype._setCharacters = function(characters)
	{
	  this.characters = characters;
	  this.charactersKeys = [];

	  for (var i in this.characters)
	    this.charactersKeys[this.characters[i]] = i;
	}

	Trie.prototype.getKey = function(word, i) {
	  return this.charactersKeys[word[i]];
	}

	Trie.prototype.add = function(word)
	{
	  var node = this.root;

	  for (var i in word)
	  {
	    if (node.children[this.getKey(word, i)] === undefined)
	      node.children[this.getKey(word, i)] = new Node(i == word.length - 1);

	    node = node.children[this.getKey(word, i)];
	  }

	  node.end = true;
	}

	Trie.prototype.contains = function(word)
	{
	  var node = this.root;

	  for (var i in word)
	  {
	    if (node.children[this.getKey(word, i)] === undefined)
	      return false;

	    node = node.children[this.getKey(word, i)];
	  }

	  return node.end;
	};

	Trie.prototype.feed = function(key, insert)
	{
	  var node = this.root;

	  if (key !== undefined) {
	    for (var i in key)
	    {
	      if (node.children[this.getKey(key, i)] === undefined)
	        return;

	      node = node.children[this.getKey(key, i)];
	    }
	  }

	  this._feed(node, key, insert);
	}

	Trie.prototype._feed = function(node, word, insert)
	{
	  if (node.end === true) insert(word);

	  for (var i in node.children)
	    this._feed(node.children[i], word + this.characters[i], insert);
	}

	Trie.prototype.fromJSON = function(json)
	{
	  this.characters = json.characters;
	  this.charactersKeys = json.keys;

	  this._fromJSON(this.root, json.trie);

	  return this;
	}

	Trie.prototype._fromJSON = function(trieNode, dataNode)
	{
	  trieNode.end = dataNode.end;

	  for (var i in dataNode.keys)
	  {
	    var key = dataNode.keys[i];

	    trieNode.children[key] = new Node();
	    this._fromJSON(trieNode.children[key], dataNode.children[key])
	  }
	}

	module.exports = Trie;

/***/ }),
/* 41 */
/***/ (function(module, exports) {

	function NonBlockingProcess(data, process, workingTime, watingTime, finish)
	{
	  this.data = data;
	  this.process = process;
	  this.workingTime = workingTime;
	  this.watingTime = watingTime;
	  this.finish = finish;

	  this._event = null;
	}

	NonBlockingProcess.prototype.start = function()
	{
	  this._index = 0;
	  this._event = setTimeout(this._work.bind(this), 0);
	}

	NonBlockingProcess.prototype.stop = function() {
	  clearTimeout(this._event);
	}

	NonBlockingProcess.prototype.continue = function() {
	  this._event = setTimeout(this._work.bind(this), 0);
	}

	NonBlockingProcess.prototype.isRunning = function() {
	  return this._event === null;
	}

	NonBlockingProcess.prototype._work = function()
	{
	  var begin = new Date().getTime();
	  var end = begin + this.workingTime;
	  var initialIndex = this._index;

	  while (new Date().getTime() < end && this._index < this.data.length)
	    this.process(this.data[this._index++]);

	  console.log('NBP:', 'Processed ' + (this._index - initialIndex) + ' items from ' + initialIndex + '-' + this._index + ' for ' + (new Date().getTime() - begin) + ' ms.');

	  if (this._index == this.data.length)
	  {
	    this._event = null;
	    this.finish();
	  }
	  else
	    this._event = setTimeout(this._work.bind(this), this.watingTime);
	}

	module.exports = NonBlockingProcess;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	var noUiSlider = __webpack_require__(43);
	__webpack_require__(44);

	var controlsTpl = __webpack_require__(46);
	__webpack_require__(47);

	function Controls(player, dictionary) {
	  this.player = player;
	  this.dictionary = dictionary;

	  this.player.on('animation:play', function () {
	    console.log('animation:play');
	    this.element.classList.remove('stopped');
	    this.element.classList.add('playing');
	  }.bind(this));

	  this.player.on('animation:pause', function () {
	    console.log('animation:pause');
	    this.element.classList.remove('playing');
	    this.element.classList.remove('stopped');
	  }.bind(this));

	  this.player.on('animation:end', function () {
	    console.log('animation:end');
	    this.element.classList.remove('playing');
	    this.element.classList.add('stopped');
	  }.bind(this));
	}

	Controls.prototype.load = function (element) {
	  this.element = element;
	  this.element.innerHTML = controlsTpl;
	  this.element.classList.add('controls');
	  this.element.classList.add('subtitles');

	  var play = this.element.querySelector('.controls-play');
	  var subtitles = this.element.querySelector('.controls-subtitles');
	  var dictionary = this.element.querySelector('.controls-dictionary');
	  var speed_default = this.element.querySelector('.speed-default');
	  var speednumber = this.element.querySelector('.controls-speed-number');
	  var elem_speed = this.element.querySelector('.elem-speed');
	  var speed05 = this.element.querySelector('.block-speed-05');
	  var speed1 = this.element.querySelector('.block-speed-1');
	  var speed2 = this.element.querySelector('.block-speed-2');
	  var speed3 = this.element.querySelector('.block-speed-3');
	  var slider = this.element.querySelector('.controls-slider .slider');



	    noUiSlider.create(slider, {
	      start: 0.0,
	      step: 0.05,
	      connect: 'lower',
	      range: {
	        min: 0.2,
	        max: 2
	      }
	    });

	    // slider.noUiSlider.on('update', function (value) {
	    //   this.player.setSpeed(Number(value[0]));
	    // }.bind(this));


	  play.addEventListener('click', function () {
	    if (this.element.classList.contains('playing')) {
	      this.player.pause();
	    } else if(this.element.classList.contains('stopped')) {
	      this.player.repeat();
	    } else {
	      this.player.continue();
	    }
	  }.bind(this));

	  subtitles.addEventListener('click', function () {
	    this.element.classList.toggle('subtitles');
	    this.player.toggleSubtitle();
	  }.bind(this));

	  dictionary.addEventListener('click', function (event) {
	    console.log(event.target);

	    if (!event.target.classList.contains('loading-dictionary'))
	    {
	      this.dictionary.show();
	      this.player.pause();
	    }
	  }.bind(this));

	  var visibility = false;
	  var speed_value;


	  speed_default.addEventListener('click', function() {
	    if (visibility) {
	        elem_speed.style.display = "none";
	        visibility = false;
	        speed_default.style.background = "none";
	        speed_default.style.border = '1px solid grey';
	        speed_default.style.color = 'grey';
	        speed_default.style.borderRadius = '3px 3px 3px 3px';
	        speed_default.style.paddingRight = '3.5px';

	        speed_default.innerHTML = speed_value;

	    } else {
	        speed_default.style.background = "url('././assets/running.svg') no-repeat center";
	        speed_default.style.border = '1px solid #003F86';
	        speed_default.style.borderRadius = '0px 0px 3px 3px';
	        speed_value = speed_default.innerHTML;
	        speed_default.innerHTML = '';

	        speed_default.style.paddingRight = '20px';
	        speed_default.style.paddingLeft = '3.5px';
	        elem_speed.style.display = "block";
	        visibility = true;

	    }


	  }.bind(this));

	  speed05.addEventListener('click', () => {
	    this.setSpeed(0.5, '0.5x', elem_speed, speed_default);
	    speed_default.style.padding = '6px 1.5px 5px 1.5px'
	    speed_default.style.fontSize = '11px'
	    visibility = false;  

	  });

	  speed1.addEventListener('click', () => {
	    this.setSpeed(1.0, 'x1', elem_speed, speed_default);
	    visibility = false;  
	  });

	  speed2.addEventListener('click', () => {
	    this.setSpeed(1.5, 'x2', elem_speed, speed_default);
	    visibility = false;  

	  });
	  speed3.addEventListener('click', () => {
	    this.setSpeed(2.0, 'x3', elem_speed, speed_default);
	    visibility = false;  

	  });


	};


	Controls.prototype.setSpeed = function (speed, label, elem_speed, speed_default) {
	    elem_speed.style.display = "none";
	    speed_default.style.background = "none";
	    speed_default.style.color = 'grey';
	    speed_default.style.border = '1px solid grey';
	    speed_default.style.borderRadius = '3px 3px 3px 3px';
	    speed_default.innerHTML = label;
	    speed_default.style.padding = '3px 4px'
	    speed_default.style.fontSize = '15px'
	    this.player.setSpeed(parseFloat(speed));
	  } 

	module.exports = Controls;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! nouislider - 8.5.1 - 2016-04-24 16:00:29 */

	(function (factory) {

	    if ( true ) {

	        // AMD. Register as an anonymous module.
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	    } else if ( typeof exports === 'object' ) {

	        // Node/CommonJS
	        module.exports = factory();

	    } else {

	        // Browser globals
	        window.noUiSlider = factory();
	    }

	}(function( ){

		'use strict';


		// Removes duplicates from an array.
		function unique(array) {
			return array.filter(function(a){
				return !this[a] ? this[a] = true : false;
			}, {});
		}

		// Round a value to the closest 'to'.
		function closest ( value, to ) {
			return Math.round(value / to) * to;
		}

		// Current position of an element relative to the document.
		function offset ( elem ) {

		var rect = elem.getBoundingClientRect(),
			doc = elem.ownerDocument,
			docElem = doc.documentElement,
			pageOffset = getPageOffset();

			// getBoundingClientRect contains left scroll in Chrome on Android.
			// I haven't found a feature detection that proves this. Worst case
			// scenario on mis-match: the 'tap' feature on horizontal sliders breaks.
			if ( /webkit.*Chrome.*Mobile/i.test(navigator.userAgent) ) {
				pageOffset.x = 0;
			}

			return {
				top: rect.top + pageOffset.y - docElem.clientTop,
				left: rect.left + pageOffset.x - docElem.clientLeft
			};
		}

		// Checks whether a value is numerical.
		function isNumeric ( a ) {
			return typeof a === 'number' && !isNaN( a ) && isFinite( a );
		}

		// Sets a class and removes it after [duration] ms.
		function addClassFor ( element, className, duration ) {
			addClass(element, className);
			setTimeout(function(){
				removeClass(element, className);
			}, duration);
		}

		// Limits a value to 0 - 100
		function limit ( a ) {
			return Math.max(Math.min(a, 100), 0);
		}

		// Wraps a variable as an array, if it isn't one yet.
		function asArray ( a ) {
			return Array.isArray(a) ? a : [a];
		}

		// Counts decimals
		function countDecimals ( numStr ) {
			var pieces = numStr.split(".");
			return pieces.length > 1 ? pieces[1].length : 0;
		}

		// http://youmightnotneedjquery.com/#add_class
		function addClass ( el, className ) {
			if ( el.classList ) {
				el.classList.add(className);
			} else {
				el.className += ' ' + className;
			}
		}

		// http://youmightnotneedjquery.com/#remove_class
		function removeClass ( el, className ) {
			if ( el.classList ) {
				el.classList.remove(className);
			} else {
				el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
			}
		}

		// https://plainjs.com/javascript/attributes/adding-removing-and-testing-for-classes-9/
		function hasClass ( el, className ) {
			return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className);
		}

		// https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY#Notes
		function getPageOffset ( ) {

			var supportPageOffset = window.pageXOffset !== undefined,
				isCSS1Compat = ((document.compatMode || "") === "CSS1Compat"),
				x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft,
				y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;

			return {
				x: x,
				y: y
			};
		}

		// we provide a function to compute constants instead
		// of accessing window.* as soon as the module needs it
		// so that we do not compute anything if not needed
		function getActions ( ) {

			// Determine the events to bind. IE11 implements pointerEvents without
			// a prefix, which breaks compatibility with the IE10 implementation.
			return window.navigator.pointerEnabled ? {
				start: 'pointerdown',
				move: 'pointermove',
				end: 'pointerup'
			} : window.navigator.msPointerEnabled ? {
				start: 'MSPointerDown',
				move: 'MSPointerMove',
				end: 'MSPointerUp'
			} : {
				start: 'mousedown touchstart',
				move: 'mousemove touchmove',
				end: 'mouseup touchend'
			};
		}


	// Value calculation

		// Determine the size of a sub-range in relation to a full range.
		function subRangeRatio ( pa, pb ) {
			return (100 / (pb - pa));
		}

		// (percentage) How many percent is this value of this range?
		function fromPercentage ( range, value ) {
			return (value * 100) / ( range[1] - range[0] );
		}

		// (percentage) Where is this value on this range?
		function toPercentage ( range, value ) {
			return fromPercentage( range, range[0] < 0 ?
				value + Math.abs(range[0]) :
					value - range[0] );
		}

		// (value) How much is this percentage on this range?
		function isPercentage ( range, value ) {
			return ((value * ( range[1] - range[0] )) / 100) + range[0];
		}


	// Range conversion

		function getJ ( value, arr ) {

			var j = 1;

			while ( value >= arr[j] ){
				j += 1;
			}

			return j;
		}

		// (percentage) Input a value, find where, on a scale of 0-100, it applies.
		function toStepping ( xVal, xPct, value ) {

			if ( value >= xVal.slice(-1)[0] ){
				return 100;
			}

			var j = getJ( value, xVal ), va, vb, pa, pb;

			va = xVal[j-1];
			vb = xVal[j];
			pa = xPct[j-1];
			pb = xPct[j];

			return pa + (toPercentage([va, vb], value) / subRangeRatio (pa, pb));
		}

		// (value) Input a percentage, find where it is on the specified range.
		function fromStepping ( xVal, xPct, value ) {

			// There is no range group that fits 100
			if ( value >= 100 ){
				return xVal.slice(-1)[0];
			}

			var j = getJ( value, xPct ), va, vb, pa, pb;

			va = xVal[j-1];
			vb = xVal[j];
			pa = xPct[j-1];
			pb = xPct[j];

			return isPercentage([va, vb], (value - pa) * subRangeRatio (pa, pb));
		}

		// (percentage) Get the step that applies at a certain value.
		function getStep ( xPct, xSteps, snap, value ) {

			if ( value === 100 ) {
				return value;
			}

			var j = getJ( value, xPct ), a, b;

			// If 'snap' is set, steps are used as fixed points on the slider.
			if ( snap ) {

				a = xPct[j-1];
				b = xPct[j];

				// Find the closest position, a or b.
				if ((value - a) > ((b-a)/2)){
					return b;
				}

				return a;
			}

			if ( !xSteps[j-1] ){
				return value;
			}

			return xPct[j-1] + closest(
				value - xPct[j-1],
				xSteps[j-1]
			);
		}


	// Entry parsing

		function handleEntryPoint ( index, value, that ) {

			var percentage;

			// Wrap numerical input in an array.
			if ( typeof value === "number" ) {
				value = [value];
			}

			// Reject any invalid input, by testing whether value is an array.
			if ( Object.prototype.toString.call( value ) !== '[object Array]' ){
				throw new Error("noUiSlider: 'range' contains invalid value.");
			}

			// Covert min/max syntax to 0 and 100.
			if ( index === 'min' ) {
				percentage = 0;
			} else if ( index === 'max' ) {
				percentage = 100;
			} else {
				percentage = parseFloat( index );
			}

			// Check for correct input.
			if ( !isNumeric( percentage ) || !isNumeric( value[0] ) ) {
				throw new Error("noUiSlider: 'range' value isn't numeric.");
			}

			// Store values.
			that.xPct.push( percentage );
			that.xVal.push( value[0] );

			// NaN will evaluate to false too, but to keep
			// logging clear, set step explicitly. Make sure
			// not to override the 'step' setting with false.
			if ( !percentage ) {
				if ( !isNaN( value[1] ) ) {
					that.xSteps[0] = value[1];
				}
			} else {
				that.xSteps.push( isNaN(value[1]) ? false : value[1] );
			}
		}

		function handleStepPoint ( i, n, that ) {

			// Ignore 'false' stepping.
			if ( !n ) {
				return true;
			}

			// Factor to range ratio
			that.xSteps[i] = fromPercentage([
				 that.xVal[i]
				,that.xVal[i+1]
			], n) / subRangeRatio (
				that.xPct[i],
				that.xPct[i+1] );
		}


	// Interface

		// The interface to Spectrum handles all direction-based
		// conversions, so the above values are unaware.

		function Spectrum ( entry, snap, direction, singleStep ) {

			this.xPct = [];
			this.xVal = [];
			this.xSteps = [ singleStep || false ];
			this.xNumSteps = [ false ];

			this.snap = snap;
			this.direction = direction;

			var index, ordered = [ /* [0, 'min'], [1, '50%'], [2, 'max'] */ ];

			// Map the object keys to an array.
			for ( index in entry ) {
				if ( entry.hasOwnProperty(index) ) {
					ordered.push([entry[index], index]);
				}
			}

			// Sort all entries by value (numeric sort).
			if ( ordered.length && typeof ordered[0][0] === "object" ) {
				ordered.sort(function(a, b) { return a[0][0] - b[0][0]; });
			} else {
				ordered.sort(function(a, b) { return a[0] - b[0]; });
			}


			// Convert all entries to subranges.
			for ( index = 0; index < ordered.length; index++ ) {
				handleEntryPoint(ordered[index][1], ordered[index][0], this);
			}

			// Store the actual step values.
			// xSteps is sorted in the same order as xPct and xVal.
			this.xNumSteps = this.xSteps.slice(0);

			// Convert all numeric steps to the percentage of the subrange they represent.
			for ( index = 0; index < this.xNumSteps.length; index++ ) {
				handleStepPoint(index, this.xNumSteps[index], this);
			}
		}

		Spectrum.prototype.getMargin = function ( value ) {
			return this.xPct.length === 2 ? fromPercentage(this.xVal, value) : false;
		};

		Spectrum.prototype.toStepping = function ( value ) {

			value = toStepping( this.xVal, this.xPct, value );

			// Invert the value if this is a right-to-left slider.
			if ( this.direction ) {
				value = 100 - value;
			}

			return value;
		};

		Spectrum.prototype.fromStepping = function ( value ) {

			// Invert the value if this is a right-to-left slider.
			if ( this.direction ) {
				value = 100 - value;
			}

			return fromStepping( this.xVal, this.xPct, value );
		};

		Spectrum.prototype.getStep = function ( value ) {

			// Find the proper step for rtl sliders by search in inverse direction.
			// Fixes issue #262.
			if ( this.direction ) {
				value = 100 - value;
			}

			value = getStep(this.xPct, this.xSteps, this.snap, value );

			if ( this.direction ) {
				value = 100 - value;
			}

			return value;
		};

		Spectrum.prototype.getApplicableStep = function ( value ) {

			// If the value is 100%, return the negative step twice.
			var j = getJ(value, this.xPct), offset = value === 100 ? 2 : 1;
			return [this.xNumSteps[j-2], this.xVal[j-offset], this.xNumSteps[j-offset]];
		};

		// Outside testing
		Spectrum.prototype.convert = function ( value ) {
			return this.getStep(this.toStepping(value));
		};

	/*	Every input option is tested and parsed. This'll prevent
		endless validation in internal methods. These tests are
		structured with an item for every option available. An
		option can be marked as required by setting the 'r' flag.
		The testing function is provided with three arguments:
			- The provided value for the option;
			- A reference to the options object;
			- The name for the option;

		The testing function returns false when an error is detected,
		or true when everything is OK. It can also modify the option
		object, to make sure all values can be correctly looped elsewhere. */

		var defaultFormatter = { 'to': function( value ){
			return value !== undefined && value.toFixed(2);
		}, 'from': Number };

		function testStep ( parsed, entry ) {

			if ( !isNumeric( entry ) ) {
				throw new Error("noUiSlider: 'step' is not numeric.");
			}

			// The step option can still be used to set stepping
			// for linear sliders. Overwritten if set in 'range'.
			parsed.singleStep = entry;
		}

		function testRange ( parsed, entry ) {

			// Filter incorrect input.
			if ( typeof entry !== 'object' || Array.isArray(entry) ) {
				throw new Error("noUiSlider: 'range' is not an object.");
			}

			// Catch missing start or end.
			if ( entry.min === undefined || entry.max === undefined ) {
				throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.");
			}

			// Catch equal start or end.
			if ( entry.min === entry.max ) {
				throw new Error("noUiSlider: 'range' 'min' and 'max' cannot be equal.");
			}

			parsed.spectrum = new Spectrum(entry, parsed.snap, parsed.dir, parsed.singleStep);
		}

		function testStart ( parsed, entry ) {

			entry = asArray(entry);

			// Validate input. Values aren't tested, as the public .val method
			// will always provide a valid location.
			if ( !Array.isArray( entry ) || !entry.length || entry.length > 2 ) {
				throw new Error("noUiSlider: 'start' option is incorrect.");
			}

			// Store the number of handles.
			parsed.handles = entry.length;

			// When the slider is initialized, the .val method will
			// be called with the start options.
			parsed.start = entry;
		}

		function testSnap ( parsed, entry ) {

			// Enforce 100% stepping within subranges.
			parsed.snap = entry;

			if ( typeof entry !== 'boolean' ){
				throw new Error("noUiSlider: 'snap' option must be a boolean.");
			}
		}

		function testAnimate ( parsed, entry ) {

			// Enforce 100% stepping within subranges.
			parsed.animate = entry;

			if ( typeof entry !== 'boolean' ){
				throw new Error("noUiSlider: 'animate' option must be a boolean.");
			}
		}

		function testAnimationDuration ( parsed, entry ) {

			parsed.animationDuration = entry;

			if ( typeof entry !== 'number' ){
				throw new Error("noUiSlider: 'animationDuration' option must be a number.");
			}
		}

		function testConnect ( parsed, entry ) {

			if ( entry === 'lower' && parsed.handles === 1 ) {
				parsed.connect = 1;
			} else if ( entry === 'upper' && parsed.handles === 1 ) {
				parsed.connect = 2;
			} else if ( entry === true && parsed.handles === 2 ) {
				parsed.connect = 3;
			} else if ( entry === false ) {
				parsed.connect = 0;
			} else {
				throw new Error("noUiSlider: 'connect' option doesn't match handle count.");
			}
		}

		function testOrientation ( parsed, entry ) {

			// Set orientation to an a numerical value for easy
			// array selection.
			switch ( entry ){
			  case 'horizontal':
				parsed.ort = 0;
				break;
			  case 'vertical':
				parsed.ort = 1;
				break;
			  default:
				throw new Error("noUiSlider: 'orientation' option is invalid.");
			}
		}

		function testMargin ( parsed, entry ) {

			if ( !isNumeric(entry) ){
				throw new Error("noUiSlider: 'margin' option must be numeric.");
			}

			// Issue #582
			if ( entry === 0 ) {
				return;
			}

			parsed.margin = parsed.spectrum.getMargin(entry);

			if ( !parsed.margin ) {
				throw new Error("noUiSlider: 'margin' option is only supported on linear sliders.");
			}
		}

		function testLimit ( parsed, entry ) {

			if ( !isNumeric(entry) ){
				throw new Error("noUiSlider: 'limit' option must be numeric.");
			}

			parsed.limit = parsed.spectrum.getMargin(entry);

			if ( !parsed.limit ) {
				throw new Error("noUiSlider: 'limit' option is only supported on linear sliders.");
			}
		}

		function testDirection ( parsed, entry ) {

			// Set direction as a numerical value for easy parsing.
			// Invert connection for RTL sliders, so that the proper
			// handles get the connect/background classes.
			switch ( entry ) {
			  case 'ltr':
				parsed.dir = 0;
				break;
			  case 'rtl':
				parsed.dir = 1;
				parsed.connect = [0,2,1,3][parsed.connect];
				break;
			  default:
				throw new Error("noUiSlider: 'direction' option was not recognized.");
			}
		}

		function testBehaviour ( parsed, entry ) {

			// Make sure the input is a string.
			if ( typeof entry !== 'string' ) {
				throw new Error("noUiSlider: 'behaviour' must be a string containing options.");
			}

			// Check if the string contains any keywords.
			// None are required.
			var tap = entry.indexOf('tap') >= 0,
				drag = entry.indexOf('drag') >= 0,
				fixed = entry.indexOf('fixed') >= 0,
				snap = entry.indexOf('snap') >= 0,
				hover = entry.indexOf('hover') >= 0;

			// Fix #472
			if ( drag && !parsed.connect ) {
				throw new Error("noUiSlider: 'drag' behaviour must be used with 'connect': true.");
			}

			parsed.events = {
				tap: tap || snap,
				drag: drag,
				fixed: fixed,
				snap: snap,
				hover: hover
			};
		}

		function testTooltips ( parsed, entry ) {

			var i;

			if ( entry === false ) {
				return;
			} else if ( entry === true ) {

				parsed.tooltips = [];

				for ( i = 0; i < parsed.handles; i++ ) {
					parsed.tooltips.push(true);
				}

			} else {

				parsed.tooltips = asArray(entry);

				if ( parsed.tooltips.length !== parsed.handles ) {
					throw new Error("noUiSlider: must pass a formatter for all handles.");
				}

				parsed.tooltips.forEach(function(formatter){
					if ( typeof formatter !== 'boolean' && (typeof formatter !== 'object' || typeof formatter.to !== 'function') ) {
						throw new Error("noUiSlider: 'tooltips' must be passed a formatter or 'false'.");
					}
				});
			}
		}

		function testFormat ( parsed, entry ) {

			parsed.format = entry;

			// Any object with a to and from method is supported.
			if ( typeof entry.to === 'function' && typeof entry.from === 'function' ) {
				return true;
			}

			throw new Error("noUiSlider: 'format' requires 'to' and 'from' methods.");
		}

		function testCssPrefix ( parsed, entry ) {

			if ( entry !== undefined && typeof entry !== 'string' && entry !== false ) {
				throw new Error("noUiSlider: 'cssPrefix' must be a string or `false`.");
			}

			parsed.cssPrefix = entry;
		}

		function testCssClasses ( parsed, entry ) {

			if ( entry !== undefined && typeof entry !== 'object' ) {
				throw new Error("noUiSlider: 'cssClasses' must be an object.");
			}

			if ( typeof parsed.cssPrefix === 'string' ) {
				parsed.cssClasses = {};

				for ( var key in entry ) {
					if ( !entry.hasOwnProperty(key) ) { continue; }

					parsed.cssClasses[key] = parsed.cssPrefix + entry[key];
				}
			} else {
				parsed.cssClasses = entry;
			}
		}

		// Test all developer settings and parse to assumption-safe values.
		function testOptions ( options ) {

			// To prove a fix for #537, freeze options here.
			// If the object is modified, an error will be thrown.
			// Object.freeze(options);

			var parsed = {
				margin: 0,
				limit: 0,
				animate: true,
				animationDuration: 300,
				format: defaultFormatter
			}, tests;

			// Tests are executed in the order they are presented here.
			tests = {
				'step': { r: false, t: testStep },
				'start': { r: true, t: testStart },
				'connect': { r: true, t: testConnect },
				'direction': { r: true, t: testDirection },
				'snap': { r: false, t: testSnap },
				'animate': { r: false, t: testAnimate },
				'animationDuration': { r: false, t: testAnimationDuration },
				'range': { r: true, t: testRange },
				'orientation': { r: false, t: testOrientation },
				'margin': { r: false, t: testMargin },
				'limit': { r: false, t: testLimit },
				'behaviour': { r: true, t: testBehaviour },
				'format': { r: false, t: testFormat },
				'tooltips': { r: false, t: testTooltips },
				'cssPrefix': { r: false, t: testCssPrefix },
				'cssClasses': { r: false, t: testCssClasses }
			};

			var defaults = {
				'connect': false,
				'direction': 'ltr',
				'behaviour': 'tap',
				'orientation': 'horizontal',
				'cssPrefix' : 'noUi-',
				'cssClasses': {
					target: 'target',
					base: 'base',
					origin: 'origin',
					handle: 'handle',
					handleLower: 'handle-lower',
					handleUpper: 'handle-upper',
					horizontal: 'horizontal',
					vertical: 'vertical',
					background: 'background',
					connect: 'connect',
					ltr: 'ltr',
					rtl: 'rtl',
					draggable: 'draggable',
					drag: 'state-drag',
					tap: 'state-tap',
					active: 'active',
					stacking: 'stacking',
					tooltip: 'tooltip',
					pips: 'pips',
					pipsHorizontal: 'pips-horizontal',
					pipsVertical: 'pips-vertical',
					marker: 'marker',
					markerHorizontal: 'marker-horizontal',
					markerVertical: 'marker-vertical',
					markerNormal: 'marker-normal',
					markerLarge: 'marker-large',
					markerSub: 'marker-sub',
					value: 'value',
					valueHorizontal: 'value-horizontal',
					valueVertical: 'value-vertical',
					valueNormal: 'value-normal',
					valueLarge: 'value-large',
					valueSub: 'value-sub'
				}
			};

			// Run all options through a testing mechanism to ensure correct
			// input. It should be noted that options might get modified to
			// be handled properly. E.g. wrapping integers in arrays.
			Object.keys(tests).forEach(function( name ){

				// If the option isn't set, but it is required, throw an error.
				if ( options[name] === undefined && defaults[name] === undefined ) {

					if ( tests[name].r ) {
						throw new Error("noUiSlider: '" + name + "' is required.");
					}

					return true;
				}

				tests[name].t( parsed, options[name] === undefined ? defaults[name] : options[name] );
			});

			// Forward pips options
			parsed.pips = options.pips;

			// Pre-define the styles.
			parsed.style = parsed.ort ? 'top' : 'left';

			return parsed;
		}


	function closure ( target, options, originalOptions ){
		var
			actions = getActions( ),
			// All variables local to 'closure' are prefixed with 'scope_'
			scope_Target = target,
			scope_Locations = [-1, -1],
			scope_Base,
			scope_Handles,
			scope_Spectrum = options.spectrum,
			scope_Values = [],
			scope_Events = {},
			scope_Self;


		// Delimit proposed values for handle positions.
		function getPositions ( a, b, delimit ) {

			// Add movement to current position.
			var c = a + b[0], d = a + b[1];

			// Only alter the other position on drag,
			// not on standard sliding.
			if ( delimit ) {
				if ( c < 0 ) {
					d += Math.abs(c);
				}
				if ( d > 100 ) {
					c -= ( d - 100 );
				}

				// Limit values to 0 and 100.
				return [limit(c), limit(d)];
			}

			return [c,d];
		}

		// Provide a clean event with standardized offset values.
		function fixEvent ( e, pageOffset ) {

			// Prevent scrolling and panning on touch events, while
			// attempting to slide. The tap event also depends on this.
			e.preventDefault();

			// Filter the event to register the type, which can be
			// touch, mouse or pointer. Offset changes need to be
			// made on an event specific basis.
			var touch = e.type.indexOf('touch') === 0,
				mouse = e.type.indexOf('mouse') === 0,
				pointer = e.type.indexOf('pointer') === 0,
				x,y, event = e;

			// IE10 implemented pointer events with a prefix;
			if ( e.type.indexOf('MSPointer') === 0 ) {
				pointer = true;
			}

			if ( touch ) {
				// noUiSlider supports one movement at a time,
				// so we can select the first 'changedTouch'.
				x = e.changedTouches[0].pageX;
				y = e.changedTouches[0].pageY;
			}

			pageOffset = pageOffset || getPageOffset();

			if ( mouse || pointer ) {
				x = e.clientX + pageOffset.x;
				y = e.clientY + pageOffset.y;
			}

			event.pageOffset = pageOffset;
			event.points = [x, y];
			event.cursor = mouse || pointer; // Fix #435

			return event;
		}

		// Append a handle to the base.
		function addHandle ( direction, index ) {

			var origin = document.createElement('div'),
				handle = document.createElement('div'),
				classModifier = [options.cssClasses.handleLower, options.cssClasses.handleUpper];

			if ( direction ) {
				classModifier.reverse();
			}

			addClass(handle, options.cssClasses.handle);
			addClass(handle, classModifier[index]);

			addClass(origin, options.cssClasses.origin);
			origin.appendChild(handle);

			return origin;
		}

		// Add the proper connection classes.
		function addConnection ( connect, target, handles ) {

			// Apply the required connection classes to the elements
			// that need them. Some classes are made up for several
			// segments listed in the class list, to allow easy
			// renaming and provide a minor compression benefit.
			switch ( connect ) {
				case 1:	addClass(target, options.cssClasses.connect);
						addClass(handles[0], options.cssClasses.background);
						break;
				case 3: addClass(handles[1], options.cssClasses.background);
						/* falls through */
				case 2: addClass(handles[0], options.cssClasses.connect);
						/* falls through */
				case 0: addClass(target, options.cssClasses.background);
						break;
			}
		}

		// Add handles to the slider base.
		function addHandles ( nrHandles, direction, base ) {

			var index, handles = [];

			// Append handles.
			for ( index = 0; index < nrHandles; index += 1 ) {

				// Keep a list of all added handles.
				handles.push( base.appendChild(addHandle( direction, index )) );
			}

			return handles;
		}

		// Initialize a single slider.
		function addSlider ( direction, orientation, target ) {

			// Apply classes and data to the target.
			addClass(target, options.cssClasses.target);

			if ( direction === 0 ) {
				addClass(target, options.cssClasses.ltr);
			} else {
				addClass(target, options.cssClasses.rtl);
			}

			if ( orientation === 0 ) {
				addClass(target, options.cssClasses.horizontal);
			} else {
				addClass(target, options.cssClasses.vertical);
			}

			var div = document.createElement('div');
			addClass(div, options.cssClasses.base);
			target.appendChild(div);
			return div;
		}


		function addTooltip ( handle, index ) {

			if ( !options.tooltips[index] ) {
				return false;
			}

			var element = document.createElement('div');
			element.className = options.cssClasses.tooltip;
			return handle.firstChild.appendChild(element);
		}

		// The tooltips option is a shorthand for using the 'update' event.
		function tooltips ( ) {

			if ( options.dir ) {
				options.tooltips.reverse();
			}

			// Tooltips are added with options.tooltips in original order.
			var tips = scope_Handles.map(addTooltip);

			if ( options.dir ) {
				tips.reverse();
				options.tooltips.reverse();
			}

			bindEvent('update', function(f, o, r) {
				if ( tips[o] ) {
					tips[o].innerHTML = options.tooltips[o] === true ? f[o] : options.tooltips[o].to(r[o]);
				}
			});
		}


		function getGroup ( mode, values, stepped ) {

			// Use the range.
			if ( mode === 'range' || mode === 'steps' ) {
				return scope_Spectrum.xVal;
			}

			if ( mode === 'count' ) {

				// Divide 0 - 100 in 'count' parts.
				var spread = ( 100 / (values-1) ), v, i = 0;
				values = [];

				// List these parts and have them handled as 'positions'.
				while ((v=i++*spread) <= 100 ) {
					values.push(v);
				}

				mode = 'positions';
			}

			if ( mode === 'positions' ) {

				// Map all percentages to on-range values.
				return values.map(function( value ){
					return scope_Spectrum.fromStepping( stepped ? scope_Spectrum.getStep( value ) : value );
				});
			}

			if ( mode === 'values' ) {

				// If the value must be stepped, it needs to be converted to a percentage first.
				if ( stepped ) {

					return values.map(function( value ){

						// Convert to percentage, apply step, return to value.
						return scope_Spectrum.fromStepping( scope_Spectrum.getStep( scope_Spectrum.toStepping( value ) ) );
					});

				}

				// Otherwise, we can simply use the values.
				return values;
			}
		}

		function generateSpread ( density, mode, group ) {

			function safeIncrement(value, increment) {
				// Avoid floating point variance by dropping the smallest decimal places.
				return (value + increment).toFixed(7) / 1;
			}

			var originalSpectrumDirection = scope_Spectrum.direction,
				indexes = {},
				firstInRange = scope_Spectrum.xVal[0],
				lastInRange = scope_Spectrum.xVal[scope_Spectrum.xVal.length-1],
				ignoreFirst = false,
				ignoreLast = false,
				prevPct = 0;

			// This function loops the spectrum in an ltr linear fashion,
			// while the toStepping method is direction aware. Trick it into
			// believing it is ltr.
			scope_Spectrum.direction = 0;

			// Create a copy of the group, sort it and filter away all duplicates.
			group = unique(group.slice().sort(function(a, b){ return a - b; }));

			// Make sure the range starts with the first element.
			if ( group[0] !== firstInRange ) {
				group.unshift(firstInRange);
				ignoreFirst = true;
			}

			// Likewise for the last one.
			if ( group[group.length - 1] !== lastInRange ) {
				group.push(lastInRange);
				ignoreLast = true;
			}

			group.forEach(function ( current, index ) {

				// Get the current step and the lower + upper positions.
				var step, i, q,
					low = current,
					high = group[index+1],
					newPct, pctDifference, pctPos, type,
					steps, realSteps, stepsize;

				// When using 'steps' mode, use the provided steps.
				// Otherwise, we'll step on to the next subrange.
				if ( mode === 'steps' ) {
					step = scope_Spectrum.xNumSteps[ index ];
				}

				// Default to a 'full' step.
				if ( !step ) {
					step = high-low;
				}

				// Low can be 0, so test for false. If high is undefined,
				// we are at the last subrange. Index 0 is already handled.
				if ( low === false || high === undefined ) {
					return;
				}

				// Find all steps in the subrange.
				for ( i = low; i <= high; i = safeIncrement(i, step) ) {

					// Get the percentage value for the current step,
					// calculate the size for the subrange.
					newPct = scope_Spectrum.toStepping( i );
					pctDifference = newPct - prevPct;

					steps = pctDifference / density;
					realSteps = Math.round(steps);

					// This ratio represents the ammount of percentage-space a point indicates.
					// For a density 1 the points/percentage = 1. For density 2, that percentage needs to be re-devided.
					// Round the percentage offset to an even number, then divide by two
					// to spread the offset on both sides of the range.
					stepsize = pctDifference/realSteps;

					// Divide all points evenly, adding the correct number to this subrange.
					// Run up to <= so that 100% gets a point, event if ignoreLast is set.
					for ( q = 1; q <= realSteps; q += 1 ) {

						// The ratio between the rounded value and the actual size might be ~1% off.
						// Correct the percentage offset by the number of points
						// per subrange. density = 1 will result in 100 points on the
						// full range, 2 for 50, 4 for 25, etc.
						pctPos = prevPct + ( q * stepsize );
						indexes[pctPos.toFixed(5)] = ['x', 0];
					}

					// Determine the point type.
					type = (group.indexOf(i) > -1) ? 1 : ( mode === 'steps' ? 2 : 0 );

					// Enforce the 'ignoreFirst' option by overwriting the type for 0.
					if ( !index && ignoreFirst ) {
						type = 0;
					}

					if ( !(i === high && ignoreLast)) {
						// Mark the 'type' of this point. 0 = plain, 1 = real value, 2 = step value.
						indexes[newPct.toFixed(5)] = [i, type];
					}

					// Update the percentage count.
					prevPct = newPct;
				}
			});

			// Reset the spectrum.
			scope_Spectrum.direction = originalSpectrumDirection;

			return indexes;
		}

		function addMarking ( spread, filterFunc, formatter ) {

			var element = document.createElement('div'),
				out = '',
				valueSizeClasses = [
					options.cssClasses.valueNormal,
					options.cssClasses.valueLarge,
					options.cssClasses.valueSub
				],
				markerSizeClasses = [
					options.cssClasses.markerNormal,
					options.cssClasses.markerLarge,
					options.cssClasses.markerSub
				],
				valueOrientationClasses = [
					options.cssClasses.valueHorizontal,
					options.cssClasses.valueVertical
				],
				markerOrientationClasses = [
					options.cssClasses.markerHorizontal,
					options.cssClasses.markerVertical
				];

			addClass(element, options.cssClasses.pips);
			addClass(element, options.ort === 0 ? options.cssClasses.pipsHorizontal : options.cssClasses.pipsVertical);

			function getClasses( type, source ){
				var a = source === options.cssClasses.value,
					orientationClasses = a ? valueOrientationClasses : markerOrientationClasses,
					sizeClasses = a ? valueSizeClasses : markerSizeClasses;

				return source + ' ' + orientationClasses[options.ort] + ' ' + sizeClasses[type];
			}

			function getTags( offset, source, values ) {
				return 'class="' + getClasses(values[1], source) + '" style="' + options.style + ': ' + offset + '%"';
			}

			function addSpread ( offset, values ){

				if ( scope_Spectrum.direction ) {
					offset = 100 - offset;
				}

				// Apply the filter function, if it is set.
				values[1] = (values[1] && filterFunc) ? filterFunc(values[0], values[1]) : values[1];

				// Add a marker for every point
				out += '<div ' + getTags(offset, options.cssClasses.marker, values) + '></div>';

				// Values are only appended for points marked '1' or '2'.
				if ( values[1] ) {
					out += '<div ' + getTags(offset, options.cssClasses.value, values) + '>' + formatter.to(values[0]) + '</div>';
				}
			}

			// Append all points.
			Object.keys(spread).forEach(function(a){
				addSpread(a, spread[a]);
			});

			element.innerHTML = out;

			return element;
		}

		function pips ( grid ) {

		var mode = grid.mode,
			density = grid.density || 1,
			filter = grid.filter || false,
			values = grid.values || false,
			stepped = grid.stepped || false,
			group = getGroup( mode, values, stepped ),
			spread = generateSpread( density, mode, group ),
			format = grid.format || {
				to: Math.round
			};

			return scope_Target.appendChild(addMarking(
				spread,
				filter,
				format
			));
		}


		// Shorthand for base dimensions.
		function baseSize ( ) {
			var rect = scope_Base.getBoundingClientRect(), alt = 'offset' + ['Width', 'Height'][options.ort];
			return options.ort === 0 ? (rect.width||scope_Base[alt]) : (rect.height||scope_Base[alt]);
		}

		// External event handling
		function fireEvent ( event, handleNumber, tap ) {

			var i;

			// During initialization, do not fire events.
			for ( i = 0; i < options.handles; i++ ) {
				if ( scope_Locations[i] === -1 ) {
					return;
				}
			}

			if ( handleNumber !== undefined && options.handles !== 1 ) {
				handleNumber = Math.abs(handleNumber - options.dir);
			}

			Object.keys(scope_Events).forEach(function( targetEvent ) {

				var eventType = targetEvent.split('.')[0];

				if ( event === eventType ) {
					scope_Events[targetEvent].forEach(function( callback ) {

						callback.call(
							// Use the slider public API as the scope ('this')
							scope_Self,
							// Return values as array, so arg_1[arg_2] is always valid.
							asArray(valueGet()),
							// Handle index, 0 or 1
							handleNumber,
							// Unformatted slider values
							asArray(inSliderOrder(Array.prototype.slice.call(scope_Values))),
							// Event is fired by tap, true or false
							tap || false,
							// Left offset of the handle, in relation to the slider
							scope_Locations
						);
					});
				}
			});
		}

		// Returns the input array, respecting the slider direction configuration.
		function inSliderOrder ( values ) {

			// If only one handle is used, return a single value.
			if ( values.length === 1 ){
				return values[0];
			}

			if ( options.dir ) {
				return values.reverse();
			}

			return values;
		}


		// Handler for attaching events trough a proxy.
		function attach ( events, element, callback, data ) {

			// This function can be used to 'filter' events to the slider.
			// element is a node, not a nodeList

			var method = function ( e ){

				if ( scope_Target.hasAttribute('disabled') ) {
					return false;
				}

				// Stop if an active 'tap' transition is taking place.
				if ( hasClass(scope_Target, options.cssClasses.tap) ) {
					return false;
				}

				e = fixEvent(e, data.pageOffset);

				// Ignore right or middle clicks on start #454
				if ( events === actions.start && e.buttons !== undefined && e.buttons > 1 ) {
					return false;
				}

				// Ignore right or middle clicks on start #454
				if ( data.hover && e.buttons ) {
					return false;
				}

				e.calcPoint = e.points[ options.ort ];

				// Call the event handler with the event [ and additional data ].
				callback ( e, data );

			}, methods = [];

			// Bind a closure on the target for every event type.
			events.split(' ').forEach(function( eventName ){
				element.addEventListener(eventName, method, false);
				methods.push([eventName, method]);
			});

			return methods;
		}

		// Handle movement on document for handle and range drag.
		function move ( event, data ) {

			// Fix #498
			// Check value of .buttons in 'start' to work around a bug in IE10 mobile (data.buttonsProperty).
			// https://connect.microsoft.com/IE/feedback/details/927005/mobile-ie10-windows-phone-buttons-property-of-pointermove-event-always-zero
			// IE9 has .buttons and .which zero on mousemove.
			// Firefox breaks the spec MDN defines.
			if ( navigator.appVersion.indexOf("MSIE 9") === -1 && event.buttons === 0 && data.buttonsProperty !== 0 ) {
				return end(event, data);
			}

			var handles = data.handles || scope_Handles, positions, state = false,
				proposal = ((event.calcPoint - data.start) * 100) / data.baseSize,
				handleNumber = handles[0] === scope_Handles[0] ? 0 : 1, i;

			// Calculate relative positions for the handles.
			positions = getPositions( proposal, data.positions, handles.length > 1);

			state = setHandle ( handles[0], positions[handleNumber], handles.length === 1 );

			if ( handles.length > 1 ) {

				state = setHandle ( handles[1], positions[handleNumber?0:1], false ) || state;

				if ( state ) {
					// fire for both handles
					for ( i = 0; i < data.handles.length; i++ ) {
						fireEvent('slide', i);
					}
				}
			} else if ( state ) {
				// Fire for a single handle
				fireEvent('slide', handleNumber);
			}
		}

		// Unbind move events on document, call callbacks.
		function end ( event, data ) {

			// The handle is no longer active, so remove the class.
			var active = scope_Base.querySelector( '.' + options.cssClasses.active ),
				handleNumber = data.handles[0] === scope_Handles[0] ? 0 : 1;

			if ( active !== null ) {
				removeClass(active, options.cssClasses.active);
			}

			// Remove cursor styles and text-selection events bound to the body.
			if ( event.cursor ) {
				document.body.style.cursor = '';
				document.body.removeEventListener('selectstart', document.body.noUiListener);
			}

			var d = document.documentElement;

			// Unbind the move and end events, which are added on 'start'.
			d.noUiListeners.forEach(function( c ) {
				d.removeEventListener(c[0], c[1]);
			});

			// Remove dragging class.
			removeClass(scope_Target, options.cssClasses.drag);

			// Fire the change and set events.
			fireEvent('set', handleNumber);
			fireEvent('change', handleNumber);

			// If this is a standard handle movement, fire the end event.
			if ( data.handleNumber !== undefined ) {
				fireEvent('end', data.handleNumber);
			}
		}

		// Fire 'end' when a mouse or pen leaves the document.
		function documentLeave ( event, data ) {
			if ( event.type === "mouseout" && event.target.nodeName === "HTML" && event.relatedTarget === null ){
				end ( event, data );
			}
		}

		// Bind move events on document.
		function start ( event, data ) {

			var d = document.documentElement;

			// Mark the handle as 'active' so it can be styled.
			if ( data.handles.length === 1 ) {
				// Support 'disabled' handles
				if ( data.handles[0].hasAttribute('disabled') ) {
					return false;
				}

				addClass(data.handles[0].children[0], options.cssClasses.active);
			}

			// Fix #551, where a handle gets selected instead of dragged.
			event.preventDefault();

			// A drag should never propagate up to the 'tap' event.
			event.stopPropagation();

			// Attach the move and end events.
			var moveEvent = attach(actions.move, d, move, {
				start: event.calcPoint,
				baseSize: baseSize(),
				pageOffset: event.pageOffset,
				handles: data.handles,
				handleNumber: data.handleNumber,
				buttonsProperty: event.buttons,
				positions: [
					scope_Locations[0],
					scope_Locations[scope_Handles.length - 1]
				]
			}), endEvent = attach(actions.end, d, end, {
				handles: data.handles,
				handleNumber: data.handleNumber
			});

			var outEvent = attach("mouseout", d, documentLeave, {
				handles: data.handles,
				handleNumber: data.handleNumber
			});

			d.noUiListeners = moveEvent.concat(endEvent, outEvent);

			// Text selection isn't an issue on touch devices,
			// so adding cursor styles can be skipped.
			if ( event.cursor ) {

				// Prevent the 'I' cursor and extend the range-drag cursor.
				document.body.style.cursor = getComputedStyle(event.target).cursor;

				// Mark the target with a dragging state.
				if ( scope_Handles.length > 1 ) {
					addClass(scope_Target, options.cssClasses.drag);
				}

				var f = function(){
					return false;
				};

				document.body.noUiListener = f;

				// Prevent text selection when dragging the handles.
				document.body.addEventListener('selectstart', f, false);
			}

			if ( data.handleNumber !== undefined ) {
				fireEvent('start', data.handleNumber);
			}
		}

		// Move closest handle to tapped location.
		function tap ( event ) {

			var location = event.calcPoint, total = 0, handleNumber, to;

			// The tap event shouldn't propagate up and cause 'edge' to run.
			event.stopPropagation();

			// Add up the handle offsets.
			scope_Handles.forEach(function(a){
				total += offset(a)[ options.style ];
			});

			// Find the handle closest to the tapped position.
			handleNumber = ( location < total/2 || scope_Handles.length === 1 ) ? 0 : 1;

			// Check if handler is not disablet if yes set number to the next handler
			if (scope_Handles[handleNumber].hasAttribute('disabled')) {
				handleNumber = handleNumber ? 0 : 1;
			}

			location -= offset(scope_Base)[ options.style ];

			// Calculate the new position.
			to = ( location * 100 ) / baseSize();

			if ( !options.events.snap ) {
				// Flag the slider as it is now in a transitional state.
				// Transition takes a configurable amount of ms (default 300). Re-enable the slider after that.
				addClassFor( scope_Target, options.cssClasses.tap, options.animationDuration );
			}

			// Support 'disabled' handles
			if ( scope_Handles[handleNumber].hasAttribute('disabled') ) {
				return false;
			}

			// Find the closest handle and calculate the tapped point.
			// The set handle to the new position.
			setHandle( scope_Handles[handleNumber], to );

			fireEvent('slide', handleNumber, true);
			fireEvent('set', handleNumber, true);
			fireEvent('change', handleNumber, true);

			if ( options.events.snap ) {
				start(event, { handles: [scope_Handles[handleNumber]] });
			}
		}

		// Fires a 'hover' event for a hovered mouse/pen position.
		function hover ( event ) {

			var location = event.calcPoint - offset(scope_Base)[ options.style ],
				to = scope_Spectrum.getStep(( location * 100 ) / baseSize()),
				value = scope_Spectrum.fromStepping( to );

			Object.keys(scope_Events).forEach(function( targetEvent ) {
				if ( 'hover' === targetEvent.split('.')[0] ) {
					scope_Events[targetEvent].forEach(function( callback ) {
						callback.call( scope_Self, value );
					});
				}
			});
		}

		// Attach events to several slider parts.
		function events ( behaviour ) {

			// Attach the standard drag event to the handles.
			if ( !behaviour.fixed ) {

				scope_Handles.forEach(function( handle, index ){

					// These events are only bound to the visual handle
					// element, not the 'real' origin element.
					attach ( actions.start, handle.children[0], start, {
						handles: [ handle ],
						handleNumber: index
					});
				});
			}

			// Attach the tap event to the slider base.
			if ( behaviour.tap ) {

				attach ( actions.start, scope_Base, tap, {
					handles: scope_Handles
				});
			}

			// Fire hover events
			if ( behaviour.hover ) {
				attach ( actions.move, scope_Base, hover, { hover: true } );
			}

			// Make the range draggable.
			if ( behaviour.drag ){

				var drag = [scope_Base.querySelector( '.' + options.cssClasses.connect )];
				addClass(drag[0], options.cssClasses.draggable);

				// When the range is fixed, the entire range can
				// be dragged by the handles. The handle in the first
				// origin will propagate the start event upward,
				// but it needs to be bound manually on the other.
				if ( behaviour.fixed ) {
					drag.push(scope_Handles[(drag[0] === scope_Handles[0] ? 1 : 0)].children[0]);
				}

				drag.forEach(function( element ) {
					attach ( actions.start, element, start, {
						handles: scope_Handles
					});
				});
			}
		}


		// Test suggested values and apply margin, step.
		function setHandle ( handle, to, noLimitOption ) {

			var trigger = handle !== scope_Handles[0] ? 1 : 0,
				lowerMargin = scope_Locations[0] + options.margin,
				upperMargin = scope_Locations[1] - options.margin,
				lowerLimit = scope_Locations[0] + options.limit,
				upperLimit = scope_Locations[1] - options.limit;

			// For sliders with multiple handles,
			// limit movement to the other handle.
			// Apply the margin option by adding it to the handle positions.
			if ( scope_Handles.length > 1 ) {
				to = trigger ? Math.max( to, lowerMargin ) : Math.min( to, upperMargin );
			}

			// The limit option has the opposite effect, limiting handles to a
			// maximum distance from another. Limit must be > 0, as otherwise
			// handles would be unmoveable. 'noLimitOption' is set to 'false'
			// for the .val() method, except for pass 4/4.
			if ( noLimitOption !== false && options.limit && scope_Handles.length > 1 ) {
				to = trigger ? Math.min ( to, lowerLimit ) : Math.max( to, upperLimit );
			}

			// Handle the step option.
			to = scope_Spectrum.getStep( to );

			// Limit percentage to the 0 - 100 range
			to = limit(to);

			// Return false if handle can't move
			if ( to === scope_Locations[trigger] ) {
				return false;
			}

			// Set the handle to the new position.
			// Use requestAnimationFrame for efficient painting.
			// No significant effect in Chrome, Edge sees dramatic
			// performace improvements.
			if ( window.requestAnimationFrame ) {
				window.requestAnimationFrame(function(){
					handle.style[options.style] = to + '%';
				});
			} else {
				handle.style[options.style] = to + '%';
			}

			// Force proper handle stacking
			if ( !handle.previousSibling ) {
				removeClass(handle, options.cssClasses.stacking);
				if ( to > 50 ) {
					addClass(handle, options.cssClasses.stacking);
				}
			}

			// Update locations.
			scope_Locations[trigger] = to;

			// Convert the value to the slider stepping/range.
			scope_Values[trigger] = scope_Spectrum.fromStepping( to );

			fireEvent('update', trigger);

			return true;
		}

		// Loop values from value method and apply them.
		function setValues ( count, values ) {

			var i, trigger, to;

			// With the limit option, we'll need another limiting pass.
			if ( options.limit ) {
				count += 1;
			}

			// If there are multiple handles to be set run the setting
			// mechanism twice for the first handle, to make sure it
			// can be bounced of the second one properly.
			for ( i = 0; i < count; i += 1 ) {

				trigger = i%2;

				// Get the current argument from the array.
				to = values[trigger];

				// Setting with null indicates an 'ignore'.
				// Inputting 'false' is invalid.
				if ( to !== null && to !== false ) {

					// If a formatted number was passed, attemt to decode it.
					if ( typeof to === 'number' ) {
						to = String(to);
					}

					to = options.format.from( to );

					// Request an update for all links if the value was invalid.
					// Do so too if setting the handle fails.
					if ( to === false || isNaN(to) || setHandle( scope_Handles[trigger], scope_Spectrum.toStepping( to ), i === (3 - options.dir) ) === false ) {
						fireEvent('update', trigger);
					}
				}
			}
		}

		// Set the slider value.
		function valueSet ( input, fireSetEvent ) {

			var count, values = asArray( input ), i;

			// Event fires by default
			fireSetEvent = (fireSetEvent === undefined ? true : !!fireSetEvent);

			// The RTL settings is implemented by reversing the front-end,
			// internal mechanisms are the same.
			if ( options.dir && options.handles > 1 ) {
				values.reverse();
			}

			// Animation is optional.
			// Make sure the initial values where set before using animated placement.
			if ( options.animate && scope_Locations[0] !== -1 ) {
				addClassFor( scope_Target, options.cssClasses.tap, options.animationDuration );
			}

			// Determine how often to set the handles.
			count = scope_Handles.length > 1 ? 3 : 1;

			if ( values.length === 1 ) {
				count = 1;
			}

			setValues ( count, values );

			// Fire the 'set' event for both handles.
			for ( i = 0; i < scope_Handles.length; i++ ) {

				// Fire the event only for handles that received a new value, as per #579
				if ( values[i] !== null && fireSetEvent ) {
					fireEvent('set', i);
				}
			}
		}

		// Get the slider value.
		function valueGet ( ) {

			var i, retour = [];

			// Get the value from all handles.
			for ( i = 0; i < options.handles; i += 1 ){
				retour[i] = options.format.to( scope_Values[i] );
			}

			return inSliderOrder( retour );
		}

		// Removes classes from the root and empties it.
		function destroy ( ) {

			for ( var key in options.cssClasses ) {
				if ( !options.cssClasses.hasOwnProperty(key) ) { continue; }
				removeClass(scope_Target, options.cssClasses[key]);
			}

			while (scope_Target.firstChild) {
				scope_Target.removeChild(scope_Target.firstChild);
			}

			delete scope_Target.noUiSlider;
		}

		// Get the current step size for the slider.
		function getCurrentStep ( ) {

			// Check all locations, map them to their stepping point.
			// Get the step point, then find it in the input list.
			var retour = scope_Locations.map(function( location, index ){

				var step = scope_Spectrum.getApplicableStep( location ),

					// As per #391, the comparison for the decrement step can have some rounding issues.
					// Round the value to the precision used in the step.
					stepDecimals = countDecimals(String(step[2])),

					// Get the current numeric value
					value = scope_Values[index],

					// To move the slider 'one step up', the current step value needs to be added.
					// Use null if we are at the maximum slider value.
					increment = location === 100 ? null : step[2],

					// Going 'one step down' might put the slider in a different sub-range, so we
					// need to switch between the current or the previous step.
					prev = Number((value - step[2]).toFixed(stepDecimals)),

					// If the value fits the step, return the current step value. Otherwise, use the
					// previous step. Return null if the slider is at its minimum value.
					decrement = location === 0 ? null : (prev >= step[1]) ? step[2] : (step[0] || false);

				return [decrement, increment];
			});

			// Return values in the proper order.
			return inSliderOrder( retour );
		}

		// Attach an event to this slider, possibly including a namespace
		function bindEvent ( namespacedEvent, callback ) {
			scope_Events[namespacedEvent] = scope_Events[namespacedEvent] || [];
			scope_Events[namespacedEvent].push(callback);

			// If the event bound is 'update,' fire it immediately for all handles.
			if ( namespacedEvent.split('.')[0] === 'update' ) {
				scope_Handles.forEach(function(a, index){
					fireEvent('update', index);
				});
			}
		}

		// Undo attachment of event
		function removeEvent ( namespacedEvent ) {

			var event = namespacedEvent && namespacedEvent.split('.')[0],
				namespace = event && namespacedEvent.substring(event.length);

			Object.keys(scope_Events).forEach(function( bind ){

				var tEvent = bind.split('.')[0],
					tNamespace = bind.substring(tEvent.length);

				if ( (!event || event === tEvent) && (!namespace || namespace === tNamespace) ) {
					delete scope_Events[bind];
				}
			});
		}

		// Updateable: margin, limit, step, range, animate, snap
		function updateOptions ( optionsToUpdate, fireSetEvent ) {

			// Spectrum is created using the range, snap, direction and step options.
			// 'snap' and 'step' can be updated, 'direction' cannot, due to event binding.
			// If 'snap' and 'step' are not passed, they should remain unchanged.
			var v = valueGet(), newOptions = testOptions({
				start: [0, 0],
				margin: optionsToUpdate.margin,
				limit: optionsToUpdate.limit,
				step: optionsToUpdate.step === undefined ? options.singleStep : optionsToUpdate.step,
				range: optionsToUpdate.range,
				animate: optionsToUpdate.animate,
				snap: optionsToUpdate.snap === undefined ? options.snap : optionsToUpdate.snap
			});

			['margin', 'limit', 'range', 'animate'].forEach(function(name){

				// Only change options that we're actually passed to update.
				if ( optionsToUpdate[name] !== undefined ) {
					options[name] = optionsToUpdate[name];
				}
			});

			// Save current spectrum direction as testOptions in testRange call
			// doesn't rely on current direction
			newOptions.spectrum.direction = scope_Spectrum.direction;
			scope_Spectrum = newOptions.spectrum;

			// Invalidate the current positioning so valueSet forces an update.
			scope_Locations = [-1, -1];
			valueSet(optionsToUpdate.start || v, fireSetEvent);
		}


		// Throw an error if the slider was already initialized.
		if ( scope_Target.noUiSlider ) {
			throw new Error('Slider was already initialized.');
		}

		// Create the base element, initialise HTML and set classes.
		// Add handles and links.
		scope_Base = addSlider( options.dir, options.ort, scope_Target );
		scope_Handles = addHandles( options.handles, options.dir, scope_Base );

		// Set the connect classes.
		addConnection ( options.connect, scope_Target, scope_Handles );

		if ( options.pips ) {
			pips(options.pips);
		}

		if ( options.tooltips ) {
			tooltips();
		}

		scope_Self = {
			destroy: destroy,
			steps: getCurrentStep,
			on: bindEvent,
			off: removeEvent,
			get: valueGet,
			set: valueSet,
			updateOptions: updateOptions,
			options: originalOptions, // Issue #600
			target: scope_Target, // Issue #597
			pips: pips // Issue #594
		};

		// Attach user events.
		events( options.events );

		return scope_Self;

	}


		// Run the standard initializer
		function initialize ( target, originalOptions ) {

			if ( !target.nodeName ) {
				throw new Error('noUiSlider.create requires a single element.');
			}

			// Test the options and create the slider environment;
			var options = testOptions( originalOptions, target ),
				slider = closure( target, options, originalOptions );

			// Use the public value method to set the start values.
			slider.set(options.start);

			target.noUiSlider = slider;
			return slider;
		}

		// Use an object instead of a function for future expansibility;
		return {
			create: initialize
		};

	}));

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(45);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(24)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../css-loader/index.js?-url!../../sass-loader/index.js!./nouislider.min.css", function() {
				var newContent = require("!!../../css-loader/index.js?-url!../../sass-loader/index.js!./nouislider.min.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(23)();
	// imports


	// module
	exports.push([module.id, "/*! nouislider - 8.5.1 - 2016-04-24 16:00:30 */\n.noUi-target, .noUi-target * {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -ms-touch-action: none;\n  touch-action: none;\n  -ms-user-select: none;\n  -moz-user-select: none;\n  user-select: none;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box; }\n\n.noUi-target {\n  position: relative;\n  direction: ltr; }\n\n.noUi-base {\n  width: 100%;\n  height: 100%;\n  position: relative;\n  z-index: 1; }\n\n.noUi-origin {\n  position: absolute;\n  right: 0;\n  top: 0;\n  left: 0;\n  bottom: 0; }\n\n.noUi-handle {\n  position: relative;\n  z-index: 1; }\n\n.noUi-stacking .noUi-handle {\n  z-index: 10; }\n\n.noUi-state-tap .noUi-origin {\n  -webkit-transition: left .3s,top .3s;\n  transition: left .3s,top .3s; }\n\n.noUi-state-drag * {\n  cursor: inherit !important; }\n\n.noUi-base, .noUi-handle {\n  -webkit-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0); }\n\n.noUi-horizontal {\n  height: 18px; }\n\n.noUi-horizontal .noUi-handle {\n  width: 34px;\n  height: 28px;\n  left: -17px;\n  top: -6px; }\n\n.noUi-vertical {\n  width: 18px; }\n\n.noUi-vertical .noUi-handle {\n  width: 28px;\n  height: 34px;\n  left: -6px;\n  top: -17px; }\n\n.noUi-background {\n  background: #FAFAFA;\n  box-shadow: inset 0 1px 1px #f0f0f0; }\n\n.noUi-connect {\n  background: #3FB8AF;\n  box-shadow: inset 0 0 3px rgba(51, 51, 51, 0.45);\n  -webkit-transition: background 450ms;\n  transition: background 450ms; }\n\n.noUi-origin {\n  border-radius: 2px; }\n\n.noUi-target {\n  border-radius: 4px;\n  border: 1px solid #D3D3D3;\n  box-shadow: inset 0 1px 1px #F0F0F0,0 3px 6px -5px #BBB; }\n\n.noUi-target.noUi-connect {\n  box-shadow: inset 0 0 3px rgba(51, 51, 51, 0.45), 0 3px 6px -5px #BBB; }\n\n.noUi-draggable {\n  cursor: w-resize; }\n\n.noUi-vertical .noUi-draggable {\n  cursor: n-resize; }\n\n.noUi-handle {\n  border: 1px solid #D9D9D9;\n  border-radius: 3px;\n  background: #FFF;\n  cursor: default;\n  box-shadow: inset 0 0 1px #FFF,inset 0 1px 7px #EBEBEB,0 3px 6px -3px #BBB; }\n\n.noUi-active {\n  box-shadow: inset 0 0 1px #FFF,inset 0 1px 7px #DDD,0 3px 6px -3px #BBB; }\n\n.noUi-handle:after, .noUi-handle:before {\n  content: \"\";\n  display: block;\n  position: absolute;\n  height: 14px;\n  width: 1px;\n  background: #E8E7E6;\n  left: 14px;\n  top: 6px; }\n\n.noUi-handle:after {\n  left: 17px; }\n\n.noUi-vertical .noUi-handle:after, .noUi-vertical .noUi-handle:before {\n  width: 14px;\n  height: 1px;\n  left: 6px;\n  top: 14px; }\n\n.noUi-vertical .noUi-handle:after {\n  top: 17px; }\n\n[disabled] .noUi-connect, [disabled].noUi-connect {\n  background: #B8B8B8; }\n\n[disabled] .noUi-handle, [disabled].noUi-origin {\n  cursor: not-allowed; }\n\n.noUi-pips, .noUi-pips * {\n  -moz-box-sizing: border-box;\n  box-sizing: border-box; }\n\n.noUi-pips {\n  position: absolute;\n  color: #999; }\n\n.noUi-value {\n  position: absolute;\n  text-align: center; }\n\n.noUi-value-sub {\n  color: #ccc;\n  font-size: 10px; }\n\n.noUi-marker {\n  position: absolute;\n  background: #CCC; }\n\n.noUi-marker-large, .noUi-marker-sub {\n  background: #AAA; }\n\n.noUi-pips-horizontal {\n  padding: 10px 0;\n  height: 80px;\n  top: 100%;\n  left: 0;\n  width: 100%; }\n\n.noUi-value-horizontal {\n  -webkit-transform: translate3d(-50%, 50%, 0);\n  transform: translate3d(-50%, 50%, 0); }\n\n.noUi-marker-horizontal.noUi-marker {\n  margin-left: -1px;\n  width: 2px;\n  height: 5px; }\n\n.noUi-marker-horizontal.noUi-marker-sub {\n  height: 10px; }\n\n.noUi-marker-horizontal.noUi-marker-large {\n  height: 15px; }\n\n.noUi-pips-vertical {\n  padding: 0 10px;\n  height: 100%;\n  top: 0;\n  left: 100%; }\n\n.noUi-value-vertical {\n  -webkit-transform: translate3d(0, -50%, 0);\n  transform: translate3d(0, -50%, 0);\n  padding-left: 25px; }\n\n.noUi-marker-vertical.noUi-marker {\n  width: 5px;\n  height: 2px;\n  margin-top: -1px; }\n\n.noUi-marker-vertical.noUi-marker-sub {\n  width: 10px; }\n\n.noUi-marker-vertical.noUi-marker-large {\n  width: 15px; }\n\n.noUi-tooltip {\n  display: block;\n  position: absolute;\n  border: 1px solid #D9D9D9;\n  border-radius: 3px;\n  background: #fff;\n  padding: 5px;\n  text-align: center; }\n\n.noUi-horizontal .noUi-handle-lower .noUi-tooltip {\n  top: -32px; }\n\n.noUi-horizontal .noUi-handle-upper .noUi-tooltip {\n  bottom: -32px; }\n\n.noUi-vertical .noUi-handle-lower .noUi-tooltip {\n  left: 120%; }\n\n.noUi-vertical .noUi-handle-upper .noUi-tooltip {\n  right: 120%; }\n", ""]);

	// exports


/***/ }),
/* 46 */
/***/ (function(module, exports) {

	module.exports = "<span class=\"controls-play\"></span>\n<div class=\"controls-slider\">\n\t<div class=\"slider\"></div>\n</div>\n<div class=\"controls-speed\">\n\t<div class=\"elem-speed\">\n\t\t<ul class=\"controls-speed-number\">\n\t\t\t<li class=\"block-speed block-speed-3\" >x3</li>\n\t\t\t<li class=\"block-speed block-speed-2\" >x2</li>\n\t\t\t<li class=\"block-speed block-speed-1\" >x1</li>\n\t\t\t<li class=\"block-speed block-speed-05\" >x0.5</li>\n\t\t</ul>\n\t</div>\n\t<span class=\"speed-default\">x1</span>\n</div>\n\n<span class=\"controls-subtitles\"></span>\n<span class=\"controls-dictionary loading-dictionary\"></span>\n"

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(48);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(24)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../node_modules/css-loader/index.js?-url!../../../node_modules/sass-loader/index.js!./controls.scss", function() {
				var newContent = require("!!../../../node_modules/css-loader/index.js?-url!../../../node_modules/sass-loader/index.js!./controls.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(23)();
	// imports


	// module
	exports.push([module.id, ".controls {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -moz-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n  -ms-flex-align: center;\n  -webkit-align-items: center;\n  -moz-align-items: center;\n  align-items: center;\n  padding: 10px;\n  width: calc(100% - 10px);\n  height: 60px;\n  margin: 0 5px;\n  background-size: 100% 100%; }\n  .controls .controls-play, .controls .controls-subtitles, .controls .controls-slider {\n    margin: 0 9px;\n    cursor: pointer; }\n  .controls .controls-play:before {\n    content: url(assets/component-play.png); }\n  .controls.playing .controls-play:before {\n    content: url(assets/component-pause.png); }\n  .controls.stopped .controls-play:before {\n    content: url(assets/component-restart.png); }\n  .controls.subtitles .controls-subtitles:before {\n    content: url(assets/component-legenda-habilitar.png); }\n  .controls .controls-subtitles:before {\n    content: url(assets/component-legenda-desabilitar.png); }\n\n@-webkit-keyframes spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n    /* Chrome, Opera 15+, Safari 3.1+ */\n    -ms-transform: rotate(0deg);\n    /* IE 9 */\n    transform: rotate(0deg);\n    /* Firefox 16+, IE 10+, Opera */ }\n  100% {\n    -webkit-transform: rotate(360deg);\n    /* Chrome, Opera 15+, Safari 3.1+ */\n    -ms-transform: rotate(360deg);\n    /* IE 9 */\n    transform: rotate(360deg);\n    /* Firefox 16+, IE 10+, Opera */ } }\n\n@keyframes spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n    /* Chrome, Opera 15+, Safari 3.1+ */\n    -ms-transform: rotate(0deg);\n    /* IE 9 */\n    transform: rotate(0deg);\n    /* Firefox 16+, IE 10+, Opera */ }\n  100% {\n    -webkit-transform: rotate(360deg);\n    /* Chrome, Opera 15+, Safari 3.1+ */\n    -ms-transform: rotate(360deg);\n    /* IE 9 */\n    transform: rotate(360deg);\n    /* Firefox 16+, IE 10+, Opera */ } }\n\n.speed-default {\n  border: 1px solid grey;\n  border-radius: 3px 3px 3px 3px;\n  padding: 3px 4px;\n  width: 100%;\n  height: 100%;\n  color: grey;\n  font-size: 15px;\n  cursor: pointer; }\n\n.elem-speed {\n  display: none;\n  position: absolute;\n  bottom: 20px;\n  cursor: pointer; }\n\n.block-speed {\n  list-style-type: none;\n  background-color: #003F86;\n  color: white;\n  font-size: 12px;\n  width: 25px;\n  text-align: center; }\n\n.block-speed:hover {\n  color: #67C8D5; }\n\n.controls-speed {\n  position: relative;\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.controls-speed-number {\n  width: 25px;\n  padding-left: 0px;\n  margin-top: 0px;\n  margin-bottom: 0px; }\n\n.block-speed-3 {\n  border-radius: 5px 5px 0px 0px; }\n\n.controls-slider {\n  -webkit-appearance: none;\n  width: 50%;\n  margin: 2.5px 0;\n  height: 7px;\n  background-color: transparent; }\n  .controls-slider .slider {\n    width: 100%;\n    height: 7px; }\n    .controls-slider .slider.noUi-target {\n      box-shadow: none;\n      border: 0; }\n    .controls-slider .slider.noUi-connect {\n      background-color: #003F86; }\n    .controls-slider .slider .noUi-background {\n      background-color: #333;\n      box-shadow: none; }\n    .controls-slider .slider .noUi-handle {\n      width: 20px;\n      height: 20px;\n      left: -8px;\n      top: -8px;\n      border-radius: 50%; }\n    .controls-slider .slider .noUi-handle:after, .controls-slider .slider .noUi-handle:before {\n      display: none; }\n", ""]);

	// exports


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(50);
	var progressTpl = __webpack_require__(52);

	function Progress(wrapper) {
	  this.progress = 0.0;
	  this.message = '';

	  this.element = document.createElement('div');
	  this.element.classList.add('progress');
	  this.element.innerHTML = progressTpl;

	  wrapper.appendChild(this.element);

	  this.Update();
	}

	Progress.prototype.SetProgress = function (progress) {
	  if (this.progress < progress) {
	    this.progress = progress;
	  }

	  this.Update();
	};

	Progress.prototype.SetMessage = function (message) {
	  this.message = message;
	  this.Update();
	};

	Progress.prototype.Clear = function() {
	  var parent = this.element.parentNode;
	  parent.removeChild(this.element);
	};

	Progress.prototype.Update = function() {
	  var progress = this.element.querySelector('.progressbar > .bar');
	  progress.style.width = (this.progress * 100) + '%';
	};

	module.exports = Progress;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(51);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(24)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../node_modules/css-loader/index.js?-url!../../../node_modules/sass-loader/index.js!./progress.scss", function() {
				var newContent = require("!!../../../node_modules/css-loader/index.js?-url!../../../node_modules/sass-loader/index.js!./progress.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(23)();
	// imports


	// module
	exports.push([module.id, ".progress {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  margin-left: -75px;\n  margin-top: -92.5px;\n  width: 150px;\n  text-align: center; }\n  .progress .brand {\n    height: 150px; }\n  .progress .progressbar {\n    margin: 10px;\n    background-color: #444444;\n    width: 100%;\n    height: 15px;\n    padding: 0;\n    margin: 0; }\n    .progress .progressbar .bar {\n      width: 0;\n      background-color: #003366;\n      height: 15px; }\n", ""]);

	// exports


/***/ }),
/* 52 */
/***/ (function(module, exports) {

	module.exports = "<img class=\"brand\" src=\"assets/progresslogo.png\"></img>\n<div class=\"progressbar\">\n    <div class=\"bar\"></div>\n</div>\n"

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(54);

	var messageBoxTlp = '<span class="message"></span>';

	function MessageBox() {
	  this.element = null;
	  this.message = null;
	}

	MessageBox.LEVELS = ['info', 'warning', 'success', 'default'];

	MessageBox.prototype.load = function (element) {
	  this.element = element;
	  this.element.classList.add('message-box');
	  this.element.innerHTML = messageBoxTlp;

	  this.hide();
	};

	MessageBox.prototype.hide = function(message) {
	  if (message !== this.message) return;

	  this.message = null;
	  this.element.classList.remove('active');

	  MessageBox.LEVELS.forEach(function(level) {
	    this.element.classList.remove(level);
	  }, this);
	};

	MessageBox.prototype.show = function(level, message, time) {
	  var self = this;

	  level = MessageBox.LEVELS.indexOf(level) == -1 ? 'info' : level;

	  this.hide();

	  self.element.classList.add('active');
	  self.element.classList.add(level);
	  self.element.querySelector('.message').innerHTML = message;

	  self.message = {
	    text: message
	  };

	  var ref = self.message;
	  if (time) {
	    setTimeout(function () {
	      self.hide(ref);
	    }, time + 1);
	  }

	  return this.message;
	};

	module.exports = MessageBox;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(55);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(24)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../node_modules/css-loader/index.js?-url!../../../node_modules/sass-loader/index.js!./message-box.scss", function() {
				var newContent = require("!!../../../node_modules/css-loader/index.js?-url!../../../node_modules/sass-loader/index.js!./message-box.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(23)();
	// imports


	// module
	exports.push([module.id, ".message-box {\n  top: -5em;\n  left: 0;\n  width: 100%;\n  padding: 1em;\n  font-size: 1em;\n  word-wrap: break-word;\n  color: #000;\n  opacity: 0;\n  -moz-transition: all .15s ease .15s;\n  -webkit-transition: all .15s ease .15s;\n  transition: all .15s ease .15s;\n  -moz-box-shadow: 0px 2px 5px #888888;\n  -webkit-box-shadow: 0px 2px 5px #888888;\n  box-shadow: 0px 2px 5px #888888; }\n  .message-box.active {\n    top: 0;\n    opacity: 1; }\n  .message-box.info {\n    background-color: #3b8bba;\n    color: #ffffff; }\n  .message-box.warning {\n    background-color: #f8ecad;\n    color: #7c6d1f; }\n  .message-box.success {\n    background-color: #d6e9c6;\n    color: #468847; }\n  .message-box.default {\n    background-color: #e6e6e6;\n    color: #8c8c8c; }\n  .message-box a {\n    color: inherit; }\n", ""]);

	// exports


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	var BoxTlp = __webpack_require__(57);
	__webpack_require__(58);


	function Box() {
	  this.element = null;
	  this.message = null;
	}

	Box.prototype.load = function (element) {
	  

	  this.element = element;
	  this.element.classList.add('box');
	  this.element.innerHTML = BoxTlp;
	  // this.element.querySelector('.mes').innerHTML = 'VLIBRAS';

	  // this.message = {
	  //   text: 'message'
	  // };

	  // return this.message;

	};




	module.exports = Box;


/***/ }),
/* 57 */
/***/ (function(module, exports) {

	module.exports = "<span class=\"mes\">VLIBRAS</span>\n<div settings-btn></div>\n<div settings-btn-close></div>"

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(59);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(24)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../node_modules/css-loader/index.js?-url!../../../node_modules/sass-loader/index.js!./box.scss", function() {
				var newContent = require("!!../../../node_modules/css-loader/index.js?-url!../../../node_modules/sass-loader/index.js!./box.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(23)();
	// imports


	// module
	exports.push([module.id, ".box {\n  top: 0;\n  padding-top: 0;\n  width: calc(100%);\n  height: 10%;\n  font-size: 1em;\n  color: #000;\n  opacity: 1;\n  position: absolute;\n  background-color: #003F86;\n  color: #ffffff;\n  background-size: 100% 100%;\n  z-index: 2; }\n  .box .mes {\n    position: absolute;\n    left: 50%;\n    top: 50%;\n    transform: translate(-50%, -50%);\n    font-size: 15px !important; }\n", ""]);

	// exports


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

	var btn_close_Tpl = __webpack_require__(61);
	__webpack_require__(62);

	function SettingsCloseBtn(){
	    this.element = null;
	}

	SettingsCloseBtn.prototype.load = function(element){
	    this.element = element;
	    this.element.innerHTML = btn_close_Tpl;
	    this.element.classList.add('btn-close');
	        
	};


	module.exports = SettingsCloseBtn;

/***/ }),
/* 61 */
/***/ (function(module, exports) {

	module.exports = "<img src=\"assets/Close-2019.png\">\n"

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(63);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(24)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../node_modules/css-loader/index.js?-url!../../../node_modules/sass-loader/index.js!./settings-close-btn.scss", function() {
				var newContent = require("!!../../../node_modules/css-loader/index.js?-url!../../../node_modules/sass-loader/index.js!./settings-close-btn.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(23)();
	// imports


	// module
	exports.push([module.id, ".btn-close {\n  position: absolute;\n  top: 0;\n  right: 40px;\n  height: 100%;\n  visibility: hidden;\n  z-index: 7;\n  cursor: pointer; }\n  .btn-close img {\n    position: absolute;\n    top: 50%;\n    transform: translateY(-50%);\n    width: 37.92px;\n    height: 37.92px; }\n", ""]);

	// exports


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

	const window = __webpack_require__(1);

	const AccessButton = __webpack_require__(65);
	const PluginWrapper = __webpack_require__(69);
	__webpack_require__(73);

	module.exports = function Widget() {
	  const widgetWrapper = new PluginWrapper();
	  const accessButton = new AccessButton(widgetWrapper);
	  
	  window.onload = () => {
	    const vw = document.querySelector('[vw]');
		const wrapper = document.querySelector('[vw-plugin-wrapper]');
		const access = document.querySelector('[vw-access-button]');

	    accessButton.load(document.querySelector('[vw-access-button]'), vw);
	    widgetWrapper.load(document.querySelector('[vw-plugin-wrapper]'));

		window.addEventListener('vp-widget-wrapper-set-side', (event) => { console.log(':', event.detail)
			if(event.detail.right) {
				vw.style.left = '0';
				vw.style.right = 'initial';
			} else {
				vw.style.right = '0';
				vw.style.left = 'initial';
			}

		});


		window.addEventListener('vp-widget-close', (event) => { 
			access.classList.toggle('active');
	    	wrapper.classList.toggle('active');
		});

	    
	  };
	}


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

	const window = __webpack_require__(1);
	const template = __webpack_require__(66);
	__webpack_require__(67);

	function AccessButton(pluginWrapper) {
	  this.pluginWrapper = pluginWrapper;
	}

	AccessButton.prototype.load = function (element, vw) {
	  this.element = element;
	  this.element.innerHTML = template;

	  this.element.addEventListener('click', () => {
	    this.element.classList.toggle('active');
	    this.pluginWrapper.element.classList.toggle('active');

	    window.plugin = (window.plugin || new window.VLibras.Plugin({enableMoveWindow: true}));
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


/***/ }),
/* 66 */
/***/ (function(module, exports) {

	module.exports = "<img src=\"assets/component-ac.png\" />"

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(68);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(24)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../../node_modules/css-loader/index.js?-url!../../../../node_modules/sass-loader/index.js!./styles.scss", function() {
				var newContent = require("!!../../../../node_modules/css-loader/index.js?-url!../../../../node_modules/sass-loader/index.js!./styles.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(23)();
	// imports


	// module
	exports.push([module.id, "[vw-access-button] {\n  display: none;\n  width: 70px;\n  text-align: center;\n  cursor: pointer; }\n  [vw-access-button].active {\n    display: block; }\n  [vw-access-button] img {\n    width: 100%;\n    height: 100%; }\n  [vw-access-button] span {\n    font-size: 13px;\n    color: #004088; }\n", ""]);

	// exports


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

	const template = __webpack_require__(70);
	__webpack_require__(71);

	function PluginWrapper() { 
		
	}

	PluginWrapper.prototype.load = function (element) {
	  this.element = element;
	  this.element.innerHTML = template;
	};

	module.exports = PluginWrapper;


/***/ }),
/* 70 */
/***/ (function(module, exports) {

	module.exports = "<div vp>\n  <div vp-box></div>\n  <div vp-message-box></div>\n  <div vp-settings></div>\n  <div vp-settings-btn></div>\n  <div vp-info-screen></div>\n  <div vp-dictionary></div>\n  <div vp-controls></div>\n</div>\n"

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(72);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(24)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../../node_modules/css-loader/index.js?-url!../../../../node_modules/sass-loader/index.js!./styles.scss", function() {
				var newContent = require("!!../../../../node_modules/css-loader/index.js?-url!../../../../node_modules/sass-loader/index.js!./styles.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(23)();
	// imports


	// module
	exports.push([module.id, "[vw].maximize [vw-plugin-wrapper] {\n  width: 100%;\n  height: 100% !important;\n  max-height: initial !important; }\n\n[vw].left [vw-plugin-wrapper] {\n  float: left; }\n\n[vw-plugin-wrapper] {\n  display: none;\n  width: 300px;\n  height: 100%;\n  float: right;\n  overflow: hidden;\n  background-color: white !important;\n  -moz-border-radius: 20px;\n  -webkit-border-radius: 20px;\n  -webkit-box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.15);\n  -moz-box-shadow: 0px 0px 9px 0px rgba(121, 76, 76, 0.15);\n  box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.15); }\n  [vw-plugin-wrapper].active {\n    display: -webkit-flex;\n    display: flex;\n    flex-direction: column;\n    -webkit-flex-direction: column;\n    height: 450px;\n    max-width: 100%;\n    overflow: hidden;\n    min-height: 100%; }\n", ""]);

	// exports


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(74);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(24)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../node_modules/css-loader/index.js?-url!../../node_modules/sass-loader/index.js!./styles.scss", function() {
				var newContent = require("!!../../node_modules/css-loader/index.js?-url!../../node_modules/sass-loader/index.js!./styles.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(23)();
	// imports


	// module
	exports.push([module.id, "[vw] {\n  position: fixed;\n  max-width: 70vw;\n  right: 0;\n  top: 50%;\n  margin-top: -32vh;\n  z-index: 1;\n  display: none;\n  font-family: Arial;\n  color: #000; }\n  [vw].enabled {\n    display: block; }\n  [vw].active {\n    margin-top: -285px; }\n  [vw].maximize {\n    top: 6vh;\n    left: 6vh;\n    right: 6vh;\n    bottom: 6vh;\n    max-width: initial;\n    margin-top: 0; }\n  [vw].left {\n    left: 0;\n    right: initial; }\n\n[vp] {\n  position: relative;\n  height: 100%;\n  width: 100%;\n  z-index: 1;\n  overflow: hidden;\n  display: flex;\n  flex-direction: row;\n  justify-content: center;\n  align-items: center; }\n  [vp] [vp-message-box] {\n    position: absolute;\n    z-index: 5; }\n  [vp] [vp-info-screen] {\n    z-index: 3; }\n    [vp] [vp-info-screen] #info-text {\n      font-size: 1.5vh !important; }\n    [vp] [vp-info-screen] #info-realizadores {\n      font-size: 11px !important; }\n  [vp] [vp-controls] {\n    position: absolute;\n    max-width: 560px;\n    z-index: 2;\n    bottom: -12px;\n    left: 7px; }\n  [vp] [vp-settings-btn] {\n    z-index: 2; }\n  [vp] [vp-dictionary] {\n    z-index: 3; }\n\n.vw-text:hover {\n  background-color: rgba(255, 102, 0, 0.5);\n  color: #000;\n  cursor: pointer; }\n\n.vw-text-active {\n  background-color: #7CFC00;\n  color: #000; }\n\n#gameContainer {\n  height: 70%;\n  width: 92%;\n  border-radius: 10px;\n  -webkit-mask-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC);\n  /* this fixes the overflow:hidden in Chrome/Opera */ }\n", ""]);

	// exports


/***/ })
/******/ ]);