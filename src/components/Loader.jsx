import { useEffect, useState } from 'react'

export default function Loader() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setDone(true), 850)
    return () => window.clearTimeout(timer)
  }, [])

  return <div className={`site-loader${done ? ' site-loader--done' : ''}`} aria-hidden={done}>
    <div className="site-loader__mark">GP</div>
    <div className="site-loader__line"><span /></div>
    <p>Loading portfolio</p>
  </div>
}
