import create from "zustand"
import produce from "immer"
import { nanoid } from "nanoid"

const defaultState = {
    time: Date.now(),
    selected: null,
    tools: {},
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
    init: (value, tools) => {
        console.log("init", value, tools)

        get().update((state) => {
            if (value) {
                state.blocks = value
            }
            if (tools) {
                state.tools = tools
            }
            state.selected = null
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
                version: get().tools[blockType].version,
            })
        })
    },
    moveBlock: (sourceIndex, targetIndex) => {
        get().update((state) => {
            const [removed] = state.blocks.splice(sourceIndex, 1)
            state.blocks.splice(targetIndex, 0, removed)
        })
    },
    deleteBlock: (blockID) => {
        get().update((state) => {
            state.selected = null
            state.blocks = state.blocks.filter((block) => block.id != blockID)
        })
    },
    update: (fn) => set(produce(fn)),
})

export const useBlockInputStore = create(store)
