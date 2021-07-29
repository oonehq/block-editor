import * as React from "react"
import "./tailwind.css"
import "../node_modules/react-quill/dist/quill.snow.css"

export { BlockEditor } from "./BlockEditor/BlockEditor"
export {
    SettingsForm,
    TextInput,
    RichTextInput,
    ArrayInput,
} from "./BlockEditor/Settings.utils"

/* simple test if yarn link/yalc link works */
// export const BlockEditor = (props: { value: Array<Record<string, any>> }) => {
//     React.useEffect(() => {
//         console.log("blockeditor mount")
//     }, [])

//     return <div>{JSON.stringify(props.value)}</div>
// }
