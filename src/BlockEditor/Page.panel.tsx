import * as React from "react"

import { Droppable, Draggable } from "react-beautiful-dnd"
import clsx from "clsx"
import { useBlockInputStore } from "./useBlocksInputStore"
import { ErrorBoundary } from "react-error-boundary"
import isEqual from "react-fast-compare"

import { ChevronDown, ChevronUp, Move, Trash } from "./Icons"

export const PagePanel = React.memo(function PagePanel(props) {
    const blocks = useBlockInputStore(
        (state) =>
            state.blocks.map((block) => ({
                id: block.id,
                type: block.type,
                version: block.version,
            })),
        isEqual
    )

    console.log("PagePanel render", blocks)

    return (
        <Droppable droppableId="page">
            {(provided, snapshot) => (
                <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={clsx(
                        "relative min-h-[150px] w-full border border-gray-200 bg-white"
                        // "min-w-[1024px]"
                    )}
                >
                    {blocks?.map((block, index) => {
                        return (
                            <PageBlock
                                block={block}
                                index={index}
                                key={`block-${block.id}`}
                            />
                        )
                    })}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    )
})

const MissingBlock = (props) => {
    return (
        <main className={"py-4 flex items-center justify-center"}>
            <p className="border border-red-500 p-4 rounded">
                Missing block type "{props?.type}"
            </p>
        </main>
    )
}

const PageBlock = React.memo(function PageBlock(props: any) {
    const [
        setSelected,
        isSelected,
        deleteBlock,
        moveBlock,
        blocksCount,
        tools,
    ] = useBlockInputStore(
        (state) => [
            state.setSelected,
            state.selected === props.block.id,
            state.deleteBlock,
            state.moveBlock,
            state.blocks.length,
            state.tools,
        ],
        isEqual
    )

    const blockProps = useBlockInputStore(
        (state) => state.blocks.find((block) => block.id === props.block.id),
        isEqual
    )

    const toolbarRef = React.useRef(null)

    const handleClick = (e) => {
        setSelected(props.block.id)
        e.stopPropagation()
    }

    const handleDelete = (e) => {
        deleteBlock(props.block.id)
        handlePrevent(e)
    }

    const handleMoveUp = (e) => {
        if (props.index > 0) {
            moveBlock(props.index, Math.max(props.index - 1, 0))
        }
        handlePrevent(e)
    }

    const handleMoveDown = (e) => {
        if (props.index + 1 <= blocksCount - 1) {
            moveBlock(props.index, Math.min(props.index + 1, blocksCount - 1))
        }
        handlePrevent(e)
    }

    const handlePrevent = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const Block = tools[props.block.type]?.Component ?? MissingBlock

    console.log("PageBlock render", blockProps)

    return (
        <Draggable draggableId={props.block.id} index={props.index}>
            {(provided, snapshot) => (
                <section
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={clsx(
                        "relative",
                        isSelected
                            ? `ring ring-gray-300`
                            : "hover:ring ring-gray-300"
                    )}
                    onClick={handleClick}
                >
                    <aside
                        ref={toolbarRef}
                        className={clsx(
                            `absolute -top-3 right-1 z-[9999]`,
                            isSelected ? "block" : "hidden"
                        )}
                    >
                        <section className="btn-group">
                            <button
                                className="btn btn-xs"
                                onClick={handleMoveUp}
                            >
                                <ChevronUp className="w-4" label="Move up" />
                            </button>
                            <button
                                className="btn btn-xs"
                                onClick={handleMoveDown}
                            >
                                <ChevronDown className="w-4" label="Move up" />
                            </button>
                            <div
                                className="btn btn-xs"
                                {...provided.dragHandleProps}
                            >
                                <Move className="w-4" label="Move up" />
                            </div>
                            <button
                                className="btn btn-xs"
                                onClick={handleDelete}
                            >
                                <Trash className="w-4" label="Move up" />
                            </button>
                        </section>
                    </aside>
                    <div className="pointer-events-none">
                        <ErrorBoundary
                            FallbackComponent={({
                                error,
                                resetErrorBoundary,
                            }) => (
                                <div role="alert">
                                    <div>Oh no</div>
                                    <div className="break-words">
                                        {error.message}
                                    </div>
                                    <button
                                        onClick={() => {
                                            // though you could accomplish this with a combination
                                            // of the FallbackCallback and onReset props as well.
                                            resetErrorBoundary()
                                        }}
                                    >
                                        Try again
                                    </button>
                                </div>
                            )}
                        >
                            <Block {...blockProps} />
                        </ErrorBoundary>
                    </div>
                </section>
            )}
        </Draggable>
    )
})
