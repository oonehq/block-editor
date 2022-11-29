import * as React from "react"
import { useFormState } from "react-final-form"
import { useGetMany, useResourceContext } from "react-admin"

import flatten from "flat"
import _cloneDeep from "lodash/cloneDeep"
import _set from "lodash/set"
import _unset from "lodash/unset"
import _get from "lodash/get"
import { useBlockInputStore } from "./BlockEditorStoreProvider"

const languages = ["cs", "en", "ru", "sk"]

const relations = {
  blogposts: { tags: "blogtags" },
}

export const useCurrentRecord = () => {
  const { values } = useFormState({ subscription: { values: true } })
  const source = useBlockInputStore((s) => s.source)

  let fullRecord = _cloneDeep(values)
  fullRecord = useRecordWithRelations(fullRecord)

  const record = React.useMemo(() => {
    // _unset(fullRecord, source)
    const lastPart = source?.split(".").pop() ?? "cs"
    const i18n = languages.includes(lastPart) ? lastPart : "cs"

    return processTranslations(fullRecord, { i18n })
  }, [fullRecord, source])

  return record
}

const processTranslations = (value, options) => {
  const lang = options.i18n ?? "cs"
  let result = _cloneDeep(value)

  // console.log("useCurrentRecord start", lang, result)

  const flatDoc = flatten(result)

  let processedPaths: string[] = []

  for (let path of Object.keys(flatDoc)) {
    const pathArray = path.split(".")

    if (
      ["cs", "en", "ru", "sk"].indexOf(pathArray[pathArray.length - 1]) !== -1
    ) {
      const path = pathArray.slice(0, -1).join(".")
      if (processedPaths.includes(path)) continue

      const translations = _get(result, path)
      // console.log("flow translated", path, translations)

      if (translations && typeof translations !== "string") {
        result = _set(result, path, translations[lang] ?? translations.cs)
        processedPaths.push(path)
      }
    }
  }

  // console.log("useCurrentRecord paths", processedPaths)
  // console.log("useCurrentRecord result", result)

  return result
}

const useRecordWithRelations = (record) => {
  const resource = useResourceContext()

  if (relations[resource]) {
    for (let relationPath of Object.keys(relations[resource])) {
      const ids = _get(record, relationPath)

      if (Array.isArray(ids) && ids.length > 0) {
        const relatedResource = relations[resource][relationPath]

        const response = useGetMany(relatedResource, { ids }, { enabled: true })

        if (response.data) {
          record = _set(record, relationPath, response.data)
        }
      }

      return record
    }
  }

  return record
}
