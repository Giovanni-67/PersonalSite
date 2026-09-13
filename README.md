# Giovanni Peila — Portfolio

React and Vite portfolio with an animated Beams hero, glass navigation,
education and experience, and a scroll-driven Selected Work section.

Projects appear in this order: Exam Registration System, Minecraft Server
Development, SLO Opportunities, Trading Strategy Lab, and Redis-like Network
Service. SLO Opportunities, Trading Strategy Lab, and Redis remain in progress.
Trading Strategy Lab is a research prototype and does not execute live trades.

## Development

Use Node.js 22 or newer.

```sh
npm ci
npm run dev
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

Project content lives in `src/data/portfolio.js`; the existing editorial image
choices are in `src/components/ProjectRail.jsx`. These are decorative stock
images, not screenshots of the projects. Desktop scrolling moves through all
five panels. Small or short viewports and reduced-motion users receive stacked
panels so every description remains reachable.

Unit tests check project ordering, complete data, and in-progress labels.
Playwright checks real navigation, forward/backward rail traversal, mobile,
short windows, reduced motion, and horizontal overflow. GitHub Actions runs
these checks before publishing `dist` to the existing GitHub Pages site on
`main`. For the repository URL, the production build uses `--base=/PersonalSite/`.

Work on feature branches and keep commits focused. Generated files, dependencies,
test output, and secrets must stay out of Git.
