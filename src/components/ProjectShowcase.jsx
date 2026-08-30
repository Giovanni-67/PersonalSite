import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useReducedMotion } from 'motion/react'
import { useLayoutEffect, useRef } from 'react'
import Reveal from './Reveal'

gsap.registerPlugin(ScrollTrigger)

function ExamStory({ project, index }) {
  const stageRef = useRef(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    if (reduced) return undefined
    const context = gsap.context(() => {
      const media = gsap.matchMedia()
      media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const query = gsap.utils.selector(stageRef)
        gsap.set(query('.exam-stage__canvas-motion'), { xPercent: 0, scale: 1, transformOrigin: '50% 50%', force3D: true })
        gsap.set(query('.exam-purpose'), { transformOrigin: '0% 50%', force3D: true })
        gsap.set(query('.exam-workflow'), { autoAlpha: 0 })
        gsap.set(query('.exam-architecture'), { autoAlpha: 0 })
        gsap.set(query('.exam-node--student'), { xPercent: -180, autoAlpha: 0, force3D: true })
        gsap.set(query('.exam-node--instructor'), { xPercent: 180, autoAlpha: 0, force3D: true })
        gsap.set(query('.exam-node--database'), { xPercent: 120, autoAlpha: 0, force3D: true })
        gsap.set(query('.exam-architecture__item'), { yPercent: 55, autoAlpha: 0, force3D: true })
        gsap.set(query('.exam-workflow__label'), { yPercent: 45, autoAlpha: 0, force3D: true })
        gsap.set(query('.exam-stage__exit'), { yPercent: 55, autoAlpha: 0, force3D: true })
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: stageRef.current,
            start: 'top top+=24',
            end: '+=180%',
            pin: true,
            scrub: 1.35,
            anticipatePin: 1,
          },
        })
        timeline
          .to(query('.exam-stage__canvas-motion'), { xPercent: 0, scale: 1.02, ease: 'none', duration: 1.15 }, 0)
          .to(query('.exam-purpose'), { xPercent: -3, yPercent: -4, scale: 0.96, ease: 'none', duration: 1.15 }, 0)
          .to(query('.exam-workflow'), { autoAlpha: 1, ease: 'none', duration: 0.8 }, 0.7)
          .to(query('.exam-node--student'), { xPercent: 0, autoAlpha: 1, ease: 'none', duration: 1.05 }, 0.72)
          .to(query('.exam-node--instructor'), { xPercent: 0, autoAlpha: 1, ease: 'none', duration: 1.05 }, 0.72)
          .to(query('.exam-node--database'), { xPercent: 0, autoAlpha: 1, ease: 'none', duration: 0.9 }, 0.9)
          .to(query('.exam-path'), { strokeDashoffset: 0, ease: 'none', duration: 1.05 }, 0.82)
          .to(query('.exam-workflow__label'), { autoAlpha: 1, yPercent: 0, ease: 'none', duration: 0.75 }, 1.08)
          .to(query('.exam-purpose'), { xPercent: -18, yPercent: -30, scale: 0.62, opacity: 0.86, ease: 'none', duration: 1.3 }, 1.75)
          .to(query('.exam-purpose__body'), { xPercent: -18, opacity: 0, ease: 'none', duration: 0.8 }, 1.7)
          .to(query('.exam-workflow'), { xPercent: -6, yPercent: -3, scale: 0.92, ease: 'none', duration: 1.3 }, 1.75)
          .to(query('.exam-stage__canvas-motion'), { xPercent: 0, yPercent: 0, scale: 1.04, ease: 'none', duration: 1.45 }, 1.75)
          .to(query('.exam-architecture'), { autoAlpha: 1, ease: 'none', duration: 0.6 }, 1.9)
          .to(query('.exam-architecture__item'), { yPercent: 0, autoAlpha: 1, stagger: 0.12, ease: 'none', duration: 0.85 }, 1.96)
          .to(query('.exam-stage__exit'), { autoAlpha: 1, yPercent: 0, ease: 'none', duration: 0.8 }, 2.8)
      })
      return () => media.revert()
    }, stageRef)
    return () => context.revert()
  }, [reduced])

  return (
    <article ref={stageRef} className="exam-story" aria-labelledby="exam-title">
      <div className="exam-story__inner">
        <div className="exam-purpose">
          <div className="project-overline"><span>Primary project</span></div>
          <h3 id="exam-title">{project.title}</h3>
          <p className="project-stack">{project.stack.join(' · ')}</p>
          <p className="project-context">{project.context}</p>
          <div className="exam-purpose__body"><p className="project-description">{project.description}</p><ul className="project-details">{project.details.map((detail) => <li key={detail}>{detail}</li>)}</ul></div>
        </div>
        <div className="exam-stage__canvas" aria-label="Exam Registration System workflow and implementation architecture">
          <div className="exam-stage__canvas-motion">
            <div className="exam-canvas__grid" aria-hidden="true" />
            <div className="exam-workflow">
              <div className="exam-node exam-node--student"><span>Student</span><small>Registration</small></div>
              <div className="exam-node exam-node--instructor"><span>Instructor</span><small>Exam creation</small></div>
              <div className="exam-node exam-node--flask"><span>Flask</span><small>Role-based workflows</small></div>
              <div className="exam-node exam-node--database"><span>MySQL</span><small>Data layer</small></div>
              <svg viewBox="0 0 800 520" aria-hidden="true"><path className="exam-path" pathLength="1" d="M170 145C320 145 286 250 400 250M630 375C480 375 514 270 400 270M474 260H607" /><circle cx="400" cy="260" r="5" /></svg>
              <p className="exam-workflow__label">Student and instructor paths converge through the Flask application.</p>
            </div>
            <div className="exam-architecture">
              <div className="exam-architecture__item exam-architecture__item--access">Secure login<br />&amp; access control</div>
              <div className="exam-architecture__item exam-architecture__item--creation">Exam<br />creation</div>
              <div className="exam-architecture__item exam-architecture__item--registration">Student<br />registration</div>
              <div className="exam-architecture__item exam-architecture__item--sdlc">SDLC<br />process</div>
            </div>
          </div>
        </div>
        <p className="exam-stage__exit">Architecture in focus <span aria-hidden="true">↓</span></p>
      </div>
    </article>
  )
}

function RedisVisual() {
  return <div className="system-visual system-visual--redis" aria-label="Redis-like network service flow diagram"><div className="terminal-line"><span>client</span><code>PING</code></div><div className="redis-core">TCP<br /><small>multi-client service</small></div><div className="terminal-line terminal-line--right"><code>JSON</code><span>persistence</span></div><div className="redis-commands"><code>SET</code><code>GET</code><code>DEL</code></div></div>
}

export default function ProjectShowcase({ project, index }) {
  if (project.variant === 'exam') return <ExamStory project={project} index={index} />
  return <article className="project project--redis"><Reveal className="project-copy" delay={0.04}><div className="project-overline"><span>{String(index + 1).padStart(2, '0')}</span>{project.status && <span className="project-status"><i aria-hidden="true" />{project.status}</span>}</div><h3>{project.title}</h3><p className="project-stack">{project.stack.join(' · ')}</p><p className="project-description">{project.description}</p><ul className="project-details">{project.details.map((detail) => <li key={detail}>{detail}</li>)}</ul></Reveal><Reveal className="project-media" delay={0.12}><motion.div className="project-media-inner" whileHover={{ y: -5, scale: 1.01 }} transition={{ type: 'spring', stiffness: 220, damping: 22 }}><RedisVisual /></motion.div></Reveal></article>
}
