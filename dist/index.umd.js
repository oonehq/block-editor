(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('react-beautiful-dnd'), require('react-fast-compare'), require('react-hotkeys-hook'), require('react-error-boundary'), require('clsx'), require('react-rnd'), require('zustand'), require('immer'), require('nanoid'), require('zustand/middleware'), require('lodash/throttle'), require('@react-hook/resize-observer')) :
    typeof define === 'function' && define.amd ? define(['exports', 'react', 'react-beautiful-dnd', 'react-fast-compare', 'react-hotkeys-hook', 'react-error-boundary', 'clsx', 'react-rnd', 'zustand', 'immer', 'nanoid', 'zustand/middleware', 'lodash/throttle', '@react-hook/resize-observer'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.BlockEditor = {}, global.React, global.reactBeautifulDnd, global.isEqual, global.reactHotkeysHook, global.reactErrorBoundary, global.clsx, global.reactRnd, global.create, global.produce, global.nanoid, global.middleware, global.throttle, global.useResizeObserver));
}(this, (function (exports, React, reactBeautifulDnd, isEqual, reactHotkeysHook, reactErrorBoundary, clsx, reactRnd, create, produce, nanoid, middleware, throttle, useResizeObserver) { 'use strict';

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

    var React__namespace = /*#__PURE__*/_interopNamespace(React);
    var isEqual__default = /*#__PURE__*/_interopDefaultLegacy(isEqual);
    var clsx__default = /*#__PURE__*/_interopDefaultLegacy(clsx);
    var create__default = /*#__PURE__*/_interopDefaultLegacy(create);
    var produce__default = /*#__PURE__*/_interopDefaultLegacy(produce);
    var throttle__default = /*#__PURE__*/_interopDefaultLegacy(throttle);
    var useResizeObserver__default = /*#__PURE__*/_interopDefaultLegacy(useResizeObserver);

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
    var store$1 = function (set, get) { return (__assign(__assign({}, defaultState$1), { init: function (source, tools, settings, onChange, permissions) {
            console.log("init", tools);
            get().update(function (state) {
                if (source) {
                    state.source = source;
                }
                if (tools) {
                    state.tools = Array.isArray(tools) ? tools : Object.values(tools);
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
        }, setTools: function (tools) {
            get().update(function (state) {
                if (tools) {
                    state.tools = Array.isArray(tools) ? tools : Object.values(tools);
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
                    id: nanoid.nanoid(),
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
                    id: nanoid.nanoid(),
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
        }, update: function (fn) { return set(produce__default['default'](fn)); } })); };
    create__default['default'](store$1);
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
        var useStore = React__namespace.useState(function () { return create__default['default'](blockEditorStore); })[0];
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

    var defaultState = {
        fixedSettingsPanel: false,
    };
    var store = function (set, get) { return (__assign(__assign({}, defaultState), { setFixedSettingsPanel: function (value) {
            get().update(function (state) {
                state.fixedSettingsPanel = value;
            });
        }, update: function (fn) { return set(produce__default['default'](fn)); } })); };
    var useBlockEditorStore = create__default['default'](middleware.persist(store, {
        name: "blockEditorStore",
        version: 1,
    }));

    process.env.NODE_ENV !== "production";
    var SettingsPanel = React__namespace.memo(function SettingsPanel(props) {
        var _a, _b;
        var _c = useBlockEditorStore(function (state) { return [state.fixedSettingsPanel, state.setFixedSettingsPanel]; }), fixedSettingsPanel = _c[0], setFixedSettingsPanel = _c[1];
        // source is same as in react-admin = path to section of record/object that is edited
        var blockMeta = useBlockInputStore(function (state) {
            var _a, _b;
            var block = state.blocks.find(function (block) { return block.id === state.selected; });
            if (block) {
                var tool = state.tools.find(function (tool) { return tool.type === block.type; });
                var blockIndex = state.blocks.findIndex(function (block) { return block.id == state.selected; });
                return {
                    id: block.id,
                    type: block.type,
                    version: block.version,
                    title: tool.title,
                    source: state.source + "[" + blockIndex + "]._$settings",
                    Settings: (_b = (_a = state === null || state === void 0 ? void 0 : state.tools) === null || _a === void 0 ? void 0 : _a.find(function (tool) { return tool.type === block.type; })) === null || _b === void 0 ? void 0 : _b.Settings,
                };
            }
            return null;
        }, isEqual__default['default']);
        var settingsMeta = useBlockInputStore(function (state) {
            if (state.selectedInput) {
                var settings_1 = state.settings.find(function (sett) { return sett.type == state.selectedInput.settings; });
                return __assign(__assign({}, settings_1), { props: __assign(__assign({}, state.selectedInput), { source: "" + (state.selectedInput.source[0] === "." ? blockMeta.source : "") + state.selectedInput.source }) });
            }
            return null;
        }, isEqual__default['default']);
        var _d = useBlockInputStore(function (state) { return [
            state.setSelected,
            state.tools,
            state.setSelectedInput,
            state.settings,
        ]; }, isEqual__default['default']), setSelected = _d[0]; _d[1]; var setSelectedInput = _d[2]; _d[3];
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
        console.log("SettingsPanel render", blockMeta, settingsMeta);
        return (React__namespace.createElement("aside", { className: clsx__default['default']("bg-gray-50 flex-0 p-2 overflow-auto max-h-[80vh]", fixedSettingsPanel ? "w-[340px] xl:w-[400px]" : "w-0") },
            settingsMeta ? (React__namespace.createElement(SettingsWrapper, { id: (blockMeta === null || blockMeta === void 0 ? void 0 : blockMeta.id) + "/" + settingsMeta.props.source, height: "auto" },
                React__namespace.createElement("header", { className: "text-white bg-purple-600 cursor-move dragHandle p-1 pl-2 flex-none h-8 flex items-center justify-between" },
                    React__namespace.createElement("section", { className: "truncate" }, (_a = settingsMeta.props.label) !== null && _a !== void 0 ? _a : settingsMeta.props.source),
                    React__namespace.createElement("aside", { className: "flex items-center justify-center" },
                        React__namespace.createElement("button", { className: "btn btn-xs bg-transparent border-none", onClick: handleToggleFixedSidebar },
                            React__namespace.createElement(ChevronDown, { className: clsx__default['default']("w-4 text-white transform", fixedSettingsPanel ? "rotate-90" : "-rotate-90"), label: "Move to sidebar" })),
                        React__namespace.createElement("button", { className: "btn btn-xs bg-transparent border-none", onClick: handleCloseInput },
                            React__namespace.createElement(Close, { className: "w-4 text-white", label: "Close" })))),
                React__namespace.createElement("section", { className: "overflow-auto p-2 h-[calc(100%-2rem)] bg-gray-50" },
                    React__namespace.createElement(settingsMeta.Component, __assign({}, settingsMeta.props))))) : null,
            blockMeta && blockMeta.Settings ? (React__namespace.createElement(SettingsWrapper, { id: blockMeta.id },
                React__namespace.createElement("header", { className: "text-white bg-yellow-500 cursor-move dragHandle p-1 pl-2 flex-none h-8 flex items-center justify-between" },
                    React__namespace.createElement("section", { className: "truncate" }, (_b = blockMeta.title) !== null && _b !== void 0 ? _b : "Nastavení stránky"),
                    React__namespace.createElement("aside", { className: "flex items-center justify-center" },
                        React__namespace.createElement("button", { className: "btn btn-xs bg-transparent border-none", onClick: handleToggleFixedSidebar },
                            React__namespace.createElement(ChevronDown, { className: clsx__default['default']("w-4 text-white transform", fixedSettingsPanel ? "rotate-90" : "-rotate-90"), label: "Move to sidebar" })),
                        React__namespace.createElement("button", { className: "btn btn-xs bg-transparent border-none", onClick: handleClose },
                            React__namespace.createElement(Close, { className: "w-4 text-white", label: "Close" })))),
                React__namespace.createElement("section", { className: "overflow-auto p-2 h-[calc(100%-2rem)] bg-gray-50" },
                    React__namespace.createElement(reactErrorBoundary.ErrorBoundary, { fallbackRender: function (_a) {
                            var error = _a.error, resetErrorBoundary = _a.resetErrorBoundary;
                            return (React__namespace.createElement("div", { role: "alert" },
                                React__namespace.createElement("div", null, "Oh no"),
                                React__namespace.createElement("div", null, error.message),
                                React__namespace.createElement("button", { className: "btn", onClick: function () {
                                        resetErrorBoundary();
                                    } }, "Try again")));
                        } }, blockMeta ? React__namespace.createElement(LazySettings, { blockMeta: blockMeta }) : null)))) : null));
    }, isEqual__default['default']);
    var SettingsWrapper = React__namespace.memo(function (props) {
        var _a;
        var fixedSettingsPanel = useBlockEditorStore(function (state) { return [
            state.fixedSettingsPanel,
        ]; })[0];
        if (fixedSettingsPanel) {
            return React__namespace.createElement(React__namespace.Fragment, null, props.children);
        }
        return (React__namespace.createElement(reactRnd.Rnd, { key: props.id, className: "flex flex-col border border-gray-300 rounded shadow-lg bg-white z-[99999] overflow-hidden", enableUserSelectHack: false, dragHandleClassName: "dragHandle", minWidth: 300, minHeight: 100, maxHeight: "60vh", maxWidth: 600, default: {
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
            return (React__namespace.createElement(React__namespace.Suspense, { fallback: React__namespace.createElement("div", null, "Loading") }, ComponentContainer ? React__namespace.createElement(ComponentContainer, __assign({}, props)) : null));
        };
    };
    var LazySettings = React__namespace.memo(function LazySettings(props) {
        var Settings = React__namespace.useMemo(function () { var _a; return LazyloadComponent((_a = props.blockMeta) === null || _a === void 0 ? void 0 : _a.Settings); }, [props.blockMeta.id]);
        // console.log("LazySettings render", props.blockMeta, Settings)
        if (props.blockMeta && Settings) {
            return (React__namespace.createElement(Settings, { blockID: props.blockMeta.id, source: props.blockMeta.source, getSource: function (scopedSource) {
                    return props.blockMeta.source + "." + scopedSource;
                } }));
        }
        return null;
    }, isEqual__default['default']);

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
        var _a = useBlockInputStore(function (state) { return [state.toolbarOpen, state.tools]; }, isEqual__default['default']), toolbarOpen = _a[0], tools = _a[1];
        return (React__namespace.createElement("aside", { className: clsx__default['default']("top-0 w-48 bg-gray-100 py-2 absolute h-full overflow-auto ease-in-out transition-all duration-300 z-[99999]", toolbarOpen ? "left-0" : "-left-48") },
            React__namespace.createElement("header", { className: "text-center text-sm group-hover:underline" }, "Bloky"),
            React__namespace.createElement(ToolsListWithFilter, { tools: tools })));
    });
    var ToolsListWithFilter = function (props) {
        var _a = React__namespace.useState(""), selectedTag = _a[0], setSelectedTag = _a[1];
        return (React__namespace.createElement("section", null,
            React__namespace.createElement(TagFilter, { tools: props.tools, selectedTag: selectedTag, setSelectedTag: setSelectedTag }),
            React__namespace.createElement(reactBeautifulDnd.Droppable, { droppableId: "sidebar" }, function (provided, snapshot) { return (React__namespace.createElement("section", __assign({ ref: provided.innerRef }, provided.droppableProps), props.tools
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
                return (React__namespace.createElement("article", __assign({ className: "bg-white shadow-xl rounded p-1", ref: provided.innerRef }, provided.draggableProps, provided.dragHandleProps),
                    React__namespace.createElement("header", { className: "text-center text-sm" }, (_b = (_a = props.block) === null || _a === void 0 ? void 0 : _a.title) !== null && _b !== void 0 ? _b : props.block.type),
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
        return (React__namespace.createElement("button", { onClick: handleClick, "data-tag": props.tag, className: clsx__default['default']("btn btn-xs h-auto m-0.5 inline-flex flex-nowrap items-center flex-shrink", props.selected ? "" : "btn-outline") },
            props.selected ? (React__namespace.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", className: "inline-block w-3 h-3 mr-1 stroke-current" },
                React__namespace.createElement("path", { "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "M6 18L18 6M6 6l12 12" }))) : null,
            React__namespace.createElement("span", { className: "overflow-ellipsis" }, props.tag)));
    };

    var useThrottle = function (cb, delay) {
        var options = { leading: true, trailing: true }; // add custom lodash options
        var cbRef = React__namespace.useRef(cb);
        // use mutable ref to make useCallback/throttle not depend on `cb` dep
        React__namespace.useEffect(function () {
            cbRef.current = cb;
        });
        return React__namespace.useCallback(throttle__default['default'](function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return cbRef.current.apply(cbRef, args);
        }, delay, options), [delay]);
    };

    var usePrevious = function (value) {
        var ref = React.useRef();
        React.useEffect(function () {
            ref.current = value;
        }, [value]);
        return ref.current;
    };

    var PagePanel = React__namespace.memo(function PagePanel(props) {
        var blocks = useBlockInputStore(function (state) {
            return state.blocks.map(function (block) { return ({
                id: block.id,
                type: block.type,
                version: block.version,
            }); });
        }, isEqual__default['default']);
        useCopyPasteBlocks();
        console.log("PagePanel render", blocks);
        return (React__namespace.createElement(reactBeautifulDnd.Droppable, { droppableId: "page" }, function (provided, snapshot) { return (React__namespace.createElement("section", __assign({ id: "page-wrapper" }, provided.droppableProps, { ref: provided.innerRef, className: clsx__default['default']("relative min-h-[150px] w-full border border-gray-200 bg-white") }), blocks === null || blocks === void 0 ? void 0 :
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
            state.blocks.find(function (block) { return block.id === props.block.id; }),
        ]; }, isEqual__default['default']), setSelected = _c[0], isSelected = _c[1], deleteBlock = _c[2], moveBlock = _c[3], blocksCount = _c[4], tools = _c[5], setToolbarOpen = _c[6], permissions = _c[7], currentBlock = _c[8];
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
        // const { values } = useFormState()
        var blockProps = __assign({}, currentBlock);
        console.log("PageBlock render", props.index, blockProps);
        return (React__namespace.createElement(reactBeautifulDnd.Draggable, { draggableId: props.block.id, index: props.index }, function (provided, snapshot) { return (React__namespace.createElement("section", __assign({ ref: provided.innerRef }, provided.draggableProps, { className: clsx__default['default']("relative"), onClick: handleClick, "data-block-type": props.block.type, "data-block-id": props.block.id }),
            permissions.includes("compose") ? (React__namespace.createElement("aside", { className: clsx__default['default']("absolute -top-3 right-1 z-[9999]", isSelected ? "block" : "hidden") },
                React__namespace.createElement("section", { className: "btn-group" },
                    React__namespace.createElement("button", { className: "btn btn-xs", onClick: handleMoveUp },
                        React__namespace.createElement(ChevronUp, { className: "w-4", label: "Move up" })),
                    React__namespace.createElement("button", { className: "btn btn-xs", onClick: handleMoveDown },
                        React__namespace.createElement(ChevronDown, { className: "w-4", label: "Move up" })),
                    React__namespace.createElement("div", __assign({ className: "btn btn-xs" }, provided.dragHandleProps),
                        React__namespace.createElement(Move, { className: "w-4", label: "Move up" })),
                    React__namespace.createElement("button", { className: "btn btn-xs", onClick: handleDelete },
                        React__namespace.createElement(Trash, { className: "w-4", label: "Move up" }))))) : null,
            React__namespace.createElement("div", { className: "pointer-events-none" },
                React__namespace.createElement(reactErrorBoundary.ErrorBoundary, { FallbackComponent: function (_a) {
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
                    React__namespace.createElement(Block, __assign({}, blockProps)))))); }));
    });
    var HighlightInput = function (props) {
        var _a = useBlockInputStore(function (state) { return [state.selected, state.setSelectedInput, state.selectedInput]; }, isEqual__default['default']), selected = _a[0], setSelectedInput = _a[1], selectedInput = _a[2];
        // console.log("HighlightInput", props, selected)
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
        return (React__namespace.createElement("aside", { onClick: handleOpenSettings, className: clsx__default['default']("absolute border-[2px] border-purple-300 hover:border-solid", isSelected ? "border-solid" : "border-dashed"), style: __assign({ zIndex: 999 }, computedStyle) },
            React__namespace.createElement("section", { className: clsx__default['default']("absolute top-0 left-[-2px] -translate-y-full rounded-tl rounded-tr text-white text-xs px-1 py-0.5 flex items-center group", isSelected ? "bg-purple-600" : "bg-purple-400") },
                settings.label,
                " - ",
                settings.source,
                "@",
                settings.settings,
                isSelected ? (React__namespace.createElement("button", { className: "bg-transparent border-none group hover:bg-gray-800 rounded-full h-3 inline-flex justify-center items-center ml-1", onClick: handleCloseInput },
                    React__namespace.createElement(Close, { className: "w-3 text-white", label: "Close" }))) : null)));
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
        reactHotkeysHook.useHotkeys("ctrl+c, command+c", handleCopyBlock, {}, [selectedBlockProps]);
        reactHotkeysHook.useHotkeys("ctrl+v, command+v", handlePasteBlock, {}, [selectedIndex]);
        return null;
    };
    var SelectedHighlightNode = function (props) {
        var _a;
        var _b = useBlockInputStore(function (state) { return [state.selected, state.value, state.tools, state.setSelected]; }, isEqual__default['default']), selected = _b[0]; _b[1]; var tools = _b[2], setSelected = _b[3];
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
        // console.log("SelectedBlock", pageWatchBB, blocWatchkBB)
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
            React__namespace.createElement("aside", { className: "absolute border-[2px] border-yellow-300 pointer-events-none", style: __assign({ zIndex: 999 }, computedStyle) },
                React__namespace.createElement("section", { className: "absolute top-0 left-[-2px] -translate-y-full bg-yellow-300 rounded-tl rounded-tr text-xs px-1 py-0.5 flex items-center pointer-events-auto" }, (_a = tool === null || tool === void 0 ? void 0 : tool.title) !== null && _a !== void 0 ? _a : tool === null || tool === void 0 ? void 0 : tool.type,
                    React__namespace.createElement("button", { className: "bg-transparent border-none group hover:bg-gray-800 rounded-full h-3 inline-flex justify-center items-center ml-1", onClick: handleClose },
                        React__namespace.createElement(Close, { className: "w-3 text-black group-hover:text-white", label: "Close" })))),
            selectedInputs.map(function (input) {
                return React__namespace.createElement(HighlightInput, { input: input });
            })));
    };
    var HoverHighlightNode = function (props) {
        var _a;
        var tools = useBlockInputStore(function (state) { return [state.tools]; }, isEqual__default['default'])[0];
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
        return (React__namespace.createElement("aside", { className: "absolute border-[2px] border-yellow-300 border-dashed pointer-events-none", style: __assign({ zIndex: 999 }, computedStyle) },
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
        useResizeObserver__default['default'](target, function (entry) {
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
            React__namespace.createElement(BlockEditorInstance, __assign({}, props)))) : null));
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
        ]; }, isEqual__default['default']), addBlock = _a[0], moveBlock = _a[1], setSelected = _a[2], setValue = _a[3], initBlocks = _a[4], setToolbarOpen = _a[5], permissions = _a[6], setTools = _a[7], setSettings = _a[8], setSelectedInput = _a[9];
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
        reactHotkeysHook.useHotkeys("esc", handleClickOutside);
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
    }, isEqual__default['default']);

    exports.BlockEditor = BlockEditor;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.umd.js.map
