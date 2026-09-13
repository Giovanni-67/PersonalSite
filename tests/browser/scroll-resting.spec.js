import { test, expect } from '@playwright/test'

test.use({ viewport: { width: 1880, height: 1320 } })
test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator('.site-loader')).toBeHidden()
})

test('Redis shows the complete green end gutter while the rail is still pinned', async ({ page }) => {
  const end = await page.locator('#work').evaluate(section => {
    const spacer = section.parentElement
    return spacer.getBoundingClientRect().top + scrollY + parseFloat(getComputedStyle(spacer).paddingBottom)
  })
  await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), end - 100)
  const rail = page.locator('#work')
  await expect(rail).toHaveCSS('position', 'fixed')
  const gutterError = () => page.locator('.project-rail').evaluate(element => {
    const actual = document.documentElement.clientWidth - element.lastElementChild.getBoundingClientRect().right
    return Math.abs(actual - parseFloat(getComputedStyle(element).paddingRight))
  })
  await expect.poll(gutterError).toBeLessThan(1)
  await expect(page.locator('#experience')).not.toBeInViewport()
  await page.mouse.wheel(0, 40)
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(end - 80)
  expect(await gutterError()).toBeLessThan(1)
  await expect(rail).toHaveCSS('position', 'fixed')
  await page.mouse.wheel(0, 200)
  await expect.poll(() => rail.evaluate(element => element.getBoundingClientRect().top)).toBeLessThan(-1)
  expect(await gutterError()).toBeLessThan(1)
})

test('wheel scrolling settles full-screen chapters without neighboring strips', async ({ page }) => {
  for (const id of ['about', 'experience', 'education', 'skills']) {
    const section = page.locator(`#${id}`)
    const start = await section.evaluate(element => element.getBoundingClientRect().top + scrollY)
    for (const direction of [1, -1]) {
      await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), start - direction * 220)
      await expect.poll(() => section.evaluate(element => Math.round(element.getBoundingClientRect().top))).toBe(direction * 220)
      await page.mouse.wheel(0, direction * 140)
      await expect.poll(() => section.evaluate(element => Math.abs(element.getBoundingClientRect().top))).toBeLessThan(1)
      const coverage = await section.evaluate(element => {
        const rect = element.getBoundingClientRect()
        return { top: rect.top, bottom: rect.bottom, viewport: innerHeight }
      })
      expect(coverage.top).toBeLessThan(1)
      expect(coverage.bottom).toBeGreaterThanOrEqual(coverage.viewport - 1)
    }
  }
})

test('keyboard input cancels a pending wheel settle', async ({ page }) => {
  const section = page.locator('#skills')
  const start = await section.evaluate(element => element.getBoundingClientRect().top + scrollY)
  await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), start - 220)
  await expect.poll(() => section.evaluate(element => Math.round(element.getBoundingClientRect().top))).toBe(220)
  await page.mouse.wheel(0, 140)
  await expect.poll(() => section.evaluate(element => Math.round(element.getBoundingClientRect().top)), { intervals: [10] }).toBe(80)
  await page.keyboard.press('Escape')
  // Wait beyond the idle threshold to prove the cancelled correction stays cancelled.
  await page.waitForTimeout(500)
  expect(await section.evaluate(element => Math.round(element.getBoundingClientRect().top))).toBe(80)
})

test('small repeated wheel steps can leave a settled chapter in either direction', async ({ page }) => {
  const section = page.locator('#experience')
  for (const direction of [1, -1]) {
    await page.getByRole('link', { name: 'Experience', exact: true }).click()
    await expect.poll(() => section.evaluate(element => Math.abs(element.getBoundingClientRect().top))).toBeLessThan(1)
    for (const step of [1, 2]) {
      await page.mouse.wheel(0, direction * 80)
      await expect.poll(() => section.evaluate(element => Math.round(element.getBoundingClientRect().top)), { intervals: [10] }).toBe(-direction * 80 * step)
      await page.waitForTimeout(500)
      expect(await section.evaluate(element => Math.round(element.getBoundingClientRect().top))).toBe(-direction * 80 * step)
    }
  }
})

test.describe('short initial viewport', () => {
test.use({ viewport: { width: 900, height: 700 } })
test('long sections remain freely scrollable', async ({ page }) => {
  await page.getByRole('link', { name: 'Experience', exact: true }).click()
  const section = page.locator('#experience')
  await expect.poll(() => section.evaluate(element => Math.abs(element.getBoundingClientRect().top))).toBeLessThan(1)
  expect(await section.evaluate(element => element.clientHeight)).toBeGreaterThan(701)
  await page.mouse.wheel(0, 80)
  await expect.poll(() => section.evaluate(element => Math.round(element.getBoundingClientRect().top)), { intervals: [10] }).toBe(-80)
  await page.waitForTimeout(500)
  expect(await section.evaluate(element => Math.round(element.getBoundingClientRect().top))).toBe(-80)
})
})

for (const mode of ['mobile', 'reduced motion']) {
  test.describe(`${mode} initial layout`, () => {
  // Configure the browser before beforeEach loads the app. Resizing a desktop
  // page here races GSAP's pin teardown and changes the stored scroll target.
  test.use(mode === 'mobile'
    ? { viewport: { width: 375, height: 812 } }
    : { reducedMotion: 'reduce' })
  test(`${mode} does not automatically reposition wheel scrolling`, async ({ page }) => {
    await expect(page.locator('.pin-spacer')).toHaveCount(0)
    const section = page.locator('#skills')
    const start = await section.evaluate(element => element.getBoundingClientRect().top + scrollY)
    await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), start - 220)
    await expect.poll(() => section.evaluate(element => Math.round(element.getBoundingClientRect().top))).toBe(220)
    await page.mouse.wheel(0, 140)
    await expect.poll(() => section.evaluate(element => Math.round(element.getBoundingClientRect().top)), { intervals: [10] }).toBe(80)
    await page.waitForTimeout(500)
    expect(await section.evaluate(element => Math.round(element.getBoundingClientRect().top))).toBe(80)
  })
  })
}

test('desktop-to-mobile resize settles before subsequent wheel scrolling', async ({ page }) => {
  await expect(page.locator('.pin-spacer')).toHaveCount(1)
  await page.setViewportSize({ width: 375, height: 812 })
  await expect(page.locator('.pin-spacer')).toHaveCount(0)
  await expect(page.locator('.project-rail')).toHaveCSS('transform', 'none')
  // Resize is its own flow: wait for stable document geometry, not a guessed
  // sleep or a cached target from the outgoing desktop layout.
  let previous
  let stableSince = Date.now()
  await expect.poll(async () => {
    const current = await page.locator('#skills').evaluate(element => JSON.stringify({
      top: element.getBoundingClientRect().top + scrollY,
      height: document.documentElement.scrollHeight,
      scroll: scrollY,
    }))
    if (current !== previous) { previous = current; stableSince = Date.now() }
    return Date.now() - stableSince
  }).toBeGreaterThan(300)
  const section = page.locator('#skills')
  const start = await section.evaluate(element => element.getBoundingClientRect().top + scrollY)
  await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), start - 220)
  await expect.poll(() => section.evaluate(element => Math.round(element.getBoundingClientRect().top))).toBe(220)
  await page.mouse.wheel(0, 140)
  await expect.poll(() => section.evaluate(element => Math.round(element.getBoundingClientRect().top))).toBe(80)
  await page.waitForTimeout(500)
  expect(await section.evaluate(element => Math.round(element.getBoundingClientRect().top))).toBe(80)
})
