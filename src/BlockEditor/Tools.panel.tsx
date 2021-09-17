import * as React from "react"
import { Draggable, Droppable } from "react-beautiful-dnd"
import clsx from "clsx"
import { useBlockInputStore } from "./BlockEditorStoreProvider"
import isEqual from "react-fast-compare"

export const ToolsPanel = React.memo(function ToolsPanel(props) {
    const [setToolbarOpen, toolbarOpen, tools] = useBlockInputStore(
        (state) => [state.setToolbarOpen, state.toolbarOpen, state.tools],
        isEqual
    )

    const handleClickOutside = () => {
        setToolbarOpen(false)
    }

    // console.log("ToolsPanel render", tools)

    return (
        <aside
            className={clsx(
                "top-0 w-48 bg-gray-100 py-2 absolute h-full overflow-auto ease-in-out transition-all duration-300 z-[99999]",
                toolbarOpen ? "left-0" : "-left-48"
            )}
            onClick={handleClickOutside}
        >
            <header className="text-center text-sm group-hover:underline">
                Bloky
            </header>
            <Droppable droppableId="sidebar">
                {(provided, snapshot) => (
                    <section
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {tools
                            ? Object.keys(tools).map((name, index) => {
                                  return (
                                      <ToolsItem
                                          name={name}
                                          index={index}
                                          block={tools[name]}
                                          key={`${name}-${index}`}
                                      />
                                  )
                              })
                            : null}
                        {provided.placeholder}
                    </section>
                )}
            </Droppable>
        </aside>
    )
})

const ToolsItem = (props) => {
    // console.log("ToolsItem render")
    return (
        <article className="m-4">
            <Draggable draggableId={props.name} index={props.index}>
                {(provided, snapshot) => (
                    <article
                        className="bg-white shadow-xl rounded p-1"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        <header className="text-center text-sm">
                            {props.block?.title
                                ? props.block.title
                                : props.name}
                        </header>

                        {props.block?.previewImage ? (
                            <img src={props.block.previewImage} />
                        ) : null}
                    </article>
                )}
            </Draggable>
        </article>
    )
}
