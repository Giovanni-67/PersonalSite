import { test, expect } from '@playwright/test'

const titles = ['Exam Registration System', 'Minecraft Server Development', 'SLO Opportunities', 'Trading Strategy Lab', 'Redis-like Network Service']

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.site-loader')).toBeHidden()
  await expect(page.locator('#work h3')).toHaveText(titles)
  await page.evaluate(() => document.fonts.ready)
})

for (const viewport of [{ width: 1440, height: 900 }, { width: 900, height: 700 }]) {
test(`Work navigation reaches every panel at ${viewport.width}x${viewport.height}`, async ({ page }) => {
  await page.setViewportSize(viewport)
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.getByRole('link', { name: 'Work', exact: true }).click()
  await expect(page).toHaveURL(/#work$/)
  // Let native smooth anchor navigation finish before driving the rail.
  await expect.poll(() => page.locator('#work').evaluate(section => Math.round(section.getBoundingClientRect().top))).toBe(80)
  const pin = await page.evaluate(() => {
    const spacer = document.querySelector('#work').parentElement
    const start = spacer.getBoundingClientRect().top + scrollY
    return { start, end: start + parseFloat(getComputedStyle(spacer).paddingBottom) }
  })
  expect(pin.end).toBeGreaterThan(pin.start)
  for (const direction of [titles, [...titles].reverse()]) {
    for (const title of direction) {
      const index = titles.indexOf(title)
      await page.evaluate(({ pin, index }) => {
        const rail = document.querySelector('.project-rail')
        const panel = rail.children[index]
        const distance = rail.scrollWidth - rail.clientWidth
        const offset = Math.min(distance, panel.offsetLeft - rail.children[0].offsetLeft)
        window.scrollTo({ top: pin.start + (pin.end - pin.start) * offset / distance, behavior: 'instant' })
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
