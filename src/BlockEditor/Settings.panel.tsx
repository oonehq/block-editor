import * as React from "react"
import { ErrorBoundary } from "react-error-boundary"
import clsx from "clsx"
import isEqual from "react-fast-compare"
import { Rnd } from "react-rnd"

import { useBlockInputStore } from "./BlockEditorStoreProvider"
import { ChevronDown, Close } from "./Icons"
import { useBlockEditorStore } from "./useBlockEditorStore"

const dev = process.env.NODE_ENV !== "production"

export const SettingsPanel = React.memo(function SettingsPanel(props) {
  const [fixedSettingsPanel, setFixedSettingsPanel] = useBlockEditorStore(
    (state) => [state.fixedSettingsPanel, state.setFixedSettingsPanel]
  )

  // source is same as in react-admin = path to section of record/object that is edited
  const blockMeta = useBlockInputStore((state) => {
    let block = state.blocks.find((block) => block.id === state.selected)

    if (block) {
      let tool = state.tools.find((tool) => tool.type === block.type)

      let blockIndex = state.blocks.findIndex(
        (block) => block.id == state.selected
      )

      return {
        id: block.id,
        type: block.type,
        version: block.version,
        title: tool?.title,
        source: `${state.source}[${blockIndex}]._$settings`,
        Settings: state?.tools?.find((tool) => tool?.type === block.type)
          ?.Settings,
      }
    }

    return null
  }, isEqual)

  const settingsMeta = useBlockInputStore((state) => {
    if (state.selectedInput) {
      let settings = state.settings.find(
        (sett) => sett.type == state.selectedInput.settings
      )
      return {
        ...settings,
        props: {
          ...state.selectedInput,
          source: `${
            state.selectedInput.source[0] === "." ? blockMeta.source : ""
          }${state.selectedInput.source}`,
        },
      }
    }

    return null
  }, isEqual)

  const [setSelected, tools, setSelectedInput, settings] = useBlockInputStore(
    (state) => [
      state.setSelected,
      state.tools,
      state.setSelectedInput,
      state.settings,
    ],
    isEqual
  )

  const handleClose = (e) => {
    setSelected(null)
    setSelectedInput(null)
    e.preventDefault()
  }

  const handleCloseInput = (e) => {
    setSelectedInput(null)
    e.preventDefault()
  }

  const handleToggleFixedSidebar = () => {
    setFixedSettingsPanel(!fixedSettingsPanel)
  }

  console.log("SettingsPanel render", blockMeta, settingsMeta)

  return (
    <aside
      className={clsx(
        "bg-gray-50 flex-0 p-2 overflow-auto max-h-[80vh]",
        fixedSettingsPanel ? "w-[340px] xl:w-[400px]" : "w-0"
      )}
    >
      {settingsMeta ? (
        <SettingsWrapper
          id={`${blockMeta?.id}/${settingsMeta.props.source}`}
          height={"auto"}
        >
          <header className="text-white bg-purple-600 cursor-move dragHandle p-1 pl-2 flex-none h-8 flex items-center justify-between">
            <section className="truncate">
              {settingsMeta.props.label ?? settingsMeta.props.source}
            </section>

            <aside className={"flex items-center justify-center"}>
              <button
                className="btn btn-xs bg-transparent border-none"
                onClick={handleToggleFixedSidebar}
              >
                <ChevronDown
                  className={clsx(
                    "w-4 text-white transform",
                    fixedSettingsPanel ? "rotate-90" : "-rotate-90"
                  )}
                  label="Move to sidebar"
                />
              </button>
              <button
                className="btn btn-xs bg-transparent border-none"
                onClick={handleCloseInput}
              >
                <Close className="w-4 text-white" label="Close" />
              </button>
            </aside>
          </header>

          <section className="overflow-auto p-2 h-[calc(100%-2rem)] bg-gray-50">
            <settingsMeta.Component {...settingsMeta.props} />
          </section>
        </SettingsWrapper>
      ) : null}

      {blockMeta && blockMeta.Settings ? (
        <SettingsWrapper id={blockMeta.id}>
          <header className="text-white bg-yellow-500 cursor-move dragHandle p-1 pl-2 flex-none h-8 flex items-center justify-between">
            <section className="truncate">
              {blockMeta.title ?? "Nastavení stránky"}
            </section>

            <aside className={"flex items-center justify-center"}>
              <button
                className="btn btn-xs bg-transparent border-none"
                onClick={handleToggleFixedSidebar}
              >
                <ChevronDown
                  className={clsx(
                    "w-4 text-white transform",
                    fixedSettingsPanel ? "rotate-90" : "-rotate-90"
                  )}
                  label="Move to sidebar"
                />
              </button>
              <button
                className="btn btn-xs bg-transparent border-none"
                onClick={handleClose}
              >
                <Close className="w-4 text-white" label="Close" />
              </button>
            </aside>
          </header>

          <section className="overflow-auto p-2 h-[calc(100%-2rem)] bg-gray-50">
            <ErrorBoundary
              fallbackRender={({ error, resetErrorBoundary }) => (
                <div role="alert">
                  <div>Oh no</div>
                  <div>{error.message}</div>
                  <button
                    className="btn"
                    onClick={() => {
                      resetErrorBoundary()
                    }}
                  >
                    Try again
                  </button>
                </div>
              )}
            >
              {blockMeta ? <LazySettings blockMeta={blockMeta} /> : null}
            </ErrorBoundary>
          </section>
        </SettingsWrapper>
      ) : null}
    </aside>
  )
}, isEqual)

