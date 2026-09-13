export const projects = [
  {
    title: 'Exam Registration System',
    variant: 'exam',
    stack: ['Python', 'Flask', 'MySQL'],
    context: 'CIT 260: Systems Analysis and Design · Aug–Dec 2025',
    description: 'A full-stack application with student and instructor/admin portals for managing exams and registration.',
    details: [
      'Built the frontend, Flask backend, and relational MySQL database',
      'Connected secure login and role-based access to exam creation and student registration',
      'Practiced both Waterfall planning and Agile iteration, comparing the two approaches',
      'Worked through requirements, design, testing, and deployment to understand the full development lifecycle',
    ],
  },
  {
    title: 'Minecraft Server Development',
    variant: 'minecraft',
    context: 'Developer · WindPvP · Aug 2026–present',
    stack: ['Java', 'Velocity', 'Maven', 'Git/GitHub'],
    description: 'An unpaid contributor working with the founder on a two-person team, learning an existing Java codebase through focused pull requests and Maven build checks.',
    details: [
      'Added /discord to print the community’s Discord link',
      'Updated Angel to restore two Chemist health potions instead of one',
      'Rebalanced Archer: 4 hearts at 20–25 blocks, 6 at 25–30, 8 at 30–35, and headshots at 35+',
      'Gave Heavy Speed I by default',
      'Combined Paladin’s resistance and regeneration discs so its items fit the hotbar',
    ],
  },
  {
    title: 'SLO Opportunities',
    variant: 'slo',
    status: 'Currently Building',
    stack: ['JavaScript', 'HTML', 'CSS'],
    description: 'An independent discovery tool helping Cal Poly students find clubs, research, competitions, and hands-on opportunities by major or interest.',
    details: ['Search and filter a sourced opportunity catalog', 'Expandable details with matching explanations and official links', 'Keyboard-accessible browsing and responsive layouts'],
  },
  {
    title: 'Trading Strategy Lab',
    variant: 'trading',
    status: 'Currently Building',
    stack: ['Python', 'SQLite', 'HTML'],
    description: 'A local research tool for testing trading ideas against historical market data and inspecting simulated results. Currently a research prototype with no live trading.',
    details: ['Repeatable backtests including transaction costs', 'Test strategies on later data outside their training period', 'Simulated portfolios, background jobs, and a results dashboard'],
  },
  { title: 'Redis-like Network Service', variant: 'redis', status: 'Currently Building', stack: ['Python', 'TCP sockets', 'Threading', 'JSON', 'Linux/WSL'], description: 'A learning-oriented TCP client/server service inspired by Redis, built to explore networking, concurrency, and race conditions.', details: ['Implemented PING, SET, GET, and DEL commands', 'JSON-based data persistence', 'Multithreaded support for multiple clients'] },
]

export const experience = [
  { role: 'State Competition Award', organization: 'Technology Student Association', date: 'Feb 2024', description: 'Placed 2nd in a state-level competitive coding event and qualified for TSA Nationals.' },
  { role: 'Teaching Assistant', organization: 'theCoderSchool', date: 'May 2024 – Aug 2024', description: 'Assisted introductory Python instruction for elementary and middle-school students, providing individual support with programming concepts and problem-solving.' },
  { role: 'Founder', organization: 'Hack Club', date: 'Aug 2024 – May 2026', description: 'Founded a Hack Club at my previous school, bringing together approximately 30 peers each week to code, share projects, and mentor beginners.' },
  { role: 'Member', organization: 'CSAI Club, Cal Poly', date: 'Current', description: 'Member of Cal Poly’s computer science and AI community.' },
  { role: 'Member', organization: 'Vibe Coding Club, Cal Poly', date: 'Current', description: 'Member of Cal Poly’s Vibe Coding Club.' },
]

export const education = [
  { school: 'Cal Poly San Luis Obispo', program: 'Bachelor of Science, Computer Science', date: 'CURRENT', detail: 'Currently attending. Expected graduation: May 2029.' },
  { school: 'College of Southern Nevada', program: 'Associate of Arts, Computer Science', date: 'AUG 2024 – MAY 2026', detail: 'Completed through dual enrollment while in high school, emphasizing computer science, mathematics, and college-level coursework.', gpa: 'GPA: 3.97 / 4.00' },
  { school: 'College of Southern Nevada High School', program: 'High School Diploma', date: 'AUG 2022 – MAY 2026', detail: 'Valedictorian', gpa: 'GPA: 4.00 unweighted / 4.95 weighted' },
]

// Newest first, following Giovanni’s course sequence. Courses taken together
// remain adjacent; catalog numbering is not a substitute for chronology.
export const courses = [
  { code: 'CSC 2001', title: 'Data Structures', summary: 'Covers data structures, recursion, mutable and immutable data, and algorithm analysis, with an emphasis on designing and testing programs.' },
  { code: 'CSC 1000', title: 'Computing Majors Orientation', summary: 'Introduces the computing majors and their academic paths at Cal Poly.' },
  { code: 'CIT 230', title: 'Advanced Java', summary: 'Built on Java fundamentals with application-development topics such as collections, networking, JDBC, client/server techniques, and XML.' },
  { code: 'CS 202', title: 'Computer Science II', summary: 'Extended core programming practice through data structures, problem-solving, and more substantial program design.' },
  { code: 'CIT 130', title: 'Beginning Java', summary: 'Introduced Java through control structures, object-oriented programming, file input/output, error handling, and simple graphical interfaces.' },
  { code: 'CIT 260', title: 'Systems Analysis & Design', summary: 'Applied requirements analysis, system design, testing, and deployment practices through a structured software-development lifecycle project.' },
  { code: 'CIT 180', title: 'Database Concepts & SQL', summary: 'Covered data modeling, relational database design, and hands-on SQL work using MySQL.' },
  { code: 'CIT 129', title: 'Introduction to Programming', summary: 'Introduced programming problem-solving and algorithm development, including user input/output, loops, decisions, arrays, documentation, and translating algorithms into working programs.' },
  { code: 'AP CS A', title: 'AP Computer Science A', summary: 'Developed object-oriented programming and algorithmic problem-solving skills in Java.' },
]

export const skills = [
  { label: 'Languages', items: ['Java', 'Python', 'C++', 'JavaScript', 'HTML', 'CSS'] },
  { label: 'Frameworks & technologies', items: ['React', 'Flask', 'MySQL'] },
  { label: 'Tools & environments', items: ['Git', 'GitHub', 'VS Code', 'Eclipse', 'IntelliJ', 'Linux', 'Ubuntu', 'WSL'] },
  { label: 'Concepts explored', items: ['Object-oriented programming', 'Data structures', 'Recursion', 'Binary trees', 'Networking', 'TCP sockets', 'Client/server architecture', 'Multithreading', 'Concurrency and race conditions', 'JSON persistence', 'Relational databases', 'SQL', 'Frontend development', 'Software Development Life Cycle'] },
  { label: 'Currently expanding', items: ['Artificial intelligence and machine learning', 'Backend development', 'Systems programming', 'Modern React/frontend development', 'Modern UI interaction and animation'] },
]
