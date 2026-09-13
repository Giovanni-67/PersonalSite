import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

const photography = {
  exam: { photo: 'photo-1558494949-ef010cbdcc31', caption: 'Application workflows' },
  minecraft: { photo: 'photo-1558494949-ef010cbdcc31', caption: 'Minecraft server development' },
  slo: { photo: 'photo-1518770660439-4636190af475', caption: 'Student opportunity discovery' },
  trading: { photo: 'photo-1518770660439-4636190af475', caption: 'Historical strategy testing' },
  redis: { photo: 'photo-1518770660439-4636190af475', caption: 'Network service development' },
}

export default function ProjectRail({ projects }) {
  const sectionRef = useRef(null)
  const railRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const rail = railRef.current
    if (!section || !rail || projects.length < 2) return undefined
    const context = gsap.context(() => {
      const media = gsap.matchMedia()
      media.add('(min-width: 900px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)', () => {
        const distance = () => Math.max(0, rail.scrollWidth - rail.clientWidth)
        gsap.to(rail, { x: () => -distance(), ease: 'none', scrollTrigger: { id: 'project-rail', trigger: section, start: 'top top', end: () => `+=${Math.max(900, distance() * 1.15)}`, pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 } })
      })
      return () => media.revert()
    }, section)
    return () => context.revert()
  }, [projects.length])

  return <section ref={sectionRef} id="work" className="project-rail-section" aria-labelledby="work-title">
    <div className="project-rail-heading container"><div><span className="eyebrow">Selected work</span><h2 id="work-title">Projects in <em>progress.</em></h2></div><p>A growing record of systems, applications, and experiments.</p></div>
    <div ref={railRef} className="project-rail">
      {projects.map((project, index) => <article className="project-panel" key={project.variant} aria-labelledby={`project-${project.variant}`}>
        <div className="project-panel__index">{String(index + 1).padStart(2, '0')}</div><div className="project-panel__copy"><span className="eyebrow">{project.status || 'Selected project'}</span><h3 id={`project-${project.variant}`}>{project.title}</h3><p className="project-panel__stack">{project.stack.join(' / ')}</p>{project.context && <p className="project-panel__context">{project.context}</p>}<p>{project.description}</p><ul>{project.details.map(detail => <li key={detail}>{detail}</li>)}</ul></div>
        {photography[project.variant] && <figure className="project-panel__photo"><img src={`https://images.unsplash.com/${photography[project.variant].photo}?auto=format&fit=crop&w=1500&q=85`} alt="" loading="lazy" /><figcaption>{photography[project.variant].caption} · Editorial image</figcaption></figure>}
      </article>)}
    </div>
  </section>
}
