import { useState } from 'react'

const courses = [
  { code: 'CIT 129', title: 'Introduction to Programming', summary: 'Introduced programming problem-solving and algorithm development, including user input/output, loops, decisions, arrays, documentation, and translating algorithms into working programs.' },
  { code: 'CIT 130', title: 'Beginning Java', summary: 'Introduced Java through control structures, object-oriented programming, file input/output, error handling, and simple graphical interfaces.' },
  { code: 'CIT 180', title: 'Database Concepts & SQL', summary: 'Covered data modeling, relational database design, and hands-on SQL work using MySQL.' },
  { code: 'CIT 230', title: 'Advanced Java', summary: 'Built on Java fundamentals with application-development topics such as collections, networking, JDBC, client/server techniques, and XML.' },
  { code: 'CIT 260', title: 'Systems Analysis & Design', summary: 'Applied requirements analysis, system design, testing, and deployment practices through a structured software-development lifecycle project.' },
  { code: 'CS 202', title: 'Computer Science II', summary: 'Extended core programming practice through data structures, problem-solving, and more substantial program design.' },
  { code: 'AP CS A', title: 'AP Computer Science A', summary: 'Developed object-oriented programming and algorithmic problem-solving skills in Java.' },
]

export default function Coursework() {
  const [expanded, setExpanded] = useState(null)

  return <section className="coursework" aria-labelledby="coursework-title">
    <h3 id="coursework-title" className="mono-label">Selected previous coursework</h3>
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
