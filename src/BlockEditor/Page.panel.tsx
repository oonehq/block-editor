import * as React from "react"

import { Droppable, Draggable } from "react-beautiful-dnd"
import clsx from "clsx"
import { useBlockInputStore } from "./BlockEditorStoreProvider"
import { ErrorBoundary } from "react-error-boundary"
import isEqual from "react-fast-compare"
import { useHotkeys } from "react-hotkeys-hook"

import { ChevronDown, ChevronUp, Move, Trash } from "./Icons"
import { useThrottle } from "utils/useThrottle"

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

  useCopyPasteBlocks()

  // console.log("PagePanel render", blocks)

  return (
    <Droppable droppableId="page">
      {(provided, snapshot) => (
        <section
          id="page-wrapper"
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={clsx(
            "relative min-h-[150px] w-full border border-gray-200 bg-white"
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
          <SelectedHighlightNode />
          <HoverHighlightNode />
        </section>
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
    setToolbarOpen,
  ] = useBlockInputStore(
    (state) => [
      state.setSelected,
      state.selected === props.block.id,
      state.deleteBlock,
      state.moveBlock,
      state.blocks.length,
      state.tools,
      state.setToolbarOpen,
    ],
    isEqual
  )

  const blockProps = useBlockInputStore(
    (state) => state.blocks.find((block) => block.id === props.block.id),
    isEqual
  )

  const handleClick = (e) => {
    setSelected(props.block.id)
    setToolbarOpen(false)
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

  const Block = tools[props.block.type]?.Component ?? MissingBlock

  console.log("PageBlock render", props.index, blockProps)

  return (
    <Draggable draggableId={props.block.id} index={props.index}>
      {(provided, snapshot) => (
        <section
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={clsx("relative")}
          onClick={handleClick}
          data-block-type={props.block.type}
          data-block-id={props.block.id}
        >
          <aside
            className={clsx(
              `absolute -top-3 right-1 z-[9999]`,
              isSelected ? "block" : "hidden"
            )}
          >
            <section className="btn-group">
              <button className="btn btn-xs" onClick={handleMoveUp}>
                <ChevronUp className="w-4" label="Move up" />
              </button>
              <button className="btn btn-xs" onClick={handleMoveDown}>
                <ChevronDown className="w-4" label="Move up" />
              </button>
              <div className="btn btn-xs" {...provided.dragHandleProps}>
                <Move className="w-4" label="Move up" />
              </div>
              <button className="btn btn-xs" onClick={handleDelete}>
                <Trash className="w-4" label="Move up" />
              </button>
            </section>
          </aside>
          <div className="pointer-events-none">
            <ErrorBoundary
              FallbackComponent={({ error, resetErrorBoundary }) => (
                <div role="alert">
                  <div>Oh no</div>
                  <div className="break-words">{error.message}</div>
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
              {/* {JSON.stringify(blockProps.data)} */}
              <Block {...blockProps} />
            </ErrorBoundary>
          </div>
        </section>
      )}
    </Draggable>
  )
})

const handlePrevent = (e) => {
  e.preventDefault()
  e.stopPropagation()
}

const useCopyPasteBlocks = () => {
  const [selectedBlockProps, selectedIndex, copyBlock] = useBlockInputStore(
    (state) => [
      state.blocks.find((block) => block.id === state.selected),
      state.blocks.findIndex((block) => block.id === state.selected),
      state.copyBlock,
    ]
  )

  // console.log("useCopyPasteBlocks", selectedBlockProps, selectedIndex)

  const handleCopyBlock = (e) => {
    // console.log("copy pressed", selectedBlockProps)

    if (!selectedBlockProps) {
      return
    }

    handlePrevent(e)
    // console.log(
    //     "copy block",
    //     selectedBlockProps.type,
    //     selectedBlockProps._$settings
    // )
    const copyPayload = JSON.stringify({
      action: "COPY_BLOCK",
      payload: selectedBlockProps,
    })

    if ("clipboard" in navigator) {
      navigator.clipboard.writeText(copyPayload)
    }
  }

  const handlePasteBlock = (e) => {
    handlePrevent(e)

    if ("clipboard" in navigator) {
      const pasteIndex = Math.max(selectedIndex, 0)

      navigator.clipboard.readText().then((value) => {
        // console.log("value", value)
        try {
          const clipboard = JSON.parse(value)
          // console.log("clipboard", clipboard)
          if (
            clipboard?.action === "COPY_BLOCK" &&
            typeof clipboard?.payload?.type === "string"
          ) {
            // console.log(
            //     "copyBlock",
            //     clipboard?.payload?.type,
            //     "to index",
            //     pasteIndex
            // )
            copyBlock(clipboard.payload, pasteIndex)
          }
        } catch (e) {
          console.error("invalid paste payload", e)
        }
      })
    }
  }

  useHotkeys("ctrl+c, command+c", handleCopyBlock, {}, [selectedBlockProps])
  useHotkeys("ctrl+v, command+v", handlePasteBlock, {}, [selectedIndex])

  return null
}

const SelectedHighlightNode = (props) => {
  const [selected] = useBlockInputStore((state) => [state.selected], isEqual)

  const [computedStyle, setComputedStyle] = React.useState<any>({})

  const pageWrapperRef = React.useRef<any>(null)
  const selectedRef = React.useRef<any>(null)

  React.useEffect(() => {
    pageWrapperRef.current = document.getElementById("page-wrapper")
  }, [])

  React.useEffect(() => {
    if (selected) {
      selectedRef.current = document.querySelector(
        `[data-block-id='${selected}']`
      )
      const targetBB = selectedRef.current.getBoundingClientRect()
      const pageWrapperBB = pageWrapperRef.current.getBoundingClientRect()

      console.log("selected highlight", {
        selected,
        targetBB,
      })

      setComputedStyle({
        width: `${targetBB.width}px`,
        height: `${targetBB.height}px`,
        top: `${targetBB.top - pageWrapperBB.top - 1}px`,
        left: `${targetBB.left - pageWrapperBB.left - 1}px`,
        userSelect: "none",
      })
    } else {
      setComputedStyle({
        display: "none",
      })
    }
  }, [selected])

  return (
    <aside
      className={"absolute border-[2px] border-yellow-300 pointer-events-none"}
      style={{
        zIndex: 999,
        ...computedStyle,
      }}
    ></aside>
  )
}

const HoverHighlightNode = (props) => {
  const [tools] = useBlockInputStore((state) => [state.tools], isEqual)

  const [computedStyle, setComputedStyle] = React.useState<any>({})
  const [blockType, setBlockType] = React.useState<any>("")

  const pageWrapperRef = React.useRef<any>(null)

  const handleMouseMove = useThrottle((e) => {
    const blockType = e.target.getAttribute("data-block-type")
    if (blockType) {
      setBlockType(blockType)
      const targetBB = e.target.getBoundingClientRect()
      const pageWrapperBB = pageWrapperRef.current.getBoundingClientRect()

      console.log("move", {
        blockType,
        e,
        targetBB,
      })

      setComputedStyle({
        width: `${targetBB.width}px`,
        height: `${targetBB.height}px`,
        top: `${targetBB.top - pageWrapperBB.top - 1}px`,
        left: `${targetBB.left - pageWrapperBB.left - 1}px`,
        transition: "all 100ms",
        userSelect: "none",
      })
    }
  }, 300)

  React.useEffect(() => {
    pageWrapperRef.current = document.getElementById("page-wrapper")

    pageWrapperRef.current.addEventListener("mousemove", handleMouseMove)
    // pageWrapperRef.current.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      pageWrapperRef.current.removeEventListener("mousemove", handleMouseMove)
      //   pageWrapperRef.current.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <aside
      className={
        "absolute border-[2px] border-yellow-300 border-dashed pointer-events-none"
      }
      style={{
        zIndex: 999,
        ...computedStyle,
      }}
    >
      <section className="absolute top-[-2px] left-[-2px] bg-yellow-300 rounded-br text-xs px-1 py-0.5">
        {tools?.[blockType]?.title}
      </section>
    </aside>
  )
}
