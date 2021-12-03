import * as React from "react"

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
import { useOnScreen } from "utils/useOnScreen"

export enum PermissionEnum {
  edit = "edit",
  compose = "compose",
}

interface BlockEditorProps {
  value: any
  tools: any
  source?: string
  onChange: (value: any) => void
  permissions?: Array<PermissionEnum>
  settings?: Record<string, any>
}

export const BlockEditor = (props: BlockEditorProps) => {
  const editorRef = React.useRef(null)
  const isVisible = useOnScreen(editorRef)

  // console.log("BlockEditor isVisible", isVisible)

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
    permissions,
    setTools,
    setSettings,
    setSelectedInput,
  ] = useBlockInputStore(
    (state) => [
      state.addBlock,
      state.moveBlock,
      state.setSelected,
      state.setValue,
      state.init,
      state.setToolbarOpen,
      state.permissions,
      state.setTools,
      state.setSettings,
      state.setSelectedInput,
    ],
    isEqual
  )

  React.useEffect(() => {
    initBlocks(
      props.source,
      props.tools,
      props.settings,
      props.onChange,
      props.permissions
    )
  }, [])

  React.useEffect(() => {
    setTools(props.tools)
  }, [props.tools])

  React.useEffect(() => {
    setSettings(props.settings)
  }, [props.settings])

  React.useEffect(() => {
    setValue(props.value)
  }, [props.value])

  const handleClickOutside = () => {
    setSelected(null)
    setSelectedInput(null)
    setToolbarOpen(false)
  }

  useHotkeys("esc", handleClickOutside)

  const handleDragStart = (event) => {
    setToolbarOpen(false)
    setSelected(null)
    setSelectedInput(null)
  }

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

  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()

    setToolbarOpen(true)
  }

  console.log("BlockEditor render")

  return (
    <main className="border border-gray-200 rounded relative overflow-hidden">
      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <header className="w-full h-8 bg-gray-50 flex justify-start items-center px-1">
          {permissions.includes("add") ? (
            <button className="btn btn-outline btn-xs" onClick={handleAdd}>
              + Přidat blok
            </button>
          ) : null}
        </header>

        <ToolsPanel />

        <section className="flex">
          <section className="bg-gray-300 flex-1 overflow-auto p-6 relative min-h-[500px]">
            <PagePanel />
          </section>

          <SettingsPanel />
        </section>
      </DragDropContext>
    </main>
  )
},
isEqual)
