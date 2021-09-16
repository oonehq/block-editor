import * as React from "react"
import create from "zustand"
import { blockEditorStore } from "./useBlocksInputStore"

const context = React.createContext<any>(null)
const useBlockInputStore = (...args) => React.useContext(context)(...args)

function BlockEditorContext({ children }) {
    const [useStore] = React.useState(() => create(blockEditorStore))
    return <context.Provider value={useStore}>{children}</context.Provider>
}

export { BlockEditorContext, useBlockInputStore }
