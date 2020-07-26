// vendors
import { useRef, useCallback, useEffect } from 'react'

export default function useDebounce (callback, delay) {
  const maxWaitArgs = useRef([])

  const functionTimeoutHandler = useRef(null)
  const isComponentUnmounted = useRef(false)

  const debouncedFunction = callback

  useEffect(
    () => () => {
      // we use flag, as we allow to call callPending outside the hook
      isComponentUnmounted.current = true
    },
    []
  )

  const debouncedCallback = useCallback(
    (...args) => {
      maxWaitArgs.current = args
      clearTimeout(functionTimeoutHandler.current)

      functionTimeoutHandler.current = setTimeout(() => {
        if (!isComponentUnmounted.current) {
          debouncedFunction(...args)
        }
      }, delay)
    },
    [debouncedFunction, delay]
  )

  // At the moment, we use 3 args array so that we save backward compatibility
  return [debouncedCallback]
}
