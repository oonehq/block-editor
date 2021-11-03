import * as React from "react"
import throttle from "lodash/throttle"

export const useThrottle = (cb, delay) => {
  const options = { leading: true, trailing: true } // add custom lodash options
  const cbRef = React.useRef(cb)
  // use mutable ref to make useCallback/throttle not depend on `cb` dep
  React.useEffect(() => {
    cbRef.current = cb
  })
  return React.useCallback(
    throttle((...args) => cbRef.current(...args), delay, options),
    [delay]
  )
}
