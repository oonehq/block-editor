import * as React from 'react';
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd';
import isEqual from 'react-fast-compare';
import { useHotkeys } from 'react-hotkeys-hook';
import { ErrorBoundary } from 'react-error-boundary';
import clsx from 'clsx';
import create from 'zustand';
import produce from 'immer';
import { nanoid } from 'nanoid';
import deepCopy from 'deep-copy';
import { useForm, FormProvider, useWatch, useFormContext, useController, useFieldArray } from 'react-hook-form';
import ReactQuill from 'react-quill';

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

function __spreadArray(to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
}

var defaultState = {
    time: Date.now(),
    selected: null,
    tools: {},
    source: null,
    onChange: null,
    toolbarOpen: false,
    blocks: [],
};
var store = function (set, get) { return (__assign(__assign({}, defaultState), { init: function (source, tools, onChange) {
        // console.log("init", value, tools)
        get().update(function (state) {
            if (source) {
                state.source = source;
            }
            if (tools) {
                state.tools = tools;
            }
            if (onChange) {
                state.onChange = onChange;
            }
            state.selected = null;
        });
    }, setValue: function (value) {
        get().update(function (state) {
            if (value) {
                state.blocks = value;
            }
        });
    }, setSelected: function (id) {
        get().update(function (state) {
            state.selected = id;
        });
    }, 
    // updateBlock: (id, paramPath, value) => {
    //     get().update((state) => {
    //         let block = state.blocks.find((block) => block.id === id)
    //         if (block) {
    //             lodashSet(block.data, paramPath, value)
    //         }
    //     })
    // },
    updateBlockData: function (id, data) {
        get().update(function (state) {
            var block = state.blocks.find(function (block) { return block.id === id; });
            block.data = data;
        });
    }, addBlock: function (blockType, index) {
        get().update(function (state) {
            state.blocks.splice(index, 0, {
                id: nanoid(),
                type: blockType,
                data: get().tools[blockType].defaultData,
                version: get().tools[blockType].version,
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
var useBlockInputStore$1 = create(store);
var blockEditorStore = store;

var context = React.createContext(null);
var useBlockInputStore = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return React.useContext(context).apply(void 0, args);
};
function BlockEditorContext(_a) {
    var children = _a.children;
    var useStore = React.useState(function () { return create(blockEditorStore); })[0];
    return React.createElement(context.Provider, { value: useStore }, children);
}

var dev = process.env.NODE_ENV !== "production";
var SettingsPanel = React.memo(function SettingsPanel(props) {
    // source is same as in react-admin = path to section of record/object that is edited
    var blockMeta = useBlockInputStore(function (state) {
        var block = state.blocks.find(function (block) { return block.id == state.selected; });
        if (block) {
            var blockIndex = state.blocks.findIndex(function (block) { return block.id == state.selected; });
            return {
                id: block.id,
                type: block.type,
                version: block.version,
                source: state.source + "[" + blockIndex + "].data",
            };
        }
        return null;
    }, isEqual);
    // console.log("SettingsPanel render", blockMeta)
    return (React.createElement("aside", { className: clsx("bg-gray-50 flex-0 p-2 transition-all overflow-auto w-[340px] xl:w-[400px]") },
        React.createElement("header", { className: "text-center mb-4 text-sm" },
            React.createElement("h2", null, "\u00DApravy"),
            dev ? (React.createElement("p", { className: "text-xs" },
                "(", blockMeta === null || blockMeta === void 0 ? void 0 :
                blockMeta.type,
                "@", blockMeta === null || blockMeta === void 0 ? void 0 :
                blockMeta.source,
                ")")) : null),
        React.createElement(ErrorBoundary, { fallbackRender: function (_a) {
                var error = _a.error, resetErrorBoundary = _a.resetErrorBoundary;
                return (React.createElement("div", { role: "alert" },
                    React.createElement("div", null, "Oh no"),
                    React.createElement("div", null, error.message),
                    React.createElement("button", { className: "btn", onClick: function () {
                            // though you could accomplish this with a combination
                            // of the FallbackCallback and onReset props as well.
                            resetErrorBoundary();
                        } }, "Try again")));
            } }, blockMeta ? React.createElement(LazySettings, { blockMeta: blockMeta }) : null)));
}, isEqual);
var LazyloadComponent = function (componentPath) {
    return function (props) {
        // console.log("LazyloadComponent", componentPath)
        var _a = React.useState(null), ComponentContainer = _a[0], setComponentContainer = _a[1];
        React.useEffect(function () {
            var path = componentPath();
            setComponentContainer(React.lazy(function () { return path; }));
        }, []);
        return (React.createElement(React.Suspense, { fallback: React.createElement("div", null, "Loading") }, ComponentContainer && React.createElement(ComponentContainer, __assign({}, props))));
    };
};
var LazySettings = React.memo(function LazySettings(props) {
    var tools = useBlockInputStore(function (state) { return state.tools; }, isEqual);
    var Settings = React.useMemo(function () { var _a; return LazyloadComponent((_a = tools[props.blockMeta.type]) === null || _a === void 0 ? void 0 : _a.Settings); }, [props.blockMeta.id]);
    // console.log("LazySettings render", props.blockMeta, Settings)
    if (props.blockMeta && Settings) {
        return (React.createElement(Settings, { blockID: props.blockMeta.id, source: props.blockMeta.source }));
    }
    return null;
}, isEqual);

var ToolsPanel = React.memo(function ToolsPanel(props) {
    var _a = useBlockInputStore(function (state) { return [state.setToolbarOpen, state.toolbarOpen, state.tools]; }, isEqual), setToolbarOpen = _a[0], toolbarOpen = _a[1], tools = _a[2];
    var handleClickOutside = function () {
        setToolbarOpen(false);
    };
    // console.log("ToolsPanel render", tools)
    return (React.createElement("aside", { className: clsx("top-0 w-48 bg-gray-100 py-2 absolute h-full overflow-auto ease-in-out transition-all duration-300 z-[99999]", toolbarOpen ? "left-0" : "-left-48"), onClick: handleClickOutside },
        React.createElement("header", { className: "text-center text-sm group-hover:underline" }, "Bloky"),
        React.createElement(Droppable, { droppableId: "sidebar" }, function (provided, snapshot) { return (React.createElement("section", __assign({ ref: provided.innerRef }, provided.droppableProps),
            tools
                ? Object.keys(tools).map(function (name, index) {
                    return (React.createElement(ToolsItem, { name: name, index: index, block: tools[name], key: name + "-" + index }));
                })
                : null,
            provided.placeholder)); })));
});
var ToolsItem = function (props) {
    // console.log("ToolsItem render")
    return (React.createElement("article", { className: "m-4" },
        React.createElement(Draggable, { draggableId: props.name, index: props.index }, function (provided, snapshot) {
            var _a, _b;
            return (React.createElement("article", __assign({ className: "bg-white shadow-xl rounded p-1", ref: provided.innerRef }, provided.draggableProps, provided.dragHandleProps),
                React.createElement("header", { className: "text-center text-sm" }, ((_a = props.block) === null || _a === void 0 ? void 0 : _a.title)
                    ? props.block.title
                    : props.name),
                ((_b = props.block) === null || _b === void 0 ? void 0 : _b.previewImage) ? (React.createElement("img", { src: props.block.previewImage })) : null));
        })));
};

var ChevronUp = function (props) {
    return (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", className: props.className },
        React.createElement("polyline", { points: "18 15 12 9 6 15" })));
};
var ChevronDown = function (props) {
    return (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", className: props.className },
        React.createElement("polyline", { points: "6 9 12 15 18 9" })));
};
var Trash = function (props) {
    return (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: props.className },
        React.createElement("polyline", { points: "3 6 5 6 21 6" }),
        React.createElement("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }),
        React.createElement("line", { x1: "10", y1: "11", x2: "10", y2: "17" }),
        React.createElement("line", { x1: "14", y1: "11", x2: "14", y2: "17" })));
};
var Move = function (props) {
    return (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: props.className },
        React.createElement("polyline", { points: "5 9 2 12 5 15" }),
        React.createElement("polyline", { points: "9 5 12 2 15 5" }),
        React.createElement("polyline", { points: "15 19 12 22 9 19" }),
        React.createElement("polyline", { points: "19 9 22 12 19 15" }),
        React.createElement("line", { x1: "2", y1: "12", x2: "22", y2: "12" }),
        React.createElement("line", { x1: "12", y1: "2", x2: "12", y2: "22" })));
};

var PagePanel = React.memo(function PagePanel(props) {
    var blocks = useBlockInputStore(function (state) {
        return state.blocks.map(function (block) { return ({
            id: block.id,
            type: block.type,
            version: block.version,
        }); });
    }, isEqual);
    // console.log("PagePanel render", blocks)
    return (React.createElement(Droppable, { droppableId: "page" }, function (provided, snapshot) { return (React.createElement("div", __assign({}, provided.droppableProps, { ref: provided.innerRef, className: clsx("relative min-h-[150px] w-full border border-gray-200 bg-white"
        // "min-w-[1024px]"
        ) }), blocks === null || blocks === void 0 ? void 0 :
        blocks.map(function (block, index) {
            return (React.createElement(PageBlock, { block: block, index: index, key: "block-" + block.id }));
        }),
        provided.placeholder)); }));
});
var MissingBlock = function (props) {
    return (React.createElement("main", { className: "py-4 flex items-center justify-center" },
        React.createElement("p", { className: "border border-red-500 p-4 rounded" },
            "Missing block type \"", props === null || props === void 0 ? void 0 :
            props.type,
            "\"")));
};
var PageBlock = React.memo(function PageBlock(props) {
    var _a, _b;
    var _c = useBlockInputStore(function (state) { return [
        state.setSelected,
        state.selected === props.block.id,
        state.deleteBlock,
        state.moveBlock,
        state.blocks.length,
        state.tools,
        state.setToolbarOpen,
    ]; }, isEqual), setSelected = _c[0], isSelected = _c[1], deleteBlock = _c[2], moveBlock = _c[3], blocksCount = _c[4], tools = _c[5], setToolbarOpen = _c[6];
    var blockProps = useBlockInputStore(function (state) { return state.blocks.find(function (block) { return block.id === props.block.id; }); }, isEqual);
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
    var handlePrevent = function (e) {
        e.preventDefault();
        e.stopPropagation();
    };
    var Block = (_b = (_a = tools[props.block.type]) === null || _a === void 0 ? void 0 : _a.Component) !== null && _b !== void 0 ? _b : MissingBlock;
    // console.log("PageBlock render", blockProps)
    return (React.createElement(Draggable, { draggableId: props.block.id, index: props.index }, function (provided, snapshot) { return (React.createElement("section", __assign({ ref: provided.innerRef }, provided.draggableProps, { className: clsx("relative", isSelected
            ? "ring ring-yellow-300"
            : "hover:ring ring-yellow-300"), onClick: handleClick }),
        React.createElement("aside", { className: clsx("absolute -top-3 right-1 z-[9999]", isSelected ? "block" : "hidden") },
            React.createElement("section", { className: "btn-group" },
                React.createElement("button", { className: "btn btn-xs", onClick: handleMoveUp },
                    React.createElement(ChevronUp, { className: "w-4", label: "Move up" })),
                React.createElement("button", { className: "btn btn-xs", onClick: handleMoveDown },
                    React.createElement(ChevronDown, { className: "w-4", label: "Move up" })),
                React.createElement("div", __assign({ className: "btn btn-xs" }, provided.dragHandleProps),
                    React.createElement(Move, { className: "w-4", label: "Move up" })),
                React.createElement("button", { className: "btn btn-xs", onClick: handleDelete },
                    React.createElement(Trash, { className: "w-4", label: "Move up" })))),
        React.createElement("div", { className: "pointer-events-none" },
            React.createElement(ErrorBoundary, { FallbackComponent: function (_a) {
                    var error = _a.error, resetErrorBoundary = _a.resetErrorBoundary;
                    return (React.createElement("div", { role: "alert" },
                        React.createElement("div", null, "Oh no"),
                        React.createElement("div", { className: "break-words" }, error.message),
                        React.createElement("button", { onClick: function () {
                                // though you could accomplish this with a combination
                                // of the FallbackCallback and onReset props as well.
                                resetErrorBoundary();
                            } }, "Try again")));
                } },
                React.createElement(Block, __assign({}, blockProps)))))); }));
});

var BlockEditor = function (props) {
    return (React.createElement(BlockEditorContext, null,
        React.createElement(BlockEditorInstance, __assign({}, props))));
};
var BlockEditorInstance = React.memo(function BlockEditorInstance(props) {
    var _a = useBlockInputStore(function (state) { return [
        state.addBlock,
        state.moveBlock,
        state.setSelected,
        state.setValue,
        state.init,
        state.setToolbarOpen,
    ]; }, isEqual), addBlock = _a[0], moveBlock = _a[1], setSelected = _a[2], setValue = _a[3], initBlocks = _a[4], setToolbarOpen = _a[5];
    React.useEffect(function () {
        initBlocks(props.source, props.tools, props.onChange);
    }, []);
    React.useEffect(function () {
        setValue(props.value);
    }, [props.value]);
    var handleClickOutside = function () {
        setSelected(null);
        setToolbarOpen(false);
    };
    useHotkeys("esc", handleClickOutside);
    var handleDragStart = function (event) {
        setToolbarOpen(false);
    };
    var handleDragEnd = function (result) {
        // console.log("result", result)
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
    return (React.createElement("main", { className: "min-h-[500px] max-h-[80vh] border border-gray-200 rounded relative overflow-hidden" },
        React.createElement(DragDropContext, { onDragStart: handleDragStart, onDragEnd: handleDragEnd },
            React.createElement("header", { className: "w-full h-8 bg-gray-50 flex justify-start items-center px-1" },
                React.createElement("button", { className: "btn btn-outline btn-xs", onClick: handleAdd }, "+ P\u0159idat blok")),
            React.createElement(ToolsPanel, null),
            React.createElement("section", { className: "flex" },
                React.createElement("section", { className: "bg-gray-300 flex-1 overflow-auto p-4 max-h-[80vh] relative", onClick: handleClickOutside },
                    React.createElement(PagePanel, null)),
                React.createElement(SettingsPanel, null)))));
}, isEqual);

var SettingsForm = function (props) {
    var formMethods = null;
    if (!props.form) {
        var defaultValues = React.useMemo(function () {
            var _a;
            return (_a = useBlockInputStore$1
                .getState()
                .blocks.find(function (block) { return block.id === props.blockID; })) === null || _a === void 0 ? void 0 : _a.data;
        }, [props.blockID]);
        // console.log("SettingsForm", defaultValues)
        formMethods = useForm({
            defaultValues: deepCopy(defaultValues),
        });
    }
    else {
        formMethods = props.form;
    }
    // console.log("SettingsForm render", props.blockID, formMethods)
    return (React.createElement(FormProvider, __assign({}, formMethods),
        props.children,
        React.createElement(AutoSaveWatcher, { id: props.blockID, control: formMethods.control })));
};
var AutoSaveWatcher = function (_a) {
    var id = _a.id, control = _a.control;
    var updateBlockData = useBlockInputStore$1(function (state) { return state.updateBlockData; });
    var data = useWatch({
        control: control,
    });
    React.useEffect(function () {
        // console.log("data change", id, data)
        updateBlockData(id, data);
    }, [data]);
    return null;
};
var TextInput = function (props) {
    var _a, _b;
    var control = useFormContext().control;
    var field = useController({
        name: props.name,
        control: control,
    }).field;
    // console.log("TextInput render", control, field)
    return (React.createElement("div", { className: "form-control" },
        React.createElement("label", { className: "label", htmlFor: props.name },
            React.createElement("span", { className: "label-text" }, (_a = props.label) !== null && _a !== void 0 ? _a : props.name)),
        React.createElement("input", __assign({ type: "text", placeholder: (_b = props.label) !== null && _b !== void 0 ? _b : props.name, className: "input input-bordered" }, field))));
};
var ArrayInput = function (props) {
    var control = useFormContext().control;
    var _a = useFieldArray({
        name: props.name,
        control: control,
    }), fields = _a.fields, append = _a.append, remove = _a.remove, move = _a.move;
    var _b = React.useState(props.collapsible ? fields.map(function (field) { return field.id; }) : []), collapsedList = _b[0], setCollapsedList = _b[1];
    var label = React.useMemo(function () {
        var _a;
        return (_a = props.label) !== null && _a !== void 0 ? _a : props.name;
    }, [props.name, props.label]);
    var handleAdd = function (e) {
        var _a;
        e.preventDefault();
        if (typeof ((_a = props === null || props === void 0 ? void 0 : props.item) === null || _a === void 0 ? void 0 : _a.defaultValue) !== "undefined") {
            append(props.item.defaultValue);
        }
        else {
            append({});
        }
    };
    var handleMoveUp = function (index) {
        return function (e) {
            e.preventDefault();
            if (index === 0) {
                return;
            }
            move(index, Math.max(0, index - 1));
        };
    };
    var handleMoveDown = function (index) {
        return function (e) {
            e.preventDefault();
            if (index < fields.length - 1) {
                move(index, Math.min(index + 1, fields.length - 1));
            }
        };
    };
    var handleDelete = function (index) {
        return function (e) {
            remove(index);
            e.preventDefault();
        };
    };
    var handleCollapse = function (fieldID) {
        return function (e) {
            e.preventDefault();
            if (collapsedList.indexOf(fieldID) >= 0) {
                var nextList = collapsedList.filter(function (id) { return id != fieldID; });
                setCollapsedList(nextList);
            }
            else {
                var nextList = __spreadArray(__spreadArray([], collapsedList), [fieldID]);
                setCollapsedList(nextList);
            }
        };
    };
    return (React.createElement("section", { className: "mt-4" },
        React.createElement("header", null, label),
        fields.map(function (field, index) {
            var _a, _b, _c;
            var isCollapsed = collapsedList.indexOf(field.id) >= 0;
            return (React.createElement("article", { key: field.id, className: clsx("relative border border-gray-400 rounded mt-4 p-2", isCollapsed ? "group" : null, props.collapsible && isCollapsed
                    ? "cursor-pointer"
                    : null, (_a = props === null || props === void 0 ? void 0 : props.item) === null || _a === void 0 ? void 0 : _a.background), onClick: isCollapsed ? handleCollapse(field.id) : undefined },
                React.createElement("section", { className: "absolute -top-3 left-2 right-2 z-[9999] flex justify-between" },
                    React.createElement("header", { className: clsx("badge badge-outline border-gray-400 bg-gray-100 truncate", props.collapsible
                            ? "cursor-pointer group-hover:underline hover:underline"
                            : null), onClick: props.collapsible
                            ? handleCollapse(field.id)
                            : undefined },
                        "#",
                        index + 1,
                        " ",
                        ((_b = props === null || props === void 0 ? void 0 : props.item) === null || _b === void 0 ? void 0 : _b.label) ? (React.createElement(FieldLabel, { label: (_c = props === null || props === void 0 ? void 0 : props.item) === null || _c === void 0 ? void 0 : _c.label, field: field })) : (label)),
                    React.createElement("section", { className: "btn-group self-end" },
                        React.createElement("button", { className: "btn btn-xs", onClick: handleMoveUp(index) },
                            React.createElement(ChevronUp, { className: "w-4", label: "Move up" })),
                        React.createElement("button", { className: "btn btn-xs", onClick: handleMoveDown(index) },
                            React.createElement(ChevronDown, { className: "w-4", label: "Move up" })),
                        React.createElement("button", { className: "btn btn-xs", onClick: handleDelete(index) },
                            React.createElement(Trash, { className: "w-4", label: "Move up" })))),
                isCollapsed ? null : (React.createElement("section", null, React.Children.map(props.children, function (input, inputIndex) {
                    var _a = input.props, name = _a.name, rest = __rest(_a, ["name"]);
                    return React.cloneElement(input, __assign({ name: props.name + "." + index + (name ? "." + name : ""), control: control }, rest));
                })))));
        }),
        React.createElement("footer", { className: "my-2" },
            React.createElement("button", { className: "btn btn-xs", onClick: handleAdd },
                "+ ",
                label))));
};
var FieldLabel = function (_a) {
    // console.log("FieldLabel render", field)
    var label = _a.label, field = _a.field;
    if (label && typeof label === "string") {
        return label;
    }
    if (typeof label === "function") {
        return label(field);
    }
    return null;
};
var RichTextInput = function (props) {
    var _a;
    var control = useFormContext().control;
    var field = useController({
        name: props.name,
        control: control,
    }).field;
    // const handleQuillChange = (content) => {
    //     props.onChange(props.name, content)
    // }
    return (React.createElement("div", { className: "form-control" },
        React.createElement("label", { className: "label", htmlFor: props.name },
            React.createElement("span", { className: "label-text" }, (_a = props.label) !== null && _a !== void 0 ? _a : props.name)),
        React.createElement(ReactQuill, __assign({ theme: "snow", placeholder: "Text", modules: {
                toolbar: [
                    [
                        "bold",
                        "italic",
                        "underline",
                        { align: [] },
                        { list: "ordered" },
                        { list: "bullet" },
                        "link",
                    ],
                    ["clean"],
                ],
            } }, field))));
};

export { ArrayInput, BlockEditor, RichTextInput, SettingsForm, TextInput };
//# sourceMappingURL=index.es.js.map
