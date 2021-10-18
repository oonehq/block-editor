import * as React from "react"
import clsx from "clsx"
import throttle from "lodash/throttle"

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
    const editorRef = React.useRef(null)
    const isVisible = useOnScreen(editorRef)

    return (
        <main ref={editorRef}>
            {isVisible ? (
                <BlockEditorContext>
                    <BlockEditorInstance {...props} />
                </BlockEditorContext>
            ) : null}
        </main>
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

    // const highlightRef = React.useRef<any>(null)

    // const mouseMove = (e) => {
    //     if (e.target === highlightRef.current) {
    //         console.log("move to highlight")
    //         return
    //     }
    //     const targetBB = e.target.getBoundingClientRect()
    //     console.log("move", e, targetBB)
    //     highlightRef.current.style.position = "absolute"
    //     highlightRef.current.style.zIndex = 99999
    //     highlightRef.current.style.width = `${targetBB.width}px`
    //     highlightRef.current.style.height = `${targetBB.height}px`
    //     highlightRef.current.style.border = "1px deeppink dashed"
    //     // highlightRef.current.style.backgroundColor = "red"
    //     // highlightRef.current.style.opacity = 0.1
    //     highlightRef.current.style.top = `${targetBB.top + window.scrollY}px`
    //     highlightRef.current.style.left = `${targetBB.left + window.scrollX}px`
    //     highlightRef.current.style.userSelect = `none`
    //     highlightRef.current.style.pointerEvents = `none`
    //     highlightRef.current.style.transition = `all 300ms`
    // }

    // const handleMouseMove = useThrottle(mouseMove, 200)

    // React.useEffect(() => {
    //     if (!document.getElementById("highlight")) {
    //         const highlightNode = document.createElement("aside")
    //         highlightNode.setAttribute("id", "highlight")
    //         document.body.appendChild(highlightNode)
    //         highlightRef.current = highlightNode
    //     } else {
    //         highlightRef.current = document.getElementById("highlight")
    //     }

    //     if (props.source?.includes(".cs")) {
    //         document.addEventListener("mousemove", handleMouseMove)
    //     }

    //     return () => {
    //         document.removeEventListener("mousemove", handleMouseMove)
    //         highlightRef.current.remove()
    //     }
    // }, [])

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
        <main className="h-[85vh] border border-gray-200 rounded relative overflow-hidden">
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

const useThrottle = (cb, delay) => {
    const options = { leading: true, trailing: true } // add custom lodash options
    const cbRef = React.useRef(cb)
    // use mutable ref to make useCallback/throttle not depend on `cb` dep
    React.useEffect(() => {
        cbRef.current = cb
    })
    return React.useCallback(
        throttle((...args) => cbRef.current(...args), delay, options),
        [delay]
    )
}

const useOnScreen = (ref) => {
    const [isIntersecting, setIntersecting] = React.useState(false)

    const observer = new IntersectionObserver(([entry]) =>
        setIntersecting(entry.isIntersecting)
    )

    React.useEffect(() => {
        observer.observe(ref.current)
        // Remove the observer as soon as the component is unmounted
        return () => {
            observer.disconnect()
        }
    }, [])

    return isIntersecting
}
