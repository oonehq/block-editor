(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('react-beautiful-dnd'), require('react-dom'), require('crypto'), require('react-final-form')) :
    typeof define === 'function' && define.amd ? define(['exports', 'react', 'react-beautiful-dnd', 'react-dom', 'crypto', 'react-final-form'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.BlockEditor = {}, global.React, global.reactBeautifulDnd, global.require$$2, global.crypto, global.reactFinalForm));
}(this, (function (exports, React$1, reactBeautifulDnd, require$$2, crypto, reactFinalForm) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () {
                            return e[k];
                        }
                    });
                }
            });
        }
        n['default'] = e;
        return Object.freeze(n);
    }

    var React__namespace = /*#__PURE__*/_interopNamespace(React$1);
    var React__default = /*#__PURE__*/_interopDefaultLegacy(React$1);
    var require$$2__default = /*#__PURE__*/_interopDefaultLegacy(require$$2);
    var crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto);

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign$3 = function() {
        __assign$3 = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign$3.apply(this, arguments);
    };

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    /* global Map:readonly, Set:readonly, ArrayBuffer:readonly */

    var hasElementType = typeof Element !== 'undefined';
    var hasMap = typeof Map === 'function';
    var hasSet = typeof Set === 'function';
    var hasArrayBuffer = typeof ArrayBuffer === 'function' && !!ArrayBuffer.isView;

    // Note: We **don't** need `envHasBigInt64Array` in fde es6/index.js

    function equal(a, b) {
      // START: fast-deep-equal es6/index.js 3.1.1
      if (a === b) return true;

      if (a && b && typeof a == 'object' && typeof b == 'object') {
        if (a.constructor !== b.constructor) return false;

        var length, i, keys;
        if (Array.isArray(a)) {
          length = a.length;
          if (length != b.length) return false;
          for (i = length; i-- !== 0;)
            if (!equal(a[i], b[i])) return false;
          return true;
        }

        // START: Modifications:
        // 1. Extra `has<Type> &&` helpers in initial condition allow es6 code
        //    to co-exist with es5.
        // 2. Replace `for of` with es5 compliant iteration using `for`.
        //    Basically, take:
        //
        //    ```js
        //    for (i of a.entries())
        //      if (!b.has(i[0])) return false;
        //    ```
        //
        //    ... and convert to:
        //
        //    ```js
        //    it = a.entries();
        //    while (!(i = it.next()).done)
        //      if (!b.has(i.value[0])) return false;
        //    ```
        //
        //    **Note**: `i` access switches to `i.value`.
        var it;
        if (hasMap && (a instanceof Map) && (b instanceof Map)) {
          if (a.size !== b.size) return false;
          it = a.entries();
          while (!(i = it.next()).done)
            if (!b.has(i.value[0])) return false;
          it = a.entries();
          while (!(i = it.next()).done)
            if (!equal(i.value[1], b.get(i.value[0]))) return false;
          return true;
        }

        if (hasSet && (a instanceof Set) && (b instanceof Set)) {
          if (a.size !== b.size) return false;
          it = a.entries();
          while (!(i = it.next()).done)
            if (!b.has(i.value[0])) return false;
          return true;
        }
        // END: Modifications

        if (hasArrayBuffer && ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
          length = a.length;
          if (length != b.length) return false;
          for (i = length; i-- !== 0;)
            if (a[i] !== b[i]) return false;
          return true;
        }

        if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length) return false;

        for (i = length; i-- !== 0;)
          if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
        // END: fast-deep-equal

        // START: react-fast-compare
        // custom handling for DOM elements
        if (hasElementType && a instanceof Element) return false;

        // custom handling for React/Preact
        for (i = length; i-- !== 0;) {
          if ((keys[i] === '_owner' || keys[i] === '__v' || keys[i] === '__o') && a.$$typeof) {
            // React-specific: avoid traversing React elements' _owner
            // Preact-specific: avoid traversing Preact elements' __v and __o
            //    __v = $_original / $_vnode
            //    __o = $_owner
            // These properties contain circular references and are not needed when
            // comparing the actual elements (and not their owners)
            // .$$typeof and ._store on just reasonable markers of elements

            continue;
          }

          // all other properties should be traversed as usual
          if (!equal(a[keys[i]], b[keys[i]])) return false;
        }
        // END: react-fast-compare

        // START: fast-deep-equal
        return true;
      }

      return a !== a && b !== b;
    }
    // end fast-deep-equal

    var reactFastCompare = function isEqual(a, b) {
      try {
        return equal(a, b);
      } catch (error) {
        if (((error.message || '').match(/stack|recursion/i))) {
          // warn on circular references, don't crash
          // browsers give this different errors name and messages:
          // chrome/safari: "RangeError", "Maximum call stack size exceeded"
          // firefox: "InternalError", too much recursion"
          // edge: "Error", "Out of stack space"
          console.warn('react-fast-compare cannot handle circular refs');
          return false;
        }
        // some other error. we should definitely know about these
        throw error;
      }
    };

    /*!
     * hotkeys-js v3.8.7
     * A simple micro-library for defining and dispatching keyboard shortcuts. It has no dependencies.
     * 
     * Copyright (c) 2021 kenny wong <wowohoo@qq.com>
     * http://jaywcjlove.github.io/hotkeys
     * 
     * Licensed under the MIT license.
     */

    var isff = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase().indexOf('firefox') > 0 : false; // 绑定事件

    function addEvent$1(object, event, method) {
      if (object.addEventListener) {
        object.addEventListener(event, method, false);
      } else if (object.attachEvent) {
        object.attachEvent("on".concat(event), function () {
          method(window.event);
        });
      }
    } // 修饰键转换成对应的键码


    function getMods(modifier, key) {
      var mods = key.slice(0, key.length - 1);

      for (var i = 0; i < mods.length; i++) {
        mods[i] = modifier[mods[i].toLowerCase()];
      }

      return mods;
    } // 处理传的key字符串转换成数组


    function getKeys(key) {
      if (typeof key !== 'string') key = '';
      key = key.replace(/\s/g, ''); // 匹配任何空白字符,包括空格、制表符、换页符等等

      var keys = key.split(','); // 同时设置多个快捷键，以','分割

      var index = keys.lastIndexOf(''); // 快捷键可能包含','，需特殊处理

      for (; index >= 0;) {
        keys[index - 1] += ',';
        keys.splice(index, 1);
        index = keys.lastIndexOf('');
      }

      return keys;
    } // 比较修饰键的数组


    function compareArray(a1, a2) {
      var arr1 = a1.length >= a2.length ? a1 : a2;
      var arr2 = a1.length >= a2.length ? a2 : a1;
      var isIndex = true;

      for (var i = 0; i < arr1.length; i++) {
        if (arr2.indexOf(arr1[i]) === -1) isIndex = false;
      }

      return isIndex;
    }

    var _keyMap = {
      backspace: 8,
      tab: 9,
      clear: 12,
      enter: 13,
      return: 13,
      esc: 27,
      escape: 27,
      space: 32,
      left: 37,
      up: 38,
      right: 39,
      down: 40,
      del: 46,
      delete: 46,
      ins: 45,
      insert: 45,
      home: 36,
      end: 35,
      pageup: 33,
      pagedown: 34,
      capslock: 20,
      num_0: 96,
      num_1: 97,
      num_2: 98,
      num_3: 99,
      num_4: 100,
      num_5: 101,
      num_6: 102,
      num_7: 103,
      num_8: 104,
      num_9: 105,
      num_multiply: 106,
      num_add: 107,
      num_enter: 108,
      num_subtract: 109,
      num_decimal: 110,
      num_divide: 111,
      '⇪': 20,
      ',': 188,
      '.': 190,
      '/': 191,
      '`': 192,
      '-': isff ? 173 : 189,
      '=': isff ? 61 : 187,
      ';': isff ? 59 : 186,
      '\'': 222,
      '[': 219,
      ']': 221,
      '\\': 220
    }; // Modifier Keys

    var _modifier = {
      // shiftKey
      '⇧': 16,
      shift: 16,
      // altKey
      '⌥': 18,
      alt: 18,
      option: 18,
      // ctrlKey
      '⌃': 17,
      ctrl: 17,
      control: 17,
      // metaKey
      '⌘': 91,
      cmd: 91,
      command: 91
    };
    var modifierMap = {
      16: 'shiftKey',
      18: 'altKey',
      17: 'ctrlKey',
      91: 'metaKey',
      shiftKey: 16,
      ctrlKey: 17,
      altKey: 18,
      metaKey: 91
    };
    var _mods = {
      16: false,
      18: false,
      17: false,
      91: false
    };
    var _handlers = {}; // F1~F12 special key

    for (var k$2 = 1; k$2 < 20; k$2++) {
      _keyMap["f".concat(k$2)] = 111 + k$2;
    }

    var _downKeys = []; // 记录摁下的绑定键

    var _scope = 'all'; // 默认热键范围

    var elementHasBindEvent = []; // 已绑定事件的节点记录
    // 返回键码

    var code = function code(x) {
      return _keyMap[x.toLowerCase()] || _modifier[x.toLowerCase()] || x.toUpperCase().charCodeAt(0);
    }; // 设置获取当前范围（默认为'所有'）


    function setScope(scope) {
      _scope = scope || 'all';
    } // 获取当前范围


    function getScope() {
      return _scope || 'all';
    } // 获取摁下绑定键的键值


    function getPressedKeyCodes() {
      return _downKeys.slice(0);
    } // 表单控件控件判断 返回 Boolean
    // hotkey is effective only when filter return true


    function filter(event) {
      var target = event.target || event.srcElement;
      var tagName = target.tagName;
      var flag = true; // ignore: isContentEditable === 'true', <input> and <textarea> when readOnly state is false, <select>

      if (target.isContentEditable || (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') && !target.readOnly) {
        flag = false;
      }

      return flag;
    } // 判断摁下的键是否为某个键，返回true或者false


    function isPressed(keyCode) {
      if (typeof keyCode === 'string') {
        keyCode = code(keyCode); // 转换成键码
      }

      return _downKeys.indexOf(keyCode) !== -1;
    } // 循环删除handlers中的所有 scope(范围)


    function deleteScope(scope, newScope) {
      var handlers;
      var i; // 没有指定scope，获取scope

      if (!scope) scope = getScope();

      for (var key in _handlers) {
        if (Object.prototype.hasOwnProperty.call(_handlers, key)) {
          handlers = _handlers[key];

          for (i = 0; i < handlers.length;) {
            if (handlers[i].scope === scope) handlers.splice(i, 1);else i++;
          }
        }
      } // 如果scope被删除，将scope重置为all


      if (getScope() === scope) setScope(newScope || 'all');
    } // 清除修饰键


    function clearModifier(event) {
      var key = event.keyCode || event.which || event.charCode;

      var i = _downKeys.indexOf(key); // 从列表中清除按压过的键


      if (i >= 0) {
        _downKeys.splice(i, 1);
      } // 特殊处理 cmmand 键，在 cmmand 组合快捷键 keyup 只执行一次的问题


      if (event.key && event.key.toLowerCase() === 'meta') {
        _downKeys.splice(0, _downKeys.length);
      } // 修饰键 shiftKey altKey ctrlKey (command||metaKey) 清除


      if (key === 93 || key === 224) key = 91;

      if (key in _mods) {
        _mods[key] = false; // 将修饰键重置为false

        for (var k in _modifier) {
          if (_modifier[k] === key) hotkeys[k] = false;
        }
      }
    }

    function unbind(keysInfo) {
      // unbind(), unbind all keys
      if (!keysInfo) {
        Object.keys(_handlers).forEach(function (key) {
          return delete _handlers[key];
        });
      } else if (Array.isArray(keysInfo)) {
        // support like : unbind([{key: 'ctrl+a', scope: 's1'}, {key: 'ctrl-a', scope: 's2', splitKey: '-'}])
        keysInfo.forEach(function (info) {
          if (info.key) eachUnbind(info);
        });
      } else if (typeof keysInfo === 'object') {
        // support like unbind({key: 'ctrl+a, ctrl+b', scope:'abc'})
        if (keysInfo.key) eachUnbind(keysInfo);
      } else if (typeof keysInfo === 'string') {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        // support old method
        // eslint-disable-line
        var scope = args[0],
            method = args[1];

        if (typeof scope === 'function') {
          method = scope;
          scope = '';
        }

        eachUnbind({
          key: keysInfo,
          scope: scope,
          method: method,
          splitKey: '+'
        });
      }
    } // 解除绑定某个范围的快捷键


    var eachUnbind = function eachUnbind(_ref) {
      var key = _ref.key,
          scope = _ref.scope,
          method = _ref.method,
          _ref$splitKey = _ref.splitKey,
          splitKey = _ref$splitKey === void 0 ? '+' : _ref$splitKey;
      var multipleKeys = getKeys(key);
      multipleKeys.forEach(function (originKey) {
        var unbindKeys = originKey.split(splitKey);
        var len = unbindKeys.length;
        var lastKey = unbindKeys[len - 1];
        var keyCode = lastKey === '*' ? '*' : code(lastKey);
        if (!_handlers[keyCode]) return; // 判断是否传入范围，没有就获取范围

        if (!scope) scope = getScope();
        var mods = len > 1 ? getMods(_modifier, unbindKeys) : [];
        _handlers[keyCode] = _handlers[keyCode].map(function (record) {
          // 通过函数判断，是否解除绑定，函数相等直接返回
          var isMatchingMethod = method ? record.method === method : true;

          if (isMatchingMethod && record.scope === scope && compareArray(record.mods, mods)) {
            return {};
          }

          return record;
        });
      });
    }; // 对监听对应快捷键的回调函数进行处理


    function eventHandler(event, handler, scope) {
      var modifiersMatch; // 看它是否在当前范围

      if (handler.scope === scope || handler.scope === 'all') {
        // 检查是否匹配修饰符（如果有返回true）
        modifiersMatch = handler.mods.length > 0;

        for (var y in _mods) {
          if (Object.prototype.hasOwnProperty.call(_mods, y)) {
            if (!_mods[y] && handler.mods.indexOf(+y) > -1 || _mods[y] && handler.mods.indexOf(+y) === -1) {
              modifiersMatch = false;
            }
          }
        } // 调用处理程序，如果是修饰键不做处理


        if (handler.mods.length === 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91] || modifiersMatch || handler.shortcut === '*') {
          if (handler.method(event, handler) === false) {
            if (event.preventDefault) event.preventDefault();else event.returnValue = false;
            if (event.stopPropagation) event.stopPropagation();
            if (event.cancelBubble) event.cancelBubble = true;
          }
        }
      }
    } // 处理keydown事件


    function dispatch(event) {
      var asterisk = _handlers['*'];
      var key = event.keyCode || event.which || event.charCode; // 表单控件过滤 默认表单控件不触发快捷键

      if (!hotkeys.filter.call(this, event)) return; // Gecko(Firefox)的command键值224，在Webkit(Chrome)中保持一致
      // Webkit左右 command 键值不一样

      if (key === 93 || key === 224) key = 91;
      /**
       * Collect bound keys
       * If an Input Method Editor is processing key input and the event is keydown, return 229.
       * https://stackoverflow.com/questions/25043934/is-it-ok-to-ignore-keydown-events-with-keycode-229
       * http://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html
       */

      if (_downKeys.indexOf(key) === -1 && key !== 229) _downKeys.push(key);
      /**
       * Jest test cases are required.
       * ===============================
       */

      ['ctrlKey', 'altKey', 'shiftKey', 'metaKey'].forEach(function (keyName) {
        var keyNum = modifierMap[keyName];

        if (event[keyName] && _downKeys.indexOf(keyNum) === -1) {
          _downKeys.push(keyNum);
        } else if (!event[keyName] && _downKeys.indexOf(keyNum) > -1) {
          _downKeys.splice(_downKeys.indexOf(keyNum), 1);
        } else if (keyName === 'metaKey' && event[keyName] && _downKeys.length === 3) {
          /**
           * Fix if Command is pressed:
           * ===============================
           */
          if (!(event.ctrlKey || event.shiftKey || event.altKey)) {
            _downKeys = _downKeys.slice(_downKeys.indexOf(keyNum));
          }
        }
      });
      /**
       * -------------------------------
       */

      if (key in _mods) {
        _mods[key] = true; // 将特殊字符的key注册到 hotkeys 上

        for (var k in _modifier) {
          if (_modifier[k] === key) hotkeys[k] = true;
        }

        if (!asterisk) return;
      } // 将 modifierMap 里面的修饰键绑定到 event 中


      for (var e in _mods) {
        if (Object.prototype.hasOwnProperty.call(_mods, e)) {
          _mods[e] = event[modifierMap[e]];
        }
      }
      /**
       * https://github.com/jaywcjlove/hotkeys/pull/129
       * This solves the issue in Firefox on Windows where hotkeys corresponding to special characters would not trigger.
       * An example of this is ctrl+alt+m on a Swedish keyboard which is used to type μ.
       * Browser support: https://caniuse.com/#feat=keyboardevent-getmodifierstate
       */


      if (event.getModifierState && !(event.altKey && !event.ctrlKey) && event.getModifierState('AltGraph')) {
        if (_downKeys.indexOf(17) === -1) {
          _downKeys.push(17);
        }

        if (_downKeys.indexOf(18) === -1) {
          _downKeys.push(18);
        }

        _mods[17] = true;
        _mods[18] = true;
      } // 获取范围 默认为 `all`


      var scope = getScope(); // 对任何快捷键都需要做的处理

      if (asterisk) {
        for (var i = 0; i < asterisk.length; i++) {
          if (asterisk[i].scope === scope && (event.type === 'keydown' && asterisk[i].keydown || event.type === 'keyup' && asterisk[i].keyup)) {
            eventHandler(event, asterisk[i], scope);
          }
        }
      } // key 不在 _handlers 中返回


      if (!(key in _handlers)) return;

      for (var _i = 0; _i < _handlers[key].length; _i++) {
        if (event.type === 'keydown' && _handlers[key][_i].keydown || event.type === 'keyup' && _handlers[key][_i].keyup) {
          if (_handlers[key][_i].key) {
            var record = _handlers[key][_i];
            var splitKey = record.splitKey;
            var keyShortcut = record.key.split(splitKey);
            var _downKeysCurrent = []; // 记录当前按键键值

            for (var a = 0; a < keyShortcut.length; a++) {
              _downKeysCurrent.push(code(keyShortcut[a]));
            }

            if (_downKeysCurrent.sort().join('') === _downKeys.sort().join('')) {
              // 找到处理内容
              eventHandler(event, record, scope);
            }
          }
        }
      }
    } // 判断 element 是否已经绑定事件


    function isElementBind(element) {
      return elementHasBindEvent.indexOf(element) > -1;
    }

    function hotkeys(key, option, method) {
      _downKeys = [];
      var keys = getKeys(key); // 需要处理的快捷键列表

      var mods = [];
      var scope = 'all'; // scope默认为all，所有范围都有效

      var element = document; // 快捷键事件绑定节点

      var i = 0;
      var keyup = false;
      var keydown = true;
      var splitKey = '+'; // 对为设定范围的判断

      if (method === undefined && typeof option === 'function') {
        method = option;
      }

      if (Object.prototype.toString.call(option) === '[object Object]') {
        if (option.scope) scope = option.scope; // eslint-disable-line

        if (option.element) element = option.element; // eslint-disable-line

        if (option.keyup) keyup = option.keyup; // eslint-disable-line

        if (option.keydown !== undefined) keydown = option.keydown; // eslint-disable-line

        if (typeof option.splitKey === 'string') splitKey = option.splitKey; // eslint-disable-line
      }

      if (typeof option === 'string') scope = option; // 对于每个快捷键进行处理

      for (; i < keys.length; i++) {
        key = keys[i].split(splitKey); // 按键列表

        mods = []; // 如果是组合快捷键取得组合快捷键

        if (key.length > 1) mods = getMods(_modifier, key); // 将非修饰键转化为键码

        key = key[key.length - 1];
        key = key === '*' ? '*' : code(key); // *表示匹配所有快捷键
        // 判断key是否在_handlers中，不在就赋一个空数组

        if (!(key in _handlers)) _handlers[key] = [];

        _handlers[key].push({
          keyup: keyup,
          keydown: keydown,
          scope: scope,
          mods: mods,
          shortcut: keys[i],
          method: method,
          key: keys[i],
          splitKey: splitKey
        });
      } // 在全局document上设置快捷键


      if (typeof element !== 'undefined' && !isElementBind(element) && window) {
        elementHasBindEvent.push(element);
        addEvent$1(element, 'keydown', function (e) {
          dispatch(e);
        });
        addEvent$1(window, 'focus', function () {
          _downKeys = [];
        });
        addEvent$1(element, 'keyup', function (e) {
          dispatch(e);
          clearModifier(e);
        });
      }
    }

    var _api = {
      setScope: setScope,
      getScope: getScope,
      deleteScope: deleteScope,
      getPressedKeyCodes: getPressedKeyCodes,
      isPressed: isPressed,
      filter: filter,
      unbind: unbind
    };

    for (var a$1 in _api) {
      if (Object.prototype.hasOwnProperty.call(_api, a$1)) {
        hotkeys[a$1] = _api[a$1];
      }
    }

    if (typeof window !== 'undefined') {
      var _hotkeys = window.hotkeys;

      hotkeys.noConflict = function (deep) {
        if (deep && window.hotkeys === hotkeys) {
          window.hotkeys = _hotkeys;
        }

        return hotkeys;
      };

      window.hotkeys = hotkeys;
    }

    hotkeys.filter = function () {
      return true;
    };

    var tagFilter = function tagFilter(_ref, enableOnTags) {
      var target = _ref.target;
      var targetTagName = target && target.tagName;
      return Boolean(targetTagName && enableOnTags && enableOnTags.includes(targetTagName));
    };

    var isKeyboardEventTriggeredByInput = function isKeyboardEventTriggeredByInput(ev) {
      return tagFilter(ev, ['INPUT', 'TEXTAREA', 'SELECT']);
    };

    function useHotkeys(keys, callback, options, deps) {
      if (options instanceof Array) {
        deps = options;
        options = undefined;
      }

      var _ref2 = options || {},
          enableOnTags = _ref2.enableOnTags,
          filter = _ref2.filter,
          keyup = _ref2.keyup,
          keydown = _ref2.keydown,
          _ref2$filterPreventDe = _ref2.filterPreventDefault,
          filterPreventDefault = _ref2$filterPreventDe === void 0 ? true : _ref2$filterPreventDe,
          _ref2$enabled = _ref2.enabled,
          enabled = _ref2$enabled === void 0 ? true : _ref2$enabled,
          _ref2$enableOnContent = _ref2.enableOnContentEditable,
          enableOnContentEditable = _ref2$enableOnContent === void 0 ? false : _ref2$enableOnContent;

      var ref = React$1.useRef(null); // The return value of this callback determines if the browsers default behavior is prevented.

      var memoisedCallback = React$1.useCallback(function (keyboardEvent, hotkeysEvent) {
        var _keyboardEvent$target;

        if (filter && !filter(keyboardEvent)) {
          return !filterPreventDefault;
        } // Check whether the hotkeys was triggered inside an input and that input is enabled or if it was triggered by a content editable tag and it is enabled.


        if (isKeyboardEventTriggeredByInput(keyboardEvent) && !tagFilter(keyboardEvent, enableOnTags) || (_keyboardEvent$target = keyboardEvent.target) != null && _keyboardEvent$target.isContentEditable && !enableOnContentEditable) {
          return true;
        }

        if (ref.current === null || document.activeElement === ref.current) {
          callback(keyboardEvent, hotkeysEvent);
          return true;
        }

        return false;
      }, deps ? [ref, enableOnTags, filter].concat(deps) : [ref, enableOnTags, filter]);
      React$1.useEffect(function () {
        if (!enabled) {
          return;
        } // In this case keydown is likely undefined, so we set it to false, since hotkeys needs the `keydown` key to have a value.


        if (keyup && keydown !== true) {
          options.keydown = false;
        }

        hotkeys(keys, options || {}, memoisedCallback);
        return function () {
          return hotkeys.unbind(keys, memoisedCallback);
        };
      }, [memoisedCallback, keys, enabled]);
      return ref;
    }

    function _setPrototypeOf$1(o, p) {
      _setPrototypeOf$1 = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
      };

      return _setPrototypeOf$1(o, p);
    }

    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      _setPrototypeOf$1(subClass, superClass);
    }

    var changedArray = function changedArray(a, b) {
      if (a === void 0) {
        a = [];
      }

      if (b === void 0) {
        b = [];
      }

      return a.length !== b.length || a.some(function (item, index) {
        return !Object.is(item, b[index]);
      });
    };

    var initialState = {
      error: null
    };

    var ErrorBoundary = /*#__PURE__*/function (_React$Component) {
      _inheritsLoose(ErrorBoundary, _React$Component);

      function ErrorBoundary() {
        var _this;

        for (var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++) {
          _args[_key] = arguments[_key];
        }

        _this = _React$Component.call.apply(_React$Component, [this].concat(_args)) || this;
        _this.state = initialState;
        _this.updatedWithError = false;

        _this.resetErrorBoundary = function () {
          var _this$props;

          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          _this.props.onReset == null ? void 0 : (_this$props = _this.props).onReset.apply(_this$props, args);

          _this.reset();
        };

        return _this;
      }

      ErrorBoundary.getDerivedStateFromError = function getDerivedStateFromError(error) {
        return {
          error: error
        };
      };

      var _proto = ErrorBoundary.prototype;

      _proto.reset = function reset() {
        this.updatedWithError = false;
        this.setState(initialState);
      };

      _proto.componentDidCatch = function componentDidCatch(error, info) {
        var _this$props$onError, _this$props2;

        (_this$props$onError = (_this$props2 = this.props).onError) == null ? void 0 : _this$props$onError.call(_this$props2, error, info);
      };

      _proto.componentDidMount = function componentDidMount() {
        var error = this.state.error;

        if (error !== null) {
          this.updatedWithError = true;
        }
      };

      _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
        var error = this.state.error;
        var resetKeys = this.props.resetKeys; // There's an edge case where if the thing that triggered the error
        // happens to *also* be in the resetKeys array, we'd end up resetting
        // the error boundary immediately. This would likely trigger a second
        // error to be thrown.
        // So we make sure that we don't check the resetKeys on the first call
        // of cDU after the error is set

        if (error !== null && !this.updatedWithError) {
          this.updatedWithError = true;
          return;
        }

        if (error !== null && changedArray(prevProps.resetKeys, resetKeys)) {
          var _this$props$onResetKe, _this$props3;

          (_this$props$onResetKe = (_this$props3 = this.props).onResetKeysChange) == null ? void 0 : _this$props$onResetKe.call(_this$props3, prevProps.resetKeys, resetKeys);
          this.reset();
        }
      };

      _proto.render = function render() {
        var error = this.state.error;
        var _this$props4 = this.props,
            fallbackRender = _this$props4.fallbackRender,
            FallbackComponent = _this$props4.FallbackComponent,
            fallback = _this$props4.fallback;

        if (error !== null) {
          var _props = {
            error: error,
            resetErrorBoundary: this.resetErrorBoundary
          };

          if ( /*#__PURE__*/React__namespace.isValidElement(fallback)) {
            return fallback;
          } else if (typeof fallbackRender === 'function') {
            return fallbackRender(_props);
          } else if (FallbackComponent) {
            return /*#__PURE__*/React__namespace.createElement(FallbackComponent, _props);
          } else {
            throw new Error('react-error-boundary requires either a fallback, fallbackRender, or FallbackComponent prop');
          }
        }

        return this.props.children;
      };

      return ErrorBoundary;
    }(React__namespace.Component);

    function toVal(mix) {
    	var k, y, str='';

    	if (typeof mix === 'string' || typeof mix === 'number') {
    		str += mix;
    	} else if (typeof mix === 'object') {
    		if (Array.isArray(mix)) {
    			for (k=0; k < mix.length; k++) {
    				if (mix[k]) {
    					if (y = toVal(mix[k])) {
    						str && (str += ' ');
    						str += y;
    					}
    				}
    			}
    		} else {
    			for (k in mix) {
    				if (mix[k]) {
    					str && (str += ' ');
    					str += k;
    				}
    			}
    		}
    	}

    	return str;
    }

    function clsx () {
    	var i=0, tmp, x, str='';
    	while (i < arguments.length) {
    		if (tmp = arguments[i++]) {
    			if (x = toVal(tmp)) {
    				str && (str += ' ');
    				str += x;
    			}
    		}
    	}
    	return str;
    }

    var cjs = {exports: {}};

    var Draggable$2 = {};

    var propTypes = {exports: {}};

    var reactIs = {exports: {}};

    var reactIs_production_min = {};

    /** @license React v16.13.1
     * react-is.production.min.js
     *
     * Copyright (c) Facebook, Inc. and its affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    var b$1="function"===typeof Symbol&&Symbol.for,c$1=b$1?Symbol.for("react.element"):60103,d$1=b$1?Symbol.for("react.portal"):60106,e$1=b$1?Symbol.for("react.fragment"):60107,f$1=b$1?Symbol.for("react.strict_mode"):60108,g$1=b$1?Symbol.for("react.profiler"):60114,h$1=b$1?Symbol.for("react.provider"):60109,k$1=b$1?Symbol.for("react.context"):60110,l$1=b$1?Symbol.for("react.async_mode"):60111,m=b$1?Symbol.for("react.concurrent_mode"):60111,n$2=b$1?Symbol.for("react.forward_ref"):60112,p$1=b$1?Symbol.for("react.suspense"):60113,q$1=b$1?
    Symbol.for("react.suspense_list"):60120,r$1=b$1?Symbol.for("react.memo"):60115,t$3=b$1?Symbol.for("react.lazy"):60116,v$1=b$1?Symbol.for("react.block"):60121,w$1=b$1?Symbol.for("react.fundamental"):60117,x$1=b$1?Symbol.for("react.responder"):60118,y$1=b$1?Symbol.for("react.scope"):60119;
    function z$1(a){if("object"===typeof a&&null!==a){var u=a.$$typeof;switch(u){case c$1:switch(a=a.type,a){case l$1:case m:case e$1:case g$1:case f$1:case p$1:return a;default:switch(a=a&&a.$$typeof,a){case k$1:case n$2:case t$3:case r$1:case h$1:return a;default:return u}}case d$1:return u}}}function A$1(a){return z$1(a)===m}reactIs_production_min.AsyncMode=l$1;reactIs_production_min.ConcurrentMode=m;reactIs_production_min.ContextConsumer=k$1;reactIs_production_min.ContextProvider=h$1;reactIs_production_min.Element=c$1;reactIs_production_min.ForwardRef=n$2;reactIs_production_min.Fragment=e$1;reactIs_production_min.Lazy=t$3;reactIs_production_min.Memo=r$1;reactIs_production_min.Portal=d$1;
    reactIs_production_min.Profiler=g$1;reactIs_production_min.StrictMode=f$1;reactIs_production_min.Suspense=p$1;reactIs_production_min.isAsyncMode=function(a){return A$1(a)||z$1(a)===l$1};reactIs_production_min.isConcurrentMode=A$1;reactIs_production_min.isContextConsumer=function(a){return z$1(a)===k$1};reactIs_production_min.isContextProvider=function(a){return z$1(a)===h$1};reactIs_production_min.isElement=function(a){return "object"===typeof a&&null!==a&&a.$$typeof===c$1};reactIs_production_min.isForwardRef=function(a){return z$1(a)===n$2};reactIs_production_min.isFragment=function(a){return z$1(a)===e$1};reactIs_production_min.isLazy=function(a){return z$1(a)===t$3};
    reactIs_production_min.isMemo=function(a){return z$1(a)===r$1};reactIs_production_min.isPortal=function(a){return z$1(a)===d$1};reactIs_production_min.isProfiler=function(a){return z$1(a)===g$1};reactIs_production_min.isStrictMode=function(a){return z$1(a)===f$1};reactIs_production_min.isSuspense=function(a){return z$1(a)===p$1};
    reactIs_production_min.isValidElementType=function(a){return "string"===typeof a||"function"===typeof a||a===e$1||a===m||a===g$1||a===f$1||a===p$1||a===q$1||"object"===typeof a&&null!==a&&(a.$$typeof===t$3||a.$$typeof===r$1||a.$$typeof===h$1||a.$$typeof===k$1||a.$$typeof===n$2||a.$$typeof===w$1||a.$$typeof===x$1||a.$$typeof===y$1||a.$$typeof===v$1)};reactIs_production_min.typeOf=z$1;

    var reactIs_development = {};

    /** @license React v16.13.1
     * react-is.development.js
     *
     * Copyright (c) Facebook, Inc. and its affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */



    if (process.env.NODE_ENV !== "production") {
      (function() {

    // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
    // nor polyfill, then a plain number is used for performance.
    var hasSymbol = typeof Symbol === 'function' && Symbol.for;
    var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
    var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
    var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
    var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
    var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
    var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
    var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
    // (unstable) APIs that have been removed. Can we remove the symbols?

    var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
    var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
    var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
    var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
    var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
    var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
    var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
    var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
    var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
    var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
    var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

    function isValidElementType(type) {
      return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
      type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
    }

    function typeOf(object) {
      if (typeof object === 'object' && object !== null) {
        var $$typeof = object.$$typeof;

        switch ($$typeof) {
          case REACT_ELEMENT_TYPE:
            var type = object.type;

            switch (type) {
              case REACT_ASYNC_MODE_TYPE:
              case REACT_CONCURRENT_MODE_TYPE:
              case REACT_FRAGMENT_TYPE:
              case REACT_PROFILER_TYPE:
              case REACT_STRICT_MODE_TYPE:
              case REACT_SUSPENSE_TYPE:
                return type;

              default:
                var $$typeofType = type && type.$$typeof;

                switch ($$typeofType) {
                  case REACT_CONTEXT_TYPE:
                  case REACT_FORWARD_REF_TYPE:
                  case REACT_LAZY_TYPE:
                  case REACT_MEMO_TYPE:
                  case REACT_PROVIDER_TYPE:
                    return $$typeofType;

                  default:
                    return $$typeof;
                }

            }

          case REACT_PORTAL_TYPE:
            return $$typeof;
        }
      }

      return undefined;
    } // AsyncMode is deprecated along with isAsyncMode

    var AsyncMode = REACT_ASYNC_MODE_TYPE;
    var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
    var ContextConsumer = REACT_CONTEXT_TYPE;
    var ContextProvider = REACT_PROVIDER_TYPE;
    var Element = REACT_ELEMENT_TYPE;
    var ForwardRef = REACT_FORWARD_REF_TYPE;
    var Fragment = REACT_FRAGMENT_TYPE;
    var Lazy = REACT_LAZY_TYPE;
    var Memo = REACT_MEMO_TYPE;
    var Portal = REACT_PORTAL_TYPE;
    var Profiler = REACT_PROFILER_TYPE;
    var StrictMode = REACT_STRICT_MODE_TYPE;
    var Suspense = REACT_SUSPENSE_TYPE;
    var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

    function isAsyncMode(object) {
      {
        if (!hasWarnedAboutDeprecatedIsAsyncMode) {
          hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

          console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
        }
      }

      return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
    }
    function isConcurrentMode(object) {
      return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
    }
    function isContextConsumer(object) {
      return typeOf(object) === REACT_CONTEXT_TYPE;
    }
    function isContextProvider(object) {
      return typeOf(object) === REACT_PROVIDER_TYPE;
    }
    function isElement(object) {
      return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    function isForwardRef(object) {
      return typeOf(object) === REACT_FORWARD_REF_TYPE;
    }
    function isFragment(object) {
      return typeOf(object) === REACT_FRAGMENT_TYPE;
    }
    function isLazy(object) {
      return typeOf(object) === REACT_LAZY_TYPE;
    }
    function isMemo(object) {
      return typeOf(object) === REACT_MEMO_TYPE;
    }
    function isPortal(object) {
      return typeOf(object) === REACT_PORTAL_TYPE;
    }
    function isProfiler(object) {
      return typeOf(object) === REACT_PROFILER_TYPE;
    }
    function isStrictMode(object) {
      return typeOf(object) === REACT_STRICT_MODE_TYPE;
    }
    function isSuspense(object) {
      return typeOf(object) === REACT_SUSPENSE_TYPE;
    }

    reactIs_development.AsyncMode = AsyncMode;
    reactIs_development.ConcurrentMode = ConcurrentMode;
    reactIs_development.ContextConsumer = ContextConsumer;
    reactIs_development.ContextProvider = ContextProvider;
    reactIs_development.Element = Element;
    reactIs_development.ForwardRef = ForwardRef;
    reactIs_development.Fragment = Fragment;
    reactIs_development.Lazy = Lazy;
    reactIs_development.Memo = Memo;
    reactIs_development.Portal = Portal;
    reactIs_development.Profiler = Profiler;
    reactIs_development.StrictMode = StrictMode;
    reactIs_development.Suspense = Suspense;
    reactIs_development.isAsyncMode = isAsyncMode;
    reactIs_development.isConcurrentMode = isConcurrentMode;
    reactIs_development.isContextConsumer = isContextConsumer;
    reactIs_development.isContextProvider = isContextProvider;
    reactIs_development.isElement = isElement;
    reactIs_development.isForwardRef = isForwardRef;
    reactIs_development.isFragment = isFragment;
    reactIs_development.isLazy = isLazy;
    reactIs_development.isMemo = isMemo;
    reactIs_development.isPortal = isPortal;
    reactIs_development.isProfiler = isProfiler;
    reactIs_development.isStrictMode = isStrictMode;
    reactIs_development.isSuspense = isSuspense;
    reactIs_development.isValidElementType = isValidElementType;
    reactIs_development.typeOf = typeOf;
      })();
    }

    if (process.env.NODE_ENV === 'production') {
      reactIs.exports = reactIs_production_min;
    } else {
      reactIs.exports = reactIs_development;
    }

    /*
    object-assign
    (c) Sindre Sorhus
    @license MIT
    */
    /* eslint-disable no-unused-vars */
    var getOwnPropertySymbols = Object.getOwnPropertySymbols;
    var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
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

    var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
    	var from;
    	var to = toObject(target);
    	var symbols;

    	for (var s = 1; s < arguments.length; s++) {
    		from = Object(arguments[s]);

    		for (var key in from) {
    			if (hasOwnProperty$1.call(from, key)) {
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

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */

    var ReactPropTypesSecret$3 = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

    var ReactPropTypesSecret_1 = ReactPropTypesSecret$3;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */

    var printWarning$1 = function() {};

    if (process.env.NODE_ENV !== 'production') {
      var ReactPropTypesSecret$2 = ReactPropTypesSecret_1;
      var loggedTypeFailures = {};
      var has$1 = Function.call.bind(Object.prototype.hasOwnProperty);

      printWarning$1 = function(text) {
        var message = 'Warning: ' + text;
        if (typeof console !== 'undefined') {
          console.error(message);
        }
        try {
          // --- Welcome to debugging React ---
          // This error was thrown as a convenience so that you can use this stack
          // to find the callsite that caused this warning to fire.
          throw new Error(message);
        } catch (x) {}
      };
    }

    /**
     * Assert that the values match with the type specs.
     * Error messages are memorized and will only be shown once.
     *
     * @param {object} typeSpecs Map of name to a ReactPropType
     * @param {object} values Runtime values that need to be type-checked
     * @param {string} location e.g. "prop", "context", "child context"
     * @param {string} componentName Name of the component for error messages.
     * @param {?Function} getStack Returns the component stack.
     * @private
     */
    function checkPropTypes$1(typeSpecs, values, location, componentName, getStack) {
      if (process.env.NODE_ENV !== 'production') {
        for (var typeSpecName in typeSpecs) {
          if (has$1(typeSpecs, typeSpecName)) {
            var error;
            // Prop type validation may throw. In case they do, we don't want to
            // fail the render phase where it didn't fail before. So we log it.
            // After these have been cleaned up, we'll let them throw.
            try {
              // This is intentionally an invariant that gets caught. It's the same
              // behavior as without this statement except with a better message.
              if (typeof typeSpecs[typeSpecName] !== 'function') {
                var err = Error(
                  (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
                  'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'
                );
                err.name = 'Invariant Violation';
                throw err;
              }
              error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret$2);
            } catch (ex) {
              error = ex;
            }
            if (error && !(error instanceof Error)) {
              printWarning$1(
                (componentName || 'React class') + ': type specification of ' +
                location + ' `' + typeSpecName + '` is invalid; the type checker ' +
                'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
                'You may have forgotten to pass an argument to the type checker ' +
                'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
                'shape all require an argument).'
              );
            }
            if (error instanceof Error && !(error.message in loggedTypeFailures)) {
              // Only monitor this failure once because there tends to be a lot of the
              // same error.
              loggedTypeFailures[error.message] = true;

              var stack = getStack ? getStack() : '';

              printWarning$1(
                'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
              );
            }
          }
        }
      }
    }

    /**
     * Resets warning cache when testing.
     *
     * @private
     */
    checkPropTypes$1.resetWarningCache = function() {
      if (process.env.NODE_ENV !== 'production') {
        loggedTypeFailures = {};
      }
    };

    var checkPropTypes_1 = checkPropTypes$1;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */

    var ReactIs$1 = reactIs.exports;
    var assign = objectAssign;

    var ReactPropTypesSecret$1 = ReactPropTypesSecret_1;
    var checkPropTypes = checkPropTypes_1;

    var has = Function.call.bind(Object.prototype.hasOwnProperty);
    var printWarning = function() {};

    if (process.env.NODE_ENV !== 'production') {
      printWarning = function(text) {
        var message = 'Warning: ' + text;
        if (typeof console !== 'undefined') {
          console.error(message);
        }
        try {
          // --- Welcome to debugging React ---
          // This error was thrown as a convenience so that you can use this stack
          // to find the callsite that caused this warning to fire.
          throw new Error(message);
        } catch (x) {}
      };
    }

    function emptyFunctionThatReturnsNull() {
      return null;
    }

    var factoryWithTypeCheckers = function(isValidElement, throwOnDirectAccess) {
      /* global Symbol */
      var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
      var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

      /**
       * Returns the iterator method function contained on the iterable object.
       *
       * Be sure to invoke the function with the iterable as context:
       *
       *     var iteratorFn = getIteratorFn(myIterable);
       *     if (iteratorFn) {
       *       var iterator = iteratorFn.call(myIterable);
       *       ...
       *     }
       *
       * @param {?object} maybeIterable
       * @return {?function}
       */
      function getIteratorFn(maybeIterable) {
        var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
        if (typeof iteratorFn === 'function') {
          return iteratorFn;
        }
      }

      /**
       * Collection of methods that allow declaration and validation of props that are
       * supplied to React components. Example usage:
       *
       *   var Props = require('ReactPropTypes');
       *   var MyArticle = React.createClass({
       *     propTypes: {
       *       // An optional string prop named "description".
       *       description: Props.string,
       *
       *       // A required enum prop named "category".
       *       category: Props.oneOf(['News','Photos']).isRequired,
       *
       *       // A prop named "dialog" that requires an instance of Dialog.
       *       dialog: Props.instanceOf(Dialog).isRequired
       *     },
       *     render: function() { ... }
       *   });
       *
       * A more formal specification of how these methods are used:
       *
       *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
       *   decl := ReactPropTypes.{type}(.isRequired)?
       *
       * Each and every declaration produces a function with the same signature. This
       * allows the creation of custom validation functions. For example:
       *
       *  var MyLink = React.createClass({
       *    propTypes: {
       *      // An optional string or URI prop named "href".
       *      href: function(props, propName, componentName) {
       *        var propValue = props[propName];
       *        if (propValue != null && typeof propValue !== 'string' &&
       *            !(propValue instanceof URI)) {
       *          return new Error(
       *            'Expected a string or an URI for ' + propName + ' in ' +
       *            componentName
       *          );
       *        }
       *      }
       *    },
       *    render: function() {...}
       *  });
       *
       * @internal
       */

      var ANONYMOUS = '<<anonymous>>';

      // Important!
      // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
      var ReactPropTypes = {
        array: createPrimitiveTypeChecker('array'),
        bool: createPrimitiveTypeChecker('boolean'),
        func: createPrimitiveTypeChecker('function'),
        number: createPrimitiveTypeChecker('number'),
        object: createPrimitiveTypeChecker('object'),
        string: createPrimitiveTypeChecker('string'),
        symbol: createPrimitiveTypeChecker('symbol'),

        any: createAnyTypeChecker(),
        arrayOf: createArrayOfTypeChecker,
        element: createElementTypeChecker(),
        elementType: createElementTypeTypeChecker(),
        instanceOf: createInstanceTypeChecker,
        node: createNodeChecker(),
        objectOf: createObjectOfTypeChecker,
        oneOf: createEnumTypeChecker,
        oneOfType: createUnionTypeChecker,
        shape: createShapeTypeChecker,
        exact: createStrictShapeTypeChecker,
      };

      /**
       * inlined Object.is polyfill to avoid requiring consumers ship their own
       * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
       */
      /*eslint-disable no-self-compare*/
      function is(x, y) {
        // SameValue algorithm
        if (x === y) {
          // Steps 1-5, 7-10
          // Steps 6.b-6.e: +0 != -0
          return x !== 0 || 1 / x === 1 / y;
        } else {
          // Step 6.a: NaN == NaN
          return x !== x && y !== y;
        }
      }
      /*eslint-enable no-self-compare*/

      /**
       * We use an Error-like object for backward compatibility as people may call
       * PropTypes directly and inspect their output. However, we don't use real
       * Errors anymore. We don't inspect their stack anyway, and creating them
       * is prohibitively expensive if they are created too often, such as what
       * happens in oneOfType() for any type before the one that matched.
       */
      function PropTypeError(message) {
        this.message = message;
        this.stack = '';
      }
      // Make `instanceof Error` still work for returned errors.
      PropTypeError.prototype = Error.prototype;

      function createChainableTypeChecker(validate) {
        if (process.env.NODE_ENV !== 'production') {
          var manualPropTypeCallCache = {};
          var manualPropTypeWarningCount = 0;
        }
        function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
          componentName = componentName || ANONYMOUS;
          propFullName = propFullName || propName;

          if (secret !== ReactPropTypesSecret$1) {
            if (throwOnDirectAccess) {
              // New behavior only for users of `prop-types` package
              var err = new Error(
                'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
                'Use `PropTypes.checkPropTypes()` to call them. ' +
                'Read more at http://fb.me/use-check-prop-types'
              );
              err.name = 'Invariant Violation';
              throw err;
            } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
              // Old behavior for people using React.PropTypes
              var cacheKey = componentName + ':' + propName;
              if (
                !manualPropTypeCallCache[cacheKey] &&
                // Avoid spamming the console because they are often not actionable except for lib authors
                manualPropTypeWarningCount < 3
              ) {
                printWarning(
                  'You are manually calling a React.PropTypes validation ' +
                  'function for the `' + propFullName + '` prop on `' + componentName  + '`. This is deprecated ' +
                  'and will throw in the standalone `prop-types` package. ' +
                  'You may be seeing this warning due to a third-party PropTypes ' +
                  'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
                );
                manualPropTypeCallCache[cacheKey] = true;
                manualPropTypeWarningCount++;
              }
            }
          }
          if (props[propName] == null) {
            if (isRequired) {
              if (props[propName] === null) {
                return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
              }
              return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
            }
            return null;
          } else {
            return validate(props, propName, componentName, location, propFullName);
          }
        }

        var chainedCheckType = checkType.bind(null, false);
        chainedCheckType.isRequired = checkType.bind(null, true);

        return chainedCheckType;
      }

      function createPrimitiveTypeChecker(expectedType) {
        function validate(props, propName, componentName, location, propFullName, secret) {
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== expectedType) {
            // `propValue` being instance of, say, date/regexp, pass the 'object'
            // check, but we can offer a more precise error message here rather than
            // 'of type `object`'.
            var preciseType = getPreciseType(propValue);

            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }

      function createAnyTypeChecker() {
        return createChainableTypeChecker(emptyFunctionThatReturnsNull);
      }

      function createArrayOfTypeChecker(typeChecker) {
        function validate(props, propName, componentName, location, propFullName) {
          if (typeof typeChecker !== 'function') {
            return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
          }
          var propValue = props[propName];
          if (!Array.isArray(propValue)) {
            var propType = getPropType(propValue);
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
          }
          for (var i = 0; i < propValue.length; i++) {
            var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret$1);
            if (error instanceof Error) {
              return error;
            }
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }

      function createElementTypeChecker() {
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          if (!isValidElement(propValue)) {
            var propType = getPropType(propValue);
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }

      function createElementTypeTypeChecker() {
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          if (!ReactIs$1.isValidElementType(propValue)) {
            var propType = getPropType(propValue);
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }

      function createInstanceTypeChecker(expectedClass) {
        function validate(props, propName, componentName, location, propFullName) {
          if (!(props[propName] instanceof expectedClass)) {
            var expectedClassName = expectedClass.name || ANONYMOUS;
            var actualClassName = getClassName(props[propName]);
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }

      function createEnumTypeChecker(expectedValues) {
        if (!Array.isArray(expectedValues)) {
          if (process.env.NODE_ENV !== 'production') {
            if (arguments.length > 1) {
              printWarning(
                'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
                'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
              );
            } else {
              printWarning('Invalid argument supplied to oneOf, expected an array.');
            }
          }
          return emptyFunctionThatReturnsNull;
        }

        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          for (var i = 0; i < expectedValues.length; i++) {
            if (is(propValue, expectedValues[i])) {
              return null;
            }
          }

          var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
            var type = getPreciseType(value);
            if (type === 'symbol') {
              return String(value);
            }
            return value;
          });
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
        }
        return createChainableTypeChecker(validate);
      }

      function createObjectOfTypeChecker(typeChecker) {
        function validate(props, propName, componentName, location, propFullName) {
          if (typeof typeChecker !== 'function') {
            return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
          }
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== 'object') {
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
          }
          for (var key in propValue) {
            if (has(propValue, key)) {
              var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret$1);
              if (error instanceof Error) {
                return error;
              }
            }
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }

      function createUnionTypeChecker(arrayOfTypeCheckers) {
        if (!Array.isArray(arrayOfTypeCheckers)) {
          process.env.NODE_ENV !== 'production' ? printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
          return emptyFunctionThatReturnsNull;
        }

        for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
          var checker = arrayOfTypeCheckers[i];
          if (typeof checker !== 'function') {
            printWarning(
              'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
              'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
            );
            return emptyFunctionThatReturnsNull;
          }
        }

        function validate(props, propName, componentName, location, propFullName) {
          for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
            var checker = arrayOfTypeCheckers[i];
            if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret$1) == null) {
              return null;
            }
          }

          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
        }
        return createChainableTypeChecker(validate);
      }

      function createNodeChecker() {
        function validate(props, propName, componentName, location, propFullName) {
          if (!isNode(props[propName])) {
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }

      function createShapeTypeChecker(shapeTypes) {
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== 'object') {
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
          }
          for (var key in shapeTypes) {
            var checker = shapeTypes[key];
            if (!checker) {
              continue;
            }
            var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret$1);
            if (error) {
              return error;
            }
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }

      function createStrictShapeTypeChecker(shapeTypes) {
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== 'object') {
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
          }
          // We need to check all keys in case some are required but missing from
          // props.
          var allKeys = assign({}, props[propName], shapeTypes);
          for (var key in allKeys) {
            var checker = shapeTypes[key];
            if (!checker) {
              return new PropTypeError(
                'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
                '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
                '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
              );
            }
            var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret$1);
            if (error) {
              return error;
            }
          }
          return null;
        }

        return createChainableTypeChecker(validate);
      }

      function isNode(propValue) {
        switch (typeof propValue) {
          case 'number':
          case 'string':
          case 'undefined':
            return true;
          case 'boolean':
            return !propValue;
          case 'object':
            if (Array.isArray(propValue)) {
              return propValue.every(isNode);
            }
            if (propValue === null || isValidElement(propValue)) {
              return true;
            }

            var iteratorFn = getIteratorFn(propValue);
            if (iteratorFn) {
              var iterator = iteratorFn.call(propValue);
              var step;
              if (iteratorFn !== propValue.entries) {
                while (!(step = iterator.next()).done) {
                  if (!isNode(step.value)) {
                    return false;
                  }
                }
              } else {
                // Iterator will provide entry [k,v] tuples rather than values.
                while (!(step = iterator.next()).done) {
                  var entry = step.value;
                  if (entry) {
                    if (!isNode(entry[1])) {
                      return false;
                    }
                  }
                }
              }
            } else {
              return false;
            }

            return true;
          default:
            return false;
        }
      }

      function isSymbol(propType, propValue) {
        // Native Symbol.
        if (propType === 'symbol') {
          return true;
        }

        // falsy value can't be a Symbol
        if (!propValue) {
          return false;
        }

        // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
        if (propValue['@@toStringTag'] === 'Symbol') {
          return true;
        }

        // Fallback for non-spec compliant Symbols which are polyfilled.
        if (typeof Symbol === 'function' && propValue instanceof Symbol) {
          return true;
        }

        return false;
      }

      // Equivalent of `typeof` but with special handling for array and regexp.
      function getPropType(propValue) {
        var propType = typeof propValue;
        if (Array.isArray(propValue)) {
          return 'array';
        }
        if (propValue instanceof RegExp) {
          // Old webkits (at least until Android 4.0) return 'function' rather than
          // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
          // passes PropTypes.object.
          return 'object';
        }
        if (isSymbol(propType, propValue)) {
          return 'symbol';
        }
        return propType;
      }

      // This handles more types than `getPropType`. Only used for error messages.
      // See `createPrimitiveTypeChecker`.
      function getPreciseType(propValue) {
        if (typeof propValue === 'undefined' || propValue === null) {
          return '' + propValue;
        }
        var propType = getPropType(propValue);
        if (propType === 'object') {
          if (propValue instanceof Date) {
            return 'date';
          } else if (propValue instanceof RegExp) {
            return 'regexp';
          }
        }
        return propType;
      }

      // Returns a string that is postfixed to a warning about an invalid type.
      // For example, "undefined" or "of type array"
      function getPostfixForTypeWarning(value) {
        var type = getPreciseType(value);
        switch (type) {
          case 'array':
          case 'object':
            return 'an ' + type;
          case 'boolean':
          case 'date':
          case 'regexp':
            return 'a ' + type;
          default:
            return type;
        }
      }

      // Returns class name of the object, if any.
      function getClassName(propValue) {
        if (!propValue.constructor || !propValue.constructor.name) {
          return ANONYMOUS;
        }
        return propValue.constructor.name;
      }

      ReactPropTypes.checkPropTypes = checkPropTypes;
      ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
      ReactPropTypes.PropTypes = ReactPropTypes;

      return ReactPropTypes;
    };

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */

    var ReactPropTypesSecret = ReactPropTypesSecret_1;

    function emptyFunction() {}
    function emptyFunctionWithReset() {}
    emptyFunctionWithReset.resetWarningCache = emptyFunction;

    var factoryWithThrowingShims = function() {
      function shim(props, propName, componentName, location, propFullName, secret) {
        if (secret === ReactPropTypesSecret) {
          // It is still safe when called from React.
          return;
        }
        var err = new Error(
          'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
          'Use PropTypes.checkPropTypes() to call them. ' +
          'Read more at http://fb.me/use-check-prop-types'
        );
        err.name = 'Invariant Violation';
        throw err;
      }  shim.isRequired = shim;
      function getShim() {
        return shim;
      }  // Important!
      // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
      var ReactPropTypes = {
        array: shim,
        bool: shim,
        func: shim,
        number: shim,
        object: shim,
        string: shim,
        symbol: shim,

        any: shim,
        arrayOf: getShim,
        element: shim,
        elementType: shim,
        instanceOf: getShim,
        node: shim,
        objectOf: getShim,
        oneOf: getShim,
        oneOfType: getShim,
        shape: getShim,
        exact: getShim,

        checkPropTypes: emptyFunctionWithReset,
        resetWarningCache: emptyFunction
      };

      ReactPropTypes.PropTypes = ReactPropTypes;

      return ReactPropTypes;
    };

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */

    if (process.env.NODE_ENV !== 'production') {
      var ReactIs = reactIs.exports;

      // By explicitly using `prop-types` you are opting into new development behavior.
      // http://fb.me/prop-types-in-prod
      var throwOnDirectAccess = true;
      propTypes.exports = factoryWithTypeCheckers(ReactIs.isElement, throwOnDirectAccess);
    } else {
      // By explicitly using `prop-types` you are opting into new production behavior.
      // http://fb.me/prop-types-in-prod
      propTypes.exports = factoryWithThrowingShims();
    }

    var classnames = {exports: {}};

    /*!
      Copyright (c) 2018 Jed Watson.
      Licensed under the MIT License (MIT), see
      http://jedwatson.github.io/classnames
    */

    (function (module) {
    /* global define */

    (function () {

    	var hasOwn = {}.hasOwnProperty;

    	function classNames() {
    		var classes = [];

    		for (var i = 0; i < arguments.length; i++) {
    			var arg = arguments[i];
    			if (!arg) continue;

    			var argType = typeof arg;

    			if (argType === 'string' || argType === 'number') {
    				classes.push(arg);
    			} else if (Array.isArray(arg)) {
    				if (arg.length) {
    					var inner = classNames.apply(null, arg);
    					if (inner) {
    						classes.push(inner);
    					}
    				}
    			} else if (argType === 'object') {
    				if (arg.toString === Object.prototype.toString) {
    					for (var key in arg) {
    						if (hasOwn.call(arg, key) && arg[key]) {
    							classes.push(key);
    						}
    					}
    				} else {
    					classes.push(arg.toString());
    				}
    			}
    		}

    		return classes.join(' ');
    	}

    	if (module.exports) {
    		classNames.default = classNames;
    		module.exports = classNames;
    	} else {
    		window.classNames = classNames;
    	}
    }());
    }(classnames));

    var domFns = {};

    var shims = {};

    Object.defineProperty(shims, "__esModule", {
      value: true
    });
    shims.findInArray = findInArray;
    shims.isFunction = isFunction;
    shims.isNum = isNum;
    shims.int = int;
    shims.dontSetMe = dontSetMe;

    // @credits https://gist.github.com/rogozhnikoff/a43cfed27c41e4e68cdc
    function findInArray(array
    /*: Array<any> | TouchList*/
    , callback
    /*: Function*/
    )
    /*: any*/
    {
      for (var i = 0, length = array.length; i < length; i++) {
        if (callback.apply(callback, [array[i], i, array])) return array[i];
      }
    }

    function isFunction(func
    /*: any*/
    )
    /*: boolean %checks*/
    {
      return typeof func === 'function' || Object.prototype.toString.call(func) === '[object Function]';
    }

    function isNum(num
    /*: any*/
    )
    /*: boolean %checks*/
    {
      return typeof num === 'number' && !isNaN(num);
    }

    function int(a
    /*: string*/
    )
    /*: number*/
    {
      return parseInt(a, 10);
    }

    function dontSetMe(props
    /*: Object*/
    , propName
    /*: string*/
    , componentName
    /*: string*/
    ) {
      if (props[propName]) {
        return new Error("Invalid prop ".concat(propName, " passed to ").concat(componentName, " - do not set this, set it on the child."));
      }
    }

    var getPrefix$1 = {};

    Object.defineProperty(getPrefix$1, "__esModule", {
      value: true
    });
    getPrefix$1.getPrefix = getPrefix;
    getPrefix$1.browserPrefixToKey = browserPrefixToKey;
    getPrefix$1.browserPrefixToStyle = browserPrefixToStyle;
    getPrefix$1.default = void 0;
    var prefixes = ['Moz', 'Webkit', 'O', 'ms'];

    function getPrefix()
    /*: string*/
    {
      var prop
      /*: string*/
      = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'transform';
      // Checking specifically for 'window.document' is for pseudo-browser server-side
      // environments that define 'window' as the global context.
      // E.g. React-rails (see https://github.com/reactjs/react-rails/pull/84)
      if (typeof window === 'undefined' || typeof window.document === 'undefined') return '';
      var style = window.document.documentElement.style;
      if (prop in style) return '';

      for (var i = 0; i < prefixes.length; i++) {
        if (browserPrefixToKey(prop, prefixes[i]) in style) return prefixes[i];
      }

      return '';
    }

    function browserPrefixToKey(prop
    /*: string*/
    , prefix
    /*: string*/
    )
    /*: string*/
    {
      return prefix ? "".concat(prefix).concat(kebabToTitleCase(prop)) : prop;
    }

    function browserPrefixToStyle(prop
    /*: string*/
    , prefix
    /*: string*/
    )
    /*: string*/
    {
      return prefix ? "-".concat(prefix.toLowerCase(), "-").concat(prop) : prop;
    }

    function kebabToTitleCase(str
    /*: string*/
    )
    /*: string*/
    {
      var out = '';
      var shouldCapitalize = true;

      for (var i = 0; i < str.length; i++) {
        if (shouldCapitalize) {
          out += str[i].toUpperCase();
          shouldCapitalize = false;
        } else if (str[i] === '-') {
          shouldCapitalize = true;
        } else {
          out += str[i];
        }
      }

      return out;
    } // Default export is the prefix itself, like 'Moz', 'Webkit', etc
    // Note that you may have to re-test for certain things; for instance, Chrome 50
    // can handle unprefixed `transform`, but not unprefixed `user-select`


    var _default = getPrefix();

    getPrefix$1.default = _default;

    function _typeof$1(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$1 = function _typeof(obj) { return typeof obj; }; } else { _typeof$1 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$1(obj); }

    Object.defineProperty(domFns, "__esModule", {
      value: true
    });
    domFns.matchesSelector = matchesSelector;
    domFns.matchesSelectorAndParentsTo = matchesSelectorAndParentsTo;
    domFns.addEvent = addEvent;
    domFns.removeEvent = removeEvent;
    domFns.outerHeight = outerHeight;
    domFns.outerWidth = outerWidth;
    domFns.innerHeight = innerHeight;
    domFns.innerWidth = innerWidth;
    domFns.offsetXYFromParent = offsetXYFromParent;
    domFns.createCSSTransform = createCSSTransform;
    domFns.createSVGTransform = createSVGTransform;
    domFns.getTranslation = getTranslation;
    domFns.getTouch = getTouch;
    domFns.getTouchIdentifier = getTouchIdentifier;
    domFns.addUserSelectStyles = addUserSelectStyles;
    domFns.removeUserSelectStyles = removeUserSelectStyles;
    domFns.addClassName = addClassName;
    domFns.removeClassName = removeClassName;

    var _shims$2 = shims;

    var _getPrefix = _interopRequireWildcard$1(getPrefix$1);

    function _getRequireWildcardCache$1() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache$1 = function _getRequireWildcardCache() { return cache; }; return cache; }

    function _interopRequireWildcard$1(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof$1(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache$1(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

    function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

    function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty$1(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

    function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

    var matchesSelectorFunc = '';

    function matchesSelector(el
    /*: Node*/
    , selector
    /*: string*/
    )
    /*: boolean*/
    {
      if (!matchesSelectorFunc) {
        matchesSelectorFunc = (0, _shims$2.findInArray)(['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'], function (method) {
          // $FlowIgnore: Doesn't think elements are indexable
          return (0, _shims$2.isFunction)(el[method]);
        });
      } // Might not be found entirely (not an Element?) - in that case, bail
      // $FlowIgnore: Doesn't think elements are indexable


      if (!(0, _shims$2.isFunction)(el[matchesSelectorFunc])) return false; // $FlowIgnore: Doesn't think elements are indexable

      return el[matchesSelectorFunc](selector);
    } // Works up the tree to the draggable itself attempting to match selector.


    function matchesSelectorAndParentsTo(el
    /*: Node*/
    , selector
    /*: string*/
    , baseNode
    /*: Node*/
    )
    /*: boolean*/
    {
      var node = el;

      do {
        if (matchesSelector(node, selector)) return true;
        if (node === baseNode) return false;
        node = node.parentNode;
      } while (node);

      return false;
    }

    function addEvent(el
    /*: ?Node*/
    , event
    /*: string*/
    , handler
    /*: Function*/
    , inputOptions
    /*: Object*/
    )
    /*: void*/
    {
      if (!el) return;

      var options = _objectSpread({
        capture: true
      }, inputOptions);

      if (el.addEventListener) {
        el.addEventListener(event, handler, options);
      } else if (el.attachEvent) {
        el.attachEvent('on' + event, handler);
      } else {
        // $FlowIgnore: Doesn't think elements are indexable
        el['on' + event] = handler;
      }
    }

    function removeEvent(el
    /*: ?Node*/
    , event
    /*: string*/
    , handler
    /*: Function*/
    , inputOptions
    /*: Object*/
    )
    /*: void*/
    {
      if (!el) return;

      var options = _objectSpread({
        capture: true
      }, inputOptions);

      if (el.removeEventListener) {
        el.removeEventListener(event, handler, options);
      } else if (el.detachEvent) {
        el.detachEvent('on' + event, handler);
      } else {
        // $FlowIgnore: Doesn't think elements are indexable
        el['on' + event] = null;
      }
    }

    function outerHeight(node
    /*: HTMLElement*/
    )
    /*: number*/
    {
      // This is deliberately excluding margin for our calculations, since we are using
      // offsetTop which is including margin. See getBoundPosition
      var height = node.clientHeight;
      var computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
      height += (0, _shims$2.int)(computedStyle.borderTopWidth);
      height += (0, _shims$2.int)(computedStyle.borderBottomWidth);
      return height;
    }

    function outerWidth(node
    /*: HTMLElement*/
    )
    /*: number*/
    {
      // This is deliberately excluding margin for our calculations, since we are using
      // offsetLeft which is including margin. See getBoundPosition
      var width = node.clientWidth;
      var computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
      width += (0, _shims$2.int)(computedStyle.borderLeftWidth);
      width += (0, _shims$2.int)(computedStyle.borderRightWidth);
      return width;
    }

    function innerHeight(node
    /*: HTMLElement*/
    )
    /*: number*/
    {
      var height = node.clientHeight;
      var computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
      height -= (0, _shims$2.int)(computedStyle.paddingTop);
      height -= (0, _shims$2.int)(computedStyle.paddingBottom);
      return height;
    }

    function innerWidth(node
    /*: HTMLElement*/
    )
    /*: number*/
    {
      var width = node.clientWidth;
      var computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
      width -= (0, _shims$2.int)(computedStyle.paddingLeft);
      width -= (0, _shims$2.int)(computedStyle.paddingRight);
      return width;
    } // Get from offsetParent


    function offsetXYFromParent(evt
    /*: {clientX: number, clientY: number}*/
    , offsetParent
    /*: HTMLElement*/
    , scale
    /*: number*/
    )
    /*: ControlPosition*/
    {
      var isBody = offsetParent === offsetParent.ownerDocument.body;
      var offsetParentRect = isBody ? {
        left: 0,
        top: 0
      } : offsetParent.getBoundingClientRect();
      var x = (evt.clientX + offsetParent.scrollLeft - offsetParentRect.left) / scale;
      var y = (evt.clientY + offsetParent.scrollTop - offsetParentRect.top) / scale;
      return {
        x: x,
        y: y
      };
    }

    function createCSSTransform(controlPos
    /*: ControlPosition*/
    , positionOffset
    /*: PositionOffsetControlPosition*/
    )
    /*: Object*/
    {
      var translation = getTranslation(controlPos, positionOffset, 'px');
      return _defineProperty$1({}, (0, _getPrefix.browserPrefixToKey)('transform', _getPrefix.default), translation);
    }

    function createSVGTransform(controlPos
    /*: ControlPosition*/
    , positionOffset
    /*: PositionOffsetControlPosition*/
    )
    /*: string*/
    {
      var translation = getTranslation(controlPos, positionOffset, '');
      return translation;
    }

    function getTranslation(_ref2, positionOffset
    /*: PositionOffsetControlPosition*/
    , unitSuffix
    /*: string*/
    )
    /*: string*/
    {
      var x = _ref2.x,
          y = _ref2.y;
      var translation = "translate(".concat(x).concat(unitSuffix, ",").concat(y).concat(unitSuffix, ")");

      if (positionOffset) {
        var defaultX = "".concat(typeof positionOffset.x === 'string' ? positionOffset.x : positionOffset.x + unitSuffix);
        var defaultY = "".concat(typeof positionOffset.y === 'string' ? positionOffset.y : positionOffset.y + unitSuffix);
        translation = "translate(".concat(defaultX, ", ").concat(defaultY, ")") + translation;
      }

      return translation;
    }

    function getTouch(e
    /*: MouseTouchEvent*/
    , identifier
    /*: number*/
    )
    /*: ?{clientX: number, clientY: number}*/
    {
      return e.targetTouches && (0, _shims$2.findInArray)(e.targetTouches, function (t) {
        return identifier === t.identifier;
      }) || e.changedTouches && (0, _shims$2.findInArray)(e.changedTouches, function (t) {
        return identifier === t.identifier;
      });
    }

    function getTouchIdentifier(e
    /*: MouseTouchEvent*/
    )
    /*: ?number*/
    {
      if (e.targetTouches && e.targetTouches[0]) return e.targetTouches[0].identifier;
      if (e.changedTouches && e.changedTouches[0]) return e.changedTouches[0].identifier;
    } // User-select Hacks:
    //
    // Useful for preventing blue highlights all over everything when dragging.
    // Note we're passing `document` b/c we could be iframed


    function addUserSelectStyles(doc
    /*: ?Document*/
    ) {
      if (!doc) return;
      var styleEl = doc.getElementById('react-draggable-style-el');

      if (!styleEl) {
        styleEl = doc.createElement('style');
        styleEl.type = 'text/css';
        styleEl.id = 'react-draggable-style-el';
        styleEl.innerHTML = '.react-draggable-transparent-selection *::-moz-selection {all: inherit;}\n';
        styleEl.innerHTML += '.react-draggable-transparent-selection *::selection {all: inherit;}\n';
        doc.getElementsByTagName('head')[0].appendChild(styleEl);
      }

      if (doc.body) addClassName(doc.body, 'react-draggable-transparent-selection');
    }

    function removeUserSelectStyles(doc
    /*: ?Document*/
    ) {
      if (!doc) return;

      try {
        if (doc.body) removeClassName(doc.body, 'react-draggable-transparent-selection'); // $FlowIgnore: IE

        if (doc.selection) {
          // $FlowIgnore: IE
          doc.selection.empty();
        } else {
          // Remove selection caused by scroll, unless it's a focused input
          // (we use doc.defaultView in case we're in an iframe)
          var selection = (doc.defaultView || window).getSelection();

          if (selection && selection.type !== 'Caret') {
            selection.removeAllRanges();
          }
        }
      } catch (e) {// probably IE
      }
    }

    function addClassName(el
    /*: HTMLElement*/
    , className
    /*: string*/
    ) {
      if (el.classList) {
        el.classList.add(className);
      } else {
        if (!el.className.match(new RegExp("(?:^|\\s)".concat(className, "(?!\\S)")))) {
          el.className += " ".concat(className);
        }
      }
    }

    function removeClassName(el
    /*: HTMLElement*/
    , className
    /*: string*/
    ) {
      if (el.classList) {
        el.classList.remove(className);
      } else {
        el.className = el.className.replace(new RegExp("(?:^|\\s)".concat(className, "(?!\\S)"), 'g'), '');
      }
    }

    var positionFns = {};

    Object.defineProperty(positionFns, "__esModule", {
      value: true
    });
    positionFns.getBoundPosition = getBoundPosition;
    positionFns.snapToGrid = snapToGrid;
    positionFns.canDragX = canDragX;
    positionFns.canDragY = canDragY;
    positionFns.getControlPosition = getControlPosition;
    positionFns.createCoreData = createCoreData;
    positionFns.createDraggableData = createDraggableData;

    var _shims$1 = shims;

    var _domFns$1 = domFns;

    function getBoundPosition(draggable
    /*: Draggable*/
    , x
    /*: number*/
    , y
    /*: number*/
    )
    /*: [number, number]*/
    {
      // If no bounds, short-circuit and move on
      if (!draggable.props.bounds) return [x, y]; // Clone new bounds

      var bounds = draggable.props.bounds;
      bounds = typeof bounds === 'string' ? bounds : cloneBounds(bounds);
      var node = findDOMNode(draggable);

      if (typeof bounds === 'string') {
        var ownerDocument = node.ownerDocument;
        var ownerWindow = ownerDocument.defaultView;
        var boundNode;

        if (bounds === 'parent') {
          boundNode = node.parentNode;
        } else {
          boundNode = ownerDocument.querySelector(bounds);
        }

        if (!(boundNode instanceof ownerWindow.HTMLElement)) {
          throw new Error('Bounds selector "' + bounds + '" could not find an element.');
        }

        var nodeStyle = ownerWindow.getComputedStyle(node);
        var boundNodeStyle = ownerWindow.getComputedStyle(boundNode); // Compute bounds. This is a pain with padding and offsets but this gets it exactly right.

        bounds = {
          left: -node.offsetLeft + (0, _shims$1.int)(boundNodeStyle.paddingLeft) + (0, _shims$1.int)(nodeStyle.marginLeft),
          top: -node.offsetTop + (0, _shims$1.int)(boundNodeStyle.paddingTop) + (0, _shims$1.int)(nodeStyle.marginTop),
          right: (0, _domFns$1.innerWidth)(boundNode) - (0, _domFns$1.outerWidth)(node) - node.offsetLeft + (0, _shims$1.int)(boundNodeStyle.paddingRight) - (0, _shims$1.int)(nodeStyle.marginRight),
          bottom: (0, _domFns$1.innerHeight)(boundNode) - (0, _domFns$1.outerHeight)(node) - node.offsetTop + (0, _shims$1.int)(boundNodeStyle.paddingBottom) - (0, _shims$1.int)(nodeStyle.marginBottom)
        };
      } // Keep x and y below right and bottom limits...


      if ((0, _shims$1.isNum)(bounds.right)) x = Math.min(x, bounds.right);
      if ((0, _shims$1.isNum)(bounds.bottom)) y = Math.min(y, bounds.bottom); // But above left and top limits.

      if ((0, _shims$1.isNum)(bounds.left)) x = Math.max(x, bounds.left);
      if ((0, _shims$1.isNum)(bounds.top)) y = Math.max(y, bounds.top);
      return [x, y];
    }

    function snapToGrid(grid
    /*: [number, number]*/
    , pendingX
    /*: number*/
    , pendingY
    /*: number*/
    )
    /*: [number, number]*/
    {
      var x = Math.round(pendingX / grid[0]) * grid[0];
      var y = Math.round(pendingY / grid[1]) * grid[1];
      return [x, y];
    }

    function canDragX(draggable
    /*: Draggable*/
    )
    /*: boolean*/
    {
      return draggable.props.axis === 'both' || draggable.props.axis === 'x';
    }

    function canDragY(draggable
    /*: Draggable*/
    )
    /*: boolean*/
    {
      return draggable.props.axis === 'both' || draggable.props.axis === 'y';
    } // Get {x, y} positions from event.


    function getControlPosition(e
    /*: MouseTouchEvent*/
    , touchIdentifier
    /*: ?number*/
    , draggableCore
    /*: DraggableCore*/
    )
    /*: ?ControlPosition*/
    {
      var touchObj = typeof touchIdentifier === 'number' ? (0, _domFns$1.getTouch)(e, touchIdentifier) : null;
      if (typeof touchIdentifier === 'number' && !touchObj) return null; // not the right touch

      var node = findDOMNode(draggableCore); // User can provide an offsetParent if desired.

      var offsetParent = draggableCore.props.offsetParent || node.offsetParent || node.ownerDocument.body;
      return (0, _domFns$1.offsetXYFromParent)(touchObj || e, offsetParent, draggableCore.props.scale);
    } // Create an data object exposed by <DraggableCore>'s events


    function createCoreData(draggable
    /*: DraggableCore*/
    , x
    /*: number*/
    , y
    /*: number*/
    )
    /*: DraggableData*/
    {
      var state = draggable.state;
      var isStart = !(0, _shims$1.isNum)(state.lastX);
      var node = findDOMNode(draggable);

      if (isStart) {
        // If this is our first move, use the x and y as last coords.
        return {
          node: node,
          deltaX: 0,
          deltaY: 0,
          lastX: x,
          lastY: y,
          x: x,
          y: y
        };
      } else {
        // Otherwise calculate proper values.
        return {
          node: node,
          deltaX: x - state.lastX,
          deltaY: y - state.lastY,
          lastX: state.lastX,
          lastY: state.lastY,
          x: x,
          y: y
        };
      }
    } // Create an data exposed by <Draggable>'s events


    function createDraggableData(draggable
    /*: Draggable*/
    , coreData
    /*: DraggableData*/
    )
    /*: DraggableData*/
    {
      var scale = draggable.props.scale;
      return {
        node: coreData.node,
        x: draggable.state.x + coreData.deltaX / scale,
        y: draggable.state.y + coreData.deltaY / scale,
        deltaX: coreData.deltaX / scale,
        deltaY: coreData.deltaY / scale,
        lastX: draggable.state.x,
        lastY: draggable.state.y
      };
    } // A lot faster than stringify/parse


    function cloneBounds(bounds
    /*: Bounds*/
    )
    /*: Bounds*/
    {
      return {
        left: bounds.left,
        top: bounds.top,
        right: bounds.right,
        bottom: bounds.bottom
      };
    }

    function findDOMNode(draggable
    /*: Draggable | DraggableCore*/
    )
    /*: HTMLElement*/
    {
      var node = draggable.findDOMNode();

      if (!node) {
        throw new Error('<DraggableCore>: Unmounted during event!');
      } // $FlowIgnore we can't assert on HTMLElement due to tests... FIXME


      return node;
    }

    var DraggableCore$2 = {};

    var log$1 = {};

    Object.defineProperty(log$1, "__esModule", {
      value: true
    });
    log$1.default = log;

    /*eslint no-console:0*/
    function log() {
    }

    Object.defineProperty(DraggableCore$2, "__esModule", {
      value: true
    });
    DraggableCore$2.default = void 0;

    var React = _interopRequireWildcard(React__default['default']);

    var _propTypes = _interopRequireDefault(propTypes.exports);

    var _reactDom = _interopRequireDefault(require$$2__default['default']);

    var _domFns = domFns;

    var _positionFns = positionFns;

    var _shims = shims;

    var _log = _interopRequireDefault(log$1);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

    function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

    function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

    function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

    function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

    function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

    function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

    function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

    function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

    function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

    function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

    function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

    function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

    function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

    function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

    function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

    // Simple abstraction for dragging events names.
    var eventsFor = {
      touch: {
        start: 'touchstart',
        move: 'touchmove',
        stop: 'touchend'
      },
      mouse: {
        start: 'mousedown',
        move: 'mousemove',
        stop: 'mouseup'
      }
    }; // Default to mouse events.

    var dragEventFor = eventsFor.mouse;
    /*:: type DraggableCoreState = {
      dragging: boolean,
      lastX: number,
      lastY: number,
      touchIdentifier: ?number
    };*/

    /*:: export type DraggableData = {
      node: HTMLElement,
      x: number, y: number,
      deltaX: number, deltaY: number,
      lastX: number, lastY: number,
    };*/

    /*:: export type DraggableEventHandler = (e: MouseEvent, data: DraggableData) => void;*/

    /*:: export type ControlPosition = {x: number, y: number};*/

    /*:: export type PositionOffsetControlPosition = {x: number|string, y: number|string};*/

    /*:: export type DraggableCoreProps = {
      allowAnyClick: boolean,
      cancel: string,
      children: ReactElement<any>,
      disabled: boolean,
      enableUserSelectHack: boolean,
      offsetParent: HTMLElement,
      grid: [number, number],
      handle: string,
      nodeRef?: ?React.ElementRef<any>,
      onStart: DraggableEventHandler,
      onDrag: DraggableEventHandler,
      onStop: DraggableEventHandler,
      onMouseDown: (e: MouseEvent) => void,
      scale: number,
    };*/

    //
    // Define <DraggableCore>.
    //
    // <DraggableCore> is for advanced usage of <Draggable>. It maintains minimal internal state so it can
    // work well with libraries that require more control over the element.
    //
    var DraggableCore$1 = /*#__PURE__*/function (_React$Component) {
      _inherits(DraggableCore, _React$Component);

      var _super = _createSuper(DraggableCore);

      function DraggableCore() {
        var _this;

        _classCallCheck(this, DraggableCore);

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this = _super.call.apply(_super, [this].concat(args));

        _defineProperty(_assertThisInitialized(_this), "state", {
          dragging: false,
          // Used while dragging to determine deltas.
          lastX: NaN,
          lastY: NaN,
          touchIdentifier: null
        });

        _defineProperty(_assertThisInitialized(_this), "mounted", false);

        _defineProperty(_assertThisInitialized(_this), "handleDragStart", function (e) {
          // Make it possible to attach event handlers on top of this one.
          _this.props.onMouseDown(e); // Only accept left-clicks.


          if (!_this.props.allowAnyClick && typeof e.button === 'number' && e.button !== 0) return false; // Get nodes. Be sure to grab relative document (could be iframed)

          var thisNode = _this.findDOMNode();

          if (!thisNode || !thisNode.ownerDocument || !thisNode.ownerDocument.body) {
            throw new Error('<DraggableCore> not mounted on DragStart!');
          }

          var ownerDocument = thisNode.ownerDocument; // Short circuit if handle or cancel prop was provided and selector doesn't match.

          if (_this.props.disabled || !(e.target instanceof ownerDocument.defaultView.Node) || _this.props.handle && !(0, _domFns.matchesSelectorAndParentsTo)(e.target, _this.props.handle, thisNode) || _this.props.cancel && (0, _domFns.matchesSelectorAndParentsTo)(e.target, _this.props.cancel, thisNode)) {
            return;
          } // Prevent scrolling on mobile devices, like ipad/iphone.
          // Important that this is after handle/cancel.


          if (e.type === 'touchstart') e.preventDefault(); // Set touch identifier in component state if this is a touch event. This allows us to
          // distinguish between individual touches on multitouch screens by identifying which
          // touchpoint was set to this element.

          var touchIdentifier = (0, _domFns.getTouchIdentifier)(e);

          _this.setState({
            touchIdentifier: touchIdentifier
          }); // Get the current drag point from the event. This is used as the offset.


          var position = (0, _positionFns.getControlPosition)(e, touchIdentifier, _assertThisInitialized(_this));
          if (position == null) return; // not possible but satisfies flow

          var x = position.x,
              y = position.y; // Create an event object with all the data parents need to make a decision here.

          var coreEvent = (0, _positionFns.createCoreData)(_assertThisInitialized(_this), x, y);
          (0, _log.default)('DraggableCore: handleDragStart: %j', coreEvent); // Call event handler. If it returns explicit false, cancel.

          (0, _log.default)('calling', _this.props.onStart);

          var shouldUpdate = _this.props.onStart(e, coreEvent);

          if (shouldUpdate === false || _this.mounted === false) return; // Add a style to the body to disable user-select. This prevents text from
          // being selected all over the page.

          if (_this.props.enableUserSelectHack) (0, _domFns.addUserSelectStyles)(ownerDocument); // Initiate dragging. Set the current x and y as offsets
          // so we know how much we've moved during the drag. This allows us
          // to drag elements around even if they have been moved, without issue.

          _this.setState({
            dragging: true,
            lastX: x,
            lastY: y
          }); // Add events to the document directly so we catch when the user's mouse/touch moves outside of
          // this element. We use different events depending on whether or not we have detected that this
          // is a touch-capable device.


          (0, _domFns.addEvent)(ownerDocument, dragEventFor.move, _this.handleDrag);
          (0, _domFns.addEvent)(ownerDocument, dragEventFor.stop, _this.handleDragStop);
        });

        _defineProperty(_assertThisInitialized(_this), "handleDrag", function (e) {
          // Get the current drag point from the event. This is used as the offset.
          var position = (0, _positionFns.getControlPosition)(e, _this.state.touchIdentifier, _assertThisInitialized(_this));
          if (position == null) return;
          var x = position.x,
              y = position.y; // Snap to grid if prop has been provided

          if (Array.isArray(_this.props.grid)) {
            var deltaX = x - _this.state.lastX,
                deltaY = y - _this.state.lastY;

            var _snapToGrid = (0, _positionFns.snapToGrid)(_this.props.grid, deltaX, deltaY);

            var _snapToGrid2 = _slicedToArray(_snapToGrid, 2);

            deltaX = _snapToGrid2[0];
            deltaY = _snapToGrid2[1];
            if (!deltaX && !deltaY) return; // skip useless drag

            x = _this.state.lastX + deltaX, y = _this.state.lastY + deltaY;
          }

          var coreEvent = (0, _positionFns.createCoreData)(_assertThisInitialized(_this), x, y);
          (0, _log.default)('DraggableCore: handleDrag: %j', coreEvent); // Call event handler. If it returns explicit false, trigger end.

          var shouldUpdate = _this.props.onDrag(e, coreEvent);

          if (shouldUpdate === false || _this.mounted === false) {
            try {
              // $FlowIgnore
              _this.handleDragStop(new MouseEvent('mouseup'));
            } catch (err) {
              // Old browsers
              var event = ((document.createEvent('MouseEvents')
              /*: any*/
              )
              /*: MouseTouchEvent*/
              ); // I see why this insanity was deprecated
              // $FlowIgnore

              event.initMouseEvent('mouseup', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

              _this.handleDragStop(event);
            }

            return;
          }

          _this.setState({
            lastX: x,
            lastY: y
          });
        });

        _defineProperty(_assertThisInitialized(_this), "handleDragStop", function (e) {
          if (!_this.state.dragging) return;
          var position = (0, _positionFns.getControlPosition)(e, _this.state.touchIdentifier, _assertThisInitialized(_this));
          if (position == null) return;
          var x = position.x,
              y = position.y;
          var coreEvent = (0, _positionFns.createCoreData)(_assertThisInitialized(_this), x, y); // Call event handler

          var shouldContinue = _this.props.onStop(e, coreEvent);

          if (shouldContinue === false || _this.mounted === false) return false;

          var thisNode = _this.findDOMNode();

          if (thisNode) {
            // Remove user-select hack
            if (_this.props.enableUserSelectHack) (0, _domFns.removeUserSelectStyles)(thisNode.ownerDocument);
          }

          (0, _log.default)('DraggableCore: handleDragStop: %j', coreEvent); // Reset the el.

          _this.setState({
            dragging: false,
            lastX: NaN,
            lastY: NaN
          });

          if (thisNode) {
            // Remove event handlers
            (0, _log.default)('DraggableCore: Removing handlers');
            (0, _domFns.removeEvent)(thisNode.ownerDocument, dragEventFor.move, _this.handleDrag);
            (0, _domFns.removeEvent)(thisNode.ownerDocument, dragEventFor.stop, _this.handleDragStop);
          }
        });

        _defineProperty(_assertThisInitialized(_this), "onMouseDown", function (e) {
          dragEventFor = eventsFor.mouse; // on touchscreen laptops we could switch back to mouse

          return _this.handleDragStart(e);
        });

        _defineProperty(_assertThisInitialized(_this), "onMouseUp", function (e) {
          dragEventFor = eventsFor.mouse;
          return _this.handleDragStop(e);
        });

        _defineProperty(_assertThisInitialized(_this), "onTouchStart", function (e) {
          // We're on a touch device now, so change the event handlers
          dragEventFor = eventsFor.touch;
          return _this.handleDragStart(e);
        });

        _defineProperty(_assertThisInitialized(_this), "onTouchEnd", function (e) {
          // We're on a touch device now, so change the event handlers
          dragEventFor = eventsFor.touch;
          return _this.handleDragStop(e);
        });

        return _this;
      }

      _createClass(DraggableCore, [{
        key: "componentDidMount",
        value: function componentDidMount() {
          this.mounted = true; // Touch handlers must be added with {passive: false} to be cancelable.
          // https://developers.google.com/web/updates/2017/01/scrolling-intervention

          var thisNode = this.findDOMNode();

          if (thisNode) {
            (0, _domFns.addEvent)(thisNode, eventsFor.touch.start, this.onTouchStart, {
              passive: false
            });
          }
        }
      }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          this.mounted = false; // Remove any leftover event handlers. Remove both touch and mouse handlers in case
          // some browser quirk caused a touch event to fire during a mouse move, or vice versa.

          var thisNode = this.findDOMNode();

          if (thisNode) {
            var ownerDocument = thisNode.ownerDocument;
            (0, _domFns.removeEvent)(ownerDocument, eventsFor.mouse.move, this.handleDrag);
            (0, _domFns.removeEvent)(ownerDocument, eventsFor.touch.move, this.handleDrag);
            (0, _domFns.removeEvent)(ownerDocument, eventsFor.mouse.stop, this.handleDragStop);
            (0, _domFns.removeEvent)(ownerDocument, eventsFor.touch.stop, this.handleDragStop);
            (0, _domFns.removeEvent)(thisNode, eventsFor.touch.start, this.onTouchStart, {
              passive: false
            });
            if (this.props.enableUserSelectHack) (0, _domFns.removeUserSelectStyles)(ownerDocument);
          }
        } // React Strict Mode compatibility: if `nodeRef` is passed, we will use it instead of trying to find
        // the underlying DOM node ourselves. See the README for more information.

      }, {
        key: "findDOMNode",
        value: function findDOMNode()
        /*: ?HTMLElement*/
        {
          return this.props.nodeRef ? this.props.nodeRef.current : _reactDom.default.findDOMNode(this);
        }
      }, {
        key: "render",
        value: function render() {
          // Reuse the child provided
          // This makes it flexible to use whatever element is wanted (div, ul, etc)
          return React.cloneElement(React.Children.only(this.props.children), {
            // Note: mouseMove handler is attached to document so it will still function
            // when the user drags quickly and leaves the bounds of the element.
            onMouseDown: this.onMouseDown,
            onMouseUp: this.onMouseUp,
            // onTouchStart is added on `componentDidMount` so they can be added with
            // {passive: false}, which allows it to cancel. See 
            // https://developers.google.com/web/updates/2017/01/scrolling-intervention
            onTouchEnd: this.onTouchEnd
          });
        }
      }]);

      return DraggableCore;
    }(React.Component);

    DraggableCore$2.default = DraggableCore$1;

    _defineProperty(DraggableCore$1, "displayName", 'DraggableCore');

    _defineProperty(DraggableCore$1, "propTypes", {
      /**
       * `allowAnyClick` allows dragging using any mouse button.
       * By default, we only accept the left button.
       *
       * Defaults to `false`.
       */
      allowAnyClick: _propTypes.default.bool,

      /**
       * `disabled`, if true, stops the <Draggable> from dragging. All handlers,
       * with the exception of `onMouseDown`, will not fire.
       */
      disabled: _propTypes.default.bool,

      /**
       * By default, we add 'user-select:none' attributes to the document body
       * to prevent ugly text selection during drag. If this is causing problems
       * for your app, set this to `false`.
       */
      enableUserSelectHack: _propTypes.default.bool,

      /**
       * `offsetParent`, if set, uses the passed DOM node to compute drag offsets
       * instead of using the parent node.
       */
      offsetParent: function offsetParent(props
      /*: DraggableCoreProps*/
      , propName
      /*: $Keys<DraggableCoreProps>*/
      ) {
        if (props[propName] && props[propName].nodeType !== 1) {
          throw new Error('Draggable\'s offsetParent must be a DOM Node.');
        }
      },

      /**
       * `grid` specifies the x and y that dragging should snap to.
       */
      grid: _propTypes.default.arrayOf(_propTypes.default.number),

      /**
       * `handle` specifies a selector to be used as the handle that initiates drag.
       *
       * Example:
       *
       * ```jsx
       *   let App = React.createClass({
       *       render: function () {
       *         return (
       *            <Draggable handle=".handle">
       *              <div>
       *                  <div className="handle">Click me to drag</div>
       *                  <div>This is some other content</div>
       *              </div>
       *           </Draggable>
       *         );
       *       }
       *   });
       * ```
       */
      handle: _propTypes.default.string,

      /**
       * `cancel` specifies a selector to be used to prevent drag initialization.
       *
       * Example:
       *
       * ```jsx
       *   let App = React.createClass({
       *       render: function () {
       *           return(
       *               <Draggable cancel=".cancel">
       *                   <div>
       *                     <div className="cancel">You can't drag from here</div>
       *                     <div>Dragging here works fine</div>
       *                   </div>
       *               </Draggable>
       *           );
       *       }
       *   });
       * ```
       */
      cancel: _propTypes.default.string,

      /* If running in React Strict mode, ReactDOM.findDOMNode() is deprecated.
       * Unfortunately, in order for <Draggable> to work properly, we need raw access
       * to the underlying DOM node. If you want to avoid the warning, pass a `nodeRef`
       * as in this example:
       *
       * function MyComponent() {
       *   const nodeRef = React.useRef(null);
       *   return (
       *     <Draggable nodeRef={nodeRef}>
       *       <div ref={nodeRef}>Example Target</div>
       *     </Draggable>
       *   );
       * }
       *
       * This can be used for arbitrarily nested components, so long as the ref ends up
       * pointing to the actual child DOM node and not a custom component.
       */
      nodeRef: _propTypes.default.object,

      /**
       * Called when dragging starts.
       * If this function returns the boolean false, dragging will be canceled.
       */
      onStart: _propTypes.default.func,

      /**
       * Called while dragging.
       * If this function returns the boolean false, dragging will be canceled.
       */
      onDrag: _propTypes.default.func,

      /**
       * Called when dragging stops.
       * If this function returns the boolean false, the drag will remain active.
       */
      onStop: _propTypes.default.func,

      /**
       * A workaround option which can be passed if onMouseDown needs to be accessed,
       * since it'll always be blocked (as there is internal use of onMouseDown)
       */
      onMouseDown: _propTypes.default.func,

      /**
       * `scale`, if set, applies scaling while dragging an element
       */
      scale: _propTypes.default.number,

      /**
       * These properties should be defined on the child, not here.
       */
      className: _shims.dontSetMe,
      style: _shims.dontSetMe,
      transform: _shims.dontSetMe
    });

    _defineProperty(DraggableCore$1, "defaultProps", {
      allowAnyClick: false,
      // by default only accept left click
      cancel: null,
      disabled: false,
      enableUserSelectHack: true,
      offsetParent: null,
      handle: null,
      grid: null,
      transform: null,
      onStart: function onStart() {},
      onDrag: function onDrag() {},
      onStop: function onStop() {},
      onMouseDown: function onMouseDown() {},
      scale: 1
    });

    (function (exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    Object.defineProperty(exports, "DraggableCore", {
      enumerable: true,
      get: function get() {
        return _DraggableCore.default;
      }
    });
    exports.default = void 0;

    var React = _interopRequireWildcard(React__default['default']);

    var _propTypes = _interopRequireDefault(propTypes.exports);

    var _reactDom = _interopRequireDefault(require$$2__default['default']);

    var _classnames = _interopRequireDefault(classnames.exports);

    var _domFns = domFns;

    var _positionFns = positionFns;

    var _shims = shims;

    var _DraggableCore = _interopRequireDefault(DraggableCore$2);

    var _log = _interopRequireDefault(log$1);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

    function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

    function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

    function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

    function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

    function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

    function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

    function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

    function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

    function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

    function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

    function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

    function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

    function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

    function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

    function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

    function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

    function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

    function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

    function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

    function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

    //
    // Define <Draggable>
    //
    var Draggable = /*#__PURE__*/function (_React$Component) {
      _inherits(Draggable, _React$Component);

      var _super = _createSuper(Draggable);

      _createClass(Draggable, null, [{
        key: "getDerivedStateFromProps",
        // React 16.3+
        // Arity (props, state)
        value: function getDerivedStateFromProps(_ref, _ref2) {
          var position = _ref.position;
          var prevPropsPosition = _ref2.prevPropsPosition;

          // Set x/y if a new position is provided in props that is different than the previous.
          if (position && (!prevPropsPosition || position.x !== prevPropsPosition.x || position.y !== prevPropsPosition.y)) {
            (0, _log.default)('Draggable: getDerivedStateFromProps %j', {
              position: position,
              prevPropsPosition: prevPropsPosition
            });
            return {
              x: position.x,
              y: position.y,
              prevPropsPosition: _objectSpread({}, position)
            };
          }

          return null;
        }
      }]);

      function Draggable(props
      /*: DraggableProps*/
      ) {
        var _this;

        _classCallCheck(this, Draggable);

        _this = _super.call(this, props);

        _defineProperty(_assertThisInitialized(_this), "onDragStart", function (e, coreData) {
          (0, _log.default)('Draggable: onDragStart: %j', coreData); // Short-circuit if user's callback killed it.

          var shouldStart = _this.props.onStart(e, (0, _positionFns.createDraggableData)(_assertThisInitialized(_this), coreData)); // Kills start event on core as well, so move handlers are never bound.


          if (shouldStart === false) return false;

          _this.setState({
            dragging: true,
            dragged: true
          });
        });

        _defineProperty(_assertThisInitialized(_this), "onDrag", function (e, coreData) {
          if (!_this.state.dragging) return false;
          (0, _log.default)('Draggable: onDrag: %j', coreData);
          var uiData = (0, _positionFns.createDraggableData)(_assertThisInitialized(_this), coreData);
          var newState
          /*: $Shape<DraggableState>*/
          = {
            x: uiData.x,
            y: uiData.y
          }; // Keep within bounds.

          if (_this.props.bounds) {
            // Save original x and y.
            var x = newState.x,
                y = newState.y; // Add slack to the values used to calculate bound position. This will ensure that if
            // we start removing slack, the element won't react to it right away until it's been
            // completely removed.

            newState.x += _this.state.slackX;
            newState.y += _this.state.slackY; // Get bound position. This will ceil/floor the x and y within the boundaries.

            var _getBoundPosition = (0, _positionFns.getBoundPosition)(_assertThisInitialized(_this), newState.x, newState.y),
                _getBoundPosition2 = _slicedToArray(_getBoundPosition, 2),
                newStateX = _getBoundPosition2[0],
                newStateY = _getBoundPosition2[1];

            newState.x = newStateX;
            newState.y = newStateY; // Recalculate slack by noting how much was shaved by the boundPosition handler.

            newState.slackX = _this.state.slackX + (x - newState.x);
            newState.slackY = _this.state.slackY + (y - newState.y); // Update the event we fire to reflect what really happened after bounds took effect.

            uiData.x = newState.x;
            uiData.y = newState.y;
            uiData.deltaX = newState.x - _this.state.x;
            uiData.deltaY = newState.y - _this.state.y;
          } // Short-circuit if user's callback killed it.


          var shouldUpdate = _this.props.onDrag(e, uiData);

          if (shouldUpdate === false) return false;

          _this.setState(newState);
        });

        _defineProperty(_assertThisInitialized(_this), "onDragStop", function (e, coreData) {
          if (!_this.state.dragging) return false; // Short-circuit if user's callback killed it.

          var shouldContinue = _this.props.onStop(e, (0, _positionFns.createDraggableData)(_assertThisInitialized(_this), coreData));

          if (shouldContinue === false) return false;
          (0, _log.default)('Draggable: onDragStop: %j', coreData);
          var newState
          /*: $Shape<DraggableState>*/
          = {
            dragging: false,
            slackX: 0,
            slackY: 0
          }; // If this is a controlled component, the result of this operation will be to
          // revert back to the old position. We expect a handler on `onDragStop`, at the least.

          var controlled = Boolean(_this.props.position);

          if (controlled) {
            var _this$props$position = _this.props.position,
                x = _this$props$position.x,
                y = _this$props$position.y;
            newState.x = x;
            newState.y = y;
          }

          _this.setState(newState);
        });

        _this.state = {
          // Whether or not we are currently dragging.
          dragging: false,
          // Whether or not we have been dragged before.
          dragged: false,
          // Current transform x and y.
          x: props.position ? props.position.x : props.defaultPosition.x,
          y: props.position ? props.position.y : props.defaultPosition.y,
          prevPropsPosition: _objectSpread({}, props.position),
          // Used for compensating for out-of-bounds drags
          slackX: 0,
          slackY: 0,
          // Can only determine if SVG after mounting
          isElementSVG: false
        };

        if (props.position && !(props.onDrag || props.onStop)) {
          // eslint-disable-next-line no-console
          console.warn('A `position` was applied to this <Draggable>, without drag handlers. This will make this ' + 'component effectively undraggable. Please attach `onDrag` or `onStop` handlers so you can adjust the ' + '`position` of this element.');
        }

        return _this;
      }

      _createClass(Draggable, [{
        key: "componentDidMount",
        value: function componentDidMount() {
          // Check to see if the element passed is an instanceof SVGElement
          if (typeof window.SVGElement !== 'undefined' && this.findDOMNode() instanceof window.SVGElement) {
            this.setState({
              isElementSVG: true
            });
          }
        }
      }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          this.setState({
            dragging: false
          }); // prevents invariant if unmounted while dragging
        } // React Strict Mode compatibility: if `nodeRef` is passed, we will use it instead of trying to find
        // the underlying DOM node ourselves. See the README for more information.

      }, {
        key: "findDOMNode",
        value: function findDOMNode()
        /*: ?HTMLElement*/
        {
          return this.props.nodeRef ? this.props.nodeRef.current : _reactDom.default.findDOMNode(this);
        }
      }, {
        key: "render",
        value: function render()
        /*: ReactElement<any>*/
        {
          var _classNames;

          var _this$props = this.props;
              _this$props.axis;
              _this$props.bounds;
              var children = _this$props.children,
              defaultPosition = _this$props.defaultPosition,
              defaultClassName = _this$props.defaultClassName,
              defaultClassNameDragging = _this$props.defaultClassNameDragging,
              defaultClassNameDragged = _this$props.defaultClassNameDragged,
              position = _this$props.position,
              positionOffset = _this$props.positionOffset;
              _this$props.scale;
              var draggableCoreProps = _objectWithoutProperties(_this$props, ["axis", "bounds", "children", "defaultPosition", "defaultClassName", "defaultClassNameDragging", "defaultClassNameDragged", "position", "positionOffset", "scale"]);

          var style = {};
          var svgTransform = null; // If this is controlled, we don't want to move it - unless it's dragging.

          var controlled = Boolean(position);
          var draggable = !controlled || this.state.dragging;
          var validPosition = position || defaultPosition;
          var transformOpts = {
            // Set left if horizontal drag is enabled
            x: (0, _positionFns.canDragX)(this) && draggable ? this.state.x : validPosition.x,
            // Set top if vertical drag is enabled
            y: (0, _positionFns.canDragY)(this) && draggable ? this.state.y : validPosition.y
          }; // If this element was SVG, we use the `transform` attribute.

          if (this.state.isElementSVG) {
            svgTransform = (0, _domFns.createSVGTransform)(transformOpts, positionOffset);
          } else {
            // Add a CSS transform to move the element around. This allows us to move the element around
            // without worrying about whether or not it is relatively or absolutely positioned.
            // If the item you are dragging already has a transform set, wrap it in a <span> so <Draggable>
            // has a clean slate.
            style = (0, _domFns.createCSSTransform)(transformOpts, positionOffset);
          } // Mark with class while dragging


          var className = (0, _classnames.default)(children.props.className || '', defaultClassName, (_classNames = {}, _defineProperty(_classNames, defaultClassNameDragging, this.state.dragging), _defineProperty(_classNames, defaultClassNameDragged, this.state.dragged), _classNames)); // Reuse the child provided
          // This makes it flexible to use whatever element is wanted (div, ul, etc)

          return /*#__PURE__*/React.createElement(_DraggableCore.default, _extends({}, draggableCoreProps, {
            onStart: this.onDragStart,
            onDrag: this.onDrag,
            onStop: this.onDragStop
          }), React.cloneElement(React.Children.only(children), {
            className: className,
            style: _objectSpread(_objectSpread({}, children.props.style), style),
            transform: svgTransform
          }));
        }
      }]);

      return Draggable;
    }(React.Component);

    exports.default = Draggable;

    _defineProperty(Draggable, "displayName", 'Draggable');

    _defineProperty(Draggable, "propTypes", _objectSpread(_objectSpread({}, _DraggableCore.default.propTypes), {}, {
      /**
       * `axis` determines which axis the draggable can move.
       *
       *  Note that all callbacks will still return data as normal. This only
       *  controls flushing to the DOM.
       *
       * 'both' allows movement horizontally and vertically.
       * 'x' limits movement to horizontal axis.
       * 'y' limits movement to vertical axis.
       * 'none' limits all movement.
       *
       * Defaults to 'both'.
       */
      axis: _propTypes.default.oneOf(['both', 'x', 'y', 'none']),

      /**
       * `bounds` determines the range of movement available to the element.
       * Available values are:
       *
       * 'parent' restricts movement within the Draggable's parent node.
       *
       * Alternatively, pass an object with the following properties, all of which are optional:
       *
       * {left: LEFT_BOUND, right: RIGHT_BOUND, bottom: BOTTOM_BOUND, top: TOP_BOUND}
       *
       * All values are in px.
       *
       * Example:
       *
       * ```jsx
       *   let App = React.createClass({
       *       render: function () {
       *         return (
       *            <Draggable bounds={{right: 300, bottom: 300}}>
       *              <div>Content</div>
       *           </Draggable>
       *         );
       *       }
       *   });
       * ```
       */
      bounds: _propTypes.default.oneOfType([_propTypes.default.shape({
        left: _propTypes.default.number,
        right: _propTypes.default.number,
        top: _propTypes.default.number,
        bottom: _propTypes.default.number
      }), _propTypes.default.string, _propTypes.default.oneOf([false])]),
      defaultClassName: _propTypes.default.string,
      defaultClassNameDragging: _propTypes.default.string,
      defaultClassNameDragged: _propTypes.default.string,

      /**
       * `defaultPosition` specifies the x and y that the dragged item should start at
       *
       * Example:
       *
       * ```jsx
       *      let App = React.createClass({
       *          render: function () {
       *              return (
       *                  <Draggable defaultPosition={{x: 25, y: 25}}>
       *                      <div>I start with transformX: 25px and transformY: 25px;</div>
       *                  </Draggable>
       *              );
       *          }
       *      });
       * ```
       */
      defaultPosition: _propTypes.default.shape({
        x: _propTypes.default.number,
        y: _propTypes.default.number
      }),
      positionOffset: _propTypes.default.shape({
        x: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
        y: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string])
      }),

      /**
       * `position`, if present, defines the current position of the element.
       *
       *  This is similar to how form elements in React work - if no `position` is supplied, the component
       *  is uncontrolled.
       *
       * Example:
       *
       * ```jsx
       *      let App = React.createClass({
       *          render: function () {
       *              return (
       *                  <Draggable position={{x: 25, y: 25}}>
       *                      <div>I start with transformX: 25px and transformY: 25px;</div>
       *                  </Draggable>
       *              );
       *          }
       *      });
       * ```
       */
      position: _propTypes.default.shape({
        x: _propTypes.default.number,
        y: _propTypes.default.number
      }),

      /**
       * These properties should be defined on the child, not here.
       */
      className: _shims.dontSetMe,
      style: _shims.dontSetMe,
      transform: _shims.dontSetMe
    }));

    _defineProperty(Draggable, "defaultProps", _objectSpread(_objectSpread({}, _DraggableCore.default.defaultProps), {}, {
      axis: 'both',
      bounds: false,
      defaultClassName: 'react-draggable',
      defaultClassNameDragging: 'react-draggable-dragging',
      defaultClassNameDragged: 'react-draggable-dragged',
      defaultPosition: {
        x: 0,
        y: 0
      },
      position: null,
      scale: 1
    }));
    }(Draggable$2));

    var _require = Draggable$2,
        Draggable$1 = _require.default,
        DraggableCore = _require.DraggableCore; // Previous versions of this lib exported <Draggable> as the root export. As to no-// them, or TypeScript, we export *both* as the root and as 'default'.
    // See https://github.com/mzabriskie/react-draggable/pull/254
    // and https://github.com/mzabriskie/react-draggable/issues/266


    cjs.exports = Draggable$1;
    cjs.exports.default = Draggable$1;
    cjs.exports.DraggableCore = DraggableCore;

    var DraggableRoot = cjs.exports;

    var __extends$2 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __assign$2 = (undefined && undefined.__assign) || function () {
        __assign$2 = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign$2.apply(this, arguments);
    };
    var styles = {
        top: {
            width: '100%',
            height: '10px',
            top: '-5px',
            left: '0px',
            cursor: 'row-resize',
        },
        right: {
            width: '10px',
            height: '100%',
            top: '0px',
            right: '-5px',
            cursor: 'col-resize',
        },
        bottom: {
            width: '100%',
            height: '10px',
            bottom: '-5px',
            left: '0px',
            cursor: 'row-resize',
        },
        left: {
            width: '10px',
            height: '100%',
            top: '0px',
            left: '-5px',
            cursor: 'col-resize',
        },
        topRight: {
            width: '20px',
            height: '20px',
            position: 'absolute',
            right: '-10px',
            top: '-10px',
            cursor: 'ne-resize',
        },
        bottomRight: {
            width: '20px',
            height: '20px',
            position: 'absolute',
            right: '-10px',
            bottom: '-10px',
            cursor: 'se-resize',
        },
        bottomLeft: {
            width: '20px',
            height: '20px',
            position: 'absolute',
            left: '-10px',
            bottom: '-10px',
            cursor: 'sw-resize',
        },
        topLeft: {
            width: '20px',
            height: '20px',
            position: 'absolute',
            left: '-10px',
            top: '-10px',
            cursor: 'nw-resize',
        },
    };
    var Resizer = /** @class */ (function (_super) {
        __extends$2(Resizer, _super);
        function Resizer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.onMouseDown = function (e) {
                _this.props.onResizeStart(e, _this.props.direction);
            };
            _this.onTouchStart = function (e) {
                _this.props.onResizeStart(e, _this.props.direction);
            };
            return _this;
        }
        Resizer.prototype.render = function () {
            return (React__namespace.createElement("div", { className: this.props.className || '', style: __assign$2(__assign$2({ position: 'absolute', userSelect: 'none' }, styles[this.props.direction]), (this.props.replaceStyles || {})), onMouseDown: this.onMouseDown, onTouchStart: this.onTouchStart }, this.props.children));
        };
        return Resizer;
    }(React__namespace.PureComponent));

    var src = {exports: {}};

    //
    // Main
    //

    function memoize (fn, options) {
      var cache = options && options.cache
        ? options.cache
        : cacheDefault;

      var serializer = options && options.serializer
        ? options.serializer
        : serializerDefault;

      var strategy = options && options.strategy
        ? options.strategy
        : strategyDefault;

      return strategy(fn, {
        cache: cache,
        serializer: serializer
      })
    }

    //
    // Strategy
    //

    function isPrimitive (value) {
      return value == null || typeof value === 'number' || typeof value === 'boolean' // || typeof value === "string" 'unsafe' primitive for our needs
    }

    function monadic (fn, cache, serializer, arg) {
      var cacheKey = isPrimitive(arg) ? arg : serializer(arg);

      var computedValue = cache.get(cacheKey);
      if (typeof computedValue === 'undefined') {
        computedValue = fn.call(this, arg);
        cache.set(cacheKey, computedValue);
      }

      return computedValue
    }

    function variadic (fn, cache, serializer) {
      var args = Array.prototype.slice.call(arguments, 3);
      var cacheKey = serializer(args);

      var computedValue = cache.get(cacheKey);
      if (typeof computedValue === 'undefined') {
        computedValue = fn.apply(this, args);
        cache.set(cacheKey, computedValue);
      }

      return computedValue
    }

    function assemble (fn, context, strategy, cache, serialize) {
      return strategy.bind(
        context,
        fn,
        cache,
        serialize
      )
    }

    function strategyDefault (fn, options) {
      var strategy = fn.length === 1 ? monadic : variadic;

      return assemble(
        fn,
        this,
        strategy,
        options.cache.create(),
        options.serializer
      )
    }

    function strategyVariadic (fn, options) {
      var strategy = variadic;

      return assemble(
        fn,
        this,
        strategy,
        options.cache.create(),
        options.serializer
      )
    }

    function strategyMonadic (fn, options) {
      var strategy = monadic;

      return assemble(
        fn,
        this,
        strategy,
        options.cache.create(),
        options.serializer
      )
    }

    //
    // Serializer
    //

    function serializerDefault () {
      return JSON.stringify(arguments)
    }

    //
    // Cache
    //

    function ObjectWithoutPrototypeCache () {
      this.cache = Object.create(null);
    }

    ObjectWithoutPrototypeCache.prototype.has = function (key) {
      return (key in this.cache)
    };

    ObjectWithoutPrototypeCache.prototype.get = function (key) {
      return this.cache[key]
    };

    ObjectWithoutPrototypeCache.prototype.set = function (key, value) {
      this.cache[key] = value;
    };

    var cacheDefault = {
      create: function create () {
        return new ObjectWithoutPrototypeCache()
      }
    };

    //
    // API
    //

    src.exports = memoize;
    src.exports.strategies = {
      variadic: strategyVariadic,
      monadic: strategyMonadic
    };

    var memoize$1 = src.exports;

    var __extends$1 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __assign$1 = (undefined && undefined.__assign) || function () {
        __assign$1 = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign$1.apply(this, arguments);
    };
    var DEFAULT_SIZE = {
        width: 'auto',
        height: 'auto',
    };
    var clamp = memoize$1(function (n, min, max) { return Math.max(Math.min(n, max), min); });
    var snap = memoize$1(function (n, size) { return Math.round(n / size) * size; });
    var hasDirection = memoize$1(function (dir, target) {
        return new RegExp(dir, 'i').test(target);
    });
    // INFO: In case of window is a Proxy and does not porxy Events correctly, use isTouchEvent & isMouseEvent to distinguish event type instead of `instanceof`.
    var isTouchEvent = function (event) {
        return Boolean(event.touches && event.touches.length);
    };
    var isMouseEvent = function (event) {
        return Boolean((event.clientX || event.clientX === 0) &&
            (event.clientY || event.clientY === 0));
    };
    var findClosestSnap = memoize$1(function (n, snapArray, snapGap) {
        if (snapGap === void 0) { snapGap = 0; }
        var closestGapIndex = snapArray.reduce(function (prev, curr, index) { return (Math.abs(curr - n) < Math.abs(snapArray[prev] - n) ? index : prev); }, 0);
        var gap = Math.abs(snapArray[closestGapIndex] - n);
        return snapGap === 0 || gap < snapGap ? snapArray[closestGapIndex] : n;
    });
    var endsWith = memoize$1(function (str, searchStr) {
        return str.substr(str.length - searchStr.length, searchStr.length) === searchStr;
    });
    var getStringSize = memoize$1(function (n) {
        n = n.toString();
        if (n === 'auto') {
            return n;
        }
        if (endsWith(n, 'px')) {
            return n;
        }
        if (endsWith(n, '%')) {
            return n;
        }
        if (endsWith(n, 'vh')) {
            return n;
        }
        if (endsWith(n, 'vw')) {
            return n;
        }
        if (endsWith(n, 'vmax')) {
            return n;
        }
        if (endsWith(n, 'vmin')) {
            return n;
        }
        return n + "px";
    });
    var getPixelSize = function (size, parentSize, innerWidth, innerHeight) {
        if (size && typeof size === 'string') {
            if (endsWith(size, 'px')) {
                return Number(size.replace('px', ''));
            }
            if (endsWith(size, '%')) {
                var ratio = Number(size.replace('%', '')) / 100;
                return parentSize * ratio;
            }
            if (endsWith(size, 'vw')) {
                var ratio = Number(size.replace('vw', '')) / 100;
                return innerWidth * ratio;
            }
            if (endsWith(size, 'vh')) {
                var ratio = Number(size.replace('vh', '')) / 100;
                return innerHeight * ratio;
            }
        }
        return size;
    };
    var calculateNewMax = memoize$1(function (parentSize, innerWidth, innerHeight, maxWidth, maxHeight, minWidth, minHeight) {
        maxWidth = getPixelSize(maxWidth, parentSize.width, innerWidth, innerHeight);
        maxHeight = getPixelSize(maxHeight, parentSize.height, innerWidth, innerHeight);
        minWidth = getPixelSize(minWidth, parentSize.width, innerWidth, innerHeight);
        minHeight = getPixelSize(minHeight, parentSize.height, innerWidth, innerHeight);
        return {
            maxWidth: typeof maxWidth === 'undefined' ? undefined : Number(maxWidth),
            maxHeight: typeof maxHeight === 'undefined' ? undefined : Number(maxHeight),
            minWidth: typeof minWidth === 'undefined' ? undefined : Number(minWidth),
            minHeight: typeof minHeight === 'undefined' ? undefined : Number(minHeight),
        };
    });
    var definedProps = [
        'as',
        'style',
        'className',
        'grid',
        'snap',
        'bounds',
        'boundsByDirection',
        'size',
        'defaultSize',
        'minWidth',
        'minHeight',
        'maxWidth',
        'maxHeight',
        'lockAspectRatio',
        'lockAspectRatioExtraWidth',
        'lockAspectRatioExtraHeight',
        'enable',
        'handleStyles',
        'handleClasses',
        'handleWrapperStyle',
        'handleWrapperClass',
        'children',
        'onResizeStart',
        'onResize',
        'onResizeStop',
        'handleComponent',
        'scale',
        'resizeRatio',
        'snapGap',
    ];
    // HACK: This class is used to calculate % size.
    var baseClassName = '__resizable_base__';
    var Resizable = /** @class */ (function (_super) {
        __extends$1(Resizable, _super);
        function Resizable(props) {
            var _this = _super.call(this, props) || this;
            _this.ratio = 1;
            _this.resizable = null;
            // For parent boundary
            _this.parentLeft = 0;
            _this.parentTop = 0;
            // For boundary
            _this.resizableLeft = 0;
            _this.resizableRight = 0;
            _this.resizableTop = 0;
            _this.resizableBottom = 0;
            // For target boundary
            _this.targetLeft = 0;
            _this.targetTop = 0;
            _this.appendBase = function () {
                if (!_this.resizable || !_this.window) {
                    return null;
                }
                var parent = _this.parentNode;
                if (!parent) {
                    return null;
                }
                var element = _this.window.document.createElement('div');
                element.style.width = '100%';
                element.style.height = '100%';
                element.style.position = 'absolute';
                element.style.transform = 'scale(0, 0)';
                element.style.left = '0';
                element.style.flex = '0';
                if (element.classList) {
                    element.classList.add(baseClassName);
                }
                else {
                    element.className += baseClassName;
                }
                parent.appendChild(element);
                return element;
            };
            _this.removeBase = function (base) {
                var parent = _this.parentNode;
                if (!parent) {
                    return;
                }
                parent.removeChild(base);
            };
            _this.ref = function (c) {
                if (c) {
                    _this.resizable = c;
                }
            };
            _this.state = {
                isResizing: false,
                width: typeof (_this.propsSize && _this.propsSize.width) === 'undefined'
                    ? 'auto'
                    : _this.propsSize && _this.propsSize.width,
                height: typeof (_this.propsSize && _this.propsSize.height) === 'undefined'
                    ? 'auto'
                    : _this.propsSize && _this.propsSize.height,
                direction: 'right',
                original: {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0,
                },
                backgroundStyle: {
                    height: '100%',
                    width: '100%',
                    backgroundColor: 'rgba(0,0,0,0)',
                    cursor: 'auto',
                    opacity: 0,
                    position: 'fixed',
                    zIndex: 9999,
                    top: '0',
                    left: '0',
                    bottom: '0',
                    right: '0',
                },
                flexBasis: undefined,
            };
            _this.onResizeStart = _this.onResizeStart.bind(_this);
            _this.onMouseMove = _this.onMouseMove.bind(_this);
            _this.onMouseUp = _this.onMouseUp.bind(_this);
            return _this;
        }
        Object.defineProperty(Resizable.prototype, "parentNode", {
            get: function () {
                if (!this.resizable) {
                    return null;
                }
                return this.resizable.parentNode;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Resizable.prototype, "window", {
            get: function () {
                if (!this.resizable) {
                    return null;
                }
                if (!this.resizable.ownerDocument) {
                    return null;
                }
                return this.resizable.ownerDocument.defaultView;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Resizable.prototype, "propsSize", {
            get: function () {
                return this.props.size || this.props.defaultSize || DEFAULT_SIZE;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Resizable.prototype, "size", {
            get: function () {
                var width = 0;
                var height = 0;
                if (this.resizable && this.window) {
                    var orgWidth = this.resizable.offsetWidth;
                    var orgHeight = this.resizable.offsetHeight;
                    // HACK: Set position `relative` to get parent size.
                    //       This is because when re-resizable set `absolute`, I can not get base width correctly.
                    var orgPosition = this.resizable.style.position;
                    if (orgPosition !== 'relative') {
                        this.resizable.style.position = 'relative';
                    }
                    // INFO: Use original width or height if set auto.
                    width = this.resizable.style.width !== 'auto' ? this.resizable.offsetWidth : orgWidth;
                    height = this.resizable.style.height !== 'auto' ? this.resizable.offsetHeight : orgHeight;
                    // Restore original position
                    this.resizable.style.position = orgPosition;
                }
                return { width: width, height: height };
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Resizable.prototype, "sizeStyle", {
            get: function () {
                var _this = this;
                var size = this.props.size;
                var getSize = function (key) {
                    if (typeof _this.state[key] === 'undefined' || _this.state[key] === 'auto') {
                        return 'auto';
                    }
                    if (_this.propsSize && _this.propsSize[key] && endsWith(_this.propsSize[key].toString(), '%')) {
                        if (endsWith(_this.state[key].toString(), '%')) {
                            return _this.state[key].toString();
                        }
                        var parentSize = _this.getParentSize();
                        var value = Number(_this.state[key].toString().replace('px', ''));
                        var percent = (value / parentSize[key]) * 100;
                        return percent + "%";
                    }
                    return getStringSize(_this.state[key]);
                };
                var width = size && typeof size.width !== 'undefined' && !this.state.isResizing
                    ? getStringSize(size.width)
                    : getSize('width');
                var height = size && typeof size.height !== 'undefined' && !this.state.isResizing
                    ? getStringSize(size.height)
                    : getSize('height');
                return { width: width, height: height };
            },
            enumerable: false,
            configurable: true
        });
        Resizable.prototype.getParentSize = function () {
            if (!this.parentNode) {
                if (!this.window) {
                    return { width: 0, height: 0 };
                }
                return { width: this.window.innerWidth, height: this.window.innerHeight };
            }
            var base = this.appendBase();
            if (!base) {
                return { width: 0, height: 0 };
            }
            // INFO: To calculate parent width with flex layout
            var wrapChanged = false;
            var wrap = this.parentNode.style.flexWrap;
            if (wrap !== 'wrap') {
                wrapChanged = true;
                this.parentNode.style.flexWrap = 'wrap';
                // HACK: Use relative to get parent padding size
            }
            base.style.position = 'relative';
            base.style.minWidth = '100%';
            var size = {
                width: base.offsetWidth,
                height: base.offsetHeight,
            };
            if (wrapChanged) {
                this.parentNode.style.flexWrap = wrap;
            }
            this.removeBase(base);
            return size;
        };
        Resizable.prototype.bindEvents = function () {
            if (this.window) {
                this.window.addEventListener('mouseup', this.onMouseUp);
                this.window.addEventListener('mousemove', this.onMouseMove);
                this.window.addEventListener('mouseleave', this.onMouseUp);
                this.window.addEventListener('touchmove', this.onMouseMove, {
                    capture: true,
                    passive: false,
                });
                this.window.addEventListener('touchend', this.onMouseUp);
            }
        };
        Resizable.prototype.unbindEvents = function () {
            if (this.window) {
                this.window.removeEventListener('mouseup', this.onMouseUp);
                this.window.removeEventListener('mousemove', this.onMouseMove);
                this.window.removeEventListener('mouseleave', this.onMouseUp);
                this.window.removeEventListener('touchmove', this.onMouseMove, true);
                this.window.removeEventListener('touchend', this.onMouseUp);
            }
        };
        Resizable.prototype.componentDidMount = function () {
            if (!this.resizable || !this.window) {
                return;
            }
            var computedStyle = this.window.getComputedStyle(this.resizable);
            this.setState({
                width: this.state.width || this.size.width,
                height: this.state.height || this.size.height,
                flexBasis: computedStyle.flexBasis !== 'auto' ? computedStyle.flexBasis : undefined,
            });
        };
        Resizable.prototype.componentWillUnmount = function () {
            if (this.window) {
                this.unbindEvents();
            }
        };
        Resizable.prototype.createSizeForCssProperty = function (newSize, kind) {
            var propsSize = this.propsSize && this.propsSize[kind];
            return this.state[kind] === 'auto' &&
                this.state.original[kind] === newSize &&
                (typeof propsSize === 'undefined' || propsSize === 'auto')
                ? 'auto'
                : newSize;
        };
        Resizable.prototype.calculateNewMaxFromBoundary = function (maxWidth, maxHeight) {
            var boundsByDirection = this.props.boundsByDirection;
            var direction = this.state.direction;
            var widthByDirection = boundsByDirection && hasDirection('left', direction);
            var heightByDirection = boundsByDirection && hasDirection('top', direction);
            var boundWidth;
            var boundHeight;
            if (this.props.bounds === 'parent') {
                var parent_1 = this.parentNode;
                if (parent_1) {
                    boundWidth = widthByDirection
                        ? this.resizableRight - this.parentLeft
                        : parent_1.offsetWidth + (this.parentLeft - this.resizableLeft);
                    boundHeight = heightByDirection
                        ? this.resizableBottom - this.parentTop
                        : parent_1.offsetHeight + (this.parentTop - this.resizableTop);
                }
            }
            else if (this.props.bounds === 'window') {
                if (this.window) {
                    boundWidth = widthByDirection ? this.resizableRight : this.window.innerWidth - this.resizableLeft;
                    boundHeight = heightByDirection ? this.resizableBottom : this.window.innerHeight - this.resizableTop;
                }
            }
            else if (this.props.bounds) {
                boundWidth = widthByDirection
                    ? this.resizableRight - this.targetLeft
                    : this.props.bounds.offsetWidth + (this.targetLeft - this.resizableLeft);
                boundHeight = heightByDirection
                    ? this.resizableBottom - this.targetTop
                    : this.props.bounds.offsetHeight + (this.targetTop - this.resizableTop);
            }
            if (boundWidth && Number.isFinite(boundWidth)) {
                maxWidth = maxWidth && maxWidth < boundWidth ? maxWidth : boundWidth;
            }
            if (boundHeight && Number.isFinite(boundHeight)) {
                maxHeight = maxHeight && maxHeight < boundHeight ? maxHeight : boundHeight;
            }
            return { maxWidth: maxWidth, maxHeight: maxHeight };
        };
        Resizable.prototype.calculateNewSizeFromDirection = function (clientX, clientY) {
            var scale = this.props.scale || 1;
            var resizeRatio = this.props.resizeRatio || 1;
            var _a = this.state, direction = _a.direction, original = _a.original;
            var _b = this.props, lockAspectRatio = _b.lockAspectRatio, lockAspectRatioExtraHeight = _b.lockAspectRatioExtraHeight, lockAspectRatioExtraWidth = _b.lockAspectRatioExtraWidth;
            var newWidth = original.width;
            var newHeight = original.height;
            var extraHeight = lockAspectRatioExtraHeight || 0;
            var extraWidth = lockAspectRatioExtraWidth || 0;
            if (hasDirection('right', direction)) {
                newWidth = original.width + ((clientX - original.x) * resizeRatio) / scale;
                if (lockAspectRatio) {
                    newHeight = (newWidth - extraWidth) / this.ratio + extraHeight;
                }
            }
            if (hasDirection('left', direction)) {
                newWidth = original.width - ((clientX - original.x) * resizeRatio) / scale;
                if (lockAspectRatio) {
                    newHeight = (newWidth - extraWidth) / this.ratio + extraHeight;
                }
            }
            if (hasDirection('bottom', direction)) {
                newHeight = original.height + ((clientY - original.y) * resizeRatio) / scale;
                if (lockAspectRatio) {
                    newWidth = (newHeight - extraHeight) * this.ratio + extraWidth;
                }
            }
            if (hasDirection('top', direction)) {
                newHeight = original.height - ((clientY - original.y) * resizeRatio) / scale;
                if (lockAspectRatio) {
                    newWidth = (newHeight - extraHeight) * this.ratio + extraWidth;
                }
            }
            return { newWidth: newWidth, newHeight: newHeight };
        };
        Resizable.prototype.calculateNewSizeFromAspectRatio = function (newWidth, newHeight, max, min) {
            var _a = this.props, lockAspectRatio = _a.lockAspectRatio, lockAspectRatioExtraHeight = _a.lockAspectRatioExtraHeight, lockAspectRatioExtraWidth = _a.lockAspectRatioExtraWidth;
            var computedMinWidth = typeof min.width === 'undefined' ? 10 : min.width;
            var computedMaxWidth = typeof max.width === 'undefined' || max.width < 0 ? newWidth : max.width;
            var computedMinHeight = typeof min.height === 'undefined' ? 10 : min.height;
            var computedMaxHeight = typeof max.height === 'undefined' || max.height < 0 ? newHeight : max.height;
            var extraHeight = lockAspectRatioExtraHeight || 0;
            var extraWidth = lockAspectRatioExtraWidth || 0;
            if (lockAspectRatio) {
                var extraMinWidth = (computedMinHeight - extraHeight) * this.ratio + extraWidth;
                var extraMaxWidth = (computedMaxHeight - extraHeight) * this.ratio + extraWidth;
                var extraMinHeight = (computedMinWidth - extraWidth) / this.ratio + extraHeight;
                var extraMaxHeight = (computedMaxWidth - extraWidth) / this.ratio + extraHeight;
                var lockedMinWidth = Math.max(computedMinWidth, extraMinWidth);
                var lockedMaxWidth = Math.min(computedMaxWidth, extraMaxWidth);
                var lockedMinHeight = Math.max(computedMinHeight, extraMinHeight);
                var lockedMaxHeight = Math.min(computedMaxHeight, extraMaxHeight);
                newWidth = clamp(newWidth, lockedMinWidth, lockedMaxWidth);
                newHeight = clamp(newHeight, lockedMinHeight, lockedMaxHeight);
            }
            else {
                newWidth = clamp(newWidth, computedMinWidth, computedMaxWidth);
                newHeight = clamp(newHeight, computedMinHeight, computedMaxHeight);
            }
            return { newWidth: newWidth, newHeight: newHeight };
        };
        Resizable.prototype.setBoundingClientRect = function () {
            // For parent boundary
            if (this.props.bounds === 'parent') {
                var parent_2 = this.parentNode;
                if (parent_2) {
                    var parentRect = parent_2.getBoundingClientRect();
                    this.parentLeft = parentRect.left;
                    this.parentTop = parentRect.top;
                }
            }
            // For target(html element) boundary
            if (this.props.bounds && typeof this.props.bounds !== 'string') {
                var targetRect = this.props.bounds.getBoundingClientRect();
                this.targetLeft = targetRect.left;
                this.targetTop = targetRect.top;
            }
            // For boundary
            if (this.resizable) {
                var _a = this.resizable.getBoundingClientRect(), left = _a.left, top_1 = _a.top, right = _a.right, bottom = _a.bottom;
                this.resizableLeft = left;
                this.resizableRight = right;
                this.resizableTop = top_1;
                this.resizableBottom = bottom;
            }
        };
        Resizable.prototype.onResizeStart = function (event, direction) {
            if (!this.resizable || !this.window) {
                return;
            }
            var clientX = 0;
            var clientY = 0;
            if (event.nativeEvent && isMouseEvent(event.nativeEvent)) {
                clientX = event.nativeEvent.clientX;
                clientY = event.nativeEvent.clientY;
            }
            else if (event.nativeEvent && isTouchEvent(event.nativeEvent)) {
                clientX = event.nativeEvent.touches[0].clientX;
                clientY = event.nativeEvent.touches[0].clientY;
            }
            if (this.props.onResizeStart) {
                if (this.resizable) {
                    var startResize = this.props.onResizeStart(event, direction, this.resizable);
                    if (startResize === false) {
                        return;
                    }
                }
            }
            // Fix #168
            if (this.props.size) {
                if (typeof this.props.size.height !== 'undefined' && this.props.size.height !== this.state.height) {
                    this.setState({ height: this.props.size.height });
                }
                if (typeof this.props.size.width !== 'undefined' && this.props.size.width !== this.state.width) {
                    this.setState({ width: this.props.size.width });
                }
            }
            // For lockAspectRatio case
            this.ratio =
                typeof this.props.lockAspectRatio === 'number' ? this.props.lockAspectRatio : this.size.width / this.size.height;
            var flexBasis;
            var computedStyle = this.window.getComputedStyle(this.resizable);
            if (computedStyle.flexBasis !== 'auto') {
                var parent_3 = this.parentNode;
                if (parent_3) {
                    var dir = this.window.getComputedStyle(parent_3).flexDirection;
                    this.flexDir = dir.startsWith('row') ? 'row' : 'column';
                    flexBasis = computedStyle.flexBasis;
                }
            }
            // For boundary
            this.setBoundingClientRect();
            this.bindEvents();
            var state = {
                original: {
                    x: clientX,
                    y: clientY,
                    width: this.size.width,
                    height: this.size.height,
                },
                isResizing: true,
                backgroundStyle: __assign$1(__assign$1({}, this.state.backgroundStyle), { cursor: this.window.getComputedStyle(event.target).cursor || 'auto' }),
                direction: direction,
                flexBasis: flexBasis,
            };
            this.setState(state);
        };
        Resizable.prototype.onMouseMove = function (event) {
            if (!this.state.isResizing || !this.resizable || !this.window) {
                return;
            }
            if (this.window.TouchEvent && isTouchEvent(event)) {
                try {
                    event.preventDefault();
                    event.stopPropagation();
                }
                catch (e) {
                    // Ignore on fail
                }
            }
            var _a = this.props, maxWidth = _a.maxWidth, maxHeight = _a.maxHeight, minWidth = _a.minWidth, minHeight = _a.minHeight;
            var clientX = isTouchEvent(event) ? event.touches[0].clientX : event.clientX;
            var clientY = isTouchEvent(event) ? event.touches[0].clientY : event.clientY;
            var _b = this.state, direction = _b.direction, original = _b.original, width = _b.width, height = _b.height;
            var parentSize = this.getParentSize();
            var max = calculateNewMax(parentSize, this.window.innerWidth, this.window.innerHeight, maxWidth, maxHeight, minWidth, minHeight);
            maxWidth = max.maxWidth;
            maxHeight = max.maxHeight;
            minWidth = max.minWidth;
            minHeight = max.minHeight;
            // Calculate new size
            var _c = this.calculateNewSizeFromDirection(clientX, clientY), newHeight = _c.newHeight, newWidth = _c.newWidth;
            // Calculate max size from boundary settings
            var boundaryMax = this.calculateNewMaxFromBoundary(maxWidth, maxHeight);
            // Calculate new size from aspect ratio
            var newSize = this.calculateNewSizeFromAspectRatio(newWidth, newHeight, { width: boundaryMax.maxWidth, height: boundaryMax.maxHeight }, { width: minWidth, height: minHeight });
            newWidth = newSize.newWidth;
            newHeight = newSize.newHeight;
            if (this.props.grid) {
                var newGridWidth = snap(newWidth, this.props.grid[0]);
                var newGridHeight = snap(newHeight, this.props.grid[1]);
                var gap = this.props.snapGap || 0;
                newWidth = gap === 0 || Math.abs(newGridWidth - newWidth) <= gap ? newGridWidth : newWidth;
                newHeight = gap === 0 || Math.abs(newGridHeight - newHeight) <= gap ? newGridHeight : newHeight;
            }
            if (this.props.snap && this.props.snap.x) {
                newWidth = findClosestSnap(newWidth, this.props.snap.x, this.props.snapGap);
            }
            if (this.props.snap && this.props.snap.y) {
                newHeight = findClosestSnap(newHeight, this.props.snap.y, this.props.snapGap);
            }
            var delta = {
                width: newWidth - original.width,
                height: newHeight - original.height,
            };
            if (width && typeof width === 'string') {
                if (endsWith(width, '%')) {
                    var percent = (newWidth / parentSize.width) * 100;
                    newWidth = percent + "%";
                }
                else if (endsWith(width, 'vw')) {
                    var vw = (newWidth / this.window.innerWidth) * 100;
                    newWidth = vw + "vw";
                }
                else if (endsWith(width, 'vh')) {
                    var vh = (newWidth / this.window.innerHeight) * 100;
                    newWidth = vh + "vh";
                }
            }
            if (height && typeof height === 'string') {
                if (endsWith(height, '%')) {
                    var percent = (newHeight / parentSize.height) * 100;
                    newHeight = percent + "%";
                }
                else if (endsWith(height, 'vw')) {
                    var vw = (newHeight / this.window.innerWidth) * 100;
                    newHeight = vw + "vw";
                }
                else if (endsWith(height, 'vh')) {
                    var vh = (newHeight / this.window.innerHeight) * 100;
                    newHeight = vh + "vh";
                }
            }
            var newState = {
                width: this.createSizeForCssProperty(newWidth, 'width'),
                height: this.createSizeForCssProperty(newHeight, 'height'),
            };
            if (this.flexDir === 'row') {
                newState.flexBasis = newState.width;
            }
            else if (this.flexDir === 'column') {
                newState.flexBasis = newState.height;
            }
            this.setState(newState);
            if (this.props.onResize) {
                this.props.onResize(event, direction, this.resizable, delta);
            }
        };
        Resizable.prototype.onMouseUp = function (event) {
            var _a = this.state, isResizing = _a.isResizing, direction = _a.direction, original = _a.original;
            if (!isResizing || !this.resizable) {
                return;
            }
            var delta = {
                width: this.size.width - original.width,
                height: this.size.height - original.height,
            };
            if (this.props.onResizeStop) {
                this.props.onResizeStop(event, direction, this.resizable, delta);
            }
            if (this.props.size) {
                this.setState(this.props.size);
            }
            this.unbindEvents();
            this.setState({
                isResizing: false,
                backgroundStyle: __assign$1(__assign$1({}, this.state.backgroundStyle), { cursor: 'auto' }),
            });
        };
        Resizable.prototype.updateSize = function (size) {
            this.setState({ width: size.width, height: size.height });
        };
        Resizable.prototype.renderResizer = function () {
            var _this = this;
            var _a = this.props, enable = _a.enable, handleStyles = _a.handleStyles, handleClasses = _a.handleClasses, handleWrapperStyle = _a.handleWrapperStyle, handleWrapperClass = _a.handleWrapperClass, handleComponent = _a.handleComponent;
            if (!enable) {
                return null;
            }
            var resizers = Object.keys(enable).map(function (dir) {
                if (enable[dir] !== false) {
                    return (React__namespace.createElement(Resizer, { key: dir, direction: dir, onResizeStart: _this.onResizeStart, replaceStyles: handleStyles && handleStyles[dir], className: handleClasses && handleClasses[dir] }, handleComponent && handleComponent[dir] ? handleComponent[dir] : null));
                }
                return null;
            });
            // #93 Wrap the resize box in span (will not break 100% width/height)
            return (React__namespace.createElement("div", { className: handleWrapperClass, style: handleWrapperStyle }, resizers));
        };
        Resizable.prototype.render = function () {
            var _this = this;
            var extendsProps = Object.keys(this.props).reduce(function (acc, key) {
                if (definedProps.indexOf(key) !== -1) {
                    return acc;
                }
                acc[key] = _this.props[key];
                return acc;
            }, {});
            var style = __assign$1(__assign$1(__assign$1({ position: 'relative', userSelect: this.state.isResizing ? 'none' : 'auto' }, this.props.style), this.sizeStyle), { maxWidth: this.props.maxWidth, maxHeight: this.props.maxHeight, minWidth: this.props.minWidth, minHeight: this.props.minHeight, boxSizing: 'border-box', flexShrink: 0 });
            if (this.state.flexBasis) {
                style.flexBasis = this.state.flexBasis;
            }
            var Wrapper = this.props.as || 'div';
            return (React__namespace.createElement(Wrapper, __assign$1({ ref: this.ref, style: style, className: this.props.className }, extendsProps),
                this.state.isResizing && React__namespace.createElement("div", { style: this.state.backgroundStyle }),
                this.props.children,
                this.renderResizer()));
        };
        Resizable.defaultProps = {
            as: 'div',
            onResizeStart: function () { },
            onResize: function () { },
            onResizeStop: function () { },
            enable: {
                top: true,
                right: true,
                bottom: true,
                left: true,
                topRight: true,
                bottomRight: true,
                bottomLeft: true,
                topLeft: true,
            },
            style: {},
            grid: [1, 1],
            lockAspectRatio: false,
            lockAspectRatioExtraWidth: 0,
            lockAspectRatioExtraHeight: 0,
            scale: 1,
            resizeRatio: 1,
            snapGap: 0,
        };
        return Resizable;
    }(React__namespace.PureComponent));

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    var Draggable = DraggableRoot;
    var resizableStyle = {
        width: "auto",
        height: "auto",
        display: "inline-block",
        position: "absolute",
        top: 0,
        left: 0,
    };
    var getEnableResizingByFlag = function (flag) { return ({
        bottom: flag,
        bottomLeft: flag,
        bottomRight: flag,
        left: flag,
        right: flag,
        top: flag,
        topLeft: flag,
        topRight: flag,
    }); };
    var Rnd = /** @class */ (function (_super) {
        __extends(Rnd, _super);
        function Rnd(props) {
            var _this = _super.call(this, props) || this;
            _this.resizingPosition = { x: 0, y: 0 };
            _this.offsetFromParent = { left: 0, top: 0 };
            _this.resizableElement = { current: null };
            _this.originalPosition = { x: 0, y: 0 };
            _this.refDraggable = function (c) {
                if (!c)
                    return;
                _this.draggable = c;
            };
            _this.refResizable = function (c) {
                if (!c)
                    return;
                _this.resizable = c;
                _this.resizableElement.current = c.resizable;
            };
            _this.state = {
                resizing: false,
                bounds: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
                maxWidth: props.maxWidth,
                maxHeight: props.maxHeight,
            };
            _this.onResizeStart = _this.onResizeStart.bind(_this);
            _this.onResize = _this.onResize.bind(_this);
            _this.onResizeStop = _this.onResizeStop.bind(_this);
            _this.onDragStart = _this.onDragStart.bind(_this);
            _this.onDrag = _this.onDrag.bind(_this);
            _this.onDragStop = _this.onDragStop.bind(_this);
            _this.getMaxSizesFromProps = _this.getMaxSizesFromProps.bind(_this);
            return _this;
        }
        Rnd.prototype.componentDidMount = function () {
            this.updateOffsetFromParent();
            var _a = this.offsetFromParent, left = _a.left, top = _a.top;
            var _b = this.getDraggablePosition(), x = _b.x, y = _b.y;
            this.draggable.setState({
                x: x - left,
                y: y - top,
            });
            // HACK: Apply position adjustment
            this.forceUpdate();
        };
        // HACK: To get `react-draggable` state x and y.
        Rnd.prototype.getDraggablePosition = function () {
            var _a = this.draggable.state, x = _a.x, y = _a.y;
            return { x: x, y: y };
        };
        Rnd.prototype.getParent = function () {
            return this.resizable && this.resizable.parentNode;
        };
        Rnd.prototype.getParentSize = function () {
            return this.resizable.getParentSize();
        };
        Rnd.prototype.getMaxSizesFromProps = function () {
            var maxWidth = typeof this.props.maxWidth === "undefined" ? Number.MAX_SAFE_INTEGER : this.props.maxWidth;
            var maxHeight = typeof this.props.maxHeight === "undefined" ? Number.MAX_SAFE_INTEGER : this.props.maxHeight;
            return { maxWidth: maxWidth, maxHeight: maxHeight };
        };
        Rnd.prototype.getSelfElement = function () {
            return this.resizable && this.resizable.resizable;
        };
        Rnd.prototype.getOffsetHeight = function (boundary) {
            var scale = this.props.scale;
            switch (this.props.bounds) {
                case "window":
                    return window.innerHeight / scale;
                case "body":
                    return document.body.offsetHeight / scale;
                default:
                    return boundary.offsetHeight;
            }
        };
        Rnd.prototype.getOffsetWidth = function (boundary) {
            var scale = this.props.scale;
            switch (this.props.bounds) {
                case "window":
                    return window.innerWidth / scale;
                case "body":
                    return document.body.offsetWidth / scale;
                default:
                    return boundary.offsetWidth;
            }
        };
        Rnd.prototype.onDragStart = function (e, data) {
            if (this.props.onDragStart) {
                this.props.onDragStart(e, data);
            }
            var pos = this.getDraggablePosition();
            this.originalPosition = pos;
            if (!this.props.bounds)
                return;
            var parent = this.getParent();
            var scale = this.props.scale;
            var boundary;
            if (this.props.bounds === "parent") {
                boundary = parent;
            }
            else if (this.props.bounds === "body") {
                var parentRect_1 = parent.getBoundingClientRect();
                var parentLeft_1 = parentRect_1.left;
                var parentTop_1 = parentRect_1.top;
                var bodyRect = document.body.getBoundingClientRect();
                var left_1 = -(parentLeft_1 - parent.offsetLeft * scale - bodyRect.left) / scale;
                var top_1 = -(parentTop_1 - parent.offsetTop * scale - bodyRect.top) / scale;
                var right = (document.body.offsetWidth - this.resizable.size.width * scale) / scale + left_1;
                var bottom = (document.body.offsetHeight - this.resizable.size.height * scale) / scale + top_1;
                return this.setState({ bounds: { top: top_1, right: right, bottom: bottom, left: left_1 } });
            }
            else if (this.props.bounds === "window") {
                if (!this.resizable)
                    return;
                var parentRect_2 = parent.getBoundingClientRect();
                var parentLeft_2 = parentRect_2.left;
                var parentTop_2 = parentRect_2.top;
                var left_2 = -(parentLeft_2 - parent.offsetLeft * scale) / scale;
                var top_2 = -(parentTop_2 - parent.offsetTop * scale) / scale;
                var right = (window.innerWidth - this.resizable.size.width * scale) / scale + left_2;
                var bottom = (window.innerHeight - this.resizable.size.height * scale) / scale + top_2;
                return this.setState({ bounds: { top: top_2, right: right, bottom: bottom, left: left_2 } });
            }
            else {
                boundary = document.querySelector(this.props.bounds);
            }
            if (!(boundary instanceof HTMLElement) || !(parent instanceof HTMLElement)) {
                return;
            }
            var boundaryRect = boundary.getBoundingClientRect();
            var boundaryLeft = boundaryRect.left;
            var boundaryTop = boundaryRect.top;
            var parentRect = parent.getBoundingClientRect();
            var parentLeft = parentRect.left;
            var parentTop = parentRect.top;
            var left = (boundaryLeft - parentLeft) / scale;
            var top = boundaryTop - parentTop;
            if (!this.resizable)
                return;
            this.updateOffsetFromParent();
            var offset = this.offsetFromParent;
            this.setState({
                bounds: {
                    top: top - offset.top,
                    right: left + (boundary.offsetWidth - this.resizable.size.width) - offset.left / scale,
                    bottom: top + (boundary.offsetHeight - this.resizable.size.height) - offset.top,
                    left: left - offset.left / scale,
                },
            });
        };
        Rnd.prototype.onDrag = function (e, data) {
            if (!this.props.onDrag)
                return;
            var _a = this.offsetFromParent, left = _a.left, top = _a.top;
            if (!this.props.dragAxis || this.props.dragAxis === "both") {
                return this.props.onDrag(e, __assign(__assign({}, data), { x: data.x - left, y: data.y - top }));
            }
            else if (this.props.dragAxis === "x") {
                return this.props.onDrag(e, __assign(__assign({}, data), { x: data.x + left, y: this.originalPosition.y + top, deltaY: 0 }));
            }
            else if (this.props.dragAxis === "y") {
                return this.props.onDrag(e, __assign(__assign({}, data), { x: this.originalPosition.x + left, y: data.y + top, deltaX: 0 }));
            }
        };
        Rnd.prototype.onDragStop = function (e, data) {
            if (!this.props.onDragStop)
                return;
            var _a = this.offsetFromParent, left = _a.left, top = _a.top;
            if (!this.props.dragAxis || this.props.dragAxis === "both") {
                return this.props.onDragStop(e, __assign(__assign({}, data), { x: data.x + left, y: data.y + top }));
            }
            else if (this.props.dragAxis === "x") {
                return this.props.onDragStop(e, __assign(__assign({}, data), { x: data.x + left, y: this.originalPosition.y + top, deltaY: 0 }));
            }
            else if (this.props.dragAxis === "y") {
                return this.props.onDragStop(e, __assign(__assign({}, data), { x: this.originalPosition.x + left, y: data.y + top, deltaX: 0 }));
            }
        };
        Rnd.prototype.onResizeStart = function (e, dir, elementRef) {
            e.stopPropagation();
            this.setState({
                resizing: true,
            });
            var scale = this.props.scale;
            var offset = this.offsetFromParent;
            var pos = this.getDraggablePosition();
            this.resizingPosition = { x: pos.x + offset.left, y: pos.y + offset.top };
            this.originalPosition = pos;
            if (this.props.bounds) {
                var parent_1 = this.getParent();
                var boundary = void 0;
                if (this.props.bounds === "parent") {
                    boundary = parent_1;
                }
                else if (this.props.bounds === "body") {
                    boundary = document.body;
                }
                else if (this.props.bounds === "window") {
                    boundary = window;
                }
                else {
                    boundary = document.querySelector(this.props.bounds);
                }
                var self_1 = this.getSelfElement();
                if (self_1 instanceof Element &&
                    (boundary instanceof HTMLElement || boundary === window) &&
                    parent_1 instanceof HTMLElement) {
                    var _a = this.getMaxSizesFromProps(), maxWidth = _a.maxWidth, maxHeight = _a.maxHeight;
                    var parentSize = this.getParentSize();
                    if (maxWidth && typeof maxWidth === "string") {
                        if (maxWidth.endsWith("%")) {
                            var ratio = Number(maxWidth.replace("%", "")) / 100;
                            maxWidth = parentSize.width * ratio;
                        }
                        else if (maxWidth.endsWith("px")) {
                            maxWidth = Number(maxWidth.replace("px", ""));
                        }
                    }
                    if (maxHeight && typeof maxHeight === "string") {
                        if (maxHeight.endsWith("%")) {
                            var ratio = Number(maxHeight.replace("%", "")) / 100;
                            maxHeight = parentSize.width * ratio;
                        }
                        else if (maxHeight.endsWith("px")) {
                            maxHeight = Number(maxHeight.replace("px", ""));
                        }
                    }
                    var selfRect = self_1.getBoundingClientRect();
                    var selfLeft = selfRect.left;
                    var selfTop = selfRect.top;
                    var boundaryRect = this.props.bounds === "window" ? { left: 0, top: 0 } : boundary.getBoundingClientRect();
                    var boundaryLeft = boundaryRect.left;
                    var boundaryTop = boundaryRect.top;
                    var offsetWidth = this.getOffsetWidth(boundary);
                    var offsetHeight = this.getOffsetHeight(boundary);
                    var hasLeft = dir.toLowerCase().endsWith("left");
                    var hasRight = dir.toLowerCase().endsWith("right");
                    var hasTop = dir.startsWith("top");
                    var hasBottom = dir.startsWith("bottom");
                    if ((hasLeft || hasTop) && this.resizable) {
                        var max = (selfLeft - boundaryLeft) / scale + this.resizable.size.width;
                        this.setState({ maxWidth: max > Number(maxWidth) ? maxWidth : max });
                    }
                    // INFO: To set bounds in `lock aspect ratio with bounds` case. See also that story.
                    if (hasRight || (this.props.lockAspectRatio && !hasLeft && !hasTop)) {
                        var max = offsetWidth + (boundaryLeft - selfLeft) / scale;
                        this.setState({ maxWidth: max > Number(maxWidth) ? maxWidth : max });
                    }
                    if ((hasTop || hasLeft) && this.resizable) {
                        var max = (selfTop - boundaryTop) / scale + this.resizable.size.height;
                        this.setState({
                            maxHeight: max > Number(maxHeight) ? maxHeight : max,
                        });
                    }
                    // INFO: To set bounds in `lock aspect ratio with bounds` case. See also that story.
                    if (hasBottom || (this.props.lockAspectRatio && !hasTop && !hasLeft)) {
                        var max = offsetHeight + (boundaryTop - selfTop) / scale;
                        this.setState({
                            maxHeight: max > Number(maxHeight) ? maxHeight : max,
                        });
                    }
                }
            }
            else {
                this.setState({
                    maxWidth: this.props.maxWidth,
                    maxHeight: this.props.maxHeight,
                });
            }
            if (this.props.onResizeStart) {
                this.props.onResizeStart(e, dir, elementRef);
            }
        };
        Rnd.prototype.onResize = function (e, direction, elementRef, delta) {
            // INFO: Apply x and y position adjustments caused by resizing to draggable
            var newPos = { x: this.originalPosition.x, y: this.originalPosition.y };
            var left = -delta.width;
            var top = -delta.height;
            var directions = ["top", "left", "topLeft", "bottomLeft", "topRight"];
            if (directions.indexOf(direction) !== -1) {
                if (direction === "bottomLeft") {
                    newPos.x += left;
                }
                else if (direction === "topRight") {
                    newPos.y += top;
                }
                else {
                    newPos.x += left;
                    newPos.y += top;
                }
            }
            if (newPos.x !== this.draggable.state.x || newPos.y !== this.draggable.state.y) {
                this.draggable.setState(newPos);
            }
            this.updateOffsetFromParent();
            var offset = this.offsetFromParent;
            var x = this.getDraggablePosition().x + offset.left;
            var y = this.getDraggablePosition().y + offset.top;
            this.resizingPosition = { x: x, y: y };
            if (!this.props.onResize)
                return;
            this.props.onResize(e, direction, elementRef, delta, {
                x: x,
                y: y,
            });
        };
        Rnd.prototype.onResizeStop = function (e, direction, elementRef, delta) {
            this.setState({
                resizing: false,
            });
            var _a = this.getMaxSizesFromProps(), maxWidth = _a.maxWidth, maxHeight = _a.maxHeight;
            this.setState({ maxWidth: maxWidth, maxHeight: maxHeight });
            if (this.props.onResizeStop) {
                this.props.onResizeStop(e, direction, elementRef, delta, this.resizingPosition);
            }
        };
        Rnd.prototype.updateSize = function (size) {
            if (!this.resizable)
                return;
            this.resizable.updateSize({ width: size.width, height: size.height });
        };
        Rnd.prototype.updatePosition = function (position) {
            this.draggable.setState(position);
        };
        Rnd.prototype.updateOffsetFromParent = function () {
            var scale = this.props.scale;
            var parent = this.getParent();
            var self = this.getSelfElement();
            if (!parent || self === null) {
                return {
                    top: 0,
                    left: 0,
                };
            }
            var parentRect = parent.getBoundingClientRect();
            var parentLeft = parentRect.left;
            var parentTop = parentRect.top;
            var selfRect = self.getBoundingClientRect();
            var position = this.getDraggablePosition();
            var scrollLeft = parent.scrollLeft;
            var scrollTop = parent.scrollTop;
            this.offsetFromParent = {
                left: selfRect.left - parentLeft + scrollLeft - position.x * scale,
                top: selfRect.top - parentTop + scrollTop - position.y * scale,
            };
        };
        Rnd.prototype.render = function () {
            var _a = this.props, disableDragging = _a.disableDragging, style = _a.style, dragHandleClassName = _a.dragHandleClassName, position = _a.position, onMouseDown = _a.onMouseDown, onMouseUp = _a.onMouseUp, dragAxis = _a.dragAxis, dragGrid = _a.dragGrid, bounds = _a.bounds, enableUserSelectHack = _a.enableUserSelectHack, cancel = _a.cancel, children = _a.children; _a.onResizeStart; _a.onResize; _a.onResizeStop; _a.onDragStart; _a.onDrag; _a.onDragStop; var resizeHandleStyles = _a.resizeHandleStyles, resizeHandleClasses = _a.resizeHandleClasses, resizeHandleComponent = _a.resizeHandleComponent, enableResizing = _a.enableResizing, resizeGrid = _a.resizeGrid, resizeHandleWrapperClass = _a.resizeHandleWrapperClass, resizeHandleWrapperStyle = _a.resizeHandleWrapperStyle, scale = _a.scale, allowAnyClick = _a.allowAnyClick, resizableProps = __rest(_a, ["disableDragging", "style", "dragHandleClassName", "position", "onMouseDown", "onMouseUp", "dragAxis", "dragGrid", "bounds", "enableUserSelectHack", "cancel", "children", "onResizeStart", "onResize", "onResizeStop", "onDragStart", "onDrag", "onDragStop", "resizeHandleStyles", "resizeHandleClasses", "resizeHandleComponent", "enableResizing", "resizeGrid", "resizeHandleWrapperClass", "resizeHandleWrapperStyle", "scale", "allowAnyClick"]);
            var defaultValue = this.props.default ? __assign({}, this.props.default) : undefined;
            // Remove unknown props, see also https://reactjs.org/warnings/unknown-prop.html
            delete resizableProps.default;
            var cursorStyle = disableDragging || dragHandleClassName ? { cursor: "auto" } : { cursor: "move" };
            var innerStyle = __assign(__assign(__assign({}, resizableStyle), cursorStyle), style);
            var _b = this.offsetFromParent, left = _b.left, top = _b.top;
            var draggablePosition;
            if (position) {
                draggablePosition = {
                    x: position.x - left,
                    y: position.y - top,
                };
            }
            // INFO: Make uncontorolled component when resizing to control position by setPostion.
            var pos = this.state.resizing ? undefined : draggablePosition;
            var dragAxisOrUndefined = this.state.resizing ? "both" : dragAxis;
            return (React$1.createElement(Draggable, { ref: this.refDraggable, handle: dragHandleClassName ? "." + dragHandleClassName : undefined, defaultPosition: defaultValue, onMouseDown: onMouseDown, onMouseUp: onMouseUp, onStart: this.onDragStart, onDrag: this.onDrag, onStop: this.onDragStop, axis: dragAxisOrUndefined, disabled: disableDragging, grid: dragGrid, bounds: bounds ? this.state.bounds : undefined, position: pos, enableUserSelectHack: enableUserSelectHack, cancel: cancel, scale: scale, allowAnyClick: allowAnyClick, nodeRef: this.resizableElement },
                React$1.createElement(Resizable, __assign({}, resizableProps, { ref: this.refResizable, defaultSize: defaultValue, size: this.props.size, enable: typeof enableResizing === "boolean" ? getEnableResizingByFlag(enableResizing) : enableResizing, onResizeStart: this.onResizeStart, onResize: this.onResize, onResizeStop: this.onResizeStop, style: innerStyle, minWidth: this.props.minWidth, minHeight: this.props.minHeight, maxWidth: this.state.resizing ? this.state.maxWidth : this.props.maxWidth, maxHeight: this.state.resizing ? this.state.maxHeight : this.props.maxHeight, grid: resizeGrid, handleWrapperClass: resizeHandleWrapperClass, handleWrapperStyle: resizeHandleWrapperStyle, lockAspectRatio: this.props.lockAspectRatio, lockAspectRatioExtraWidth: this.props.lockAspectRatioExtraWidth, lockAspectRatioExtraHeight: this.props.lockAspectRatioExtraHeight, handleStyles: resizeHandleStyles, handleClasses: resizeHandleClasses, handleComponent: resizeHandleComponent, scale: this.props.scale }), children)));
        };
        Rnd.defaultProps = {
            maxWidth: Number.MAX_SAFE_INTEGER,
            maxHeight: Number.MAX_SAFE_INTEGER,
            scale: 1,
            onResizeStart: function () { },
            onResize: function () { },
            onResizeStop: function () { },
            onDragStart: function () { },
            onDrag: function () { },
            onDragStop: function () { },
        };
        return Rnd;
    }(React$1.PureComponent));

    function create$1(createState) {
      let state;
      const listeners = new Set();
      const setState = (partial, replace) => {
        const nextState = typeof partial === "function" ? partial(state) : partial;
        if (nextState !== state) {
          const previousState = state;
          state = replace ? nextState : Object.assign({}, state, nextState);
          listeners.forEach((listener) => listener(state, previousState));
        }
      };
      const getState = () => state;
      const subscribeWithSelector = (listener, selector = getState, equalityFn = Object.is) => {
        let currentSlice = selector(state);
        function listenerToAdd() {
          const nextSlice = selector(state);
          if (!equalityFn(currentSlice, nextSlice)) {
            const previousSlice = currentSlice;
            listener(currentSlice = nextSlice, previousSlice);
          }
        }
        listeners.add(listenerToAdd);
        return () => listeners.delete(listenerToAdd);
      };
      const subscribe = (listener, selector, equalityFn) => {
        if (selector || equalityFn) {
          return subscribeWithSelector(listener, selector, equalityFn);
        }
        listeners.add(listener);
        return () => listeners.delete(listener);
      };
      const destroy = () => listeners.clear();
      const api = { setState, getState, subscribe, destroy };
      state = createState(setState, getState, api);
      return api;
    }

    const isSSR = typeof window === "undefined" || !window.navigator || /ServerSideRendering|^Deno\//.test(window.navigator.userAgent);
    const useIsomorphicLayoutEffect = isSSR ? React$1.useEffect : React$1.useLayoutEffect;
    function create(createState) {
      const api = typeof createState === "function" ? create$1(createState) : createState;
      const useStore = (selector = api.getState, equalityFn = Object.is) => {
        const [, forceUpdate] = React$1.useReducer((c) => c + 1, 0);
        const state = api.getState();
        const stateRef = React$1.useRef(state);
        const selectorRef = React$1.useRef(selector);
        const equalityFnRef = React$1.useRef(equalityFn);
        const erroredRef = React$1.useRef(false);
        const currentSliceRef = React$1.useRef();
        if (currentSliceRef.current === void 0) {
          currentSliceRef.current = selector(state);
        }
        let newStateSlice;
        let hasNewStateSlice = false;
        if (stateRef.current !== state || selectorRef.current !== selector || equalityFnRef.current !== equalityFn || erroredRef.current) {
          newStateSlice = selector(state);
          hasNewStateSlice = !equalityFn(currentSliceRef.current, newStateSlice);
        }
        useIsomorphicLayoutEffect(() => {
          if (hasNewStateSlice) {
            currentSliceRef.current = newStateSlice;
          }
          stateRef.current = state;
          selectorRef.current = selector;
          equalityFnRef.current = equalityFn;
          erroredRef.current = false;
        });
        const stateBeforeSubscriptionRef = React$1.useRef(state);
        useIsomorphicLayoutEffect(() => {
          const listener = () => {
            try {
              const nextState = api.getState();
              const nextStateSlice = selectorRef.current(nextState);
              if (!equalityFnRef.current(currentSliceRef.current, nextStateSlice)) {
                stateRef.current = nextState;
                currentSliceRef.current = nextStateSlice;
                forceUpdate();
              }
            } catch (error) {
              erroredRef.current = true;
              forceUpdate();
            }
          };
          const unsubscribe = api.subscribe(listener);
          if (api.getState() !== stateBeforeSubscriptionRef.current) {
            listener();
          }
          return unsubscribe;
        }, []);
        return hasNewStateSlice ? newStateSlice : currentSliceRef.current;
      };
      Object.assign(useStore, api);
      useStore[Symbol.iterator] = function() {
        console.warn("[useStore, api] = create() is deprecated and will be removed in v4");
        const items = [useStore, api];
        return {
          next() {
            const done = items.length <= 0;
            return { value: items.shift(), done };
          }
        };
      };
      return useStore;
    }

    function n$1(n){for(var t=arguments.length,r=Array(t>1?t-1:0),e=1;e<t;e++)r[e-1]=arguments[e];if("production"!==process.env.NODE_ENV){var i=Y[n],o=i?"function"==typeof i?i.apply(null,r):i:"unknown error nr: "+n;throw Error("[Immer] "+o)}throw Error("[Immer] minified error nr: "+n+(r.length?" "+r.map((function(n){return "'"+n+"'"})).join(","):"")+". Find the full error at: https://bit.ly/3cXEKWf")}function t$2(n){return !!n&&!!n[Q]}function r(n){return !!n&&(function(n){if(!n||"object"!=typeof n)return !1;var t=Object.getPrototypeOf(n);if(null===t)return !0;var r=Object.hasOwnProperty.call(t,"constructor")&&t.constructor;return r===Object||"function"==typeof r&&Function.toString.call(r)===Z}(n)||Array.isArray(n)||!!n[L]||!!n.constructor[L]||s$1(n)||v(n))}function i$1(n,t,r){void 0===r&&(r=!1),0===o$1(n)?(r?Object.keys:nn)(n).forEach((function(e){r&&"symbol"==typeof e||t(e,n[e],n);})):n.forEach((function(r,e){return t(e,r,n)}));}function o$1(n){var t=n[Q];return t?t.i>3?t.i-4:t.i:Array.isArray(n)?1:s$1(n)?2:v(n)?3:0}function u(n,t){return 2===o$1(n)?n.has(t):Object.prototype.hasOwnProperty.call(n,t)}function a(n,t){return 2===o$1(n)?n.get(t):n[t]}function f(n,t,r){var e=o$1(n);2===e?n.set(t,r):3===e?(n.delete(t),n.add(r)):n[t]=r;}function c(n,t){return n===t?0!==n||1/n==1/t:n!=n&&t!=t}function s$1(n){return X&&n instanceof Map}function v(n){return q&&n instanceof Set}function p(n){return n.o||n.t}function l(n){if(Array.isArray(n))return Array.prototype.slice.call(n);var t=tn(n);delete t[Q];for(var r=nn(t),e=0;e<r.length;e++){var i=r[e],o=t[i];!1===o.writable&&(o.writable=!0,o.configurable=!0),(o.get||o.set)&&(t[i]={configurable:!0,writable:!0,enumerable:o.enumerable,value:n[i]});}return Object.create(Object.getPrototypeOf(n),t)}function d(n,e){return void 0===e&&(e=!1),y(n)||t$2(n)||!r(n)?n:(o$1(n)>1&&(n.set=n.add=n.clear=n.delete=h),Object.freeze(n),e&&i$1(n,(function(n,t){return d(t,!0)}),!0),n)}function h(){n$1(2);}function y(n){return null==n||"object"!=typeof n||Object.isFrozen(n)}function b(t){var r=rn[t];return r||n$1(18,t),r}function _(){return "production"===process.env.NODE_ENV||U||n$1(0),U}function j(n,t){t&&(b("Patches"),n.u=[],n.s=[],n.v=t);}function O(n){g(n),n.p.forEach(S),n.p=null;}function g(n){n===U&&(U=n.l);}function w(n){return U={p:[],l:U,h:n,m:!0,_:0}}function S(n){var t=n[Q];0===t.i||1===t.i?t.j():t.O=!0;}function P(t,e){e._=e.p.length;var i=e.p[0],o=void 0!==t&&t!==i;return e.h.g||b("ES5").S(e,t,o),o?(i[Q].P&&(O(e),n$1(4)),r(t)&&(t=M(e,t),e.l||x(e,t)),e.u&&b("Patches").M(i[Q],t,e.u,e.s)):t=M(e,i,[]),O(e),e.u&&e.v(e.u,e.s),t!==H?t:void 0}function M(n,t,r){if(y(t))return t;var e=t[Q];if(!e)return i$1(t,(function(i,o){return A(n,e,t,i,o,r)}),!0),t;if(e.A!==n)return t;if(!e.P)return x(n,e.t,!0),e.t;if(!e.I){e.I=!0,e.A._--;var o=4===e.i||5===e.i?e.o=l(e.k):e.o;i$1(3===e.i?new Set(o):o,(function(t,i){return A(n,e,o,t,i,r)})),x(n,o,!1),r&&n.u&&b("Patches").R(e,r,n.u,n.s);}return e.o}function A(e,i,o,a,c,s){if("production"!==process.env.NODE_ENV&&c===o&&n$1(5),t$2(c)){var v=M(e,c,s&&i&&3!==i.i&&!u(i.D,a)?s.concat(a):void 0);if(f(o,a,v),!t$2(v))return;e.m=!1;}if(r(c)&&!y(c)){if(!e.h.F&&e._<1)return;M(e,c),i&&i.A.l||x(e,c);}}function x(n,t,r){void 0===r&&(r=!1),n.h.F&&n.m&&d(t,r);}function z(n,t){var r=n[Q];return (r?p(r):n)[t]}function I(n,t){if(t in n)for(var r=Object.getPrototypeOf(n);r;){var e=Object.getOwnPropertyDescriptor(r,t);if(e)return e;r=Object.getPrototypeOf(r);}}function k(n){n.P||(n.P=!0,n.l&&k(n.l));}function E(n){n.o||(n.o=l(n.t));}function R(n,t,r){var e=s$1(t)?b("MapSet").N(t,r):v(t)?b("MapSet").T(t,r):n.g?function(n,t){var r=Array.isArray(n),e={i:r?1:0,A:t?t.A:_(),P:!1,I:!1,D:{},l:t,t:n,k:null,o:null,j:null,C:!1},i=e,o=en;r&&(i=[e],o=on);var u=Proxy.revocable(i,o),a=u.revoke,f=u.proxy;return e.k=f,e.j=a,f}(t,r):b("ES5").J(t,r);return (r?r.A:_()).p.push(e),e}function D(e){return t$2(e)||n$1(22,e),function n(t){if(!r(t))return t;var e,u=t[Q],c=o$1(t);if(u){if(!u.P&&(u.i<4||!b("ES5").K(u)))return u.t;u.I=!0,e=F(t,c),u.I=!1;}else e=F(t,c);return i$1(e,(function(t,r){u&&a(u.t,t)===r||f(e,t,n(r));})),3===c?new Set(e):e}(e)}function F(n,t){switch(t){case 2:return new Map(n);case 3:return Array.from(n)}return l(n)}var G,U,W="undefined"!=typeof Symbol&&"symbol"==typeof Symbol("x"),X="undefined"!=typeof Map,q="undefined"!=typeof Set,B="undefined"!=typeof Proxy&&void 0!==Proxy.revocable&&"undefined"!=typeof Reflect,H=W?Symbol.for("immer-nothing"):((G={})["immer-nothing"]=!0,G),L=W?Symbol.for("immer-draftable"):"__$immer_draftable",Q=W?Symbol.for("immer-state"):"__$immer_state",Y={0:"Illegal state",1:"Immer drafts cannot have computed properties",2:"This object has been frozen and should not be mutated",3:function(n){return "Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? "+n},4:"An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.",5:"Immer forbids circular references",6:"The first or second argument to `produce` must be a function",7:"The third argument to `produce` must be a function or undefined",8:"First argument to `createDraft` must be a plain object, an array, or an immerable object",9:"First argument to `finishDraft` must be a draft returned by `createDraft`",10:"The given draft is already finalized",11:"Object.defineProperty() cannot be used on an Immer draft",12:"Object.setPrototypeOf() cannot be used on an Immer draft",13:"Immer only supports deleting array indices",14:"Immer only supports setting array indices and the 'length' property",15:function(n){return "Cannot apply patch, path doesn't resolve: "+n},16:'Sets cannot have "replace" patches.',17:function(n){return "Unsupported patch operation: "+n},18:function(n){return "The plugin for '"+n+"' has not been loaded into Immer. To enable the plugin, import and call `enable"+n+"()` when initializing your application."},20:"Cannot use proxies if Proxy, Proxy.revocable or Reflect are not available",21:function(n){return "produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '"+n+"'"},22:function(n){return "'current' expects a draft, got: "+n},23:function(n){return "'original' expects a draft, got: "+n},24:"Patching reserved attributes like __proto__, prototype and constructor is not allowed"},Z=""+Object.prototype.constructor,nn="undefined"!=typeof Reflect&&Reflect.ownKeys?Reflect.ownKeys:void 0!==Object.getOwnPropertySymbols?function(n){return Object.getOwnPropertyNames(n).concat(Object.getOwnPropertySymbols(n))}:Object.getOwnPropertyNames,tn=Object.getOwnPropertyDescriptors||function(n){var t={};return nn(n).forEach((function(r){t[r]=Object.getOwnPropertyDescriptor(n,r);})),t},rn={},en={get:function(n,t){if(t===Q)return n;var e=p(n);if(!u(e,t))return function(n,t,r){var e,i=I(t,r);return i?"value"in i?i.value:null===(e=i.get)||void 0===e?void 0:e.call(n.k):void 0}(n,e,t);var i=e[t];return n.I||!r(i)?i:i===z(n.t,t)?(E(n),n.o[t]=R(n.A.h,i,n)):i},has:function(n,t){return t in p(n)},ownKeys:function(n){return Reflect.ownKeys(p(n))},set:function(n,t,r){var e=I(p(n),t);if(null==e?void 0:e.set)return e.set.call(n.k,r),!0;if(!n.P){var i=z(p(n),t),o=null==i?void 0:i[Q];if(o&&o.t===r)return n.o[t]=r,n.D[t]=!1,!0;if(c(r,i)&&(void 0!==r||u(n.t,t)))return !0;E(n),k(n);}return n.o[t]===r&&"number"!=typeof r&&(void 0!==r||t in n.o)||(n.o[t]=r,n.D[t]=!0,!0)},deleteProperty:function(n,t){return void 0!==z(n.t,t)||t in n.t?(n.D[t]=!1,E(n),k(n)):delete n.D[t],n.o&&delete n.o[t],!0},getOwnPropertyDescriptor:function(n,t){var r=p(n),e=Reflect.getOwnPropertyDescriptor(r,t);return e?{writable:!0,configurable:1!==n.i||"length"!==t,enumerable:e.enumerable,value:r[t]}:e},defineProperty:function(){n$1(11);},getPrototypeOf:function(n){return Object.getPrototypeOf(n.t)},setPrototypeOf:function(){n$1(12);}},on={};i$1(en,(function(n,t){on[n]=function(){return arguments[0]=arguments[0][0],t.apply(this,arguments)};})),on.deleteProperty=function(t,r){return "production"!==process.env.NODE_ENV&&isNaN(parseInt(r))&&n$1(13),en.deleteProperty.call(this,t[0],r)},on.set=function(t,r,e){return "production"!==process.env.NODE_ENV&&"length"!==r&&isNaN(parseInt(r))&&n$1(14),en.set.call(this,t[0],r,e,t[0])};var un=function(){function e(t){var e=this;this.g=B,this.F=!0,this.produce=function(t,i,o){if("function"==typeof t&&"function"!=typeof i){var u=i;i=t;var a=e;return function(n){var t=this;void 0===n&&(n=u);for(var r=arguments.length,e=Array(r>1?r-1:0),o=1;o<r;o++)e[o-1]=arguments[o];return a.produce(n,(function(n){var r;return (r=i).call.apply(r,[t,n].concat(e))}))}}var f;if("function"!=typeof i&&n$1(6),void 0!==o&&"function"!=typeof o&&n$1(7),r(t)){var c=w(e),s=R(e,t,void 0),v=!0;try{f=i(s),v=!1;}finally{v?O(c):g(c);}return "undefined"!=typeof Promise&&f instanceof Promise?f.then((function(n){return j(c,o),P(n,c)}),(function(n){throw O(c),n})):(j(c,o),P(f,c))}if(!t||"object"!=typeof t){if((f=i(t))===H)return;return void 0===f&&(f=t),e.F&&d(f,!0),f}n$1(21,t);},this.produceWithPatches=function(n,t){return "function"==typeof n?function(t){for(var r=arguments.length,i=Array(r>1?r-1:0),o=1;o<r;o++)i[o-1]=arguments[o];return e.produceWithPatches(t,(function(t){return n.apply(void 0,[t].concat(i))}))}:[e.produce(n,t,(function(n,t){r=n,i=t;})),r,i];var r,i;},"boolean"==typeof(null==t?void 0:t.useProxies)&&this.setUseProxies(t.useProxies),"boolean"==typeof(null==t?void 0:t.autoFreeze)&&this.setAutoFreeze(t.autoFreeze);}var i=e.prototype;return i.createDraft=function(e){r(e)||n$1(8),t$2(e)&&(e=D(e));var i=w(this),o=R(this,e,void 0);return o[Q].C=!0,g(i),o},i.finishDraft=function(t,r){var e=t&&t[Q];"production"!==process.env.NODE_ENV&&(e&&e.C||n$1(9),e.I&&n$1(10));var i=e.A;return j(i,r),P(void 0,i)},i.setAutoFreeze=function(n){this.F=n;},i.setUseProxies=function(t){t&&!B&&n$1(20),this.g=t;},i.applyPatches=function(n,r){var e;for(e=r.length-1;e>=0;e--){var i=r[e];if(0===i.path.length&&"replace"===i.op){n=i.value;break}}var o=b("Patches").$;return t$2(n)?o(n,r):this.produce(n,(function(n){return o(n,r.slice(e+1))}))},e}(),an=new un,fn=an.produce;an.produceWithPatches.bind(an);an.setAutoFreeze.bind(an);an.setUseProxies.bind(an);an.applyPatches.bind(an);an.createDraft.bind(an);an.finishDraft.bind(an);var produce = fn;

    // This alphabet uses `A-Za-z0-9_-` symbols. The genetic algorithm helped
    // optimize the gzip compression for this alphabet.
    let urlAlphabet =
      'ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW';

    // It is best to make fewer, larger requests to the crypto module to
    // avoid system call overhead. So, random numbers are generated in a
    // pool. The pool is a Buffer that is larger than the initial random
    // request size by this multiplier. The pool is enlarged if subsequent
    // requests exceed the maximum buffer size.
    const POOL_SIZE_MULTIPLIER = 32;
    let pool, poolOffset;

    let random = bytes => {
      if (!pool || pool.length < bytes) {
        pool = Buffer.allocUnsafe(bytes * POOL_SIZE_MULTIPLIER);
        crypto__default['default'].randomFillSync(pool);
        poolOffset = 0;
      } else if (poolOffset + bytes > pool.length) {
        crypto__default['default'].randomFillSync(pool);
        poolOffset = 0;
      }

      let res = pool.subarray(poolOffset, poolOffset + bytes);
      poolOffset += bytes;
      return res
    };

    let nanoid = (size = 21) => {
      let bytes = random(size);
      let id = '';
      // A compact alternative for `for (let i = 0; i < size; i++)`.
      while (size--) {
        // It is incorrect to use bytes exceeding the alphabet size.
        // The following mask reduces the random byte in the 0-255 value
        // range to the 0-63 value range. Therefore, adding hacks, such
        // as empty string fallback or magic numbers, is unneccessary because
        // the bitmask trims bytes down to the alphabet size.
        id += urlAlphabet[bytes[size] & 63];
      }
      return id
    };

    var defaultState$1 = {
        time: Date.now(),
        selected: null,
        selectedInput: null,
        tools: [],
        settings: [],
        source: null,
        onChange: null,
        toolbarOpen: false,
        permissions: ["add", "edit", "compose"],
        blocks: [],
    };
    var store$1 = function (set, get) { return (__assign$3(__assign$3({}, defaultState$1), { init: function (source, tools, settings, onChange, permissions) {
            // console.log("init", value, tools)
            get().update(function (state) {
                if (source) {
                    state.source = source;
                }
                if (tools) {
                    state.tools = Array.isArray(tools) ? tools : Object.entries(tools);
                }
                if (onChange) {
                    state.onChange = onChange;
                }
                if (settings) {
                    state.settings = settings;
                }
                if (permissions) {
                    state.permissions = permissions;
                }
                state.selected = null;
            });
        }, setValue: function (value) {
            get().update(function (state) {
                if (value) {
                    state.blocks = value;
                }
            });
        }, setTools: function (value) {
            get().update(function (state) {
                if (value) {
                    state.tools = value;
                }
            });
        }, setSettings: function (value) {
            get().update(function (state) {
                if (value) {
                    state.settings = value;
                }
            });
        }, setSelected: function (id) {
            get().update(function (state) {
                state.selected = id;
            });
        }, setSelectedInput: function (settings) {
            get().update(function (state) {
                state.selectedInput = settings;
            });
        }, updateBlockData: function (id, data) {
            get().update(function (state) {
                var block = state.blocks.find(function (block) { return block.id === id; });
                block.data = data;
            });
        }, addBlock: function (blockType, index) {
            get().update(function (state) {
                var tool = get().tools.find(function (tool) { return tool.type === blockType; });
                console.log("addBlock", tool);
                state.blocks.splice(index, 0, {
                    id: nanoid(),
                    type: blockType,
                    data: tool.defaultData,
                    _$settings: tool.defaultData,
                    version: tool.version,
                });
            });
            console.log("addBlock onChange", get().onChange);
            if (get().onChange)
                get().onChange(get().blocks);
        }, moveBlock: function (sourceIndex, targetIndex) {
            get().update(function (state) {
                var removed = state.blocks.splice(sourceIndex, 1)[0];
                state.blocks.splice(targetIndex, 0, removed);
            });
            if (get().onChange)
                get().onChange(get().blocks);
        }, copyBlock: function (blockProps, index) {
            get().update(function (state) {
                state.blocks.splice(index, 0, {
                    id: nanoid(),
                    type: blockProps.type,
                    data: blockProps.data,
                    _$settings: blockProps._$settings,
                    version: blockProps.version,
                });
            });
            if (get().onChange)
                get().onChange(get().blocks);
        }, deleteBlock: function (blockID) {
            get().update(function (state) {
                state.selected = null;
                state.blocks = state.blocks.filter(function (block) { return block.id != blockID; });
            });
            if (get().onChange)
                get().onChange(get().blocks);
        }, setToolbarOpen: function (value) {
            get().update(function (state) {
                state.toolbarOpen = value;
            });
        }, update: function (fn) { return set(produce(fn)); } })); };
    create(store$1);
    var blockEditorStore = store$1;

    var context = React__namespace.createContext(null);
    var useBlockInputStore = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return React__namespace.useContext(context).apply(void 0, args);
    };
    function BlockEditorContext(_a) {
        var children = _a.children;
        var useStore = React__namespace.useState(function () { return create(blockEditorStore); })[0];
        return React__namespace.createElement(context.Provider, { value: useStore }, children);
    }

    var ChevronUp = function (props) {
        return (React__namespace.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", className: props.className },
            React__namespace.createElement("polyline", { points: "18 15 12 9 6 15" })));
    };
    var ChevronDown = function (props) {
        return (React__namespace.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", className: props.className },
            React__namespace.createElement("polyline", { points: "6 9 12 15 18 9" })));
    };
    var Trash = function (props) {
        return (React__namespace.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: props.className },
            React__namespace.createElement("polyline", { points: "3 6 5 6 21 6" }),
            React__namespace.createElement("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }),
            React__namespace.createElement("line", { x1: "10", y1: "11", x2: "10", y2: "17" }),
            React__namespace.createElement("line", { x1: "14", y1: "11", x2: "14", y2: "17" })));
    };
    var Move = function (props) {
        return (React__namespace.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: props.className },
            React__namespace.createElement("polyline", { points: "5 9 2 12 5 15" }),
            React__namespace.createElement("polyline", { points: "9 5 12 2 15 5" }),
            React__namespace.createElement("polyline", { points: "15 19 12 22 9 19" }),
            React__namespace.createElement("polyline", { points: "19 9 22 12 19 15" }),
            React__namespace.createElement("line", { x1: "2", y1: "12", x2: "22", y2: "12" }),
            React__namespace.createElement("line", { x1: "12", y1: "2", x2: "12", y2: "22" })));
    };
    var Close = function (props) {
        return (React__namespace.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: props.className },
            React__namespace.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
            React__namespace.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" })));
    };
    var Search = function (props) {
        return (React__namespace.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: props.className },
            React__namespace.createElement("circle", { cx: "11", cy: "11", r: "8" }),
            React__namespace.createElement("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })));
    };

    var __defProp = Object.defineProperty;
    var __getOwnPropSymbols = Object.getOwnPropertySymbols;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __propIsEnum = Object.prototype.propertyIsEnumerable;
    var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
    var __spreadValues = (a, b) => {
      for (var prop in b || (b = {}))
        if (__hasOwnProp.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      if (__getOwnPropSymbols)
        for (var prop of __getOwnPropSymbols(b)) {
          if (__propIsEnum.call(b, prop))
            __defNormalProp(a, prop, b[prop]);
        }
      return a;
    };
    const toThenable = (fn) => (input) => {
      try {
        const result = fn(input);
        if (result instanceof Promise) {
          return result;
        }
        return {
          then(onFulfilled) {
            return toThenable(onFulfilled)(result);
          },
          catch(_onRejected) {
            return this;
          }
        };
      } catch (e) {
        return {
          then(_onFulfilled) {
            return this;
          },
          catch(onRejected) {
            return toThenable(onRejected)(e);
          }
        };
      }
    };
    const persist = (config, options) => (set, get, api) => {
      const {
        name,
        getStorage = () => localStorage,
        serialize = JSON.stringify,
        deserialize = JSON.parse,
        blacklist,
        whitelist,
        onRehydrateStorage,
        version = 0,
        migrate,
        merge = (persistedState, currentState) => __spreadValues(__spreadValues({}, currentState), persistedState)
      } = options || {};
      let storage;
      try {
        storage = getStorage();
      } catch (e) {
      }
      if (!storage) {
        return config((...args) => {
          console.warn(`Persist middleware: unable to update ${name}, the given storage is currently unavailable.`);
          set(...args);
        }, get, api);
      }
      const thenableSerialize = toThenable(serialize);
      const setItem = () => {
        const state = __spreadValues({}, get());
        if (whitelist) {
          Object.keys(state).forEach((key) => {
            !whitelist.includes(key) && delete state[key];
          });
        }
        if (blacklist) {
          blacklist.forEach((key) => delete state[key]);
        }
        let errorInSync;
        const thenable = thenableSerialize({ state, version }).then((serializedValue) => storage.setItem(name, serializedValue)).catch((e) => {
          errorInSync = e;
        });
        if (errorInSync) {
          throw errorInSync;
        }
        return thenable;
      };
      const savedSetState = api.setState;
      api.setState = (state, replace) => {
        savedSetState(state, replace);
        void setItem();
      };
      const configResult = config((...args) => {
        set(...args);
        void setItem();
      }, get, api);
      let stateFromStorage;
      const postRehydrationCallback = (onRehydrateStorage == null ? void 0 : onRehydrateStorage(get())) || void 0;
      toThenable(storage.getItem.bind(storage))(name).then((storageValue) => {
        if (storageValue) {
          return deserialize(storageValue);
        }
      }).then((deserializedStorageValue) => {
        if (deserializedStorageValue) {
          if (typeof deserializedStorageValue.version === "number" && deserializedStorageValue.version !== version) {
            if (migrate) {
              return migrate(deserializedStorageValue.state, deserializedStorageValue.version);
            }
            console.error(`State loaded from storage couldn't be migrated since no migrate function was provided`);
          } else {
            return deserializedStorageValue.state;
          }
        }
      }).then((migratedState) => {
        stateFromStorage = merge(migratedState, configResult);
        set(stateFromStorage, true);
        return setItem();
      }).then(() => {
        postRehydrationCallback == null ? void 0 : postRehydrationCallback(stateFromStorage, void 0);
      }).catch((e) => {
        postRehydrationCallback == null ? void 0 : postRehydrationCallback(void 0, e);
      });
      return stateFromStorage || configResult;
    };

    var defaultState = {
        fixedSettingsPanel: false,
    };
    var store = function (set, get) { return (__assign$3(__assign$3({}, defaultState), { setFixedSettingsPanel: function (value) {
            get().update(function (state) {
                state.fixedSettingsPanel = value;
            });
        }, update: function (fn) { return set(produce(fn)); } })); };
    var useBlockEditorStore = create(persist(store, {
        name: "blockEditorStore",
        version: 1,
    }));

    process.env.NODE_ENV !== "production";
    var SettingsPanel = React__namespace.memo(function SettingsPanel(props) {
        var _a;
        var _b = useBlockEditorStore(function (state) { return [state.fixedSettingsPanel, state.setFixedSettingsPanel]; }), fixedSettingsPanel = _b[0], setFixedSettingsPanel = _b[1];
        // source is same as in react-admin = path to section of record/object that is edited
        var blockMeta = useBlockInputStore(function (state) {
            var _a, _b;
            var block = state.blocks.find(function (block) { return block.id == state.selected; });
            if (block) {
                var blockIndex = state.blocks.findIndex(function (block) { return block.id == state.selected; });
                return {
                    id: block.id,
                    type: block.type,
                    version: block.version,
                    source: state.source + "[" + blockIndex + "]._$settings",
                    withSettings: (_b = (_a = state === null || state === void 0 ? void 0 : state.tools) === null || _a === void 0 ? void 0 : _a[block.type]) === null || _b === void 0 ? void 0 : _b.Settings,
                };
            }
            return null;
        }, reactFastCompare);
        var settingsMeta = useBlockInputStore(function (state) {
            if (state.selectedInput) {
                var settings_1 = state.settings.find(function (sett) { return sett.type == state.selectedInput.settings; });
                return __assign$3(__assign$3({}, settings_1), { props: __assign$3(__assign$3({}, state.selectedInput), { source: "" + (state.selectedInput.source[0] === "." ? blockMeta.source : "") + state.selectedInput.source }) });
            }
            return null;
        }, reactFastCompare);
        var _c = useBlockInputStore(function (state) { return [
            state.setSelected,
            state.tools,
            state.setSelectedInput,
            state.settings,
        ]; }, reactFastCompare), setSelected = _c[0], tools = _c[1], setSelectedInput = _c[2]; _c[3];
        var handleClose = function (e) {
            setSelected(null);
            setSelectedInput(null);
            e.preventDefault();
        };
        var handleCloseInput = function (e) {
            setSelectedInput(null);
            e.preventDefault();
        };
        var handleToggleFixedSidebar = function () {
            setFixedSettingsPanel(!fixedSettingsPanel);
        };
        var title = React__namespace.useMemo(function () {
            var _a;
            if (!blockMeta)
                return null;
            return (_a = tools[blockMeta.type]) === null || _a === void 0 ? void 0 : _a.title;
        }, [blockMeta === null || blockMeta === void 0 ? void 0 : blockMeta.type]);
        console.log("SettingsPanel render", blockMeta, settingsMeta);
        return (React__namespace.createElement("aside", { className: clsx("bg-gray-50 flex-0 p-2 overflow-auto max-h-[80vh]", fixedSettingsPanel ? "w-[340px] xl:w-[400px]" : "w-0") },
            settingsMeta ? (React__namespace.createElement(SettingsWrapper, { id: (blockMeta === null || blockMeta === void 0 ? void 0 : blockMeta.id) + "/" + settingsMeta.props.source, height: "auto" },
                React__namespace.createElement("header", { className: "text-white bg-purple-600 cursor-move dragHandle p-1 pl-2 flex-none h-8 flex items-center justify-between" },
                    React__namespace.createElement("section", { className: "truncate" }, (_a = settingsMeta.props.label) !== null && _a !== void 0 ? _a : settingsMeta.props.source),
                    React__namespace.createElement("aside", { className: "flex items-center justify-center" },
                        React__namespace.createElement("button", { className: "btn btn-xs bg-transparent border-none", onClick: handleToggleFixedSidebar },
                            React__namespace.createElement(ChevronDown, { className: clsx("w-4 text-white transform", fixedSettingsPanel ? "rotate-90" : "-rotate-90"), label: "Move to sidebar" })),
                        React__namespace.createElement("button", { className: "btn btn-xs bg-transparent border-none", onClick: handleCloseInput },
                            React__namespace.createElement(Close, { className: "w-4 text-white", label: "Close" })))),
                React__namespace.createElement("section", { className: "overflow-auto p-2 h-[calc(100%-2rem)] bg-gray-50" },
                    React__namespace.createElement(settingsMeta.Component, __assign$3({}, settingsMeta.props))))) : null,
            blockMeta && blockMeta.withSettings ? (React__namespace.createElement(SettingsWrapper, { id: blockMeta.id },
                React__namespace.createElement("header", { className: "text-white bg-blue-800 cursor-move dragHandle p-1 pl-2 flex-none h-8 flex items-center justify-between" },
                    React__namespace.createElement("section", { className: "truncate" }, title !== null && title !== void 0 ? title : "Nastavení stránky"),
                    React__namespace.createElement("aside", { className: "flex items-center justify-center" },
                        React__namespace.createElement("button", { className: "btn btn-xs bg-transparent border-none", onClick: handleToggleFixedSidebar },
                            React__namespace.createElement(ChevronDown, { className: clsx("w-4 text-white transform", fixedSettingsPanel ? "rotate-90" : "-rotate-90"), label: "Move to sidebar" })),
                        React__namespace.createElement("button", { className: "btn btn-xs bg-transparent border-none", onClick: handleClose },
                            React__namespace.createElement(Close, { className: "w-4 text-white", label: "Close" })))),
                React__namespace.createElement("section", { className: "overflow-auto p-2 h-[calc(100%-2rem)] bg-gray-50" },
                    React__namespace.createElement(ErrorBoundary, { fallbackRender: function (_a) {
                            var error = _a.error, resetErrorBoundary = _a.resetErrorBoundary;
                            return (React__namespace.createElement("div", { role: "alert" },
                                React__namespace.createElement("div", null, "Oh no"),
                                React__namespace.createElement("div", null, error.message),
                                React__namespace.createElement("button", { className: "btn", onClick: function () {
                                        resetErrorBoundary();
                                    } }, "Try again")));
                        } }, blockMeta ? React__namespace.createElement(LazySettings, { blockMeta: blockMeta }) : null)))) : null));
    }, reactFastCompare);
    var SettingsWrapper = React__namespace.memo(function (props) {
        var _a;
        var fixedSettingsPanel = useBlockEditorStore(function (state) { return [
            state.fixedSettingsPanel,
        ]; })[0];
        if (fixedSettingsPanel) {
            return React__namespace.createElement(React__namespace.Fragment, null, props.children);
        }
        return (React__namespace.createElement(Rnd, { key: props.id, className: "flex flex-col border border-gray-300 rounded shadow-lg bg-white z-[99999] overflow-hidden", enableUserSelectHack: false, dragHandleClassName: "dragHandle", minWidth: 300, minHeight: 100, maxHeight: "60vh", maxWidth: 600, default: {
                x: -480,
                y: window.scrollY + 50,
                width: 400,
                height: (_a = props.height) !== null && _a !== void 0 ? _a : "50vh",
            } }, props.children));
    });
    var LazyloadComponent = function (componentPath) {
        return function (props) {
            // console.log("LazyloadComponent", componentPath)
            var _a = React__namespace.useState(null), ComponentContainer = _a[0], setComponentContainer = _a[1];
            React__namespace.useEffect(function () {
                if (componentPath) {
                    var path_1 = componentPath();
                    setComponentContainer(React__namespace.lazy(function () { return path_1; }));
                }
            }, [componentPath]);
            return (React__namespace.createElement(React__namespace.Suspense, { fallback: React__namespace.createElement("div", null, "Loading") }, ComponentContainer ? React__namespace.createElement(ComponentContainer, __assign$3({}, props)) : null));
        };
    };
    var LazySettings = React__namespace.memo(function LazySettings(props) {
        var tools = useBlockInputStore(function (state) { return state.tools; }, reactFastCompare);
        var Settings = React__namespace.useMemo(function () { var _a; return LazyloadComponent((_a = tools[props.blockMeta.type]) === null || _a === void 0 ? void 0 : _a.Settings); }, [props.blockMeta.id]);
        // console.log("LazySettings render", props.blockMeta, Settings)
        if (props.blockMeta && Settings) {
            return (React__namespace.createElement(Settings, { blockID: props.blockMeta.id, source: props.blockMeta.source, getSource: function (scopedSource) {
                    return props.blockMeta.source + "." + scopedSource;
                } }));
        }
        return null;
    }, reactFastCompare);

    var useClickOutside = function (ref, handler) {
        React__namespace.useEffect(function () {
            var listener = function (event) {
                // Do nothing if clicking ref's element or descendent elements
                if (!ref.current || ref.current.contains(event.target)) {
                    return;
                }
                handler(event);
            };
            document.addEventListener("mousedown", listener);
            document.addEventListener("touchstart", listener);
            return function () {
                document.removeEventListener("mousedown", listener);
                document.removeEventListener("touchstart", listener);
            };
        }, 
        // Add ref and handler to effect dependencies
        // It's worth noting that because passed in handler is a new ...
        // ... function on every render that will cause this effect ...
        // ... callback/cleanup to run every render. It's not a big deal ...
        // ... but to optimize you can wrap handler in useCallback before ...
        // ... passing it into this hook.
        [ref, handler]);
    };

    var ToolsPanel = React__namespace.memo(function ToolsPanel(props) {
        var _a = useBlockInputStore(function (state) { return [state.toolbarOpen, state.tools]; }, reactFastCompare), toolbarOpen = _a[0], tools = _a[1];
        return (React__namespace.createElement("aside", { className: clsx("top-0 w-48 bg-gray-100 py-2 absolute h-full overflow-auto ease-in-out transition-all duration-300 z-[99999]", toolbarOpen ? "left-0" : "-left-48") },
            React__namespace.createElement("header", { className: "text-center text-sm group-hover:underline" }, "Bloky"),
            React__namespace.createElement(ToolsListWithFilter, { tools: tools })));
    });
    var ToolsListWithFilter = function (props) {
        var _a = React__namespace.useState(""), selectedTag = _a[0], setSelectedTag = _a[1];
        return (React__namespace.createElement("section", null,
            React__namespace.createElement(TagFilter, { tools: props.tools, selectedTag: selectedTag, setSelectedTag: setSelectedTag }),
            React__namespace.createElement(reactBeautifulDnd.Droppable, { droppableId: "sidebar" }, function (provided, snapshot) { return (React__namespace.createElement("section", __assign$3({ ref: provided.innerRef }, provided.droppableProps), props.tools
                ? props.tools.map(function (tool, index) {
                    if (selectedTag.length > 0 &&
                        Array.isArray(tool.tags) &&
                        !tool.tags.includes(selectedTag)) {
                        return null;
                    }
                    return (React__namespace.createElement(ToolsItem, { index: index, block: tool, key: tool.type + "-" + index }));
                })
                : null)); })));
    };
    var ToolsItem = function (props) {
        return (React__namespace.createElement("article", { className: "m-4" },
            React__namespace.createElement(reactBeautifulDnd.Draggable, { draggableId: props.block.type, index: props.index }, function (provided, snapshot) {
                var _a, _b, _c;
                return (React__namespace.createElement("article", __assign$3({ className: "bg-white shadow-xl rounded p-1", ref: provided.innerRef }, provided.draggableProps, provided.dragHandleProps),
                    React__namespace.createElement("header", { className: "text-center text-sm" },
                        props.block.type, (_b = (_a = props.block) === null || _a === void 0 ? void 0 : _a.title) !== null && _b !== void 0 ? _b : props.block.type),
                    ((_c = props.block) === null || _c === void 0 ? void 0 : _c.previewImage) ? (React__namespace.createElement("img", { src: props.block.previewImage })) : null));
            })));
    };
    var TagFilter = function (props) {
        var _a = React__namespace.useState(false), inputActive = _a[0], setInputActive = _a[1];
        var _b = React__namespace.useState([]), tags = _b[0], setTags = _b[1];
        var ref = React__namespace.useRef(null);
        useClickOutside(ref, function () { return (inputActive ? setInputActive(false) : null); });
        React__namespace.useEffect(function () {
            var tags = props.tools.reduce(function (result, tool) {
                if (tool && tool.tags && Array.isArray(tool.tags)) {
                    tool.tags.forEach(function (tag) {
                        if (!result.includes(tag)) {
                            result.push(tag);
                        }
                    });
                }
                return result;
            }, []);
            setTags(tags);
        }, [props.tools]);
        var prevent = function (e) {
            e.preventDefault();
            e.stopPropagation();
        };
        var handleFocus = function (e) {
            prevent(e);
            setInputActive(true);
        };
        var handleSelected = function (e) {
            console.log("handleSelected", e.currentTarget.getAttribute("data-tag"));
            prevent(e);
            var nextTag = e.currentTarget.getAttribute("data-tag");
            if (nextTag === props.selectedTag) {
                props.setSelectedTag("");
            }
            else {
                props.setSelectedTag(nextTag);
            }
            setInputActive(false);
        };
        return (React__namespace.createElement("aside", { className: "px-2" },
            React__namespace.createElement("header", { className: "flex items-center overflow-hidden" },
                React__namespace.createElement("button", { onClick: handleFocus, className: "btn btn-xs btn-outline border-none m-0.5 italic opacity-75 flex-none" },
                    React__namespace.createElement(Search, { className: "w-4 h-4" }),
                    !props.selectedTag ? React__namespace.createElement("span", { className: "ml-1" }, "Filtrovat") : null),
                props.selectedTag ? (React__namespace.createElement(TagButton, { tag: props.selectedTag, onClick: handleSelected, selected: true })) : null),
            React__namespace.createElement("section", { className: "relative" }, inputActive ? (React__namespace.createElement("section", { className: "absolute top-0 -left-1 bg-white shadow rounded pb-0.5 px-0.5", ref: ref }, tags.map(function (tag) {
                return React__namespace.createElement(TagButton, { tag: tag, key: tag, onClick: handleSelected });
            }))) : null)));
    };
    var TagButton = function (props) {
        var handleClick = function (e) {
            console.log("tagbutton click");
            props.onClick(e);
        };
        return (React__namespace.createElement("button", { onClick: handleClick, "data-tag": props.tag, className: clsx("btn btn-xs h-auto m-0.5 inline-flex flex-nowrap items-center flex-shrink", props.selected ? "" : "btn-outline") },
            props.selected ? (React__namespace.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", className: "inline-block w-3 h-3 mr-1 stroke-current" },
                React__namespace.createElement("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M6 18L18 6M6 6l12 12" }))) : null,
            React__namespace.createElement("span", { className: "overflow-ellipsis" }, props.tag)));
    };

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */

    function isObject$3(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    var isObject_1 = isObject$3;

    /** Detect free variable `global` from Node.js. */

    var freeGlobal$1 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

    var _freeGlobal = freeGlobal$1;

    var freeGlobal = _freeGlobal;

    /** Detect free variable `self`. */
    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root$2 = freeGlobal || freeSelf || Function('return this')();

    var _root = root$2;

    var root$1 = _root;

    /**
     * Gets the timestamp of the number of milliseconds that have elapsed since
     * the Unix epoch (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Date
     * @returns {number} Returns the timestamp.
     * @example
     *
     * _.defer(function(stamp) {
     *   console.log(_.now() - stamp);
     * }, _.now());
     * // => Logs the number of milliseconds it took for the deferred invocation.
     */
    var now$1 = function() {
      return root$1.Date.now();
    };

    var now_1 = now$1;

    /** Used to match a single whitespace character. */

    var reWhitespace = /\s/;

    /**
     * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
     * character of `string`.
     *
     * @private
     * @param {string} string The string to inspect.
     * @returns {number} Returns the index of the last non-whitespace character.
     */
    function trimmedEndIndex$1(string) {
      var index = string.length;

      while (index-- && reWhitespace.test(string.charAt(index))) {}
      return index;
    }

    var _trimmedEndIndex = trimmedEndIndex$1;

    var trimmedEndIndex = _trimmedEndIndex;

    /** Used to match leading whitespace. */
    var reTrimStart = /^\s+/;

    /**
     * The base implementation of `_.trim`.
     *
     * @private
     * @param {string} string The string to trim.
     * @returns {string} Returns the trimmed string.
     */
    function baseTrim$1(string) {
      return string
        ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
        : string;
    }

    var _baseTrim = baseTrim$1;

    var root = _root;

    /** Built-in value references. */
    var Symbol$3 = root.Symbol;

    var _Symbol = Symbol$3;

    var Symbol$2 = _Symbol;

    /** Used for built-in method references. */
    var objectProto$1 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto$1.hasOwnProperty;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString$1 = objectProto$1.toString;

    /** Built-in value references. */
    var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : undefined;

    /**
     * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the raw `toStringTag`.
     */
    function getRawTag$1(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag$1),
          tag = value[symToStringTag$1];

      try {
        value[symToStringTag$1] = undefined;
        var unmasked = true;
      } catch (e) {}

      var result = nativeObjectToString$1.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag$1] = tag;
        } else {
          delete value[symToStringTag$1];
        }
      }
      return result;
    }

    var _getRawTag = getRawTag$1;

    /** Used for built-in method references. */

    var objectProto = Object.prototype;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString = objectProto.toString;

    /**
     * Converts `value` to a string using `Object.prototype.toString`.
     *
     * @private
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     */
    function objectToString$1(value) {
      return nativeObjectToString.call(value);
    }

    var _objectToString = objectToString$1;

    var Symbol$1 = _Symbol,
        getRawTag = _getRawTag,
        objectToString = _objectToString;

    /** `Object#toString` result references. */
    var nullTag = '[object Null]',
        undefinedTag = '[object Undefined]';

    /** Built-in value references. */
    var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

    /**
     * The base implementation of `getTag` without fallbacks for buggy environments.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function baseGetTag$1(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      return (symToStringTag && symToStringTag in Object(value))
        ? getRawTag(value)
        : objectToString(value);
    }

    var _baseGetTag = baseGetTag$1;

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */

    function isObjectLike$1(value) {
      return value != null && typeof value == 'object';
    }

    var isObjectLike_1 = isObjectLike$1;

    var baseGetTag = _baseGetTag,
        isObjectLike = isObjectLike_1;

    /** `Object#toString` result references. */
    var symbolTag = '[object Symbol]';

    /**
     * Checks if `value` is classified as a `Symbol` primitive or object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
     * @example
     *
     * _.isSymbol(Symbol.iterator);
     * // => true
     *
     * _.isSymbol('abc');
     * // => false
     */
    function isSymbol$1(value) {
      return typeof value == 'symbol' ||
        (isObjectLike(value) && baseGetTag(value) == symbolTag);
    }

    var isSymbol_1 = isSymbol$1;

    var baseTrim = _baseTrim,
        isObject$2 = isObject_1,
        isSymbol = isSymbol_1;

    /** Used as references for various `Number` constants. */
    var NAN = 0 / 0;

    /** Used to detect bad signed hexadecimal string values. */
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

    /** Used to detect binary string values. */
    var reIsBinary = /^0b[01]+$/i;

    /** Used to detect octal string values. */
    var reIsOctal = /^0o[0-7]+$/i;

    /** Built-in method references without a dependency on `root`. */
    var freeParseInt = parseInt;

    /**
     * Converts `value` to a number.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     * @example
     *
     * _.toNumber(3.2);
     * // => 3.2
     *
     * _.toNumber(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toNumber(Infinity);
     * // => Infinity
     *
     * _.toNumber('3.2');
     * // => 3.2
     */
    function toNumber$1(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject$2(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = isObject$2(other) ? (other + '') : other;
      }
      if (typeof value != 'string') {
        return value === 0 ? value : +value;
      }
      value = baseTrim(value);
      var isBinary = reIsBinary.test(value);
      return (isBinary || reIsOctal.test(value))
        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
        : (reIsBadHex.test(value) ? NAN : +value);
    }

    var toNumber_1 = toNumber$1;

    var isObject$1 = isObject_1,
        now = now_1,
        toNumber = toNumber_1;

    /** Error message constants. */
    var FUNC_ERROR_TEXT$1 = 'Expected a function';

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeMax = Math.max,
        nativeMin = Math.min;

    /**
     * Creates a debounced function that delays invoking `func` until after `wait`
     * milliseconds have elapsed since the last time the debounced function was
     * invoked. The debounced function comes with a `cancel` method to cancel
     * delayed `func` invocations and a `flush` method to immediately invoke them.
     * Provide `options` to indicate whether `func` should be invoked on the
     * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
     * with the last arguments provided to the debounced function. Subsequent
     * calls to the debounced function return the result of the last `func`
     * invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is
     * invoked on the trailing edge of the timeout only if the debounced function
     * is invoked more than once during the `wait` timeout.
     *
     * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
     * until to the next tick, similar to `setTimeout` with a timeout of `0`.
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `_.debounce` and `_.throttle`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to debounce.
     * @param {number} [wait=0] The number of milliseconds to delay.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.leading=false]
     *  Specify invoking on the leading edge of the timeout.
     * @param {number} [options.maxWait]
     *  The maximum time `func` is allowed to be delayed before it's invoked.
     * @param {boolean} [options.trailing=true]
     *  Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // Avoid costly calculations while the window size is in flux.
     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
     *
     * // Invoke `sendMail` when clicked, debouncing subsequent calls.
     * jQuery(element).on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * }));
     *
     * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
     * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
     * var source = new EventSource('/stream');
     * jQuery(source).on('message', debounced);
     *
     * // Cancel the trailing debounced invocation.
     * jQuery(window).on('popstate', debounced.cancel);
     */
    function debounce$1(func, wait, options) {
      var lastArgs,
          lastThis,
          maxWait,
          result,
          timerId,
          lastCallTime,
          lastInvokeTime = 0,
          leading = false,
          maxing = false,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT$1);
      }
      wait = toNumber(wait) || 0;
      if (isObject$1(options)) {
        leading = !!options.leading;
        maxing = 'maxWait' in options;
        maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }

      function invokeFunc(time) {
        var args = lastArgs,
            thisArg = lastThis;

        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
      }

      function leadingEdge(time) {
        // Reset any `maxWait` timer.
        lastInvokeTime = time;
        // Start the timer for the trailing edge.
        timerId = setTimeout(timerExpired, wait);
        // Invoke the leading edge.
        return leading ? invokeFunc(time) : result;
      }

      function remainingWait(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime,
            timeWaiting = wait - timeSinceLastCall;

        return maxing
          ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
          : timeWaiting;
      }

      function shouldInvoke(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime;

        // Either this is the first call, activity has stopped and we're at the
        // trailing edge, the system time has gone backwards and we're treating
        // it as the trailing edge, or we've hit the `maxWait` limit.
        return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
          (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
      }

      function timerExpired() {
        var time = now();
        if (shouldInvoke(time)) {
          return trailingEdge(time);
        }
        // Restart the timer.
        timerId = setTimeout(timerExpired, remainingWait(time));
      }

      function trailingEdge(time) {
        timerId = undefined;

        // Only invoke if we have `lastArgs` which means `func` has been
        // debounced at least once.
        if (trailing && lastArgs) {
          return invokeFunc(time);
        }
        lastArgs = lastThis = undefined;
        return result;
      }

      function cancel() {
        if (timerId !== undefined) {
          clearTimeout(timerId);
        }
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = undefined;
      }

      function flush() {
        return timerId === undefined ? result : trailingEdge(now());
      }

      function debounced() {
        var time = now(),
            isInvoking = shouldInvoke(time);

        lastArgs = arguments;
        lastThis = this;
        lastCallTime = time;

        if (isInvoking) {
          if (timerId === undefined) {
            return leadingEdge(lastCallTime);
          }
          if (maxing) {
            // Handle invocations in a tight loop.
            clearTimeout(timerId);
            timerId = setTimeout(timerExpired, wait);
            return invokeFunc(lastCallTime);
          }
        }
        if (timerId === undefined) {
          timerId = setTimeout(timerExpired, wait);
        }
        return result;
      }
      debounced.cancel = cancel;
      debounced.flush = flush;
      return debounced;
    }

    var debounce_1 = debounce$1;

    var debounce = debounce_1,
        isObject = isObject_1;

    /** Error message constants. */
    var FUNC_ERROR_TEXT = 'Expected a function';

    /**
     * Creates a throttled function that only invokes `func` at most once per
     * every `wait` milliseconds. The throttled function comes with a `cancel`
     * method to cancel delayed `func` invocations and a `flush` method to
     * immediately invoke them. Provide `options` to indicate whether `func`
     * should be invoked on the leading and/or trailing edge of the `wait`
     * timeout. The `func` is invoked with the last arguments provided to the
     * throttled function. Subsequent calls to the throttled function return the
     * result of the last `func` invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is
     * invoked on the trailing edge of the timeout only if the throttled function
     * is invoked more than once during the `wait` timeout.
     *
     * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
     * until to the next tick, similar to `setTimeout` with a timeout of `0`.
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `_.throttle` and `_.debounce`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to throttle.
     * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.leading=true]
     *  Specify invoking on the leading edge of the timeout.
     * @param {boolean} [options.trailing=true]
     *  Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // Avoid excessively updating the position while scrolling.
     * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
     *
     * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
     * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
     * jQuery(element).on('click', throttled);
     *
     * // Cancel the trailing throttled invocation.
     * jQuery(window).on('popstate', throttled.cancel);
     */
    function throttle(func, wait, options) {
      var leading = true,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      if (isObject(options)) {
        leading = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }
      return debounce(func, wait, {
        'leading': leading,
        'maxWait': wait,
        'trailing': trailing
      });
    }

    var throttle_1 = throttle;

    var useThrottle = function (cb, delay) {
        var options = { leading: true, trailing: true }; // add custom lodash options
        var cbRef = React__namespace.useRef(cb);
        // use mutable ref to make useCallback/throttle not depend on `cb` dep
        React__namespace.useEffect(function () {
            cbRef.current = cb;
        });
        return React__namespace.useCallback(throttle_1(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return cbRef.current.apply(cbRef, args);
        }, delay, options), [delay]);
    };

    var usePrevious = function (value) {
        var ref = React$1.useRef();
        React$1.useEffect(function () {
            ref.current = value;
        }, [value]);
        return ref.current;
    };

    var resizeObservers = [];

    var hasActiveObservations = function () {
        return resizeObservers.some(function (ro) { return ro.activeTargets.length > 0; });
    };

    var hasSkippedObservations = function () {
        return resizeObservers.some(function (ro) { return ro.skippedTargets.length > 0; });
    };

    var msg = 'ResizeObserver loop completed with undelivered notifications.';
    var deliverResizeLoopError = function () {
        var event;
        if (typeof ErrorEvent === 'function') {
            event = new ErrorEvent('error', {
                message: msg
            });
        }
        else {
            event = document.createEvent('Event');
            event.initEvent('error', false, false);
            event.message = msg;
        }
        window.dispatchEvent(event);
    };

    var ResizeObserverBoxOptions;
    (function (ResizeObserverBoxOptions) {
        ResizeObserverBoxOptions["BORDER_BOX"] = "border-box";
        ResizeObserverBoxOptions["CONTENT_BOX"] = "content-box";
        ResizeObserverBoxOptions["DEVICE_PIXEL_CONTENT_BOX"] = "device-pixel-content-box";
    })(ResizeObserverBoxOptions || (ResizeObserverBoxOptions = {}));

    var freeze = function (obj) { return Object.freeze(obj); };

    var ResizeObserverSize = (function () {
        function ResizeObserverSize(inlineSize, blockSize) {
            this.inlineSize = inlineSize;
            this.blockSize = blockSize;
            freeze(this);
        }
        return ResizeObserverSize;
    }());

    var DOMRectReadOnly = (function () {
        function DOMRectReadOnly(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.top = this.y;
            this.left = this.x;
            this.bottom = this.top + this.height;
            this.right = this.left + this.width;
            return freeze(this);
        }
        DOMRectReadOnly.prototype.toJSON = function () {
            var _a = this, x = _a.x, y = _a.y, top = _a.top, right = _a.right, bottom = _a.bottom, left = _a.left, width = _a.width, height = _a.height;
            return { x: x, y: y, top: top, right: right, bottom: bottom, left: left, width: width, height: height };
        };
        DOMRectReadOnly.fromRect = function (rectangle) {
            return new DOMRectReadOnly(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
        };
        return DOMRectReadOnly;
    }());

    var isSVG = function (target) { return target instanceof SVGElement && 'getBBox' in target; };
    var isHidden = function (target) {
        if (isSVG(target)) {
            var _a = target.getBBox(), width = _a.width, height = _a.height;
            return !width && !height;
        }
        var _b = target, offsetWidth = _b.offsetWidth, offsetHeight = _b.offsetHeight;
        return !(offsetWidth || offsetHeight || target.getClientRects().length);
    };
    var isElement = function (obj) {
        var _a, _b;
        if (obj instanceof Element) {
            return true;
        }
        var scope = (_b = (_a = obj) === null || _a === void 0 ? void 0 : _a.ownerDocument) === null || _b === void 0 ? void 0 : _b.defaultView;
        return !!(scope && obj instanceof scope.Element);
    };
    var isReplacedElement = function (target) {
        switch (target.tagName) {
            case 'INPUT':
                if (target.type !== 'image') {
                    break;
                }
            case 'VIDEO':
            case 'AUDIO':
            case 'EMBED':
            case 'OBJECT':
            case 'CANVAS':
            case 'IFRAME':
            case 'IMG':
                return true;
        }
        return false;
    };

    var global$1 = typeof window !== 'undefined' ? window : {};

    var cache = new WeakMap();
    var scrollRegexp = /auto|scroll/;
    var verticalRegexp = /^tb|vertical/;
    var IE = (/msie|trident/i).test(global$1.navigator && global$1.navigator.userAgent);
    var parseDimension = function (pixel) { return parseFloat(pixel || '0'); };
    var size = function (inlineSize, blockSize, switchSizes) {
        if (inlineSize === void 0) { inlineSize = 0; }
        if (blockSize === void 0) { blockSize = 0; }
        if (switchSizes === void 0) { switchSizes = false; }
        return new ResizeObserverSize((switchSizes ? blockSize : inlineSize) || 0, (switchSizes ? inlineSize : blockSize) || 0);
    };
    var zeroBoxes = freeze({
        devicePixelContentBoxSize: size(),
        borderBoxSize: size(),
        contentBoxSize: size(),
        contentRect: new DOMRectReadOnly(0, 0, 0, 0)
    });
    var calculateBoxSizes = function (target, forceRecalculation) {
        if (forceRecalculation === void 0) { forceRecalculation = false; }
        if (cache.has(target) && !forceRecalculation) {
            return cache.get(target);
        }
        if (isHidden(target)) {
            cache.set(target, zeroBoxes);
            return zeroBoxes;
        }
        var cs = getComputedStyle(target);
        var svg = isSVG(target) && target.ownerSVGElement && target.getBBox();
        var removePadding = !IE && cs.boxSizing === 'border-box';
        var switchSizes = verticalRegexp.test(cs.writingMode || '');
        var canScrollVertically = !svg && scrollRegexp.test(cs.overflowY || '');
        var canScrollHorizontally = !svg && scrollRegexp.test(cs.overflowX || '');
        var paddingTop = svg ? 0 : parseDimension(cs.paddingTop);
        var paddingRight = svg ? 0 : parseDimension(cs.paddingRight);
        var paddingBottom = svg ? 0 : parseDimension(cs.paddingBottom);
        var paddingLeft = svg ? 0 : parseDimension(cs.paddingLeft);
        var borderTop = svg ? 0 : parseDimension(cs.borderTopWidth);
        var borderRight = svg ? 0 : parseDimension(cs.borderRightWidth);
        var borderBottom = svg ? 0 : parseDimension(cs.borderBottomWidth);
        var borderLeft = svg ? 0 : parseDimension(cs.borderLeftWidth);
        var horizontalPadding = paddingLeft + paddingRight;
        var verticalPadding = paddingTop + paddingBottom;
        var horizontalBorderArea = borderLeft + borderRight;
        var verticalBorderArea = borderTop + borderBottom;
        var horizontalScrollbarThickness = !canScrollHorizontally ? 0 : target.offsetHeight - verticalBorderArea - target.clientHeight;
        var verticalScrollbarThickness = !canScrollVertically ? 0 : target.offsetWidth - horizontalBorderArea - target.clientWidth;
        var widthReduction = removePadding ? horizontalPadding + horizontalBorderArea : 0;
        var heightReduction = removePadding ? verticalPadding + verticalBorderArea : 0;
        var contentWidth = svg ? svg.width : parseDimension(cs.width) - widthReduction - verticalScrollbarThickness;
        var contentHeight = svg ? svg.height : parseDimension(cs.height) - heightReduction - horizontalScrollbarThickness;
        var borderBoxWidth = contentWidth + horizontalPadding + verticalScrollbarThickness + horizontalBorderArea;
        var borderBoxHeight = contentHeight + verticalPadding + horizontalScrollbarThickness + verticalBorderArea;
        var boxes = freeze({
            devicePixelContentBoxSize: size(Math.round(contentWidth * devicePixelRatio), Math.round(contentHeight * devicePixelRatio), switchSizes),
            borderBoxSize: size(borderBoxWidth, borderBoxHeight, switchSizes),
            contentBoxSize: size(contentWidth, contentHeight, switchSizes),
            contentRect: new DOMRectReadOnly(paddingLeft, paddingTop, contentWidth, contentHeight)
        });
        cache.set(target, boxes);
        return boxes;
    };
    var calculateBoxSize = function (target, observedBox, forceRecalculation) {
        var _a = calculateBoxSizes(target, forceRecalculation), borderBoxSize = _a.borderBoxSize, contentBoxSize = _a.contentBoxSize, devicePixelContentBoxSize = _a.devicePixelContentBoxSize;
        switch (observedBox) {
            case ResizeObserverBoxOptions.DEVICE_PIXEL_CONTENT_BOX:
                return devicePixelContentBoxSize;
            case ResizeObserverBoxOptions.BORDER_BOX:
                return borderBoxSize;
            default:
                return contentBoxSize;
        }
    };

    var ResizeObserverEntry = (function () {
        function ResizeObserverEntry(target) {
            var boxes = calculateBoxSizes(target);
            this.target = target;
            this.contentRect = boxes.contentRect;
            this.borderBoxSize = freeze([boxes.borderBoxSize]);
            this.contentBoxSize = freeze([boxes.contentBoxSize]);
            this.devicePixelContentBoxSize = freeze([boxes.devicePixelContentBoxSize]);
        }
        return ResizeObserverEntry;
    }());

    var calculateDepthForNode = function (node) {
        if (isHidden(node)) {
            return Infinity;
        }
        var depth = 0;
        var parent = node.parentNode;
        while (parent) {
            depth += 1;
            parent = parent.parentNode;
        }
        return depth;
    };

    var broadcastActiveObservations = function () {
        var shallowestDepth = Infinity;
        var callbacks = [];
        resizeObservers.forEach(function processObserver(ro) {
            if (ro.activeTargets.length === 0) {
                return;
            }
            var entries = [];
            ro.activeTargets.forEach(function processTarget(ot) {
                var entry = new ResizeObserverEntry(ot.target);
                var targetDepth = calculateDepthForNode(ot.target);
                entries.push(entry);
                ot.lastReportedSize = calculateBoxSize(ot.target, ot.observedBox);
                if (targetDepth < shallowestDepth) {
                    shallowestDepth = targetDepth;
                }
            });
            callbacks.push(function resizeObserverCallback() {
                ro.callback.call(ro.observer, entries, ro.observer);
            });
            ro.activeTargets.splice(0, ro.activeTargets.length);
        });
        for (var _i = 0, callbacks_1 = callbacks; _i < callbacks_1.length; _i++) {
            var callback = callbacks_1[_i];
            callback();
        }
        return shallowestDepth;
    };

    var gatherActiveObservationsAtDepth = function (depth) {
        resizeObservers.forEach(function processObserver(ro) {
            ro.activeTargets.splice(0, ro.activeTargets.length);
            ro.skippedTargets.splice(0, ro.skippedTargets.length);
            ro.observationTargets.forEach(function processTarget(ot) {
                if (ot.isActive()) {
                    if (calculateDepthForNode(ot.target) > depth) {
                        ro.activeTargets.push(ot);
                    }
                    else {
                        ro.skippedTargets.push(ot);
                    }
                }
            });
        });
    };

    var process$1 = function () {
        var depth = 0;
        gatherActiveObservationsAtDepth(depth);
        while (hasActiveObservations()) {
            depth = broadcastActiveObservations();
            gatherActiveObservationsAtDepth(depth);
        }
        if (hasSkippedObservations()) {
            deliverResizeLoopError();
        }
        return depth > 0;
    };

    var trigger;
    var callbacks = [];
    var notify = function () { return callbacks.splice(0).forEach(function (cb) { return cb(); }); };
    var queueMicroTask = function (callback) {
        if (!trigger) {
            var toggle_1 = 0;
            var el_1 = document.createTextNode('');
            var config = { characterData: true };
            new MutationObserver(function () { return notify(); }).observe(el_1, config);
            trigger = function () { el_1.textContent = "" + (toggle_1 ? toggle_1-- : toggle_1++); };
        }
        callbacks.push(callback);
        trigger();
    };

    var queueResizeObserver = function (cb) {
        queueMicroTask(function ResizeObserver() {
            requestAnimationFrame(cb);
        });
    };

    var watching = 0;
    var isWatching = function () { return !!watching; };
    var CATCH_PERIOD = 250;
    var observerConfig = { attributes: true, characterData: true, childList: true, subtree: true };
    var events = [
        'resize',
        'load',
        'transitionend',
        'animationend',
        'animationstart',
        'animationiteration',
        'keyup',
        'keydown',
        'mouseup',
        'mousedown',
        'mouseover',
        'mouseout',
        'blur',
        'focus'
    ];
    var time = function (timeout) {
        if (timeout === void 0) { timeout = 0; }
        return Date.now() + timeout;
    };
    var scheduled = false;
    var Scheduler = (function () {
        function Scheduler() {
            var _this = this;
            this.stopped = true;
            this.listener = function () { return _this.schedule(); };
        }
        Scheduler.prototype.run = function (timeout) {
            var _this = this;
            if (timeout === void 0) { timeout = CATCH_PERIOD; }
            if (scheduled) {
                return;
            }
            scheduled = true;
            var until = time(timeout);
            queueResizeObserver(function () {
                var elementsHaveResized = false;
                try {
                    elementsHaveResized = process$1();
                }
                finally {
                    scheduled = false;
                    timeout = until - time();
                    if (!isWatching()) {
                        return;
                    }
                    if (elementsHaveResized) {
                        _this.run(1000);
                    }
                    else if (timeout > 0) {
                        _this.run(timeout);
                    }
                    else {
                        _this.start();
                    }
                }
            });
        };
        Scheduler.prototype.schedule = function () {
            this.stop();
            this.run();
        };
        Scheduler.prototype.observe = function () {
            var _this = this;
            var cb = function () { return _this.observer && _this.observer.observe(document.body, observerConfig); };
            document.body ? cb() : global$1.addEventListener('DOMContentLoaded', cb);
        };
        Scheduler.prototype.start = function () {
            var _this = this;
            if (this.stopped) {
                this.stopped = false;
                this.observer = new MutationObserver(this.listener);
                this.observe();
                events.forEach(function (name) { return global$1.addEventListener(name, _this.listener, true); });
            }
        };
        Scheduler.prototype.stop = function () {
            var _this = this;
            if (!this.stopped) {
                this.observer && this.observer.disconnect();
                events.forEach(function (name) { return global$1.removeEventListener(name, _this.listener, true); });
                this.stopped = true;
            }
        };
        return Scheduler;
    }());
    var scheduler = new Scheduler();
    var updateCount = function (n) {
        !watching && n > 0 && scheduler.start();
        watching += n;
        !watching && scheduler.stop();
    };

    var skipNotifyOnElement = function (target) {
        return !isSVG(target)
            && !isReplacedElement(target)
            && getComputedStyle(target).display === 'inline';
    };
    var ResizeObservation = (function () {
        function ResizeObservation(target, observedBox) {
            this.target = target;
            this.observedBox = observedBox || ResizeObserverBoxOptions.CONTENT_BOX;
            this.lastReportedSize = {
                inlineSize: 0,
                blockSize: 0
            };
        }
        ResizeObservation.prototype.isActive = function () {
            var size = calculateBoxSize(this.target, this.observedBox, true);
            if (skipNotifyOnElement(this.target)) {
                this.lastReportedSize = size;
            }
            if (this.lastReportedSize.inlineSize !== size.inlineSize
                || this.lastReportedSize.blockSize !== size.blockSize) {
                return true;
            }
            return false;
        };
        return ResizeObservation;
    }());

    var ResizeObserverDetail = (function () {
        function ResizeObserverDetail(resizeObserver, callback) {
            this.activeTargets = [];
            this.skippedTargets = [];
            this.observationTargets = [];
            this.observer = resizeObserver;
            this.callback = callback;
        }
        return ResizeObserverDetail;
    }());

    var observerMap = new WeakMap();
    var getObservationIndex = function (observationTargets, target) {
        for (var i = 0; i < observationTargets.length; i += 1) {
            if (observationTargets[i].target === target) {
                return i;
            }
        }
        return -1;
    };
    var ResizeObserverController = (function () {
        function ResizeObserverController() {
        }
        ResizeObserverController.connect = function (resizeObserver, callback) {
            var detail = new ResizeObserverDetail(resizeObserver, callback);
            observerMap.set(resizeObserver, detail);
        };
        ResizeObserverController.observe = function (resizeObserver, target, options) {
            var detail = observerMap.get(resizeObserver);
            var firstObservation = detail.observationTargets.length === 0;
            if (getObservationIndex(detail.observationTargets, target) < 0) {
                firstObservation && resizeObservers.push(detail);
                detail.observationTargets.push(new ResizeObservation(target, options && options.box));
                updateCount(1);
                scheduler.schedule();
            }
        };
        ResizeObserverController.unobserve = function (resizeObserver, target) {
            var detail = observerMap.get(resizeObserver);
            var index = getObservationIndex(detail.observationTargets, target);
            var lastObservation = detail.observationTargets.length === 1;
            if (index >= 0) {
                lastObservation && resizeObservers.splice(resizeObservers.indexOf(detail), 1);
                detail.observationTargets.splice(index, 1);
                updateCount(-1);
            }
        };
        ResizeObserverController.disconnect = function (resizeObserver) {
            var _this = this;
            var detail = observerMap.get(resizeObserver);
            detail.observationTargets.slice().forEach(function (ot) { return _this.unobserve(resizeObserver, ot.target); });
            detail.activeTargets.splice(0, detail.activeTargets.length);
        };
        return ResizeObserverController;
    }());

    var ResizeObserver = (function () {
        function ResizeObserver(callback) {
            if (arguments.length === 0) {
                throw new TypeError("Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.");
            }
            if (typeof callback !== 'function') {
                throw new TypeError("Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function.");
            }
            ResizeObserverController.connect(this, callback);
        }
        ResizeObserver.prototype.observe = function (target, options) {
            if (arguments.length === 0) {
                throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': 1 argument required, but only 0 present.");
            }
            if (!isElement(target)) {
                throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element");
            }
            ResizeObserverController.observe(this, target, options);
        };
        ResizeObserver.prototype.unobserve = function (target) {
            if (arguments.length === 0) {
                throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': 1 argument required, but only 0 present.");
            }
            if (!isElement(target)) {
                throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element");
            }
            ResizeObserverController.unobserve(this, target);
        };
        ResizeObserver.prototype.disconnect = function () {
            ResizeObserverController.disconnect(this);
        };
        ResizeObserver.toString = function () {
            return 'function ResizeObserver () { [polyfill code] }';
        };
        return ResizeObserver;
    }());

    var t=React__default['default']["undefined"!=typeof document&&void 0!==document.createElement?"useLayoutEffect":"useEffect"];var t$1 = t;

    var n = e=>{var a=React$1.useRef(e);return React$1.useEffect(()=>{a.current=e;}),a};

    var rafSchd = function rafSchd(fn) {
      var lastArgs = [];
      var frameId = null;

      var wrapperFn = function wrapperFn() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        lastArgs = args;

        if (frameId) {
          return;
        }

        frameId = requestAnimationFrame(function () {
          frameId = null;
          fn.apply(void 0, lastArgs);
        });
      };

      wrapperFn.cancel = function () {
        if (!frameId) {
          return;
        }

        cancelAnimationFrame(frameId);
        frameId = null;
      };

      return wrapperFn;
    };

    var o = rafSchd;

    function e(){}var s,i="undefined"!=typeof window&&"ResizeObserver"in window?window.ResizeObserver:ResizeObserver;function useResizeObserver(r,u){var a,v,f=s||(a=new Map,v=new i(o((e,r)=>{for(var t=function(t){var n=a.get(e[t].target);null==n||n.forEach(n=>n(e[t],r));},n=0;n<e.length;n++)t(n);})),s={observer:v,subscribe(e,r){var t;v.observe(e);var n=null!==(t=a.get(e))&&void 0!==t?t:[];n.push(r),a.set(e,n);},unsubscribe(e,r){var t;v.unobserve(e);var n=null!==(t=a.get(e))&&void 0!==t?t:[];if(1!==n.length){var o=n.indexOf(r);-1!==o&&n.splice(o,1),a.set(e,n);}else a.delete(e);}}),c=n(u);return t$1(()=>{function t(e,r){n||c.current(e,r);}var n=0,o=r&&"current"in r?r.current:r;return o?(f.subscribe(o,t),()=>{n=1,f.unsubscribe(o,t);}):e},[r,f,c]),f.observer}

    var PagePanel = React__namespace.memo(function PagePanel(props) {
        var blocks = useBlockInputStore(function (state) {
            return state.blocks.map(function (block) { return ({
                id: block.id,
                type: block.type,
                version: block.version,
            }); });
        }, reactFastCompare);
        useCopyPasteBlocks();
        // console.log("PagePanel render", blocks)
        return (React__namespace.createElement(reactBeautifulDnd.Droppable, { droppableId: "page" }, function (provided, snapshot) { return (React__namespace.createElement("section", __assign$3({ id: "page-wrapper" }, provided.droppableProps, { ref: provided.innerRef, className: clsx("relative min-h-[150px] w-full border border-gray-200 bg-white") }), blocks === null || blocks === void 0 ? void 0 :
            blocks.map(function (block, index) {
                return (React__namespace.createElement(PageBlock, { block: block, index: index, key: "block-" + block.id }));
            }),
            provided.placeholder,
            React__namespace.createElement(HoverHighlightNode, null),
            React__namespace.createElement(SelectedHighlightNode, null))); }));
    });
    var MissingBlock = function (props) {
        return (React__namespace.createElement("main", { className: "py-4 flex items-center justify-center" },
            React__namespace.createElement("p", { className: "border border-red-500 p-4 rounded" },
                "Missing block type \"", props === null || props === void 0 ? void 0 :
                props.type,
                "\"")));
    };
    var PageBlock = React__namespace.memo(function PageBlock(props) {
        var _a, _b;
        var _c = useBlockInputStore(function (state) { return [
            state.setSelected,
            state.selected === props.block.id,
            state.deleteBlock,
            state.moveBlock,
            state.blocks.length,
            state.tools,
            state.setToolbarOpen,
            state.permissions,
        ]; }, reactFastCompare), setSelected = _c[0], isSelected = _c[1], deleteBlock = _c[2], moveBlock = _c[3], blocksCount = _c[4], tools = _c[5], setToolbarOpen = _c[6], permissions = _c[7];
        var blockProps = useBlockInputStore(function (state) { return state.blocks.find(function (block) { return block.id === props.block.id; }); }, reactFastCompare);
        var handleClick = function (e) {
            setSelected(props.block.id);
            setToolbarOpen(false);
            e.stopPropagation();
        };
        var handleDelete = function (e) {
            deleteBlock(props.block.id);
            handlePrevent(e);
        };
        var handleMoveUp = function (e) {
            if (props.index > 0) {
                moveBlock(props.index, Math.max(props.index - 1, 0));
            }
            handlePrevent(e);
        };
        var handleMoveDown = function (e) {
            if (props.index + 1 <= blocksCount - 1) {
                moveBlock(props.index, Math.min(props.index + 1, blocksCount - 1));
            }
            handlePrevent(e);
        };
        var Block = (_b = (_a = tools.find(function (tool) { return tool.type === props.block.type; })) === null || _a === void 0 ? void 0 : _a.Component) !== null && _b !== void 0 ? _b : MissingBlock;
        Block = withCurrentRecord(Block);
        console.log("PageBlock render", props.index, blockProps);
        return (React__namespace.createElement(reactBeautifulDnd.Draggable, { draggableId: props.block.id, index: props.index }, function (provided, snapshot) { return (React__namespace.createElement("section", __assign$3({ ref: provided.innerRef }, provided.draggableProps, { className: clsx("relative"), onClick: handleClick, "data-block-type": props.block.type, "data-block-id": props.block.id }),
            permissions.includes("compose") ? (React__namespace.createElement("aside", { className: clsx("absolute -top-3 right-1 z-[9999]", isSelected ? "block" : "hidden") },
                React__namespace.createElement("section", { className: "btn-group" },
                    React__namespace.createElement("button", { className: "btn btn-xs", onClick: handleMoveUp },
                        React__namespace.createElement(ChevronUp, { className: "w-4", label: "Move up" })),
                    React__namespace.createElement("button", { className: "btn btn-xs", onClick: handleMoveDown },
                        React__namespace.createElement(ChevronDown, { className: "w-4", label: "Move up" })),
                    React__namespace.createElement("div", __assign$3({ className: "btn btn-xs" }, provided.dragHandleProps),
                        React__namespace.createElement(Move, { className: "w-4", label: "Move up" })),
                    React__namespace.createElement("button", { className: "btn btn-xs", onClick: handleDelete },
                        React__namespace.createElement(Trash, { className: "w-4", label: "Move up" }))))) : null,
            React__namespace.createElement("div", { className: "pointer-events-none" },
                React__namespace.createElement(ErrorBoundary, { FallbackComponent: function (_a) {
                        var error = _a.error, resetErrorBoundary = _a.resetErrorBoundary;
                        return (React__namespace.createElement("div", { role: "alert" },
                            React__namespace.createElement("div", null, "Oh no"),
                            React__namespace.createElement("div", { className: "break-words" }, error.message),
                            React__namespace.createElement("button", { onClick: function () {
                                    // though you could accomplish this with a combination
                                    // of the FallbackCallback and onReset props as well.
                                    resetErrorBoundary();
                                } }, "Try again")));
                    } },
                    React__namespace.createElement(Block, __assign$3({}, blockProps)))))); }));
    });
    var HighlightInput = function (props) {
        var _a = useBlockInputStore(function (state) { return [state.selected, state.setSelectedInput, state.selectedInput]; }, reactFastCompare), selected = _a[0], setSelectedInput = _a[1], selectedInput = _a[2];
        console.log("HighlightInput", props, selected);
        var settings = JSON.parse(props.input.getAttribute("data-input"));
        var _b = React__namespace.useState({
            display: "none",
        }), computedStyle = _b[0], setComputedStyle = _b[1];
        var pageWrapperRef = React__namespace.useRef(null);
        var selectedRef = React__namespace.useRef(null);
        React__namespace.useEffect(function () {
            pageWrapperRef.current = document.getElementById("page-wrapper");
        }, []);
        var handleOpenSettings = function () {
            setSelectedInput(settings);
        };
        var handleCloseInput = function (e) {
            handlePrevent(e);
            setSelectedInput(null);
        };
        var isSelected = (selectedInput === null || selectedInput === void 0 ? void 0 : selectedInput.source) === (settings === null || settings === void 0 ? void 0 : settings.source);
        var prevSelected = usePrevious(selected);
        React__namespace.useEffect(function () {
            if (selected !== prevSelected) {
                setSelectedInput(null);
            }
        }, [selected, prevSelected]);
        React__namespace.useEffect(function () {
            if (selected) {
                selectedRef.current = document.querySelector("[data-block-id='" + selected + "']");
                var parentBB = selectedRef.current.getBoundingClientRect();
                var targetBB = props.input.getBoundingClientRect();
                var pageWrapperBB = pageWrapperRef.current.getBoundingClientRect();
                setComputedStyle({
                    width: targetBB.width + "px",
                    height: targetBB.height + "px",
                    top: targetBB.top - pageWrapperBB.top - 1 + "px",
                    left: targetBB.left - parentBB.left - 1 + "px",
                    userSelect: "none",
                });
            }
            else {
                setComputedStyle({
                    display: "none",
                });
            }
            return function () {
            };
        }, [selected, props.input]);
        return (React__namespace.createElement("aside", { onClick: handleOpenSettings, className: clsx("absolute border-[2px] border-purple-300 hover:border-solid", isSelected ? "border-solid" : "border-dashed"), style: __assign$3({ zIndex: 999 }, computedStyle) },
            React__namespace.createElement("section", { className: clsx("absolute top-0 left-[-2px] -translate-y-full rounded-tl rounded-tr text-white text-xs px-1 py-0.5 flex items-center group", isSelected ? "bg-purple-600" : "bg-purple-400") },
                settings.label,
                " - ",
                settings.source,
                "@",
                settings.settings,
                isSelected ? (React__namespace.createElement("button", { className: "bg-transparent border-none group hover:bg-gray-800 rounded-full h-3 inline-flex justify-center items-center ml-1", onClick: handleCloseInput },
                    React__namespace.createElement(Close, { className: "w-3 text-white", label: "Close" }))) : null)));
    };
    var withCurrentRecord = function (Component) {
        var values = reactFinalForm.useFormState().values;
        return function (props) {
            return React__namespace.createElement(Component, __assign$3({}, props, { record: values }));
        };
    };
    var handlePrevent = function (e) {
        e.preventDefault();
        e.stopPropagation();
    };
    var useCopyPasteBlocks = function () {
        var _a = useBlockInputStore(function (state) { return [
            state.blocks.find(function (block) { return block.id === state.selected; }),
            state.blocks.findIndex(function (block) { return block.id === state.selected; }),
            state.copyBlock,
        ]; }), selectedBlockProps = _a[0], selectedIndex = _a[1], copyBlock = _a[2];
        // console.log("useCopyPasteBlocks", selectedBlockProps, selectedIndex)
        var handleCopyBlock = function (e) {
            // console.log("copy pressed", selectedBlockProps)
            if (!selectedBlockProps) {
                return;
            }
            handlePrevent(e);
            // console.log(
            //     "copy block",
            //     selectedBlockProps.type,
            //     selectedBlockProps._$settings
            // )
            var copyPayload = JSON.stringify({
                action: "COPY_BLOCK",
                payload: selectedBlockProps,
            });
            if ("clipboard" in navigator) {
                navigator.clipboard.writeText(copyPayload);
            }
        };
        var handlePasteBlock = function (e) {
            handlePrevent(e);
            if ("clipboard" in navigator) {
                var pasteIndex_1 = Math.max(selectedIndex, 0);
                navigator.clipboard.readText().then(function (value) {
                    var _a;
                    // console.log("value", value)
                    try {
                        var clipboard = JSON.parse(value);
                        // console.log("clipboard", clipboard)
                        if ((clipboard === null || clipboard === void 0 ? void 0 : clipboard.action) === "COPY_BLOCK" &&
                            typeof ((_a = clipboard === null || clipboard === void 0 ? void 0 : clipboard.payload) === null || _a === void 0 ? void 0 : _a.type) === "string") {
                            // console.log(
                            //     "copyBlock",
                            //     clipboard?.payload?.type,
                            //     "to index",
                            //     pasteIndex
                            // )
                            copyBlock(clipboard.payload, pasteIndex_1);
                        }
                    }
                    catch (e) {
                        console.error("invalid paste payload", e);
                    }
                });
            }
        };
        useHotkeys("ctrl+c, command+c", handleCopyBlock, {}, [selectedBlockProps]);
        useHotkeys("ctrl+v, command+v", handlePasteBlock, {}, [selectedIndex]);
        return null;
    };
    var SelectedHighlightNode = function (props) {
        var _a;
        var _b = useBlockInputStore(function (state) { return [state.selected, state.value, state.tools, state.setSelected]; }, reactFastCompare), selected = _b[0]; _b[1]; var tools = _b[2], setSelected = _b[3];
        var _c = React__namespace.useState(""), blockType = _c[0], setBlockType = _c[1];
        var _d = React__namespace.useState([]), selectedInputs = _d[0], setSelectedInputs = _d[1];
        var _e = React__namespace.useState({}), computedStyle = _e[0], setComputedStyle = _e[1];
        var pageRef = React__namespace.useRef(null);
        var blockRef = React__namespace.useRef(null);
        var handleClose = function (e) {
            handlePrevent(e);
            setSelected(null);
        };
        React__namespace.useLayoutEffect(function () {
            pageRef.current = document.getElementById("page-wrapper");
            blockRef.current = document.querySelector("[data-block-id='" + selected + "']");
        }, [selected]);
        var pageWatchBB = useBoundingBox(document.getElementById("page-wrapper"));
        var blocWatchkBB = useBoundingBox(document.querySelector("[data-block-id='" + selected + "']"));
        console.log("SelectedBlock", pageWatchBB, blocWatchkBB);
        React__namespace.useEffect(function () {
            if (selected &&
                pageWatchBB &&
                blocWatchkBB &&
                blockRef.current &&
                pageRef.current) {
                var blockType_1 = blockRef.current.getAttribute("data-block-type");
                setBlockType(blockType_1);
                setSelectedInputs(Array.from(blockRef.current.querySelectorAll("[data-input]")));
                var pageBB = pageRef.current.getBoundingClientRect();
                var blockBB = blockRef.current.getBoundingClientRect();
                setComputedStyle({
                    width: blockBB.width + "px",
                    height: blockBB.height + "px",
                    top: blockBB.top - pageBB.top - 1 + "px",
                    left: blockBB.left - pageBB.left - 1 + "px",
                    userSelect: "none",
                });
            }
            else {
                setComputedStyle({
                    display: "none",
                });
            }
        }, [selected, pageWatchBB, blocWatchkBB]);
        var tool = tools.find(function (tool) { return tool.type === blockType; });
        // console.log("selectedInputs", selectedInputs)
        return (React__namespace.createElement(React__namespace.Fragment, null,
            React__namespace.createElement("aside", { className: "absolute border-[2px] border-yellow-300 pointer-events-none", style: __assign$3({ zIndex: 999 }, computedStyle) },
                React__namespace.createElement("section", { className: "absolute top-0 left-[-2px] -translate-y-full bg-yellow-300 rounded-tl rounded-tr text-xs px-1 py-0.5 flex items-center pointer-events-auto" }, (_a = tool === null || tool === void 0 ? void 0 : tool.title) !== null && _a !== void 0 ? _a : tool === null || tool === void 0 ? void 0 : tool.type,
                    React__namespace.createElement("button", { className: "bg-transparent border-none group hover:bg-gray-800 rounded-full h-3 inline-flex justify-center items-center ml-1", onClick: handleClose },
                        React__namespace.createElement(Close, { className: "w-3 text-black group-hover:text-white", label: "Close" })))),
            selectedInputs.map(function (input) {
                return React__namespace.createElement(HighlightInput, { input: input });
            })));
    };
    var HoverHighlightNode = function (props) {
        var _a;
        var tools = useBlockInputStore(function (state) { return [state.tools]; }, reactFastCompare)[0];
        var _b = React__namespace.useState({}), computedStyle = _b[0], setComputedStyle = _b[1];
        var _c = React__namespace.useState(""), blockType = _c[0], setBlockType = _c[1];
        var pageWrapperRef = React__namespace.useRef(null);
        var handleMouseMove = useThrottle(function (e) {
            var blockType = e.target.getAttribute("data-block-type");
            if (blockType) {
                setBlockType(blockType);
                var targetBB = e.target.getBoundingClientRect();
                var pageWrapperBB = pageWrapperRef.current.getBoundingClientRect();
                //   console.log("move", {
                //     blockType,
                //     e,
                //     targetBB,
                //   })
                setComputedStyle({
                    width: targetBB.width + "px",
                    height: targetBB.height + "px",
                    top: targetBB.top - pageWrapperBB.top - 1 + "px",
                    left: targetBB.left - pageWrapperBB.left - 1 + "px",
                    transition: "all 100ms",
                    userSelect: "none",
                });
            }
            else {
                setComputedStyle({ display: "none" });
            }
        }, 300);
        React__namespace.useEffect(function () {
            pageWrapperRef.current = document.getElementById("page-wrapper");
            pageWrapperRef.current.addEventListener("mousemove", handleMouseMove);
            return function () {
                pageWrapperRef.current.removeEventListener("mousemove", handleMouseMove);
            };
        }, []);
        var tool = tools.find(function (tool) { return tool.type === blockType; });
        return (React__namespace.createElement("aside", { className: "absolute border-[2px] border-yellow-300 border-dashed pointer-events-none", style: __assign$3({ zIndex: 999 }, computedStyle) },
            React__namespace.createElement("section", { className: "absolute top-0 left-[-2px] -translate-y-full bg-yellow-300 rounded-tl rounded-tr text-xs px-1 py-0.5 flex items-center" }, (_a = tool === null || tool === void 0 ? void 0 : tool.title) !== null && _a !== void 0 ? _a : tool === null || tool === void 0 ? void 0 : tool.type)));
    };
    var useBoundingBox = function (target) {
        var _a = React__namespace.useState(), bb = _a[0], setBB = _a[1];
        React__namespace.useLayoutEffect(function () {
            if (target === null || target === void 0 ? void 0 : target.getBoundingClientRect) {
                setBB(target.getBoundingClientRect());
            }
            else if (target === null || target === void 0 ? void 0 : target.current) {
                setBB(target.current.getBoundingClientRect());
            }
        }, [target]);
        // Where the magic happens
        useResizeObserver(target, function (entry) {
            if (entry && entry.target) {
                setBB(entry.target.getBoundingClientRect());
            }
        });
        return bb;
    };

    var useOnScreen = function (ref) {
        var _a = React__namespace.useState(false), isIntersecting = _a[0], setIntersecting = _a[1];
        var observer = new IntersectionObserver(function (_a) {
            var entry = _a[0];
            console.log("onScreen", entry.isIntersecting);
            setIntersecting(entry.isIntersecting);
        });
        React__namespace.useEffect(function () {
            observer.observe(ref.current);
            // Remove the observer as soon as the component is unmounted
            return function () {
                observer.disconnect();
            };
        }, []);
        return isIntersecting;
    };

    var PermissionEnum;
    (function (PermissionEnum) {
        PermissionEnum["edit"] = "edit";
        PermissionEnum["compose"] = "compose";
    })(PermissionEnum || (PermissionEnum = {}));
    var BlockEditor = function (props) {
        var editorRef = React__namespace.useRef(null);
        var isVisible = useOnScreen(editorRef);
        console.log("BlockEditor isVisible", isVisible);
        return (React__namespace.createElement("main", { ref: editorRef }, isVisible ? (React__namespace.createElement(BlockEditorContext, null,
            React__namespace.createElement(BlockEditorInstance, __assign$3({}, props)))) : null));
    };
    var BlockEditorInstance = React__namespace.memo(function BlockEditorInstance(props) {
        var _a = useBlockInputStore(function (state) { return [
            state.addBlock,
            state.moveBlock,
            state.setSelected,
            state.setValue,
            state.init,
            state.setToolbarOpen,
            state.permissions,
            state.setTools,
            state.setSettings,
            state.setSelectedInput,
        ]; }, reactFastCompare), addBlock = _a[0], moveBlock = _a[1], setSelected = _a[2], setValue = _a[3], initBlocks = _a[4], setToolbarOpen = _a[5], permissions = _a[6], setTools = _a[7], setSettings = _a[8], setSelectedInput = _a[9];
        React__namespace.useEffect(function () {
            initBlocks(props.source, props.tools, props.settings, props.onChange, props.permissions);
        }, []);
        React__namespace.useEffect(function () {
            setTools(props.tools);
        }, [props.tools]);
        React__namespace.useEffect(function () {
            setSettings(props.settings);
        }, [props.settings]);
        React__namespace.useEffect(function () {
            setValue(props.value);
        }, [props.value]);
        var handleClickOutside = function () {
            setSelected(null);
            setSelectedInput(null);
            setToolbarOpen(false);
        };
        useHotkeys("esc", handleClickOutside);
        var handleDragStart = function (event) {
            setToolbarOpen(false);
        };
        var handleDragEnd = function (result) {
            console.log("result", result);
            var source = result.source, destination = result.destination;
            // dropped outside
            if (!destination) {
                return;
            }
            if ((destination === null || destination === void 0 ? void 0 : destination.droppableId) === "page") {
                if ((source === null || source === void 0 ? void 0 : source.droppableId) === "sidebar") {
                    addBlock(result.draggableId, destination.index);
                }
                if ((source === null || source === void 0 ? void 0 : source.droppableId) === "page") {
                    moveBlock(source === null || source === void 0 ? void 0 : source.index, destination === null || destination === void 0 ? void 0 : destination.index);
                }
            }
        };
        var handleAdd = function (e) {
            e.preventDefault();
            e.stopPropagation();
            setToolbarOpen(true);
        };
        // console.log("BlockEditor render")
        return (React__namespace.createElement("main", { className: "border border-gray-200 rounded relative overflow-hidden" },
            React__namespace.createElement(reactBeautifulDnd.DragDropContext, { onDragStart: handleDragStart, onDragEnd: handleDragEnd },
                React__namespace.createElement("header", { className: "w-full h-8 bg-gray-50 flex justify-start items-center px-1" }, permissions.includes("add") ? (React__namespace.createElement("button", { className: "btn btn-outline btn-xs", onClick: handleAdd }, "+ P\u0159idat blok")) : null),
                React__namespace.createElement(ToolsPanel, null),
                React__namespace.createElement("section", { className: "flex" },
                    React__namespace.createElement("section", { className: "bg-gray-300 flex-1 overflow-auto p-6 relative" },
                        React__namespace.createElement(PagePanel, null)),
                    React__namespace.createElement(SettingsPanel, null)))));
    }, reactFastCompare);

    exports.BlockEditor = BlockEditor;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.umd.js.map
