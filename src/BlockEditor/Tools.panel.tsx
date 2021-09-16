import * as React from "react"
import { Draggable, Droppable } from "react-beautiful-dnd"
import clsx from "clsx"
import { useBlockInputStore } from "./BlockEditorStoreProvider"
import isEqual from "react-fast-compare"

export const ToolsPanel = React.memo(function ToolsPanel(props) {
    const [setSelected, selected, tools] = useBlockInputStore(
        (state) => [state.setSelected, state.selected, state.tools],
        isEqual
    )

    const handleClickOutside = () => {
        setSelected(null)
    }

    // console.log("ToolsPanel render", tools)

    return (
        <aside
            className={clsx(
                "flex-0 bg-gray-100 py-2 transition-all",
                selected
                    ? "w-[50px] hover:bg-gray-200 cursor-pointer group"
                    : "w-[200px]"
            )}
            onClick={handleClickOutside}
        >
            <header className="text-center text-sm group-hover:underline">
                Tools
            </header>
            <Droppable droppableId="sidebar">
                {(provided, snapshot) => (
                    <section
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {tools
                            ? Object.keys(tools).map((name, index) => {
                                  if (selected) {
                                      return (
                                          <article
                                              className="bg-white shadow-xl rounded p-1 w-5 h-5 mx-auto my-4"
                                              key={`${name}-${index}`}
                                          />
                                      )
                                  }
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
