import { useEffect, useRef } from 'react'

export function useDebouncedCallback(fn, delay = 400) {
  const fnRef = useRef(fn)
  const t = useRef(null)

  useEffect(() => { fnRef.current = fn }, [fn])
  useEffect(() => () => { if (t.current) window.clearTimeout(t.current) }, [])

  return ((...args) => {
    if (t.current) window.clearTimeout(t.current)
    t.current = window.setTimeout(() => fnRef.current(...args), delay)
  })
}