const SettingsWrapper = React.memo((props: any) => {
  const [fixedSettingsPanel] = useBlockEditorStore((state) => [
    state.fixedSettingsPanel,
  ])

  if (fixedSettingsPanel) {
    return <>{props.children}</>
  }

  const windowH = window.innerHeight
  const topScroll = window.scrollY
  const editorViewportTop =
    document.getElementById("page-wrapper")?.getBoundingClientRect()?.top ?? 0
  const editorTopPos = editorViewportTop + topScroll

  const y = Math.max(50, windowH * 0.25 + topScroll - editorTopPos)

  console.log("posY", {
    y,
    editorTopPos,
    topScroll,
    editorViewportTop,
    windowH,
  })

  return (
    <Rnd
      key={props.id}
      className="flex flex-col border border-gray-300 rounded shadow-lg bg-white z-[99999] overflow-hidden"
      enableUserSelectHack={false}
      dragHandleClassName={"dragHandle"}
      minWidth={300}
      minHeight={100}
      maxHeight={"60vh"}
      maxWidth={600}
      default={{
        x: -480,
        y,
        width: 400,
        height: props.height ?? "50vh",
      }}
    >
      {props.children}
    </Rnd>
  )
})

const LazyloadComponent = (componentPath) => {
  return (props) => {
    // console.log("LazyloadComponent", componentPath)

    let [ComponentContainer, setComponentContainer] = React.useState<any>(null)

    React.useEffect(() => {
      if (componentPath) {
        const path = componentPath()
        setComponentContainer(React.lazy(() => path))
      }
    }, [componentPath])

    return (
      <React.Suspense fallback={<div>Loading</div>}>
        {ComponentContainer ? <ComponentContainer {...props} /> : null}
      </React.Suspense>
    )
  }
}

const LazySettings = React.memo(function LazySettings(props: {
  blockMeta: any
}) {
  const Settings = React.useMemo(
    () => LazyloadComponent(props.blockMeta?.Settings),
    [props.blockMeta.id]
  )

  // console.log("LazySettings render", props.blockMeta, Settings)

  if (props.blockMeta && Settings) {
    return (
      <Settings
        blockID={props.blockMeta.id}
        source={props.blockMeta.source}
        getSource={(scopedSource) => {
          return `${props.blockMeta.source}.${scopedSource}`
        }}
      />
    )
  }

  return null
},
isEqual)
