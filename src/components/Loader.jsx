import { useEffect, useState } from 'react'

export default function Loader() {
  const [done, setDone] = useState(false)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setDone(true), 850)
    // A stalled CSS transition must never leave an overlay covering the site.
    const finishTimer = window.setTimeout(() => setFinished(true), 1450)
    return () => {
      window.clearTimeout(timer)
      window.clearTimeout(finishTimer)
    }
  }, [])

  if (finished) return null

  return <div className={`site-loader${done ? ' site-loader--done' : ''}`} aria-hidden={done}>
    <div className="site-loader__mark">GP</div>
    <div className="site-loader__line"><span /></div>
    <p>Loading portfolio</p>
  </div>
}
