import { useState } from 'react'
import { courses } from '../data/portfolio'

export default function Coursework() {
  const [expanded, setExpanded] = useState(null)

  return <section className="coursework" aria-labelledby="coursework-title">
    <h3 id="coursework-title" className="mono-label">Relevant coursework</h3>
    <ul>{courses.map((course) => {
      const isExpanded = expanded === course.code
      return <li key={course.code} onMouseEnter={() => setExpanded(course.code)} onMouseLeave={() => setExpanded(null)}>
        <button type="button" aria-expanded={isExpanded} onClick={() => setExpanded(isExpanded ? null : course.code)} onFocus={() => setExpanded(course.code)}>
          <span>{course.code}</span><span>{course.title}</span>
        </button>
        <div className={isExpanded ? 'coursework__summary coursework__summary--open' : 'coursework__summary'}><p>{course.summary}</p></div>
      </li>
    })}</ul>
  </section>
}
