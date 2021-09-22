import * as React from "react"
import clsx from "clsx"

import { DragDropContext } from "react-beautiful-dnd"
// import { useBlockInputStore } from "./useBlocksInputStore"
import isEqual from "react-fast-compare"
import { useHotkeys } from "react-hotkeys-hook"

import { SettingsPanel } from "./Settings.panel"

import { ToolsPanel } from "./Tools.panel"
import { PagePanel } from "./Page.panel"
import {
    BlockEditorContext,
    useBlockInputStore,
} from "./BlockEditorStoreProvider"

interface BlockEditorProps {
    value: any
    tools: any
    source?: string
    onChange: (value: any) => void
}

export const BlockEditor = (props: BlockEditorProps) => {
    return (
        <BlockEditorContext>
            <BlockEditorInstance {...props} />
        </BlockEditorContext>
    )
}

export const BlockEditorInstance = React.memo(function BlockEditorInstance(
    props: BlockEditorProps
) {
    const [
        addBlock,
        moveBlock,
        setSelected,
        setValue,
        initBlocks,
        setToolbarOpen,
    ] = useBlockInputStore(
        (state) => [
            state.addBlock,
            state.moveBlock,
            state.setSelected,
            state.setValue,
            state.init,
            state.setToolbarOpen,
        ],
        isEqual
    )

    React.useEffect(() => {
        initBlocks(props.source, props.tools, props.onChange)
    }, [])

    React.useEffect(() => {
        setValue(props.value)
    }, [props.value])

    const handleClickOutside = () => {
        setSelected(null)
        setToolbarOpen(false)
    }

    useHotkeys("esc", handleClickOutside)

    const handleDragStart = (event) => {
        setToolbarOpen(false)
    }

    const handleDragEnd = (result) => {
        // console.log("result", result)
        const { source, destination } = result

        // dropped outside
        if (!destination) {
            return
        }

        if (destination?.droppableId === "page") {
            if (source?.droppableId === "sidebar") {
                addBlock(result.draggableId, destination.index)
            }
            if (source?.droppableId === "page") {
                moveBlock(source?.index, destination?.index)
            }
        }
    }

    const handleAdd = (e) => {
        e.preventDefault()
        e.stopPropagation()

        setToolbarOpen(true)
    }

    // console.log("BlockEditor render")

    return (
        <main className="min-h-[500px] max-h-[85vh] border border-gray-200 rounded relative overflow-hidden">
            <DragDropContext
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <header className="w-full h-8 bg-gray-50 flex justify-start items-center px-1">
                    <button
                        className="btn btn-outline btn-xs"
                        onClick={handleAdd}
                    >
                        + Přidat blok
                    </button>
                </header>

                <ToolsPanel />

                <section className="flex">
                    <section
                        className="bg-gray-300 flex-1 overflow-auto p-4 h-[80vh] relative"
                        onClick={handleClickOutside}
                    >
                        <PagePanel />
                    </section>

                    <SettingsPanel />
                </section>
            </DragDropContext>
        </main>
    )
},
isEqual)
