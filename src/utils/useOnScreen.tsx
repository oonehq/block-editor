import * as React from "react"

export const useOnScreen = (ref) => {
  const [isIntersecting, setIntersecting] = React.useState(false)

  const observer = new IntersectionObserver(([entry]) => {
    console.log("onScreen", entry.isIntersecting)
    setIntersecting(entry.isIntersecting)
  })

  React.useEffect(() => {
    observer.observe(ref.current)
    // Remove the observer as soon as the component is unmounted
    return () => {
      observer.disconnect()
    }
  }, [])

  return isIntersecting
}
