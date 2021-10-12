import * as React from "react"
import create from "zustand"
import produce from "immer"
import { persist } from "zustand/middleware"
import { nanoid } from "nanoid"

const defaultState = {
    fixedSettingsPanel: false,
}

const store = (set, get) => ({
    ...defaultState,
    setFixedSettingsPanel: (value: boolean) => {
        get().update((state) => {
            state.fixedSettingsPanel = value
        })
    },
    update: (fn) => set(produce(fn)),
})

export const useBlockEditorStore = create(
    persist(store, {
        name: "blockEditorStore",
        version: 1,
    })
)
