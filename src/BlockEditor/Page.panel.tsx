import * as React from "react"

import { Droppable, Draggable } from "react-beautiful-dnd"
import clsx from "clsx"
import { useBlockInputStore } from "./BlockEditorStoreProvider"
import { ErrorBoundary } from "react-error-boundary"
import isEqual from "react-fast-compare"
import { useHotkeys } from "react-hotkeys-hook"

import { ChevronDown, ChevronUp, Close, Move, Trash } from "./Icons"
import { useThrottle } from "utils/useThrottle"
import { useCurrentRecord } from "./useCurrentRecord"
import { usePrevious } from "utils/usePrevious"
import useResizeObserver from "@react-hook/resize-observer"

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

  console.log("PagePanel render", blocks)

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
          <HoverHighlightNode />
          <SelectedHighlightNode />
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
    permissions,
    currentBlock,
  ] = useBlockInputStore(
    (state) => [
      state.setSelected,
      state.selected === props.block.id,
      state.deleteBlock,
      state.moveBlock,
      state.blocks.length,
      state.tools,
      state.setToolbarOpen,
      state.permissions,
      state.blocks.find((block) => block.id === props.block.id),
    ],
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

  let Block =
    tools.find((tool) => tool.type === props.block.type)?.Component ??
    MissingBlock

  const record = useCurrentRecord()

  let blockProps = {
    ...currentBlock,
    record,
  }

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
          {permissions.includes("compose") ? (
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
          ) : null}

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

const HighlightInput = (props) => {
  const [selected, setSelectedInput, selectedInput] = useBlockInputStore(
    (state) => [state.selected, state.setSelectedInput, state.selectedInput],
    isEqual
  )

  // console.log("HighlightInput", props, selected)

  const settings = JSON.parse(props.input.getAttribute("data-input"))

  const [computedStyle, setComputedStyle] = React.useState<any>({
    display: "none",
  })

  const pageWrapperRef = React.useRef<any>(null)
  const selectedRef = React.useRef<any>(null)

  React.useEffect(() => {
    pageWrapperRef.current = document.getElementById("page-wrapper")
  }, [])

  const handleOpenSettings = () => {
    setSelectedInput(settings)
  }

  const handleCloseInput = (e) => {
    handlePrevent(e)
    setSelectedInput(null)
  }

  const isSelected = selectedInput?.source === settings?.source

  const prevSelected = usePrevious(selected)

  React.useEffect(() => {
    if (selected !== prevSelected) {
      setSelectedInput(null)
    }
  }, [selected, prevSelected])

  React.useEffect(() => {
    let observer: ResizeObserver | null = null

    if (selected) {
      selectedRef.current = document.querySelector(
        `[data-block-id='${selected}']`
      )

      const parentBB = selectedRef.current.getBoundingClientRect()
      const targetBB = props.input.getBoundingClientRect()
      const pageWrapperBB = pageWrapperRef.current.getBoundingClientRect()

      setComputedStyle({
        width: `${targetBB.width}px`,
        height: `${targetBB.height}px`,
        top: `${targetBB.top - pageWrapperBB.top - 1}px`,
        left: `${targetBB.left - parentBB.left - 1}px`,
        userSelect: "none",
      })
    } else {
      setComputedStyle({
        display: "none",
      })
    }

    return () => {
      observer?.disconnect()
    }
  }, [selected, props.input])

  return (
    <aside
      onClick={handleOpenSettings}
      className={clsx(
        "absolute border-[2px] border-purple-300 hover:border-solid",
        isSelected ? "border-solid" : "border-dashed"
      )}
      style={{
        zIndex: 999,
        ...computedStyle,
      }}
    >
      <section
        className={clsx(
          "absolute top-0 left-[-2px] -translate-y-full rounded-tl rounded-tr text-white text-xs px-1 py-0.5 flex items-center group",
          isSelected ? "bg-purple-600" : "bg-purple-400"
        )}
      >
        {settings.label} - {settings.source}@{settings.settings}
        {isSelected ? (
          <button
            className="bg-transparent border-none group hover:bg-gray-800 rounded-full h-3 inline-flex justify-center items-center ml-1"
            onClick={handleCloseInput}
          >
            <Close className="w-3 text-white" label="Close" />
          </button>
        ) : null}
      </section>
    </aside>
  )
}

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
  const [selected, value, tools, setSelected] = useBlockInputStore(
    (state) => [state.selected, state.value, state.tools, state.setSelected],
    isEqual
  )

  const [blockType, setBlockType] = React.useState<any>("")
  const [selectedInputs, setSelectedInputs] = React.useState<any>([])

  const [computedStyle, setComputedStyle] = React.useState<any>({})

  const pageRef = React.useRef<any>(null)
  const blockRef = React.useRef<any>(null)

  const handleClose = (e) => {
    handlePrevent(e)
    setSelected(null)
  }

  React.useLayoutEffect(() => {
    pageRef.current = document.getElementById("page-wrapper")
    blockRef.current = document.querySelector(`[data-block-id='${selected}']`)
  }, [selected])

  const pageWatchBB = useBoundingBox(document.getElementById("page-wrapper"))
  const blocWatchkBB = useBoundingBox(
    document.querySelector(`[data-block-id='${selected}']`)
  )

  // console.log("SelectedBlock", pageWatchBB, blocWatchkBB)

  React.useEffect(() => {
    if (
      selected &&
      pageWatchBB &&
      blocWatchkBB &&
      blockRef.current &&
      pageRef.current
    ) {
      const blockType = blockRef.current.getAttribute("data-block-type")
      setBlockType(blockType)
      setSelectedInputs(
        Array.from(blockRef.current.querySelectorAll("[data-input]"))
      )

      const pageBB = pageRef.current.getBoundingClientRect()
      const blockBB = blockRef.current.getBoundingClientRect()

      setComputedStyle({
        width: `${blockBB.width}px`,
        height: `${blockBB.height}px`,
        top: `${blockBB.top - pageBB.top - 1}px`,
        left: `${blockBB.left - pageBB.left - 1}px`,
        userSelect: "none",
      })
    } else {
      setComputedStyle({
        display: "none",
      })
    }
  }, [selected, pageWatchBB, blocWatchkBB])

  const tool = tools.find((tool) => tool.type === blockType)

  // console.log("selectedInputs", selectedInputs)

  return (
    <>
      <aside
        className={
          "absolute border-[2px] border-yellow-300 pointer-events-none"
        }
        style={{
          zIndex: 999,
          ...computedStyle,
        }}
      >
        <section className="absolute top-0 left-[-2px] -translate-y-full bg-yellow-300 rounded-tl rounded-tr text-xs px-1 py-0.5 flex items-center pointer-events-auto">
          {tool?.title ?? tool?.type}

          <button
            className="bg-transparent border-none group hover:bg-gray-800 rounded-full h-3 inline-flex justify-center items-center ml-1"
            onClick={handleClose}
          >
            <Close
              className="w-3 text-black group-hover:text-white"
              label="Close"
            />
          </button>
        </section>
      </aside>
      {selectedInputs.map((input) => {
        return <HighlightInput input={input} />
      })}
    </>
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

      //   console.log("move", {
      //     blockType,
      //     e,
      //     targetBB,
      //   })

      setComputedStyle({
        width: `${targetBB.width}px`,
        height: `${targetBB.height}px`,
        top: `${targetBB.top - pageWrapperBB.top - 1}px`,
        left: `${targetBB.left - pageWrapperBB.left - 1}px`,
        transition: "all 100ms",
        userSelect: "none",
      })
    } else {
      setComputedStyle({ display: "none" })
    }
  }, 300)

  React.useEffect(() => {
    pageWrapperRef.current = document.getElementById("page-wrapper")

    pageWrapperRef.current.addEventListener("mousemove", handleMouseMove)

    return () => {
      pageWrapperRef.current.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const tool = tools.find((tool) => tool.type === blockType)

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
      <section className="absolute top-0 left-[-2px] -translate-y-full bg-yellow-300 rounded-tl rounded-tr text-xs px-1 py-0.5 flex items-center">
        {tool?.title ?? tool?.type}
      </section>
    </aside>
  )
}

const useBoundingBox = (target: any) => {
  const [bb, setBB] = React.useState<DOMRect>()

  React.useLayoutEffect(() => {
    if (target?.getBoundingClientRect) {
      setBB(target.getBoundingClientRect())
    } else if (target?.current) {
      setBB(target.current.getBoundingClientRect())
    }
  }, [target])

  // Where the magic happens
  useResizeObserver(target, (entry) => {
    if (entry && entry.target) {
      setBB(entry.target.getBoundingClientRect())
    }
  })

  return bb
}
