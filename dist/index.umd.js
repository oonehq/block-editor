(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('react-beautiful-dnd'), require('react-fast-compare'), require('react-hotkeys-hook'), require('react-error-boundary'), require('clsx'), require('react-rnd'), require('zustand'), require('immer'), require('nanoid'), require('zustand/middleware'), require('react-final-form'), require('@react-hook/resize-observer')) :
    typeof define === 'function' && define.amd ? define(['exports', 'react', 'react-beautiful-dnd', 'react-fast-compare', 'react-hotkeys-hook', 'react-error-boundary', 'clsx', 'react-rnd', 'zustand', 'immer', 'nanoid', 'zustand/middleware', 'react-final-form', '@react-hook/resize-observer'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.BlockEditor = {}, global.React, global.reactBeautifulDnd, global.isEqual, global.reactHotkeysHook, global.reactErrorBoundary, global.clsx, global.reactRnd, global.create, global.produce, global.nanoid, global.middleware, global.reactFinalForm, global.useResizeObserver));
}(this, (function (exports, React, reactBeautifulDnd, isEqual, reactHotkeysHook, reactErrorBoundary, clsx, reactRnd, create, produce, nanoid, middleware, reactFinalForm, useResizeObserver) { 'use strict';

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
                    title: tool === null || tool === void 0 ? void 0 : tool.title,
                    source: state.source + "[" + blockIndex + "]._$settings",
                    Settings: (_b = (_a = state === null || state === void 0 ? void 0 : state.tools) === null || _a === void 0 ? void 0 : _a.find(function (tool) { return (tool === null || tool === void 0 ? void 0 : tool.type) === block.type; })) === null || _b === void 0 ? void 0 : _b.Settings,
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
        var _a, _b, _c, _d;
        var fixedSettingsPanel = useBlockEditorStore(function (state) { return [
            state.fixedSettingsPanel,
        ]; })[0];
        if (fixedSettingsPanel) {
            return React__namespace.createElement(React__namespace.Fragment, null, props.children);
        }
        var windowH = window.innerHeight;
        var topScroll = window.scrollY;
        var editorViewportTop = (_c = (_b = (_a = document.getElementById("page-wrapper")) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect()) === null || _b === void 0 ? void 0 : _b.top) !== null && _c !== void 0 ? _c : 0;
        var editorTopPos = editorViewportTop + topScroll;
        var y = Math.max(50, windowH * 0.25 + topScroll - editorTopPos);
        console.log("posY", {
            y: y,
            editorTopPos: editorTopPos,
            topScroll: topScroll,
            editorViewportTop: editorViewportTop,
            windowH: windowH,
        });
        return (React__namespace.createElement(reactRnd.Rnd, { key: props.id, className: "flex flex-col border border-gray-300 rounded shadow-lg bg-white z-[99999] overflow-hidden", enableUserSelectHack: false, dragHandleClassName: "dragHandle", minWidth: 300, minHeight: 100, maxHeight: "60vh", maxWidth: 600, default: {
                x: -480,
                y: y,
                width: 400,
                height: (_d = props.height) !== null && _d !== void 0 ? _d : "50vh",
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

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

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

    function isObject$9(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    var isObject_1 = isObject$9;

    /** Detect free variable `global` from Node.js. */

    var freeGlobal$1 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

    var _freeGlobal = freeGlobal$1;

    var freeGlobal = _freeGlobal;

    /** Detect free variable `self`. */
    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root$9 = freeGlobal || freeSelf || Function('return this')();

    var _root = root$9;

    var root$8 = _root;

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
      return root$8.Date.now();
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

    var root$7 = _root;

    /** Built-in value references. */
    var Symbol$4 = root$7.Symbol;

    var _Symbol = Symbol$4;

    var Symbol$3 = _Symbol;

    /** Used for built-in method references. */
    var objectProto$c = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$9 = objectProto$c.hasOwnProperty;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString$1 = objectProto$c.toString;

    /** Built-in value references. */
    var symToStringTag$1 = Symbol$3 ? Symbol$3.toStringTag : undefined;

    /**
     * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the raw `toStringTag`.
     */
    function getRawTag$1(value) {
      var isOwn = hasOwnProperty$9.call(value, symToStringTag$1),
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

    var objectProto$b = Object.prototype;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString = objectProto$b.toString;

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

    var Symbol$2 = _Symbol,
        getRawTag = _getRawTag,
        objectToString = _objectToString;

    /** `Object#toString` result references. */
    var nullTag = '[object Null]',
        undefinedTag = '[object Undefined]';

    /** Built-in value references. */
    var symToStringTag = Symbol$2 ? Symbol$2.toStringTag : undefined;

    /**
     * The base implementation of `getTag` without fallbacks for buggy environments.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function baseGetTag$5(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      return (symToStringTag && symToStringTag in Object(value))
        ? getRawTag(value)
        : objectToString(value);
    }

    var _baseGetTag = baseGetTag$5;

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

    function isObjectLike$6(value) {
      return value != null && typeof value == 'object';
    }

    var isObjectLike_1 = isObjectLike$6;

    var baseGetTag$4 = _baseGetTag,
        isObjectLike$5 = isObjectLike_1;

    /** `Object#toString` result references. */
    var symbolTag$2 = '[object Symbol]';

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
    function isSymbol$4(value) {
      return typeof value == 'symbol' ||
        (isObjectLike$5(value) && baseGetTag$4(value) == symbolTag$2);
    }

    var isSymbol_1 = isSymbol$4;

    var baseTrim = _baseTrim,
        isObject$8 = isObject_1,
        isSymbol$3 = isSymbol_1;

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
      if (isSymbol$3(value)) {
        return NAN;
      }
      if (isObject$8(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = isObject$8(other) ? (other + '') : other;
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

    var isObject$7 = isObject_1,
        now = now_1,
        toNumber = toNumber_1;

    /** Error message constants. */
    var FUNC_ERROR_TEXT$2 = 'Expected a function';

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
        throw new TypeError(FUNC_ERROR_TEXT$2);
      }
      wait = toNumber(wait) || 0;
      if (isObject$7(options)) {
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
        isObject$6 = isObject_1;

    /** Error message constants. */
    var FUNC_ERROR_TEXT$1 = 'Expected a function';

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
        throw new TypeError(FUNC_ERROR_TEXT$1);
      }
      if (isObject$6(options)) {
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

    var flat = flatten;
    flatten.flatten = flatten;
    flatten.unflatten = unflatten;

    function isBuffer$3 (obj) {
      return obj &&
        obj.constructor &&
        (typeof obj.constructor.isBuffer === 'function') &&
        obj.constructor.isBuffer(obj)
    }

    function keyIdentity (key) {
      return key
    }

    function flatten (target, opts) {
      opts = opts || {};

      const delimiter = opts.delimiter || '.';
      const maxDepth = opts.maxDepth;
      const transformKey = opts.transformKey || keyIdentity;
      const output = {};

      function step (object, prev, currentDepth) {
        currentDepth = currentDepth || 1;
        Object.keys(object).forEach(function (key) {
          const value = object[key];
          const isarray = opts.safe && Array.isArray(value);
          const type = Object.prototype.toString.call(value);
          const isbuffer = isBuffer$3(value);
          const isobject = (
            type === '[object Object]' ||
            type === '[object Array]'
          );

          const newKey = prev
            ? prev + delimiter + transformKey(key)
            : transformKey(key);

          if (!isarray && !isbuffer && isobject && Object.keys(value).length &&
            (!opts.maxDepth || currentDepth < maxDepth)) {
            return step(value, newKey, currentDepth + 1)
          }

          output[newKey] = value;
        });
      }

      step(target);

      return output
    }

    function unflatten (target, opts) {
      opts = opts || {};

      const delimiter = opts.delimiter || '.';
      const overwrite = opts.overwrite || false;
      const transformKey = opts.transformKey || keyIdentity;
      const result = {};

      const isbuffer = isBuffer$3(target);
      if (isbuffer || Object.prototype.toString.call(target) !== '[object Object]') {
        return target
      }

      // safely ensure that the key is
      // an integer.
      function getkey (key) {
        const parsedKey = Number(key);

        return (
          isNaN(parsedKey) ||
          key.indexOf('.') !== -1 ||
          opts.object
        ) ? key
          : parsedKey
      }

      function addKeys (keyPrefix, recipient, target) {
        return Object.keys(target).reduce(function (result, key) {
          result[keyPrefix + delimiter + key] = target[key];

          return result
        }, recipient)
      }

      function isEmpty (val) {
        const type = Object.prototype.toString.call(val);
        const isArray = type === '[object Array]';
        const isObject = type === '[object Object]';

        if (!val) {
          return true
        } else if (isArray) {
          return !val.length
        } else if (isObject) {
          return !Object.keys(val).length
        }
      }

      target = Object.keys(target).reduce(function (result, key) {
        const type = Object.prototype.toString.call(target[key]);
        const isObject = (type === '[object Object]' || type === '[object Array]');
        if (!isObject || isEmpty(target[key])) {
          result[key] = target[key];
          return result
        } else {
          return addKeys(
            key,
            result,
            flatten(target[key], opts)
          )
        }
      }, {});

      Object.keys(target).forEach(function (key) {
        const split = key.split(delimiter).map(transformKey);
        let key1 = getkey(split.shift());
        let key2 = getkey(split[0]);
        let recipient = result;

        while (key2 !== undefined) {
          if (key1 === '__proto__') {
            return
          }

          const type = Object.prototype.toString.call(recipient[key1]);
          const isobject = (
            type === '[object Object]' ||
            type === '[object Array]'
          );

          // do not write over falsey, non-undefined values if overwrite is false
          if (!overwrite && !isobject && typeof recipient[key1] !== 'undefined') {
            return
          }

          if ((overwrite && !isobject) || (!overwrite && recipient[key1] == null)) {
            recipient[key1] = (
              typeof key2 === 'number' &&
              !opts.object ? [] : {}
            );
          }

          recipient = recipient[key1];
          if (split.length > 0) {
            key1 = getkey(split.shift());
            key2 = getkey(split[0]);
          }
        }

        // unflatten again for 'messy objects'
        recipient[key1] = unflatten(target[key], opts);
      });

      return result
    }

    /**
     * Removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberOf ListCache
     */

    function listCacheClear$1() {
      this.__data__ = [];
      this.size = 0;
    }

    var _listCacheClear = listCacheClear$1;

    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */

    function eq$2(value, other) {
      return value === other || (value !== value && other !== other);
    }

    var eq_1 = eq$2;

    var eq$1 = eq_1;

    /**
     * Gets the index at which the `key` is found in `array` of key-value pairs.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function assocIndexOf$4(array, key) {
      var length = array.length;
      while (length--) {
        if (eq$1(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    var _assocIndexOf = assocIndexOf$4;

    var assocIndexOf$3 = _assocIndexOf;

    /** Used for built-in method references. */
    var arrayProto = Array.prototype;

    /** Built-in value references. */
    var splice = arrayProto.splice;

    /**
     * Removes `key` and its value from the list cache.
     *
     * @private
     * @name delete
     * @memberOf ListCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function listCacheDelete$1(key) {
      var data = this.__data__,
          index = assocIndexOf$3(data, key);

      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }

    var _listCacheDelete = listCacheDelete$1;

    var assocIndexOf$2 = _assocIndexOf;

    /**
     * Gets the list cache value for `key`.
     *
     * @private
     * @name get
     * @memberOf ListCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function listCacheGet$1(key) {
      var data = this.__data__,
          index = assocIndexOf$2(data, key);

      return index < 0 ? undefined : data[index][1];
    }

    var _listCacheGet = listCacheGet$1;

    var assocIndexOf$1 = _assocIndexOf;

    /**
     * Checks if a list cache value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf ListCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function listCacheHas$1(key) {
      return assocIndexOf$1(this.__data__, key) > -1;
    }

    var _listCacheHas = listCacheHas$1;

    var assocIndexOf = _assocIndexOf;

    /**
     * Sets the list cache `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf ListCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the list cache instance.
     */
    function listCacheSet$1(key, value) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }

    var _listCacheSet = listCacheSet$1;

    var listCacheClear = _listCacheClear,
        listCacheDelete = _listCacheDelete,
        listCacheGet = _listCacheGet,
        listCacheHas = _listCacheHas,
        listCacheSet = _listCacheSet;

    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function ListCache$4(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    // Add methods to `ListCache`.
    ListCache$4.prototype.clear = listCacheClear;
    ListCache$4.prototype['delete'] = listCacheDelete;
    ListCache$4.prototype.get = listCacheGet;
    ListCache$4.prototype.has = listCacheHas;
    ListCache$4.prototype.set = listCacheSet;

    var _ListCache = ListCache$4;

    var ListCache$3 = _ListCache;

    /**
     * Removes all key-value entries from the stack.
     *
     * @private
     * @name clear
     * @memberOf Stack
     */
    function stackClear$1() {
      this.__data__ = new ListCache$3;
      this.size = 0;
    }

    var _stackClear = stackClear$1;

    /**
     * Removes `key` and its value from the stack.
     *
     * @private
     * @name delete
     * @memberOf Stack
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */

    function stackDelete$1(key) {
      var data = this.__data__,
          result = data['delete'](key);

      this.size = data.size;
      return result;
    }

    var _stackDelete = stackDelete$1;

    /**
     * Gets the stack value for `key`.
     *
     * @private
     * @name get
     * @memberOf Stack
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */

    function stackGet$1(key) {
      return this.__data__.get(key);
    }

    var _stackGet = stackGet$1;

    /**
     * Checks if a stack value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Stack
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */

    function stackHas$1(key) {
      return this.__data__.has(key);
    }

    var _stackHas = stackHas$1;

    var baseGetTag$3 = _baseGetTag,
        isObject$5 = isObject_1;

    /** `Object#toString` result references. */
    var asyncTag = '[object AsyncFunction]',
        funcTag$2 = '[object Function]',
        genTag$1 = '[object GeneratorFunction]',
        proxyTag = '[object Proxy]';

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction$2(value) {
      if (!isObject$5(value)) {
        return false;
      }
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 9 which returns 'object' for typed arrays and other constructors.
      var tag = baseGetTag$3(value);
      return tag == funcTag$2 || tag == genTag$1 || tag == asyncTag || tag == proxyTag;
    }

    var isFunction_1 = isFunction$2;

    var root$6 = _root;

    /** Used to detect overreaching core-js shims. */
    var coreJsData$1 = root$6['__core-js_shared__'];

    var _coreJsData = coreJsData$1;

    var coreJsData = _coreJsData;

    /** Used to detect methods masquerading as native. */
    var maskSrcKey = (function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
      return uid ? ('Symbol(src)_1.' + uid) : '';
    }());

    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */
    function isMasked$1(func) {
      return !!maskSrcKey && (maskSrcKey in func);
    }

    var _isMasked = isMasked$1;

    /** Used for built-in method references. */

    var funcProto$1 = Function.prototype;

    /** Used to resolve the decompiled source of functions. */
    var funcToString$1 = funcProto$1.toString;

    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to convert.
     * @returns {string} Returns the source code.
     */
    function toSource$2(func) {
      if (func != null) {
        try {
          return funcToString$1.call(func);
        } catch (e) {}
        try {
          return (func + '');
        } catch (e) {}
      }
      return '';
    }

    var _toSource = toSource$2;

    var isFunction$1 = isFunction_1,
        isMasked = _isMasked,
        isObject$4 = isObject_1,
        toSource$1 = _toSource;

    /**
     * Used to match `RegExp`
     * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
     */
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

    /** Used to detect host constructors (Safari). */
    var reIsHostCtor = /^\[object .+?Constructor\]$/;

    /** Used for built-in method references. */
    var funcProto = Function.prototype,
        objectProto$a = Object.prototype;

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty$8 = objectProto$a.hasOwnProperty;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      funcToString.call(hasOwnProperty$8).replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */
    function baseIsNative$1(value) {
      if (!isObject$4(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction$1(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource$1(value));
    }

    var _baseIsNative = baseIsNative$1;

    /**
     * Gets the value at `key` of `object`.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */

    function getValue$1(object, key) {
      return object == null ? undefined : object[key];
    }

    var _getValue = getValue$1;

    var baseIsNative = _baseIsNative,
        getValue = _getValue;

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative$7(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : undefined;
    }

    var _getNative = getNative$7;

    var getNative$6 = _getNative,
        root$5 = _root;

    /* Built-in method references that are verified to be native. */
    var Map$3 = getNative$6(root$5, 'Map');

    var _Map = Map$3;

    var getNative$5 = _getNative;

    /* Built-in method references that are verified to be native. */
    var nativeCreate$4 = getNative$5(Object, 'create');

    var _nativeCreate = nativeCreate$4;

    var nativeCreate$3 = _nativeCreate;

    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */
    function hashClear$1() {
      this.__data__ = nativeCreate$3 ? nativeCreate$3(null) : {};
      this.size = 0;
    }

    var _hashClear = hashClear$1;

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */

    function hashDelete$1(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }

    var _hashDelete = hashDelete$1;

    var nativeCreate$2 = _nativeCreate;

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

    /** Used for built-in method references. */
    var objectProto$9 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet$1(key) {
      var data = this.__data__;
      if (nativeCreate$2) {
        var result = data[key];
        return result === HASH_UNDEFINED$1 ? undefined : result;
      }
      return hasOwnProperty$7.call(data, key) ? data[key] : undefined;
    }

    var _hashGet = hashGet$1;

    var nativeCreate$1 = _nativeCreate;

    /** Used for built-in method references. */
    var objectProto$8 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$6 = objectProto$8.hasOwnProperty;

    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Hash
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function hashHas$1(key) {
      var data = this.__data__;
      return nativeCreate$1 ? (data[key] !== undefined) : hasOwnProperty$6.call(data, key);
    }

    var _hashHas = hashHas$1;

    var nativeCreate = _nativeCreate;

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED = '__lodash_hash_undefined__';

    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Hash
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the hash instance.
     */
    function hashSet$1(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
      return this;
    }

    var _hashSet = hashSet$1;

    var hashClear = _hashClear,
        hashDelete = _hashDelete,
        hashGet = _hashGet,
        hashHas = _hashHas,
        hashSet = _hashSet;

    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Hash$1(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    // Add methods to `Hash`.
    Hash$1.prototype.clear = hashClear;
    Hash$1.prototype['delete'] = hashDelete;
    Hash$1.prototype.get = hashGet;
    Hash$1.prototype.has = hashHas;
    Hash$1.prototype.set = hashSet;

    var _Hash = Hash$1;

    var Hash = _Hash,
        ListCache$2 = _ListCache,
        Map$2 = _Map;

    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */
    function mapCacheClear$1() {
      this.size = 0;
      this.__data__ = {
        'hash': new Hash,
        'map': new (Map$2 || ListCache$2),
        'string': new Hash
      };
    }

    var _mapCacheClear = mapCacheClear$1;

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */

    function isKeyable$1(value) {
      var type = typeof value;
      return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
        ? (value !== '__proto__')
        : (value === null);
    }

    var _isKeyable = isKeyable$1;

    var isKeyable = _isKeyable;

    /**
     * Gets the data for `map`.
     *
     * @private
     * @param {Object} map The map to query.
     * @param {string} key The reference key.
     * @returns {*} Returns the map data.
     */
    function getMapData$4(map, key) {
      var data = map.__data__;
      return isKeyable(key)
        ? data[typeof key == 'string' ? 'string' : 'hash']
        : data.map;
    }

    var _getMapData = getMapData$4;

    var getMapData$3 = _getMapData;

    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function mapCacheDelete$1(key) {
      var result = getMapData$3(this, key)['delete'](key);
      this.size -= result ? 1 : 0;
      return result;
    }

    var _mapCacheDelete = mapCacheDelete$1;

    var getMapData$2 = _getMapData;

    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function mapCacheGet$1(key) {
      return getMapData$2(this, key).get(key);
    }

    var _mapCacheGet = mapCacheGet$1;

    var getMapData$1 = _getMapData;

    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapCacheHas$1(key) {
      return getMapData$1(this, key).has(key);
    }

    var _mapCacheHas = mapCacheHas$1;

    var getMapData = _getMapData;

    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache instance.
     */
    function mapCacheSet$1(key, value) {
      var data = getMapData(this, key),
          size = data.size;

      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }

    var _mapCacheSet = mapCacheSet$1;

    var mapCacheClear = _mapCacheClear,
        mapCacheDelete = _mapCacheDelete,
        mapCacheGet = _mapCacheGet,
        mapCacheHas = _mapCacheHas,
        mapCacheSet = _mapCacheSet;

    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function MapCache$2(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    // Add methods to `MapCache`.
    MapCache$2.prototype.clear = mapCacheClear;
    MapCache$2.prototype['delete'] = mapCacheDelete;
    MapCache$2.prototype.get = mapCacheGet;
    MapCache$2.prototype.has = mapCacheHas;
    MapCache$2.prototype.set = mapCacheSet;

    var _MapCache = MapCache$2;

    var ListCache$1 = _ListCache,
        Map$1 = _Map,
        MapCache$1 = _MapCache;

    /** Used as the size to enable large array optimizations. */
    var LARGE_ARRAY_SIZE = 200;

    /**
     * Sets the stack `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Stack
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the stack cache instance.
     */
    function stackSet$1(key, value) {
      var data = this.__data__;
      if (data instanceof ListCache$1) {
        var pairs = data.__data__;
        if (!Map$1 || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new MapCache$1(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }

    var _stackSet = stackSet$1;

    var ListCache = _ListCache,
        stackClear = _stackClear,
        stackDelete = _stackDelete,
        stackGet = _stackGet,
        stackHas = _stackHas,
        stackSet = _stackSet;

    /**
     * Creates a stack cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Stack$1(entries) {
      var data = this.__data__ = new ListCache(entries);
      this.size = data.size;
    }

    // Add methods to `Stack`.
    Stack$1.prototype.clear = stackClear;
    Stack$1.prototype['delete'] = stackDelete;
    Stack$1.prototype.get = stackGet;
    Stack$1.prototype.has = stackHas;
    Stack$1.prototype.set = stackSet;

    var _Stack = Stack$1;

    /**
     * A specialized version of `_.forEach` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns `array`.
     */

    function arrayEach$1(array, iteratee) {
      var index = -1,
          length = array == null ? 0 : array.length;

      while (++index < length) {
        if (iteratee(array[index], index, array) === false) {
          break;
        }
      }
      return array;
    }

    var _arrayEach = arrayEach$1;

    var getNative$4 = _getNative;

    var defineProperty$1 = (function() {
      try {
        var func = getNative$4(Object, 'defineProperty');
        func({}, '', {});
        return func;
      } catch (e) {}
    }());

    var _defineProperty = defineProperty$1;

    var defineProperty = _defineProperty;

    /**
     * The base implementation of `assignValue` and `assignMergeValue` without
     * value checks.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function baseAssignValue$2(object, key, value) {
      if (key == '__proto__' && defineProperty) {
        defineProperty(object, key, {
          'configurable': true,
          'enumerable': true,
          'value': value,
          'writable': true
        });
      } else {
        object[key] = value;
      }
    }

    var _baseAssignValue = baseAssignValue$2;

    var baseAssignValue$1 = _baseAssignValue,
        eq = eq_1;

    /** Used for built-in method references. */
    var objectProto$7 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

    /**
     * Assigns `value` to `key` of `object` if the existing value is not equivalent
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignValue$3(object, key, value) {
      var objValue = object[key];
      if (!(hasOwnProperty$5.call(object, key) && eq(objValue, value)) ||
          (value === undefined && !(key in object))) {
        baseAssignValue$1(object, key, value);
      }
    }

    var _assignValue = assignValue$3;

    var assignValue$2 = _assignValue,
        baseAssignValue = _baseAssignValue;

    /**
     * Copies properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property identifiers to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @param {Function} [customizer] The function to customize copied values.
     * @returns {Object} Returns `object`.
     */
    function copyObject$4(source, props, object, customizer) {
      var isNew = !object;
      object || (object = {});

      var index = -1,
          length = props.length;

      while (++index < length) {
        var key = props[index];

        var newValue = customizer
          ? customizer(object[key], source[key], key, object, source)
          : undefined;

        if (newValue === undefined) {
          newValue = source[key];
        }
        if (isNew) {
          baseAssignValue(object, key, newValue);
        } else {
          assignValue$2(object, key, newValue);
        }
      }
      return object;
    }

    var _copyObject = copyObject$4;

    /**
     * The base implementation of `_.times` without support for iteratee shorthands
     * or max array length checks.
     *
     * @private
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the array of results.
     */

    function baseTimes$1(n, iteratee) {
      var index = -1,
          result = Array(n);

      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }

    var _baseTimes = baseTimes$1;

    var baseGetTag$2 = _baseGetTag,
        isObjectLike$4 = isObjectLike_1;

    /** `Object#toString` result references. */
    var argsTag$2 = '[object Arguments]';

    /**
     * The base implementation of `_.isArguments`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     */
    function baseIsArguments$1(value) {
      return isObjectLike$4(value) && baseGetTag$2(value) == argsTag$2;
    }

    var _baseIsArguments = baseIsArguments$1;

    var baseIsArguments = _baseIsArguments,
        isObjectLike$3 = isObjectLike_1;

    /** Used for built-in method references. */
    var objectProto$6 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$4 = objectProto$6.hasOwnProperty;

    /** Built-in value references. */
    var propertyIsEnumerable$1 = objectProto$6.propertyIsEnumerable;

    /**
     * Checks if `value` is likely an `arguments` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     *  else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    var isArguments$1 = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
      return isObjectLike$3(value) && hasOwnProperty$4.call(value, 'callee') &&
        !propertyIsEnumerable$1.call(value, 'callee');
    };

    var isArguments_1 = isArguments$1;

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */

    var isArray$6 = Array.isArray;

    var isArray_1 = isArray$6;

    var isBuffer$2 = {exports: {}};

    /**
     * This method returns `false`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `false`.
     * @example
     *
     * _.times(2, _.stubFalse);
     * // => [false, false]
     */

    function stubFalse() {
      return false;
    }

    var stubFalse_1 = stubFalse;

    (function (module, exports) {
    var root = _root,
        stubFalse = stubFalse_1;

    /** Detect free variable `exports`. */
    var freeExports = exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    /** Built-in value references. */
    var Buffer = moduleExports ? root.Buffer : undefined;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

    /**
     * Checks if `value` is a buffer.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isBuffer(new Buffer(2));
     * // => true
     *
     * _.isBuffer(new Uint8Array(2));
     * // => false
     */
    var isBuffer = nativeIsBuffer || stubFalse;

    module.exports = isBuffer;
    }(isBuffer$2, isBuffer$2.exports));

    /** Used as references for various `Number` constants. */

    var MAX_SAFE_INTEGER$1 = 9007199254740991;

    /** Used to detect unsigned integer values. */
    var reIsUint = /^(?:0|[1-9]\d*)$/;

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex$2(value, length) {
      var type = typeof value;
      length = length == null ? MAX_SAFE_INTEGER$1 : length;

      return !!length &&
        (type == 'number' ||
          (type != 'symbol' && reIsUint.test(value))) &&
            (value > -1 && value % 1 == 0 && value < length);
    }

    var _isIndex = isIndex$2;

    /** Used as references for various `Number` constants. */

    var MAX_SAFE_INTEGER = 9007199254740991;

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This method is loosely based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     * @example
     *
     * _.isLength(3);
     * // => true
     *
     * _.isLength(Number.MIN_VALUE);
     * // => false
     *
     * _.isLength(Infinity);
     * // => false
     *
     * _.isLength('3');
     * // => false
     */
    function isLength$2(value) {
      return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    var isLength_1 = isLength$2;

    var baseGetTag$1 = _baseGetTag,
        isLength$1 = isLength_1,
        isObjectLike$2 = isObjectLike_1;

    /** `Object#toString` result references. */
    var argsTag$1 = '[object Arguments]',
        arrayTag$1 = '[object Array]',
        boolTag$2 = '[object Boolean]',
        dateTag$2 = '[object Date]',
        errorTag$1 = '[object Error]',
        funcTag$1 = '[object Function]',
        mapTag$4 = '[object Map]',
        numberTag$2 = '[object Number]',
        objectTag$2 = '[object Object]',
        regexpTag$2 = '[object RegExp]',
        setTag$4 = '[object Set]',
        stringTag$2 = '[object String]',
        weakMapTag$2 = '[object WeakMap]';

    var arrayBufferTag$2 = '[object ArrayBuffer]',
        dataViewTag$3 = '[object DataView]',
        float32Tag$2 = '[object Float32Array]',
        float64Tag$2 = '[object Float64Array]',
        int8Tag$2 = '[object Int8Array]',
        int16Tag$2 = '[object Int16Array]',
        int32Tag$2 = '[object Int32Array]',
        uint8Tag$2 = '[object Uint8Array]',
        uint8ClampedTag$2 = '[object Uint8ClampedArray]',
        uint16Tag$2 = '[object Uint16Array]',
        uint32Tag$2 = '[object Uint32Array]';

    /** Used to identify `toStringTag` values of typed arrays. */
    var typedArrayTags = {};
    typedArrayTags[float32Tag$2] = typedArrayTags[float64Tag$2] =
    typedArrayTags[int8Tag$2] = typedArrayTags[int16Tag$2] =
    typedArrayTags[int32Tag$2] = typedArrayTags[uint8Tag$2] =
    typedArrayTags[uint8ClampedTag$2] = typedArrayTags[uint16Tag$2] =
    typedArrayTags[uint32Tag$2] = true;
    typedArrayTags[argsTag$1] = typedArrayTags[arrayTag$1] =
    typedArrayTags[arrayBufferTag$2] = typedArrayTags[boolTag$2] =
    typedArrayTags[dataViewTag$3] = typedArrayTags[dateTag$2] =
    typedArrayTags[errorTag$1] = typedArrayTags[funcTag$1] =
    typedArrayTags[mapTag$4] = typedArrayTags[numberTag$2] =
    typedArrayTags[objectTag$2] = typedArrayTags[regexpTag$2] =
    typedArrayTags[setTag$4] = typedArrayTags[stringTag$2] =
    typedArrayTags[weakMapTag$2] = false;

    /**
     * The base implementation of `_.isTypedArray` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     */
    function baseIsTypedArray$1(value) {
      return isObjectLike$2(value) &&
        isLength$1(value.length) && !!typedArrayTags[baseGetTag$1(value)];
    }

    var _baseIsTypedArray = baseIsTypedArray$1;

    /**
     * The base implementation of `_.unary` without support for storing metadata.
     *
     * @private
     * @param {Function} func The function to cap arguments for.
     * @returns {Function} Returns the new capped function.
     */

    function baseUnary$3(func) {
      return function(value) {
        return func(value);
      };
    }

    var _baseUnary = baseUnary$3;

    var _nodeUtil = {exports: {}};

    (function (module, exports) {
    var freeGlobal = _freeGlobal;

    /** Detect free variable `exports`. */
    var freeExports = exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    /** Detect free variable `process` from Node.js. */
    var freeProcess = moduleExports && freeGlobal.process;

    /** Used to access faster Node.js helpers. */
    var nodeUtil = (function() {
      try {
        // Use `util.types` for Node.js 10+.
        var types = freeModule && freeModule.require && freeModule.require('util').types;

        if (types) {
          return types;
        }

        // Legacy `process.binding('util')` for Node.js < 10.
        return freeProcess && freeProcess.binding && freeProcess.binding('util');
      } catch (e) {}
    }());

    module.exports = nodeUtil;
    }(_nodeUtil, _nodeUtil.exports));

    var baseIsTypedArray = _baseIsTypedArray,
        baseUnary$2 = _baseUnary,
        nodeUtil$2 = _nodeUtil.exports;

    /* Node.js helper references. */
    var nodeIsTypedArray = nodeUtil$2 && nodeUtil$2.isTypedArray;

    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    var isTypedArray$1 = nodeIsTypedArray ? baseUnary$2(nodeIsTypedArray) : baseIsTypedArray;

    var isTypedArray_1 = isTypedArray$1;

    var baseTimes = _baseTimes,
        isArguments = isArguments_1,
        isArray$5 = isArray_1,
        isBuffer$1 = isBuffer$2.exports,
        isIndex$1 = _isIndex,
        isTypedArray = isTypedArray_1;

    /** Used for built-in method references. */
    var objectProto$5 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$3 = objectProto$5.hasOwnProperty;

    /**
     * Creates an array of the enumerable property names of the array-like `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @param {boolean} inherited Specify returning inherited property names.
     * @returns {Array} Returns the array of property names.
     */
    function arrayLikeKeys$2(value, inherited) {
      var isArr = isArray$5(value),
          isArg = !isArr && isArguments(value),
          isBuff = !isArr && !isArg && isBuffer$1(value),
          isType = !isArr && !isArg && !isBuff && isTypedArray(value),
          skipIndexes = isArr || isArg || isBuff || isType,
          result = skipIndexes ? baseTimes(value.length, String) : [],
          length = result.length;

      for (var key in value) {
        if ((inherited || hasOwnProperty$3.call(value, key)) &&
            !(skipIndexes && (
               // Safari 9 has enumerable `arguments.length` in strict mode.
               key == 'length' ||
               // Node.js 0.10 has enumerable non-index properties on buffers.
               (isBuff && (key == 'offset' || key == 'parent')) ||
               // PhantomJS 2 has enumerable non-index properties on typed arrays.
               (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
               // Skip index properties.
               isIndex$1(key, length)
            ))) {
          result.push(key);
        }
      }
      return result;
    }

    var _arrayLikeKeys = arrayLikeKeys$2;

    /** Used for built-in method references. */

    var objectProto$4 = Object.prototype;

    /**
     * Checks if `value` is likely a prototype object.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
     */
    function isPrototype$3(value) {
      var Ctor = value && value.constructor,
          proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$4;

      return value === proto;
    }

    var _isPrototype = isPrototype$3;

    /**
     * Creates a unary function that invokes `func` with its argument transformed.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {Function} transform The argument transform.
     * @returns {Function} Returns the new function.
     */

    function overArg$2(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }

    var _overArg = overArg$2;

    var overArg$1 = _overArg;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeKeys$1 = overArg$1(Object.keys, Object);

    var _nativeKeys = nativeKeys$1;

    var isPrototype$2 = _isPrototype,
        nativeKeys = _nativeKeys;

    /** Used for built-in method references. */
    var objectProto$3 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

    /**
     * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeys$1(object) {
      if (!isPrototype$2(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty$2.call(object, key) && key != 'constructor') {
          result.push(key);
        }
      }
      return result;
    }

    var _baseKeys = baseKeys$1;

    var isFunction = isFunction_1,
        isLength = isLength_1;

    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * _.isArrayLike([1, 2, 3]);
     * // => true
     *
     * _.isArrayLike(document.body.children);
     * // => true
     *
     * _.isArrayLike('abc');
     * // => true
     *
     * _.isArrayLike(_.noop);
     * // => false
     */
    function isArrayLike$2(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }

    var isArrayLike_1 = isArrayLike$2;

    var arrayLikeKeys$1 = _arrayLikeKeys,
        baseKeys = _baseKeys,
        isArrayLike$1 = isArrayLike_1;

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    function keys$3(object) {
      return isArrayLike$1(object) ? arrayLikeKeys$1(object) : baseKeys(object);
    }

    var keys_1 = keys$3;

    var copyObject$3 = _copyObject,
        keys$2 = keys_1;

    /**
     * The base implementation of `_.assign` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssign$1(object, source) {
      return object && copyObject$3(source, keys$2(source), object);
    }

    var _baseAssign = baseAssign$1;

    /**
     * This function is like
     * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * except that it includes inherited enumerable properties.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */

    function nativeKeysIn$1(object) {
      var result = [];
      if (object != null) {
        for (var key in Object(object)) {
          result.push(key);
        }
      }
      return result;
    }

    var _nativeKeysIn = nativeKeysIn$1;

    var isObject$3 = isObject_1,
        isPrototype$1 = _isPrototype,
        nativeKeysIn = _nativeKeysIn;

    /** Used for built-in method references. */
    var objectProto$2 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

    /**
     * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeysIn$1(object) {
      if (!isObject$3(object)) {
        return nativeKeysIn(object);
      }
      var isProto = isPrototype$1(object),
          result = [];

      for (var key in object) {
        if (!(key == 'constructor' && (isProto || !hasOwnProperty$1.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }

    var _baseKeysIn = baseKeysIn$1;

    var arrayLikeKeys = _arrayLikeKeys,
        baseKeysIn = _baseKeysIn,
        isArrayLike = isArrayLike_1;

    /**
     * Creates an array of the own and inherited enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keysIn(new Foo);
     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
     */
    function keysIn$3(object) {
      return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
    }

    var keysIn_1 = keysIn$3;

    var copyObject$2 = _copyObject,
        keysIn$2 = keysIn_1;

    /**
     * The base implementation of `_.assignIn` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssignIn$1(object, source) {
      return object && copyObject$2(source, keysIn$2(source), object);
    }

    var _baseAssignIn = baseAssignIn$1;

    var _cloneBuffer = {exports: {}};

    (function (module, exports) {
    var root = _root;

    /** Detect free variable `exports`. */
    var freeExports = exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    /** Built-in value references. */
    var Buffer = moduleExports ? root.Buffer : undefined,
        allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

    /**
     * Creates a clone of  `buffer`.
     *
     * @private
     * @param {Buffer} buffer The buffer to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Buffer} Returns the cloned buffer.
     */
    function cloneBuffer(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }
      var length = buffer.length,
          result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

      buffer.copy(result);
      return result;
    }

    module.exports = cloneBuffer;
    }(_cloneBuffer, _cloneBuffer.exports));

    /**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */

    function copyArray$1(source, array) {
      var index = -1,
          length = source.length;

      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }

    var _copyArray = copyArray$1;

    /**
     * A specialized version of `_.filter` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */

    function arrayFilter$1(array, predicate) {
      var index = -1,
          length = array == null ? 0 : array.length,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result[resIndex++] = value;
        }
      }
      return result;
    }

    var _arrayFilter = arrayFilter$1;

    /**
     * This method returns a new empty array.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Array} Returns the new empty array.
     * @example
     *
     * var arrays = _.times(2, _.stubArray);
     *
     * console.log(arrays);
     * // => [[], []]
     *
     * console.log(arrays[0] === arrays[1]);
     * // => false
     */

    function stubArray$2() {
      return [];
    }

    var stubArray_1 = stubArray$2;

    var arrayFilter = _arrayFilter,
        stubArray$1 = stubArray_1;

    /** Used for built-in method references. */
    var objectProto$1 = Object.prototype;

    /** Built-in value references. */
    var propertyIsEnumerable = objectProto$1.propertyIsEnumerable;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeGetSymbols$1 = Object.getOwnPropertySymbols;

    /**
     * Creates an array of the own enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbols$3 = !nativeGetSymbols$1 ? stubArray$1 : function(object) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return arrayFilter(nativeGetSymbols$1(object), function(symbol) {
        return propertyIsEnumerable.call(object, symbol);
      });
    };

    var _getSymbols = getSymbols$3;

    var copyObject$1 = _copyObject,
        getSymbols$2 = _getSymbols;

    /**
     * Copies own symbols of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */
    function copySymbols$1(source, object) {
      return copyObject$1(source, getSymbols$2(source), object);
    }

    var _copySymbols = copySymbols$1;

    /**
     * Appends the elements of `values` to `array`.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to append.
     * @returns {Array} Returns `array`.
     */

    function arrayPush$2(array, values) {
      var index = -1,
          length = values.length,
          offset = array.length;

      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }

    var _arrayPush = arrayPush$2;

    var overArg = _overArg;

    /** Built-in value references. */
    var getPrototype$2 = overArg(Object.getPrototypeOf, Object);

    var _getPrototype = getPrototype$2;

    var arrayPush$1 = _arrayPush,
        getPrototype$1 = _getPrototype,
        getSymbols$1 = _getSymbols,
        stubArray = stubArray_1;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeGetSymbols = Object.getOwnPropertySymbols;

    /**
     * Creates an array of the own and inherited enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbolsIn$2 = !nativeGetSymbols ? stubArray : function(object) {
      var result = [];
      while (object) {
        arrayPush$1(result, getSymbols$1(object));
        object = getPrototype$1(object);
      }
      return result;
    };

    var _getSymbolsIn = getSymbolsIn$2;

    var copyObject = _copyObject,
        getSymbolsIn$1 = _getSymbolsIn;

    /**
     * Copies own and inherited symbols of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */
    function copySymbolsIn$1(source, object) {
      return copyObject(source, getSymbolsIn$1(source), object);
    }

    var _copySymbolsIn = copySymbolsIn$1;

    var arrayPush = _arrayPush,
        isArray$4 = isArray_1;

    /**
     * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
     * `keysFunc` and `symbolsFunc` to get the enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @param {Function} symbolsFunc The function to get the symbols of `object`.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function baseGetAllKeys$2(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray$4(object) ? result : arrayPush(result, symbolsFunc(object));
    }

    var _baseGetAllKeys = baseGetAllKeys$2;

    var baseGetAllKeys$1 = _baseGetAllKeys,
        getSymbols = _getSymbols,
        keys$1 = keys_1;

    /**
     * Creates an array of own enumerable property names and symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeys$1(object) {
      return baseGetAllKeys$1(object, keys$1, getSymbols);
    }

    var _getAllKeys = getAllKeys$1;

    var baseGetAllKeys = _baseGetAllKeys,
        getSymbolsIn = _getSymbolsIn,
        keysIn$1 = keysIn_1;

    /**
     * Creates an array of own and inherited enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeysIn$1(object) {
      return baseGetAllKeys(object, keysIn$1, getSymbolsIn);
    }

    var _getAllKeysIn = getAllKeysIn$1;

    var getNative$3 = _getNative,
        root$4 = _root;

    /* Built-in method references that are verified to be native. */
    var DataView$1 = getNative$3(root$4, 'DataView');

    var _DataView = DataView$1;

    var getNative$2 = _getNative,
        root$3 = _root;

    /* Built-in method references that are verified to be native. */
    var Promise$2 = getNative$2(root$3, 'Promise');

    var _Promise = Promise$2;

    var getNative$1 = _getNative,
        root$2 = _root;

    /* Built-in method references that are verified to be native. */
    var Set$1 = getNative$1(root$2, 'Set');

    var _Set = Set$1;

    var getNative = _getNative,
        root$1 = _root;

    /* Built-in method references that are verified to be native. */
    var WeakMap$1 = getNative(root$1, 'WeakMap');

    var _WeakMap = WeakMap$1;

    var DataView = _DataView,
        Map = _Map,
        Promise$1 = _Promise,
        Set = _Set,
        WeakMap = _WeakMap,
        baseGetTag = _baseGetTag,
        toSource = _toSource;

    /** `Object#toString` result references. */
    var mapTag$3 = '[object Map]',
        objectTag$1 = '[object Object]',
        promiseTag = '[object Promise]',
        setTag$3 = '[object Set]',
        weakMapTag$1 = '[object WeakMap]';

    var dataViewTag$2 = '[object DataView]';

    /** Used to detect maps, sets, and weakmaps. */
    var dataViewCtorString = toSource(DataView),
        mapCtorString = toSource(Map),
        promiseCtorString = toSource(Promise$1),
        setCtorString = toSource(Set),
        weakMapCtorString = toSource(WeakMap);

    /**
     * Gets the `toStringTag` of `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    var getTag$3 = baseGetTag;

    // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
    if ((DataView && getTag$3(new DataView(new ArrayBuffer(1))) != dataViewTag$2) ||
        (Map && getTag$3(new Map) != mapTag$3) ||
        (Promise$1 && getTag$3(Promise$1.resolve()) != promiseTag) ||
        (Set && getTag$3(new Set) != setTag$3) ||
        (WeakMap && getTag$3(new WeakMap) != weakMapTag$1)) {
      getTag$3 = function(value) {
        var result = baseGetTag(value),
            Ctor = result == objectTag$1 ? value.constructor : undefined,
            ctorString = Ctor ? toSource(Ctor) : '';

        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString: return dataViewTag$2;
            case mapCtorString: return mapTag$3;
            case promiseCtorString: return promiseTag;
            case setCtorString: return setTag$3;
            case weakMapCtorString: return weakMapTag$1;
          }
        }
        return result;
      };
    }

    var _getTag = getTag$3;

    /** Used for built-in method references. */

    var objectProto = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /**
     * Initializes an array clone.
     *
     * @private
     * @param {Array} array The array to clone.
     * @returns {Array} Returns the initialized clone.
     */
    function initCloneArray$1(array) {
      var length = array.length,
          result = new array.constructor(length);

      // Add properties assigned by `RegExp#exec`.
      if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }

    var _initCloneArray = initCloneArray$1;

    var root = _root;

    /** Built-in value references. */
    var Uint8Array$1 = root.Uint8Array;

    var _Uint8Array = Uint8Array$1;

    var Uint8Array = _Uint8Array;

    /**
     * Creates a clone of `arrayBuffer`.
     *
     * @private
     * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
     * @returns {ArrayBuffer} Returns the cloned array buffer.
     */
    function cloneArrayBuffer$3(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new Uint8Array(result).set(new Uint8Array(arrayBuffer));
      return result;
    }

    var _cloneArrayBuffer = cloneArrayBuffer$3;

    var cloneArrayBuffer$2 = _cloneArrayBuffer;

    /**
     * Creates a clone of `dataView`.
     *
     * @private
     * @param {Object} dataView The data view to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned data view.
     */
    function cloneDataView$1(dataView, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer$2(dataView.buffer) : dataView.buffer;
      return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
    }

    var _cloneDataView = cloneDataView$1;

    /** Used to match `RegExp` flags from their coerced string values. */

    var reFlags = /\w*$/;

    /**
     * Creates a clone of `regexp`.
     *
     * @private
     * @param {Object} regexp The regexp to clone.
     * @returns {Object} Returns the cloned regexp.
     */
    function cloneRegExp$1(regexp) {
      var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
      result.lastIndex = regexp.lastIndex;
      return result;
    }

    var _cloneRegExp = cloneRegExp$1;

    var Symbol$1 = _Symbol;

    /** Used to convert symbols to primitives and strings. */
    var symbolProto$1 = Symbol$1 ? Symbol$1.prototype : undefined,
        symbolValueOf = symbolProto$1 ? symbolProto$1.valueOf : undefined;

    /**
     * Creates a clone of the `symbol` object.
     *
     * @private
     * @param {Object} symbol The symbol object to clone.
     * @returns {Object} Returns the cloned symbol object.
     */
    function cloneSymbol$1(symbol) {
      return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
    }

    var _cloneSymbol = cloneSymbol$1;

    var cloneArrayBuffer$1 = _cloneArrayBuffer;

    /**
     * Creates a clone of `typedArray`.
     *
     * @private
     * @param {Object} typedArray The typed array to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned typed array.
     */
    function cloneTypedArray$1(typedArray, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer$1(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    }

    var _cloneTypedArray = cloneTypedArray$1;

    var cloneArrayBuffer = _cloneArrayBuffer,
        cloneDataView = _cloneDataView,
        cloneRegExp = _cloneRegExp,
        cloneSymbol = _cloneSymbol,
        cloneTypedArray = _cloneTypedArray;

    /** `Object#toString` result references. */
    var boolTag$1 = '[object Boolean]',
        dateTag$1 = '[object Date]',
        mapTag$2 = '[object Map]',
        numberTag$1 = '[object Number]',
        regexpTag$1 = '[object RegExp]',
        setTag$2 = '[object Set]',
        stringTag$1 = '[object String]',
        symbolTag$1 = '[object Symbol]';

    var arrayBufferTag$1 = '[object ArrayBuffer]',
        dataViewTag$1 = '[object DataView]',
        float32Tag$1 = '[object Float32Array]',
        float64Tag$1 = '[object Float64Array]',
        int8Tag$1 = '[object Int8Array]',
        int16Tag$1 = '[object Int16Array]',
        int32Tag$1 = '[object Int32Array]',
        uint8Tag$1 = '[object Uint8Array]',
        uint8ClampedTag$1 = '[object Uint8ClampedArray]',
        uint16Tag$1 = '[object Uint16Array]',
        uint32Tag$1 = '[object Uint32Array]';

    /**
     * Initializes an object clone based on its `toStringTag`.
     *
     * **Note:** This function only supports cloning values with tags of
     * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
     *
     * @private
     * @param {Object} object The object to clone.
     * @param {string} tag The `toStringTag` of the object to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneByTag$1(object, tag, isDeep) {
      var Ctor = object.constructor;
      switch (tag) {
        case arrayBufferTag$1:
          return cloneArrayBuffer(object);

        case boolTag$1:
        case dateTag$1:
          return new Ctor(+object);

        case dataViewTag$1:
          return cloneDataView(object, isDeep);

        case float32Tag$1: case float64Tag$1:
        case int8Tag$1: case int16Tag$1: case int32Tag$1:
        case uint8Tag$1: case uint8ClampedTag$1: case uint16Tag$1: case uint32Tag$1:
          return cloneTypedArray(object, isDeep);

        case mapTag$2:
          return new Ctor;

        case numberTag$1:
        case stringTag$1:
          return new Ctor(object);

        case regexpTag$1:
          return cloneRegExp(object);

        case setTag$2:
          return new Ctor;

        case symbolTag$1:
          return cloneSymbol(object);
      }
    }

    var _initCloneByTag = initCloneByTag$1;

    var isObject$2 = isObject_1;

    /** Built-in value references. */
    var objectCreate = Object.create;

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} proto The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    var baseCreate$1 = (function() {
      function object() {}
      return function(proto) {
        if (!isObject$2(proto)) {
          return {};
        }
        if (objectCreate) {
          return objectCreate(proto);
        }
        object.prototype = proto;
        var result = new object;
        object.prototype = undefined;
        return result;
      };
    }());

    var _baseCreate = baseCreate$1;

    var baseCreate = _baseCreate,
        getPrototype = _getPrototype,
        isPrototype = _isPrototype;

    /**
     * Initializes an object clone.
     *
     * @private
     * @param {Object} object The object to clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneObject$1(object) {
      return (typeof object.constructor == 'function' && !isPrototype(object))
        ? baseCreate(getPrototype(object))
        : {};
    }

    var _initCloneObject = initCloneObject$1;

    var getTag$2 = _getTag,
        isObjectLike$1 = isObjectLike_1;

    /** `Object#toString` result references. */
    var mapTag$1 = '[object Map]';

    /**
     * The base implementation of `_.isMap` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a map, else `false`.
     */
    function baseIsMap$1(value) {
      return isObjectLike$1(value) && getTag$2(value) == mapTag$1;
    }

    var _baseIsMap = baseIsMap$1;

    var baseIsMap = _baseIsMap,
        baseUnary$1 = _baseUnary,
        nodeUtil$1 = _nodeUtil.exports;

    /* Node.js helper references. */
    var nodeIsMap = nodeUtil$1 && nodeUtil$1.isMap;

    /**
     * Checks if `value` is classified as a `Map` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a map, else `false`.
     * @example
     *
     * _.isMap(new Map);
     * // => true
     *
     * _.isMap(new WeakMap);
     * // => false
     */
    var isMap$1 = nodeIsMap ? baseUnary$1(nodeIsMap) : baseIsMap;

    var isMap_1 = isMap$1;

    var getTag$1 = _getTag,
        isObjectLike = isObjectLike_1;

    /** `Object#toString` result references. */
    var setTag$1 = '[object Set]';

    /**
     * The base implementation of `_.isSet` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a set, else `false`.
     */
    function baseIsSet$1(value) {
      return isObjectLike(value) && getTag$1(value) == setTag$1;
    }

    var _baseIsSet = baseIsSet$1;

    var baseIsSet = _baseIsSet,
        baseUnary = _baseUnary,
        nodeUtil = _nodeUtil.exports;

    /* Node.js helper references. */
    var nodeIsSet = nodeUtil && nodeUtil.isSet;

    /**
     * Checks if `value` is classified as a `Set` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a set, else `false`.
     * @example
     *
     * _.isSet(new Set);
     * // => true
     *
     * _.isSet(new WeakSet);
     * // => false
     */
    var isSet$1 = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

    var isSet_1 = isSet$1;

    var Stack = _Stack,
        arrayEach = _arrayEach,
        assignValue$1 = _assignValue,
        baseAssign = _baseAssign,
        baseAssignIn = _baseAssignIn,
        cloneBuffer = _cloneBuffer.exports,
        copyArray = _copyArray,
        copySymbols = _copySymbols,
        copySymbolsIn = _copySymbolsIn,
        getAllKeys = _getAllKeys,
        getAllKeysIn = _getAllKeysIn,
        getTag = _getTag,
        initCloneArray = _initCloneArray,
        initCloneByTag = _initCloneByTag,
        initCloneObject = _initCloneObject,
        isArray$3 = isArray_1,
        isBuffer = isBuffer$2.exports,
        isMap = isMap_1,
        isObject$1 = isObject_1,
        isSet = isSet_1,
        keys = keys_1,
        keysIn = keysIn_1;

    /** Used to compose bitmasks for cloning. */
    var CLONE_DEEP_FLAG$1 = 1,
        CLONE_FLAT_FLAG = 2,
        CLONE_SYMBOLS_FLAG$1 = 4;

    /** `Object#toString` result references. */
    var argsTag = '[object Arguments]',
        arrayTag = '[object Array]',
        boolTag = '[object Boolean]',
        dateTag = '[object Date]',
        errorTag = '[object Error]',
        funcTag = '[object Function]',
        genTag = '[object GeneratorFunction]',
        mapTag = '[object Map]',
        numberTag = '[object Number]',
        objectTag = '[object Object]',
        regexpTag = '[object RegExp]',
        setTag = '[object Set]',
        stringTag = '[object String]',
        symbolTag = '[object Symbol]',
        weakMapTag = '[object WeakMap]';

    var arrayBufferTag = '[object ArrayBuffer]',
        dataViewTag = '[object DataView]',
        float32Tag = '[object Float32Array]',
        float64Tag = '[object Float64Array]',
        int8Tag = '[object Int8Array]',
        int16Tag = '[object Int16Array]',
        int32Tag = '[object Int32Array]',
        uint8Tag = '[object Uint8Array]',
        uint8ClampedTag = '[object Uint8ClampedArray]',
        uint16Tag = '[object Uint16Array]',
        uint32Tag = '[object Uint32Array]';

    /** Used to identify `toStringTag` values supported by `_.clone`. */
    var cloneableTags = {};
    cloneableTags[argsTag] = cloneableTags[arrayTag] =
    cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
    cloneableTags[boolTag] = cloneableTags[dateTag] =
    cloneableTags[float32Tag] = cloneableTags[float64Tag] =
    cloneableTags[int8Tag] = cloneableTags[int16Tag] =
    cloneableTags[int32Tag] = cloneableTags[mapTag] =
    cloneableTags[numberTag] = cloneableTags[objectTag] =
    cloneableTags[regexpTag] = cloneableTags[setTag] =
    cloneableTags[stringTag] = cloneableTags[symbolTag] =
    cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
    cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
    cloneableTags[errorTag] = cloneableTags[funcTag] =
    cloneableTags[weakMapTag] = false;

    /**
     * The base implementation of `_.clone` and `_.cloneDeep` which tracks
     * traversed objects.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} bitmask The bitmask flags.
     *  1 - Deep clone
     *  2 - Flatten inherited properties
     *  4 - Clone symbols
     * @param {Function} [customizer] The function to customize cloning.
     * @param {string} [key] The key of `value`.
     * @param {Object} [object] The parent object of `value`.
     * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone$1(value, bitmask, customizer, key, object, stack) {
      var result,
          isDeep = bitmask & CLONE_DEEP_FLAG$1,
          isFlat = bitmask & CLONE_FLAT_FLAG,
          isFull = bitmask & CLONE_SYMBOLS_FLAG$1;

      if (customizer) {
        result = object ? customizer(value, key, object, stack) : customizer(value);
      }
      if (result !== undefined) {
        return result;
      }
      if (!isObject$1(value)) {
        return value;
      }
      var isArr = isArray$3(value);
      if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
          return copyArray(value, result);
        }
      } else {
        var tag = getTag(value),
            isFunc = tag == funcTag || tag == genTag;

        if (isBuffer(value)) {
          return cloneBuffer(value, isDeep);
        }
        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
          result = (isFlat || isFunc) ? {} : initCloneObject(value);
          if (!isDeep) {
            return isFlat
              ? copySymbolsIn(value, baseAssignIn(result, value))
              : copySymbols(value, baseAssign(result, value));
          }
        } else {
          if (!cloneableTags[tag]) {
            return object ? value : {};
          }
          result = initCloneByTag(value, tag, isDeep);
        }
      }
      // Check for circular references and return its corresponding clone.
      stack || (stack = new Stack);
      var stacked = stack.get(value);
      if (stacked) {
        return stacked;
      }
      stack.set(value, result);

      if (isSet(value)) {
        value.forEach(function(subValue) {
          result.add(baseClone$1(subValue, bitmask, customizer, subValue, value, stack));
        });
      } else if (isMap(value)) {
        value.forEach(function(subValue, key) {
          result.set(key, baseClone$1(subValue, bitmask, customizer, key, value, stack));
        });
      }

      var keysFunc = isFull
        ? (isFlat ? getAllKeysIn : getAllKeys)
        : (isFlat ? keysIn : keys);

      var props = isArr ? undefined : keysFunc(value);
      arrayEach(props || value, function(subValue, key) {
        if (props) {
          key = subValue;
          subValue = value[key];
        }
        // Recursively populate clone (susceptible to call stack limits).
        assignValue$1(result, key, baseClone$1(subValue, bitmask, customizer, key, value, stack));
      });
      return result;
    }

    var _baseClone = baseClone$1;

    var baseClone = _baseClone;

    /** Used to compose bitmasks for cloning. */
    var CLONE_DEEP_FLAG = 1,
        CLONE_SYMBOLS_FLAG = 4;

    /**
     * This method is like `_.clone` except that it recursively clones `value`.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Lang
     * @param {*} value The value to recursively clone.
     * @returns {*} Returns the deep cloned value.
     * @see _.clone
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var deep = _.cloneDeep(objects);
     * console.log(deep[0] === objects[0]);
     * // => false
     */
    function cloneDeep(value) {
      return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
    }

    var cloneDeep_1 = cloneDeep;

    var isArray$2 = isArray_1,
        isSymbol$2 = isSymbol_1;

    /** Used to match property names within property paths. */
    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
        reIsPlainProp = /^\w*$/;

    /**
     * Checks if `value` is a property name and not a property path.
     *
     * @private
     * @param {*} value The value to check.
     * @param {Object} [object] The object to query keys on.
     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
     */
    function isKey$1(value, object) {
      if (isArray$2(value)) {
        return false;
      }
      var type = typeof value;
      if (type == 'number' || type == 'symbol' || type == 'boolean' ||
          value == null || isSymbol$2(value)) {
        return true;
      }
      return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
        (object != null && value in Object(object));
    }

    var _isKey = isKey$1;

    var MapCache = _MapCache;

    /** Error message constants. */
    var FUNC_ERROR_TEXT = 'Expected a function';

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided, it determines the cache key for storing the result based on the
     * arguments provided to the memoized function. By default, the first argument
     * provided to the memoized function is used as the map cache key. The `func`
     * is invoked with the `this` binding of the memoized function.
     *
     * **Note:** The cache is exposed as the `cache` property on the memoized
     * function. Its creation may be customized by replacing the `_.memoize.Cache`
     * constructor with one whose instances implement the
     * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
     * method interface of `clear`, `delete`, `get`, `has`, and `set`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] The function to resolve the cache key.
     * @returns {Function} Returns the new memoized function.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     * var other = { 'c': 3, 'd': 4 };
     *
     * var values = _.memoize(_.values);
     * values(object);
     * // => [1, 2]
     *
     * values(other);
     * // => [3, 4]
     *
     * object.a = 2;
     * values(object);
     * // => [1, 2]
     *
     * // Modify the result cache.
     * values.cache.set(object, ['a', 'b']);
     * values(object);
     * // => ['a', 'b']
     *
     * // Replace `_.memoize.Cache`.
     * _.memoize.Cache = WeakMap;
     */
    function memoize$1(func, resolver) {
      if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments,
            key = resolver ? resolver.apply(this, args) : args[0],
            cache = memoized.cache;

        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result) || cache;
        return result;
      };
      memoized.cache = new (memoize$1.Cache || MapCache);
      return memoized;
    }

    // Expose `MapCache`.
    memoize$1.Cache = MapCache;

    var memoize_1 = memoize$1;

    var memoize = memoize_1;

    /** Used as the maximum memoize cache size. */
    var MAX_MEMOIZE_SIZE = 500;

    /**
     * A specialized version of `_.memoize` which clears the memoized function's
     * cache when it exceeds `MAX_MEMOIZE_SIZE`.
     *
     * @private
     * @param {Function} func The function to have its output memoized.
     * @returns {Function} Returns the new memoized function.
     */
    function memoizeCapped$1(func) {
      var result = memoize(func, function(key) {
        if (cache.size === MAX_MEMOIZE_SIZE) {
          cache.clear();
        }
        return key;
      });

      var cache = result.cache;
      return result;
    }

    var _memoizeCapped = memoizeCapped$1;

    var memoizeCapped = _memoizeCapped;

    /** Used to match property names within property paths. */
    var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

    /** Used to match backslashes in property paths. */
    var reEscapeChar = /\\(\\)?/g;

    /**
     * Converts `string` to a property path array.
     *
     * @private
     * @param {string} string The string to convert.
     * @returns {Array} Returns the property path array.
     */
    var stringToPath$1 = memoizeCapped(function(string) {
      var result = [];
      if (string.charCodeAt(0) === 46 /* . */) {
        result.push('');
      }
      string.replace(rePropName, function(match, number, quote, subString) {
        result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
      });
      return result;
    });

    var _stringToPath = stringToPath$1;

    /**
     * A specialized version of `_.map` for arrays without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */

    function arrayMap$1(array, iteratee) {
      var index = -1,
          length = array == null ? 0 : array.length,
          result = Array(length);

      while (++index < length) {
        result[index] = iteratee(array[index], index, array);
      }
      return result;
    }

    var _arrayMap = arrayMap$1;

    var Symbol = _Symbol,
        arrayMap = _arrayMap,
        isArray$1 = isArray_1,
        isSymbol$1 = isSymbol_1;

    /** Used as references for various `Number` constants. */
    var INFINITY$1 = 1 / 0;

    /** Used to convert symbols to primitives and strings. */
    var symbolProto = Symbol ? Symbol.prototype : undefined,
        symbolToString = symbolProto ? symbolProto.toString : undefined;

    /**
     * The base implementation of `_.toString` which doesn't convert nullish
     * values to empty strings.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {string} Returns the string.
     */
    function baseToString$1(value) {
      // Exit early for strings to avoid a performance hit in some environments.
      if (typeof value == 'string') {
        return value;
      }
      if (isArray$1(value)) {
        // Recursively convert values (susceptible to call stack limits).
        return arrayMap(value, baseToString$1) + '';
      }
      if (isSymbol$1(value)) {
        return symbolToString ? symbolToString.call(value) : '';
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
    }

    var _baseToString = baseToString$1;

    var baseToString = _baseToString;

    /**
     * Converts `value` to a string. An empty string is returned for `null`
     * and `undefined` values. The sign of `-0` is preserved.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.toString(null);
     * // => ''
     *
     * _.toString(-0);
     * // => '-0'
     *
     * _.toString([1, 2, 3]);
     * // => '1,2,3'
     */
    function toString$1(value) {
      return value == null ? '' : baseToString(value);
    }

    var toString_1 = toString$1;

    var isArray = isArray_1,
        isKey = _isKey,
        stringToPath = _stringToPath,
        toString = toString_1;

    /**
     * Casts `value` to a path array if it's not one.
     *
     * @private
     * @param {*} value The value to inspect.
     * @param {Object} [object] The object to query keys on.
     * @returns {Array} Returns the cast property path array.
     */
    function castPath$2(value, object) {
      if (isArray(value)) {
        return value;
      }
      return isKey(value, object) ? [value] : stringToPath(toString(value));
    }

    var _castPath = castPath$2;

    var isSymbol = isSymbol_1;

    /** Used as references for various `Number` constants. */
    var INFINITY = 1 / 0;

    /**
     * Converts `value` to a string key if it's not a string or symbol.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {string|symbol} Returns the key.
     */
    function toKey$2(value) {
      if (typeof value == 'string' || isSymbol(value)) {
        return value;
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    var _toKey = toKey$2;

    var assignValue = _assignValue,
        castPath$1 = _castPath,
        isIndex = _isIndex,
        isObject = isObject_1,
        toKey$1 = _toKey;

    /**
     * The base implementation of `_.set`.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @param {Function} [customizer] The function to customize path creation.
     * @returns {Object} Returns `object`.
     */
    function baseSet$1(object, path, value, customizer) {
      if (!isObject(object)) {
        return object;
      }
      path = castPath$1(path, object);

      var index = -1,
          length = path.length,
          lastIndex = length - 1,
          nested = object;

      while (nested != null && ++index < length) {
        var key = toKey$1(path[index]),
            newValue = value;

        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
          return object;
        }

        if (index != lastIndex) {
          var objValue = nested[key];
          newValue = customizer ? customizer(objValue, key, nested) : undefined;
          if (newValue === undefined) {
            newValue = isObject(objValue)
              ? objValue
              : (isIndex(path[index + 1]) ? [] : {});
          }
        }
        assignValue(nested, key, newValue);
        nested = nested[key];
      }
      return object;
    }

    var _baseSet = baseSet$1;

    var baseSet = _baseSet;

    /**
     * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
     * it's created. Arrays are created for missing index properties while objects
     * are created for all other missing properties. Use `_.setWith` to customize
     * `path` creation.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.set(object, 'a[0].b.c', 4);
     * console.log(object.a[0].b.c);
     * // => 4
     *
     * _.set(object, ['x', '0', 'y', 'z'], 5);
     * console.log(object.x[0].y.z);
     * // => 5
     */
    function set(object, path, value) {
      return object == null ? object : baseSet(object, path, value);
    }

    var set_1 = set;

    var castPath = _castPath,
        toKey = _toKey;

    /**
     * The base implementation of `_.get` without support for default values.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @returns {*} Returns the resolved value.
     */
    function baseGet$1(object, path) {
      path = castPath(path, object);

      var index = 0,
          length = path.length;

      while (object != null && index < length) {
        object = object[toKey(path[index++])];
      }
      return (index && index == length) ? object : undefined;
    }

    var _baseGet = baseGet$1;

    var baseGet = _baseGet;

    /**
     * Gets the value at `path` of `object`. If the resolved value is
     * `undefined`, the `defaultValue` is returned in its place.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @param {*} [defaultValue] The value returned for `undefined` resolved values.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.get(object, 'a[0].b.c');
     * // => 3
     *
     * _.get(object, ['a', '0', 'b', 'c']);
     * // => 3
     *
     * _.get(object, 'a.b.c', 'default');
     * // => 'default'
     */
    function get(object, path, defaultValue) {
      var result = object == null ? undefined : baseGet(object, path);
      return result === undefined ? defaultValue : result;
    }

    var get_1 = get;

    var languages = ["cs", "en", "ru", "sk"];
    var useCurrentRecord = function () {
        var values = reactFinalForm.useFormState().values;
        var source = useBlockInputStore(function (s) { return s.source; });
        var record = React__namespace.useMemo(function () {
            var _a;
            // _unset(values, source)
            var lastPart = (_a = source === null || source === void 0 ? void 0 : source.split(".").pop()) !== null && _a !== void 0 ? _a : "cs";
            var i18n = languages.includes(lastPart) ? lastPart : "cs";
            return processTranslations(values, { i18n: i18n });
        }, [values, source]);
        return record;
    };
    var processTranslations = function (value, options) {
        var _a, _b;
        var lang = (_a = options.i18n) !== null && _a !== void 0 ? _a : "cs";
        var result = cloneDeep_1(value);
        console.log("useCurrentRecord start", lang, result);
        var flatDoc = flat(result);
        var processedPaths = [];
        for (var _i = 0, _c = Object.keys(flatDoc); _i < _c.length; _i++) {
            var path = _c[_i];
            var pathArray = path.split(".");
            if (["cs", "en", "ru", "sk"].indexOf(pathArray[pathArray.length - 1]) !== -1) {
                var path_1 = pathArray.slice(0, -1).join(".");
                if (processedPaths.includes(path_1))
                    continue;
                var translations = get_1(result, path_1);
                // console.log("flow translated", path, translations)
                if (translations && typeof translations !== "string") {
                    result = set_1(result, path_1, (_b = translations[lang]) !== null && _b !== void 0 ? _b : translations.cs);
                    processedPaths.push(path_1);
                }
            }
        }
        // console.log("useCurrentRecord paths", processedPaths)
        // console.log("useCurrentRecord result", result)
        return result;
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
            state.source,
        ]; }, isEqual__default['default']), setSelected = _c[0], isSelected = _c[1], deleteBlock = _c[2], moveBlock = _c[3], blocksCount = _c[4], tools = _c[5], setToolbarOpen = _c[6], permissions = _c[7], currentBlock = _c[8]; _c[9];
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
        var record = useCurrentRecord();
        var blockProps = __assign(__assign({}, currentBlock), { record: record });
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
