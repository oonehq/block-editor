import * as React from "react"
import clsx from "clsx"

import { DragDropContext } from "react-beautiful-dnd"
import { useBlockInputStore } from "./useBlocksInputStore"
import isEqual from "react-fast-compare"
import { useHotkeys } from "react-hotkeys-hook"

import { SettingsPanel } from "./Settings.panel"

import { ToolsPanel } from "./Tools.panel"
import { PagePanel } from "./Page.panel"

interface BlockEditorProps {
    value: any
    tools: any
    onChange: (value: any) => void
}

export const BlockEditor = React.memo(function BlockEditor(
    props: BlockEditorProps
) {
    const [addBlock, moveBlock, setSelected, initBlocks] = useBlockInputStore(
        (state) => [
            state.addBlock,
            state.moveBlock,
            state.setSelected,
            state.init,
        ],
        isEqual
    )

    React.useEffect(() => {
        initBlocks(props.value, props.tools)
    }, [])

    React.useEffect(() => {
        const unsubscribe = useBlockInputStore.subscribe(
            (blocks) => {
                props?.onChange(blocks)
            },
            (state) => state.blocks
        )

        return () => {
            unsubscribe()
        }
    }, [])

    const handleClickOutside = () => {
        setSelected(null)
    }
    useHotkeys("esc", handleClickOutside)

    const handleDragEnd = (result) => {
        console.log("result", result)
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

    console.log("BlockEditor render")

    return (
        <main className="flex min-h-[500px] max-h-[80vh] border border-gray-200 rounded">
            <DragDropContext onDragEnd={handleDragEnd}>
                <ToolsPanel />

                <section
                    className="bg-gray-300 flex-1 overflow-auto p-4 max-h-[80vh]"
                    onClick={handleClickOutside}
                >
                    <PagePanel />
                </section>

                <SettingsPanel />
            </DragDropContext>
        </main>
    )
},
isEqual)
