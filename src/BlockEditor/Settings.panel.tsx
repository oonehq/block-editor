import * as React from "react"
import { ErrorBoundary } from "react-error-boundary"
import clsx from "clsx"
import isEqual from "react-fast-compare"

import { useBlockInputStore } from "./BlockEditorStoreProvider"

const dev = process.env.NODE_ENV !== "production"

export const SettingsPanel = React.memo(function SettingsPanel(props) {
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
                source: `${state.source}[${blockIndex}].data`,
            }
        }
        return null
    }, isEqual)

    // console.log("SettingsPanel render", blockMeta)

    return (
        <aside
            className={clsx(
                "bg-gray-50 flex-0 p-2 transition-all overflow-auto",
                blockMeta ? "w-[400px]" : "w-[250px]"
            )}
        >
            <header className="text-center mb-4 text-sm">
                <h2>Úpravy</h2>
                {dev ? (
                    <p className="text-xs">
                        ({blockMeta?.type}@{blockMeta?.source})
                    </p>
                ) : null}
            </header>
            <ErrorBoundary
                fallbackRender={({ error, resetErrorBoundary }) => (
                    <div role="alert">
                        <div>Oh no</div>
                        <div>{error.message}</div>
                        <button
                            className="btn"
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
                {blockMeta ? <LazySettings blockMeta={blockMeta} /> : null}
            </ErrorBoundary>
            {/* <section className="overflow-y-scroll max-h-[300px]">
                <pre>{JSON.stringify(val, null, 4)}</pre>
            </section> */}
        </aside>
    )
}, isEqual)

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
            />
        )
    }

    return null
},
isEqual)
