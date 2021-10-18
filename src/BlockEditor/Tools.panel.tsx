import * as React from "react"
import { Draggable, Droppable } from "react-beautiful-dnd"
import clsx from "clsx"
import { useClickOutside } from "utils/useClickOutside"

import { useBlockInputStore } from "./BlockEditorStoreProvider"
import isEqual from "react-fast-compare"
import { Search } from "./Icons"

export const ToolsPanel = React.memo(function ToolsPanel(props) {
    const [toolbarOpen, tools] = useBlockInputStore(
        (state) => [state.toolbarOpen, state.tools],
        isEqual
    )

    return (
        <aside
            className={clsx(
                "top-0 w-48 bg-gray-100 py-2 absolute h-full overflow-auto ease-in-out transition-all duration-300 z-[99999]",
                toolbarOpen ? "left-0" : "-left-48"
            )}
        >
            <header className="text-center text-sm group-hover:underline">
                Bloky
            </header>

            <ToolsListWithFilter tools={tools} />
        </aside>
    )
})

const ToolsListWithFilter = (props) => {
    const [selectedTag, setSelectedTag] = React.useState("")

    return (
        <section>
            <TagFilter
                tools={props.tools}
                selectedTag={selectedTag}
                setSelectedTag={setSelectedTag}
            />

            <Droppable droppableId="sidebar">
                {(provided, snapshot) => (
                    <section
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {props.tools
                            ? Object.keys(props.tools).map((name, index) => {
                                  if (
                                      selectedTag.length > 0 &&
                                      Array.isArray(props.tools[name].tags) &&
                                      !props.tools[name].tags.includes(
                                          selectedTag
                                      )
                                  ) {
                                      return null
                                  }

                                  return (
                                      <ToolsItem
                                          name={name}
                                          index={index}
                                          block={props.tools[name]}
                                          key={`${name}-${index}`}
                                      />
                                  )
                              })
                            : null}
                    </section>
                )}
            </Droppable>
        </section>
    )
}

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

const TagFilter = (props) => {
    const [inputActive, setInputActive] = React.useState(false)
    const [tags, setTags] = React.useState<string[]>([])

    const ref = React.useRef(null)
    useClickOutside(ref, () => (inputActive ? setInputActive(false) : null))

    React.useEffect(() => {
        let tags = Object.keys(props.tools).reduce((result, toolName) => {
            const tool = props.tools[toolName]
            if (tool && tool.tags && Array.isArray(tool.tags)) {
                tool.tags.forEach((tag: string) => {
                    if (!result.includes(tag)) {
                        result.push(tag)
                    }
                })
            }
            return result
        }, [] as string[])

        setTags(tags)
    }, [props.tools])

    const prevent = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleFocus = (e) => {
        prevent(e)
        setInputActive(true)
    }

    const handleSelected = (e) => {
        console.log("handleSelected", e.currentTarget.getAttribute("data-tag"))
        prevent(e)
        const nextTag = e.currentTarget.getAttribute("data-tag")
        if (nextTag === props.selectedTag) {
            props.setSelectedTag("")
        } else {
            props.setSelectedTag(nextTag)
        }
        setInputActive(false)
    }

    return (
        <aside className="px-2">
            <header className="flex items-center overflow-hidden">
                <button
                    onClick={handleFocus}
                    className={
                        "btn btn-xs btn-outline border-none m-0.5 italic opacity-75 flex-none"
                    }
                >
                    <Search className="w-4 h-4" />
                    {!props.selectedTag ? (
                        <span className="ml-1">Filtrovat</span>
                    ) : null}
                </button>

                {props.selectedTag ? (
                    <TagButton
                        tag={props.selectedTag}
                        onClick={handleSelected}
                        selected
                    />
                ) : null}
            </header>

            <section className="relative">
                {inputActive ? (
                    <section
                        className="absolute top-0 -left-1 bg-white shadow rounded pb-0.5 px-0.5"
                        ref={ref}
                    >
                        {tags.map((tag) => {
                            return (
                                <TagButton
                                    tag={tag}
                                    key={tag}
                                    onClick={handleSelected}
                                />
                            )
                        })}
                    </section>
                ) : null}
            </section>
        </aside>
    )
}

const TagButton = (props) => {
    const handleClick = (e) => {
        console.log("tagbutton click")
        props.onClick(e)
    }
    return (
        <button
            onClick={handleClick}
            data-tag={props.tag}
            className={clsx(
                "btn btn-xs h-auto m-0.5 inline-flex flex-nowrap items-center flex-shrink",
                props.selected ? "" : "btn-outline"
            )}
        >
            {props.selected ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-3 h-3 mr-1 stroke-current"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                    ></path>
                </svg>
            ) : null}
            <span className="overflow-ellipsis">{props.tag}</span>
        </button>
    )
}
