import React, { useCallback, useMemo } from 'react'
import { usePresence, useAwarenessStates } from '../../presence/PresenceProvider'
import styles from './presence.module.css'
import { useViewport } from 'reactflow'

export default function LiveCursors({ staleMs = 15000 }) {
  const { self } = usePresence()
  const { x: viewX, y: viewY, zoom } = useViewport();

  const mapFn = useCallback((s) => (s.user && s.user.id !== self.id ? s : null), [self.id]);
  const others = useAwarenessStates(mapFn)

  const fresh = useMemo(() => {
    const now = Date.now()
    return others.filter((s) => !!s.cursor && now - (s.cursor.ts || 0) <= staleMs)
  }, [others, staleMs])

  return (
    <>
      {fresh.map((s) => {
        if(!s.cursor || !s.user) return null;
        const { x, y } = s.cursor
        const sx = viewX + x * zoom
        const sy = viewY + y * zoom
        const color = s.user.color
        return (
          <div key={s.user.id} className={styles.cursor} style={{ transform: `translate(${sx}px, ${sy}px)` }}>
            <div className={styles.dot} style={{ background: color }} />
            <span className={styles.tag} style={{ background: color, color: '#fff' }}>
              {s.user.name}
            </span>
          </div>
        )
      })}
    </>
  )
}
