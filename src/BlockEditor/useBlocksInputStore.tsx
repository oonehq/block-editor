import * as React from "react"
import create from "zustand"
import produce from "immer"
import { nanoid } from "nanoid"
import { PermissionEnum } from "./BlockEditor"

const defaultState = {
  time: Date.now(),
  selected: null,
  selectedInput: null,
  tools: [],
  settings: [],
  source: null,
  onChange: null,
  toolbarOpen: false,
  permissions: ["add", "edit", "compose"],
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
  init: (source, tools, settings, onChange, permissions) => {
    // console.log("init", value, tools)

    get().update((state) => {
      if (source) {
        state.source = source
      }
      if (tools) {
        state.tools = Array.isArray(tools) ? tools : Object.entries(tools)
      }
      if (onChange) {
        state.onChange = onChange
      }
      if (settings) {
        state.settings = settings
      }
      if (permissions) {
        state.permissions = permissions
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
  setTools: (value) => {
    get().update((state) => {
      if (value) {
        state.tools = value
      }
    })
  },
  setSettings: (value) => {
    get().update((state) => {
      if (value) {
        state.settings = value
      }
    })
  },
  setSelected: (id) => {
    get().update((state) => {
      state.selected = id
    })
  },
  setSelectedInput: (settings) => {
    get().update((state) => {
      state.selectedInput = settings
    })
  },
  updateBlockData: (id, data) => {
    get().update((state) => {
      let block = state.blocks.find((block) => block.id === id)
      block.data = data
    })
  },
  addBlock: (blockType, index) => {
    get().update((state) => {
      const tool = get().tools.find((tool) => tool.type === blockType)
      console.log("addBlock", tool)
      state.blocks.splice(index, 0, {
        id: nanoid(),
        type: blockType,
        data: tool.defaultData,
        _$settings: tool.defaultData,
        version: tool.version,
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
  copyBlock: (blockProps, index) => {
    get().update((state) => {
      state.blocks.splice(index, 0, {
        id: nanoid(),
        type: blockProps.type,
        data: blockProps.data,
        _$settings: blockProps._$settings,
        version: blockProps.version,
      })
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
