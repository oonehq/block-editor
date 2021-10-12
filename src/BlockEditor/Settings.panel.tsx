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
        let block = state.blocks.find((block) => block.id == state.selected)
        if (block) {
            let blockIndex = state.blocks.findIndex(
                (block) => block.id == state.selected
            )
            return {
                id: block.id,
                type: block.type,
                version: block.version,
                source: `${state.source}[${blockIndex}]._$settings`,
            }
        }
        return null
    }, isEqual)

    const [setSelected, tools] = useBlockInputStore(
        (state) => [state.setSelected, state.tools],
        isEqual
    )

    const handleClose = (e) => {
        setSelected(null)
        e.preventDefault()
    }

    const handleToggleFixedSidebar = () => {
        setFixedSettingsPanel(!fixedSettingsPanel)
    }

    const title = React.useMemo(() => {
        if (!blockMeta) return null
        return tools[blockMeta.type]?.title
    }, [blockMeta?.type])

    // console.log("SettingsPanel render", blockMeta)

    return (
        <aside
            className={clsx(
                "bg-gray-50 flex-0 p-2 overflow-auto max-h-[80vh]",
                fixedSettingsPanel ? "w-[340px] xl:w-[400px]" : "w-0"
            )}
        >
            {blockMeta ? (
                <SettingsWrapper>
                    <header className="text-white bg-blue-800 cursor-move dragHandle p-1 pl-2 flex-none h-8 flex items-center justify-between">
                        <section className="truncate">
                            {title ?? "Nastavení stránky"}
                        </section>
                        <aside className={"flex items-center justify-center"}>
                            <button
                                className="btn btn-xs bg-transparent border-none"
                                onClick={handleToggleFixedSidebar}
                            >
                                <ChevronDown
                                    className={clsx(
                                        "w-4 text-white transform",
                                        fixedSettingsPanel
                                            ? "rotate-90"
                                            : "-rotate-90"
                                    )}
                                    label="Move to sidebar"
                                />
                            </button>
                            <button
                                className="btn btn-xs bg-transparent border-none"
                                onClick={handleClose}
                            >
                                <Close
                                    className="w-4 text-white"
                                    label="Close"
                                />
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
                            {blockMeta ? (
                                <LazySettings blockMeta={blockMeta} />
                            ) : null}
                        </ErrorBoundary>
                    </section>
                </SettingsWrapper>
            ) : null}
        </aside>
    )
}, isEqual)

const SettingsWrapper = React.memo((props) => {
    const [fixedSettingsPanel] = useBlockEditorStore((state) => [
        state.fixedSettingsPanel,
    ])

    if (fixedSettingsPanel) {
        return <>{props.children}</>
    }

    return (
        <Rnd
            className="flex flex-col border border-gray-300 rounded shadow-lg bg-white z-[99999] overflow-hidden"
            enableUserSelectHack={false}
            dragHandleClassName={"dragHandle"}
            minWidth={300}
            minHeight={300}
            default={{
                x: -450,
                y: 50,
                width: 400,
                height: "60vh",
            }}
        >
            {props.children}
        </Rnd>
    )
})

const LazyloadComponent = (componentPath) => {
    return (props) => {
        // console.log("LazyloadComponent", componentPath)

        let [ComponentContainer, setComponentContainer] =
            React.useState<any>(null)

        React.useEffect(() => {
            const path = componentPath()
            setComponentContainer(React.lazy(() => path))
        }, [])

        return (
            <React.Suspense fallback={<div>Loading</div>}>
                {ComponentContainer && <ComponentContainer {...props} />}
            </React.Suspense>
        )
    }
}

const LazySettings = React.memo(function LazySettings(props: {
    blockMeta: any
}) {
    const tools = useBlockInputStore((state) => state.tools, isEqual)

    const Settings = React.useMemo(
        () => LazyloadComponent(tools[props.blockMeta.type]?.Settings),
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
