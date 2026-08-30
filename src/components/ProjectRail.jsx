import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

const photography = [
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1500&q=85',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1500&q=85',
]

export default function ProjectRail({ projects }) {
  const sectionRef = useRef(null)
  const railRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const rail = railRef.current
    if (!section || !rail || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const context = gsap.context(() => {
      const media = gsap.matchMedia()
      media.add('(min-width: 900px)', () => {
        const distance = () => Math.max(0, rail.scrollWidth - window.innerWidth + 72)
        const tween = gsap.to(rail, { x: () => -distance(), ease: 'none', scrollTrigger: { trigger: section, start: 'top top', end: () => `+=${Math.max(900, distance() * 1.15)}`, pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 } })
        return () => tween.kill()
      })
      return () => media.revert()
    }, section)
    return () => context.revert()
  }, [])

  return <section ref={sectionRef} id="work" className="project-rail-section" aria-labelledby="work-title">
    <div className="project-rail-heading container"><div><span className="eyebrow">01 / Selected work</span><h2 id="work-title">Projects in<br /><em>progress.</em></h2></div><p>Scroll to move through a growing record of systems, applications, and experiments.</p></div>
    <div ref={railRef} className="project-rail">
      {projects.map((project, index) => <article className="project-panel" key={project.title}>
        <div className="project-panel__index">0{index + 1}</div><div className="project-panel__copy"><span className="eyebrow">{project.status || 'Selected project'}</span><h3>{project.title}</h3><p className="project-panel__stack">{project.stack.join(' / ')}</p>{project.context && <p className="project-panel__context">{project.context}</p>}<p>{project.description}</p><ul>{project.details.map(detail => <li key={detail}>{detail}</li>)}</ul></div>
        <figure className="project-panel__photo"><img src={photography[index % photography.length]} alt="Editorial technology workspace" /><figcaption>{index === 0 ? 'System architecture / workflow study' : 'Network service / ongoing build'}</figcaption></figure>
      </article>)}
      <article className="project-panel project-panel--future" aria-label="Space reserved for a future project"><div className="project-panel__index">03</div><div className="project-panel__copy"><span className="eyebrow">Next project</span><h3>More work<br />to <em>come.</em></h3><p>This rail is designed to grow as new projects are ready to be shared.</p></div></article>
    </div>
  </section>
}
