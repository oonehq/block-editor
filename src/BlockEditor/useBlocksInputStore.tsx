import * as React from "react"
import create from "zustand"
import produce from "immer"
import { nanoid } from "nanoid"

const defaultState = {
    time: Date.now(),
    selected: null,
    tools: {},
    source: null,
    onChange: null,
    toolbarOpen: false,
    blocks: [] as Array<{
        id: string
        type: string
        title: string
        version: number
        data: Record<string, any>
    }>,
}

const store = (set, get) => ({
    ...defaultState,
    init: (source, tools, onChange) => {
        // console.log("init", value, tools)

        get().update((state) => {
            if (source) {
                state.source = source
            }
            if (tools) {
                state.tools = tools
            }
            if (onChange) {
                state.onChange = onChange
            }
            state.selected = null
        })
    },
    setValue: (value) => {
        get().update((state) => {
            if (value) {
                state.blocks = value
            }
        })
    },
    setSelected: (id) => {
        get().update((state) => {
            state.selected = id
        })
    },
    // updateBlock: (id, paramPath, value) => {
    //     get().update((state) => {
    //         let block = state.blocks.find((block) => block.id === id)
    //         if (block) {
    //             lodashSet(block.data, paramPath, value)
    //         }
    //     })
    // },
    updateBlockData: (id, data) => {
        get().update((state) => {
            let block = state.blocks.find((block) => block.id === id)
            block.data = data
        })
    },
    addBlock: (blockType, index) => {
        get().update((state) => {
            state.blocks.splice(index, 0, {
                id: nanoid(),
                type: blockType,
                data: get().tools[blockType].defaultData,
                _$settings: get().tools[blockType].defaultData,
                version: get().tools[blockType].version,
            })
        })
        console.log("addBlock onChange", get().onChange)
        if (get().onChange) get().onChange(get().blocks)
    },
    moveBlock: (sourceIndex, targetIndex) => {
        get().update((state) => {
            const [removed] = state.blocks.splice(sourceIndex, 1)
            state.blocks.splice(targetIndex, 0, removed)
        })
        if (get().onChange) get().onChange(get().blocks)
    },
    deleteBlock: (blockID) => {
        get().update((state) => {
            state.selected = null
            state.blocks = state.blocks.filter((block) => block.id != blockID)
        })
        if (get().onChange) get().onChange(get().blocks)
    },
    setToolbarOpen: (value: boolean) => {
        get().update((state) => {
            state.toolbarOpen = value
        })
    },
    update: (fn) => set(produce(fn)),
})

export const useBlockInputStore = create(store)

export const blockEditorStore = store
