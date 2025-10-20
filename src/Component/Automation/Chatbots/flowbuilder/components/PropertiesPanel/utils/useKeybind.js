import { useEffect } from 'react'

export function useKeybind(key, handler) {
  useEffect(() => {
    function onKey(e) {
      if (e.key.toLowerCase() === key.toLowerCase()) handler(e)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [key, handler])
}
