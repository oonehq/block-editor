import * as React from "react"
import clsx from "clsx"
import cloneDeep from "lodash/cloneDeep"
import deepCopy from "deep-copy"

import { useBlockInputStore } from "./useBlocksInputStore"

import {
    useForm,
    useWatch,
    FormProvider,
    useController,
    useFieldArray,
    useFormContext,
    Controller,
} from "react-hook-form"

import ReactQuill from "react-quill"
import { ChevronDown, ChevronUp, Trash } from "./Icons"

export const SettingsForm = (props) => {
    let formMethods: any = null

    if (!props.form) {
        const defaultValues = React.useMemo(() => {
            return useBlockInputStore
                .getState()
                .blocks.find((block) => block.id === props.blockID)?.data
        }, [props.blockID])

        console.log("SettingsForm", defaultValues)

        formMethods = useForm({
            defaultValues: deepCopy(defaultValues),
        })
    } else {
        formMethods = props.form
    }

    console.log("SettingsForm render", props.blockID, formMethods)

    return (
        <FormProvider {...formMethods}>
            {props.children}
            <AutoSaveWatcher id={props.blockID} control={formMethods.control} />
        </FormProvider>
    )
}

const AutoSaveWatcher = ({ id, control }) => {
    const updateBlockData = useBlockInputStore((state) => state.updateBlockData)

    const data = useWatch({
        control,
    })

    React.useEffect(() => {
        console.log("data change", id, data)
        updateBlockData(id, data)
    }, [data])

    return null
}

export const TextInput = (props) => {
    const { control } = useFormContext()

    const { field } = useController({
        name: props.name,
        control,
    })

    console.log("TextInput render", control, field)

    return (
        <div className="form-control">
            <label className="label" htmlFor={props.name}>
                <span className="label-text">{props.label ?? props.name}</span>
            </label>
            <input
                type="text"
                placeholder={props.label ?? props.name}
                className="input input-bordered"
                {...field}
            />
        </div>
    )
}

interface ArrayInputProps {
    name: string
    label?: string
    collapsible?: boolean
    children: any
    item?: {
        defaultValue?: any
        label?: string | ((item: any) => string)
        background?: string
    }
}

export const ArrayInput = (props: ArrayInputProps) => {
    const { control } = useFormContext()

    const { fields, append, remove, move } = useFieldArray({
        name: props.name,
        control,
    })

    const [collapsedList, setCollapsedList] = React.useState(
        props.collapsible ? fields.map((field) => field.id) : []
    )

    const label = React.useMemo(() => {
        return props.label ?? props.name
    }, [props.name, props.label])

    const handleAdd = (e) => {
        e.preventDefault()
        if (typeof props?.item?.defaultValue !== "undefined") {
            append(props.item.defaultValue)
        } else {
            append({})
        }
    }

    const handleMoveUp = (index) => {
        return (e) => {
            e.preventDefault()
            if (index === 0) {
                return
            }
            move(index, Math.max(0, index - 1))
        }
    }

    const handleMoveDown = (index) => {
        return (e) => {
            e.preventDefault()
            if (index < fields.length - 1) {
                move(index, Math.min(index + 1, fields.length - 1))
            }
        }
    }

    const handleDelete = (index) => {
        return (e) => {
            remove(index)
            e.preventDefault()
        }
    }

    const handleCollapse = (fieldID) => {
        return (e) => {
            e.preventDefault()
            if (collapsedList.indexOf(fieldID) >= 0) {
                const nextList = collapsedList.filter((id) => id != fieldID)
                setCollapsedList(nextList)
            } else {
                const nextList = [...collapsedList, fieldID]
                setCollapsedList(nextList)
            }
        }
    }

    return (
        <section className="mt-4">
            <header>{label}</header>
            {fields.map((field, index) => {
                const isCollapsed = collapsedList.indexOf(field.id) >= 0
                return (
                    <article
                        key={field.id}
                        className={clsx(
                            "relative border border-gray-400 rounded mt-4 p-2",
                            isCollapsed ? "group" : null,
                            props.collapsible && isCollapsed
                                ? "cursor-pointer"
                                : null,
                            props?.item?.background
                        )}
                        onClick={
                            isCollapsed ? handleCollapse(field.id) : undefined
                        }
                    >
                        <section className="absolute -top-3 left-2 right-2 z-[9999] flex justify-between">
                            <header
                                className={clsx(
                                    "badge badge-outline border-gray-400 bg-gray-100 truncate",
                                    props.collapsible
                                        ? "cursor-pointer group-hover:underline hover:underline"
                                        : null
                                )}
                                onClick={
                                    props.collapsible
                                        ? handleCollapse(field.id)
                                        : undefined
                                }
                            >
                                #{index + 1}{" "}
                                {props?.item?.label ? (
                                    <FieldLabel
                                        label={props?.item?.label}
                                        field={field}
                                    />
                                ) : (
                                    label
                                )}
                            </header>

                            <section className="btn-group self-end">
                                <button
                                    className="btn btn-xs"
                                    onClick={handleMoveUp(index)}
                                >
                                    <ChevronUp
                                        className="w-4"
                                        label="Move up"
                                    />
                                </button>
                                <button
                                    className="btn btn-xs"
                                    onClick={handleMoveDown(index)}
                                >
                                    <ChevronDown
                                        className="w-4"
                                        label="Move up"
                                    />
                                </button>

                                <button
                                    className="btn btn-xs"
                                    onClick={handleDelete(index)}
                                >
                                    <Trash className="w-4" label="Move up" />
                                </button>
                            </section>
                        </section>

                        {isCollapsed ? null : (
                            <section>
                                {React.Children.map(
                                    props.children,
                                    (input, inputIndex) => {
                                        const { name, ...rest } = input.props
                                        return React.cloneElement(input, {
                                            name: `${props.name}.${index}${
                                                name ? `.${name}` : ""
                                            }`,
                                            control,
                                            ...rest,
                                        })
                                    }
                                )}
                            </section>
                        )}
                    </article>
                )
            })}
            <footer className="my-2">
                <button className="btn btn-xs" onClick={handleAdd}>
                    + {label}
                </button>
            </footer>
        </section>
    )
}

const FieldLabel = ({ label, field }) => {
    console.log("FieldLabel render", field)

    if (label && typeof label === "string") {
        return label
    }

    if (typeof label === "function") {
        return label(field)
    }

    return null
}

interface RichTextInput {
    name: string
    label?: string
}

export const RichTextInput = (props: RichTextInput) => {
    const { control } = useFormContext()

    const { field } = useController({
        name: props.name,
        control,
    })

    // const handleQuillChange = (content) => {
    //     props.onChange(props.name, content)
    // }

    return (
        <div className="form-control">
            <label className="label" htmlFor={props.name}>
                <span className="label-text">{props.label ?? props.name}</span>
            </label>

            <ReactQuill
                theme="snow"
                placeholder="Text"
                modules={{
                    toolbar: [
                        [
                            "bold",
                            "italic",
                            "underline",
                            { align: [] },
                            { list: "ordered" },
                            { list: "bullet" },
                            "link",
                        ],
                        ["clean"],
                    ],
                }}
                {...field}
            />
        </div>
    )
}
