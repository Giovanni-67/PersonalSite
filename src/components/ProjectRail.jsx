import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

const photography = {
  newton: { photo: 'newton.png', caption: 'Hackathon presentation cover' },
  exam: { photo: 'exam-registration.jpg', caption: 'Study & learning' },
  minecraft: { photo: 'minecraft.png', caption: 'Minecraft server development' },
  slo: { photo: 'cal-poly-slo.jpg', caption: 'San Luis Obispo County' },
  redis: { photo: 'redis.jpg', caption: 'Network connections' },
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
        const distance = () => {
          const contentRight = rail.lastElementChild.getBoundingClientRect().right - rail.getBoundingClientRect().left
          // Overflowing flex content does not reliably include the trailing padding.
          return Math.max(0, contentRight + parseFloat(getComputedStyle(rail).paddingRight) - rail.clientWidth)
        }
        let movementFraction = 1
        gsap.to(rail, {
          x: () => -distance(),
          ease: progress => Math.min(1, progress / movementFraction),
          scrollTrigger: {
            id: 'project-rail', trigger: section, start: 'top top',
            end: () => {
              const travel = Math.max(900, distance() * 1.15)
              const rest = Math.min(240, section.clientHeight * 0.2)
              movementFraction = travel / (travel + rest)
              return `+=${travel + rest}`
            },
            // Finish the horizontal move, then keep the completed panel pinned briefly.
            // Pin at the measured start so anchor scrolling does not snap the rail early.
            pin: true, scrub: true, invalidateOnRefresh: true,
          },
        })
      })
      return () => media.revert()
    }, section)
    const navigateToWork = event => {
      const link = event.target.closest('a[href="#work"]')
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.hasAttribute('download') || (link.target && link.target !== '_self')) return
      const trigger = ScrollTrigger.getById('project-rail')
      if (!trigger) return
      // The pinned element moves; its scroll trigger retains the document start.
      event.preventDefault()
      if (window.location.hash !== '#work') window.history.pushState(window.history.state, '', '#work')
      section.focus({ preventScroll: true })
      window.scrollTo({ top: trigger.start, behavior: 'smooth' })
    }
    document.addEventListener('click', navigateToWork)
    return () => {
      document.removeEventListener('click', navigateToWork)
      context.revert()
    }
  }, [projects.length])

  return <section ref={sectionRef} id="work" tabIndex={-1} className="project-rail-section" aria-labelledby="work-title">
    <div className="project-rail-heading container"><div><span className="eyebrow">Selected work</span><h2 id="work-title">Projects</h2></div></div>
    <div ref={railRef} className="project-rail">
      {projects.map(project => <article className="project-panel" key={project.variant} aria-labelledby={`project-${project.variant}`}>
        <div className="project-panel__copy"><span className="eyebrow">{project.status || 'Selected project'}</span><h3 id={`project-${project.variant}`}>{project.title}</h3><p className="project-panel__stack">{project.stack.join(' / ')}</p>{project.context && <p className="project-panel__context">{project.context}</p>}<p>{project.description}</p><ul>{project.details.map(detail => <li key={detail}>{detail}</li>)}</ul>{project.url && <a className="project-panel__link" href={project.url}>Try Newton</a>}</div>
        {photography[project.variant] && <figure className={`project-panel__photo${project.variant === 'newton' ? ' project-panel__photo--cover' : ''}`}><img src={`${import.meta.env.BASE_URL}assets/projects/${photography[project.variant].photo}`} alt={project.variant === 'newton' ? 'What if every student had a personal tutor?' : ''} loading="lazy" /><figcaption>{photography[project.variant].caption}{project.variant === 'newton' ? '' : ' · Editorial image'}</figcaption></figure>}
      </article>)}
    </div>
  </section>
}
