import { test, expect } from '@playwright/test'

const titles = ['Exam Registration System', 'Minecraft Server Development', 'SLO Opportunities', 'Trading Strategy Lab', 'Redis-like Network Service']

function readPin(section) {
  const spacer = section.parentElement
  const rail = section.querySelector('.project-rail')
  const start = spacer.getBoundingClientRect().top + scrollY
  const end = start + parseFloat(getComputedStyle(spacer).paddingBottom)
  const distance = rail.lastElementChild.getBoundingClientRect().right - rail.getBoundingClientRect().left + parseFloat(getComputedStyle(rail).paddingRight) - rail.clientWidth
  return { start, end, distance, moveEnd: end - Math.min(240, section.clientHeight * 0.2) }
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator('.site-loader')).toBeHidden()
  await expect(page.locator('#work h3')).toHaveText(titles)
  await expect(page.locator('#work').getByText(/^\d{2}$/)).toHaveCount(0)
})

for (const viewport of [{ width: 1440, height: 900 }, { width: 900, height: 700 }]) {
test(`Redis finishes moving before the rail unpins at ${viewport.width}x${viewport.height}`, async ({ page }) => {
  await page.setViewportSize(viewport)
  const pin = await page.locator('#work').evaluate(readPin)
  expect(pin.end).toBeGreaterThan(pin.start)

  // Exercise both a quick flick and a smaller movement through the boundary.
  for (const remaining of [600, 80]) {
    await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), pin.end - remaining)
    await expect.poll(() => page.locator('#work').evaluate(section => Math.abs(section.getBoundingClientRect().top))).toBeLessThan(1)
    await expect.poll(() => page.locator('.project-rail').evaluate((rail, { pin, remaining }) => {
      const expected = -pin.distance * Math.min(1, (pin.end - remaining - pin.start) / (pin.moveEnd - pin.start))
      return Math.abs(new DOMMatrixReadOnly(getComputedStyle(rail).transform).m41 - expected)
    }, { pin, remaining })).toBeLessThan(1)

    const release = await page.evaluate(async end => {
      const section = document.querySelector('#work')
      const rail = section.querySelector('.project-rail')
      window.scrollTo({ top: end + 48, behavior: 'instant' })
      // Sample the FIRST unpinned frame, not the eventually settled animation.
      for (let frame = 0; frame < 120; frame++) {
        await new Promise(requestAnimationFrame)
        if (section.getBoundingClientRect().top < -1) {
          const rect = rail.lastElementChild.getBoundingClientRect()
          const gutter = parseFloat(getComputedStyle(rail).paddingRight)
          return { remainingX: Math.abs(document.documentElement.clientWidth - rect.right - gutter), left: rect.left, right: rect.right }
        }
      }
      return null
    }, pin.end)
    expect(release, 'The page should resume vertical scrolling').not.toBeNull()
    expect(release.remainingX, 'No horizontal catch-up after vertical scrolling resumes').toBeLessThan(1)
    expect(release.left).toBeGreaterThanOrEqual(-1)
    expect(release.right).toBeLessThanOrEqual(viewport.width + 1)
  }
})

test(`Work navigation reaches every panel at ${viewport.width}x${viewport.height}`, async ({ page }) => {
  await page.setViewportSize(viewport)
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.getByRole('link', { name: 'Work', exact: true }).click()
  await expect(page).toHaveURL(/#work$/)
  // Let native smooth anchor navigation finish before driving the rail.
  await expect.poll(() => page.locator('#work').evaluate(section => Math.round(section.getBoundingClientRect().top))).toBe(80)
  const pin = await page.locator('#work').evaluate(readPin)
  expect(pin.end).toBeGreaterThan(pin.start)
  for (const direction of [titles, [...titles].reverse()]) {
    for (const title of direction) {
      const index = titles.indexOf(title)
      await page.evaluate(({ pin, index }) => {
        const rail = document.querySelector('.project-rail')
        const panel = rail.children[index]
        const distance = pin.distance
        const offset = Math.min(distance, panel.offsetLeft - rail.children[0].offsetLeft)
        window.scrollTo({ top: pin.start + (pin.moveEnd - pin.start) * offset / distance, behavior: 'instant' })
      }, { pin, index })
      const panel = page.getByRole('article', { name: title, exact: true })
      await expect.poll(async () => {
        const rect = await panel.boundingBox()
        return {
          title,
          leftOverflow: Math.max(0, Math.round(-rect.x)),
          rightOverflow: Math.max(0, Math.round(rect.x + rect.width - viewport.width)),
          topOverflow: Math.max(0, Math.round(-rect.y)),
          bottomOverflow: Math.max(0, Math.round(rect.y + rect.height - viewport.height)),
        }
      }, { timeout: 15000 }).toEqual({ title, leftOverflow: 0, rightOverflow: 0, topOverflow: 0, bottomOverflow: 0 })
      const settled = await panel.boundingBox()
      expect(settled.x).toBeGreaterThanOrEqual(-1)
      expect(settled.y).toBeGreaterThanOrEqual(-1)
      await expect(panel.getByRole('heading')).toBeVisible()
      const lastDetail = await panel.locator('li').last().boundingBox()
      const panelBox = await panel.boundingBox()
      const copyBox = await panel.locator('.project-panel__copy').boundingBox()
      expect(copyBox.y).toBeGreaterThanOrEqual(panelBox.y)
      expect(copyBox.y + copyBox.height).toBeLessThanOrEqual(panelBox.y + panelBox.height)
      expect(lastDetail.y + lastDetail.height).toBeLessThanOrEqual(panelBox.y + panelBox.height)
      if (['SLO Opportunities', 'Trading Strategy Lab', 'Redis-like Network Service'].includes(title)) {
        await expect(panel.getByText('Currently Building', { exact: true })).toBeVisible()
      }
    }
  }
  await page.screenshot({ path: `${test.info().outputDir}/work-desktop.png` })
  expect(errors).toEqual([])
})
}

for (const scenario of [
  { name: 'mobile', width: 375, height: 812, reducedMotion: 'no-preference' },
  { name: 'short desktop', width: 1280, height: 650, reducedMotion: 'no-preference' },
  { name: 'reduced motion', width: 1280, height: 800, reducedMotion: 'reduce' },
]) {
  test(`${scenario.name}: all five projects remain readable without pinning`, async ({ page }) => {
    await page.setViewportSize({ width: scenario.width, height: scenario.height })
    await page.emulateMedia({ reducedMotion: scenario.reducedMotion })
    await expect(page.locator('#work')).not.toHaveCSS('position', 'fixed')
    for (const title of titles) {
      const panel = page.getByRole('article', { name: title, exact: true })
      await panel.getByRole('heading').scrollIntoViewIfNeeded()
      await expect(panel.getByRole('heading')).toBeInViewport()
      const box = await panel.boundingBox()
      expect(box.x).toBeGreaterThanOrEqual(0)
      expect(box.x + box.width).toBeLessThanOrEqual(scenario.width + 1)
      const lastDetail = panel.locator('li').last()
      await lastDetail.scrollIntoViewIfNeeded()
      await expect(lastDetail).toBeInViewport()
    }
    await page.screenshot({ path: `${test.info().outputDir}/work-${scenario.name.replaceAll(' ', '-')}.png` })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })
}
