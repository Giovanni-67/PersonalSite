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

The project images are distinct Unsplash editorial photographs: a
[library study area](https://unsplash.com/photos/nGlfw0HouBQ), the original
Minecraft server-rack image, [SLO County hills](https://unsplash.com/photos/RG1Nhgd-ddE),
[market charts](https://unsplash.com/photos/fiXLQXAhCfk), and
[network cables](https://unsplash.com/photos/40XgDxBfYXM).

Coursework uses the confirmed newest-first learning sequence, not numerical
sorting. Prefixes were cross-checked against CSN's
[Java guidance](https://www.csn.edu/_csnmedia/documents/cit-information/prepare_for_oracle_certifications2023-24.pdf)
and the [2024–25 CSN/UNLV transfer agreement](https://www.unlv.edu/sites/default/files/media/document/2024-07/BS-4Year-ComputerScience-2024-2025.pdf).
New Cal Poly summaries use the [official CSC catalog](https://catalog.calpoly.edu/courses/csc/).

Unit tests check project ordering, complete data, and in-progress labels.
Playwright checks real navigation, forward/backward rail traversal, mobile,
short windows, reduced motion, and horizontal overflow. GitHub Actions runs
these checks before publishing `dist` to the existing GitHub Pages site on
`main`. For the repository URL, the production build uses `--base=/PersonalSite/`.

Work on feature branches and keep commits focused. Generated files, dependencies,
test output, and secrets must stay out of Git.
