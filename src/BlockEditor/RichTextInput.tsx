import * as React from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

interface RichTextInput {
    name: string
    value: string
    onChange: (name: string, value: string) => void
}

export const RichTextInput = (props: RichTextInput) => {
    const handleQuillChange = (content) => {
        props.onChange(props.name, content)
    }
    return (
        <>
            <ReactQuill
                theme="snow"
                value={props?.value}
                onChange={handleQuillChange}
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
            />

            {/* <style global jsx>{`
                .ql-editor {
                    background-color: white;
                    min-height: 100px;
                    max-height: 200px;
                }
            `}</style> */}
        </>
    )
}
