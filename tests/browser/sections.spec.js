import { test, expect } from '@playwright/test'

for (const viewport of [{ width: 1440, height: 900 }, { width: 1280, height: 650 }, { width: 375, height: 812 }]) {
  test(`sections fill the viewport without clipping at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto('/')
    await page.evaluate(() => document.fonts.ready)
    await expect(page.locator('.site-loader')).toBeHidden()
    for (const id of ['about', 'experience', 'education', 'skills']) {
      const section = page.locator(`#${id}`)
      if (viewport.width < 900) await page.getByRole('button', { name: 'Open navigation' }).click()
      await page.getByRole('link', { name: id[0].toUpperCase() + id.slice(1), exact: true }).click()
      await expect(page).toHaveURL(new RegExp(`#${id}$`))
      await expect.poll(() => section.evaluate(element => Math.abs(element.getBoundingClientRect().top))).toBeLessThan(1)
      const sectionBox = await section.boundingBox()
      expect(sectionBox.height).toBeGreaterThanOrEqual(viewport.height - 1)
      const heading = section.locator('.section-heading')
      await expect(heading).toHaveCSS('transform', 'none')
      expect((await heading.boundingBox()).y).toBeGreaterThanOrEqual(80)
      const content = section.locator(':scope > .container')
      const contentBox = await content.boundingBox()
      expect(contentBox.y + contentBox.height).toBeLessThanOrEqual(sectionBox.y + sectionBox.height + 1)
    }
    // Expanded coursework is allowed to grow the section, never overflow it.
    const lastCourse = page.getByRole('button', { name: 'AP CS A AP Computer Science A', exact: true })
    await lastCourse.focus()
    await expect(lastCourse).toHaveAttribute('aria-expanded', 'true')
    const summary = lastCourse.locator('..').locator('.coursework__summary')
    await expect.poll(() => summary.evaluate(element => element.clientHeight)).toBeGreaterThan(20)
    // Measure both rectangles in one frame: focus can still be scrolling.
    await expect.poll(() => summary.evaluate(element => {
      const sectionBottom = document.getElementById('education').getBoundingClientRect().bottom
      return sectionBottom - element.getBoundingClientRect().bottom
    })).toBeGreaterThan(0)
    expect(await page.locator('#contact').evaluate(element => getComputedStyle(element).minHeight)).toBe('0px')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    expect(errors).toEqual([])
  })
}

test('hero scrolls away naturally while retaining its beams and parallax', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator('.site-loader')).toBeHidden()
  const hero = page.locator('#top')
  await expect(hero.locator('..')).not.toHaveClass(/pin-spacer/)
  await expect(hero.locator('canvas')).toHaveCount(1)
  const initial = await hero.boundingBox()
  const about = await page.locator('#about').boundingBox()
  expect(Math.abs(about.y - (initial.y + initial.height))).toBeLessThan(2)
  const originalTransform = await page.locator('.hero-content').evaluate(element => getComputedStyle(element).transform)
  await page.mouse.wheel(0, 240)
  await expect.poll(() => hero.evaluate(element => element.getBoundingClientRect().top)).toBeLessThan(-200)
  await expect.poll(() => page.locator('.hero-content').evaluate(element => getComputedStyle(element).transform)).not.toBe(originalTransform)
})
