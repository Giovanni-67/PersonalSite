import { test, expect } from '@playwright/test'

async function openNavLink(page, name) {
  if (await page.getByRole('button', { name: 'Open navigation' }).isVisible()) {
    await page.getByRole('button', { name: 'Open navigation' }).click()
  }
  await page.getByRole('navigation').getByRole('link', { name, exact: true }).click()
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator('.site-loader')).toBeHidden()
})

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 956, height: 1320 },
  { width: 375, height: 812 },
  { width: 1280, height: 650 },
  { width: 1280, height: 800, reducedMotion: 'reduce' },
]) {
  test.describe(`initial navigation layout ${viewport.width}x${viewport.height}`, () => {
  test.use({ viewport: { width: viewport.width, height: viewport.height }, reducedMotion: viewport.reducedMotion || 'no-preference' })
  test(`Work lands flush from above and below without reversing at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    for (const origin of ['top', 'about', 'skills', 'contact']) {
      if (origin === 'top') await page.getByRole('link', { name: 'Giovanni Peila, back to top' }).click()
      else await openNavLink(page, origin[0].toUpperCase() + origin.slice(1))
      const source = page.locator(`#${origin}`)
      // Contact can be shorter or taller than the viewport; anchors clamp at the page end.
      await expect.poll(() => source.evaluate(element => {
        const start = element.getBoundingClientRect().top + scrollY
        return Math.abs(scrollY - Math.min(start, document.documentElement.scrollHeight - innerHeight))
      })).toBeLessThan(1)
      const target = await page.locator('#work').evaluate(element => {
        const anchor = element.parentElement.classList.contains('pin-spacer') ? element.parentElement : element
        return anchor.getBoundingClientRect().top + scrollY
      })
      const before = await page.evaluate(() => scrollY)
      await page.evaluate(() => {
        window.navigationPositions = []
        window.recordNavigation = true
        const sample = () => {
          window.navigationPositions.push(scrollY)
          if (window.recordNavigation) requestAnimationFrame(sample)
        }
        requestAnimationFrame(sample)
      })
      await openNavLink(page, 'Work')
      await expect(page).toHaveURL(/#work$/)
      await expect.poll(() => page.locator('#work').evaluate(element => Math.abs(element.getBoundingClientRect().top))).toBeLessThan(1)
      await expect.poll(() => page.evaluate(target => Math.abs(scrollY - target), target)).toBeLessThan(1)
      // Detect late pin/anchor corrections as well as the initial landing.
      await page.waitForTimeout(300)
      const samples = await page.evaluate(() => { window.recordNavigation = false; return window.navigationPositions })
      const direction = Math.sign(target - before)
      const reversals = samples.slice(1).filter((position, index) => (position - samples[index]) * direction < -2)
      expect(reversals, `No scroll reversals from ${origin}`).toEqual([])
      expect(await page.locator('#work').evaluate(element => Math.abs(element.getBoundingClientRect().top))).toBeLessThan(1)
      const first = page.locator('.project-panel').first()
      await expect(first.getByRole('heading')).toBeInViewport()
      expect((await first.boundingBox()).x).toBeGreaterThanOrEqual(-1)
    }
  })
  })
}

test('hero has no active glass item after returning from About', async ({ page }) => {
  const nav = page.getByRole('navigation')
  const about = nav.getByRole('link', { name: 'About', exact: true })
  await page.mouse.move(800, 400)
  await expect(nav.locator('.is-active')).toHaveCount(0)
  for (const method of ['brand', 'wheel']) {
    await about.click()
    await expect(about).toHaveClass('is-active')
    await expect.poll(() => page.locator('#about').evaluate(element => Math.abs(element.getBoundingClientRect().top))).toBeLessThan(1)
    await page.mouse.move(800, 400)
    if (method === 'brand') await page.getByRole('link', { name: 'Giovanni Peila, back to top' }).click()
    else await page.mouse.wheel(0, -await page.evaluate(() => scrollY))
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0)
    await expect(nav.locator('.is-active')).toHaveCount(0)
    await expect(nav.locator('.nav-item--highlighted')).toHaveCount(0)
  }
  // Intentional hover is still allowed on the hero, without marking a section active.
  await about.hover()
  await expect(about.locator('..')).toHaveClass(/nav-item--highlighted/)
  await expect(about).not.toHaveClass('is-active')
  await page.mouse.move(800, 400)
  await expect(nav.locator('.nav-item--highlighted')).toHaveCount(0)
  await about.focus()
  await expect(about.locator('..')).toHaveClass(/nav-item--highlighted/)
  await page.getByRole('link', { name: 'Giovanni Peila, back to top' }).focus()
  await expect(nav.locator('.nav-item--highlighted')).toHaveCount(0)
})

test('Work links support keyboard entry and restarting the pinned rail', async ({ page }) => {
  const work = page.locator('#work')
  const start = await work.evaluate(section => section.parentElement.getBoundingClientRect().top + scrollY)
  for (const name of ['View selected work', 'Scroll to selected work', 'Skip to selected work']) {
    await page.getByRole('link', { name: 'Giovanni Peila, back to top' }).click()
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0)
    const link = page.getByRole('link', { name })
    await link.focus()
    await link.press('Enter')
    await expect.poll(() => page.evaluate(start => Math.abs(scrollY - start), start)).toBeLessThan(1)
    await expect(work).toBeFocused()
    await expect(page).toHaveURL(/#work$/)
  }
  // The hash is already #work: clicking Work must still return to panel one.
  await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), start + 1000)
  await expect.poll(() => page.locator('.project-panel').first().evaluate(panel => panel.getBoundingClientRect().left)).toBeLessThan(0)
  const navLink = page.getByRole('navigation').getByRole('link', { name: 'Work', exact: true })
  await navLink.focus()
  await navLink.press('Enter')
  await expect.poll(() => page.evaluate(start => Math.abs(scrollY - start), start)).toBeLessThan(1)
  await expect(work).toBeFocused()
  await expect.poll(() => page.locator('.project-panel').first().evaluate(panel => panel.getBoundingClientRect().left)).toBeGreaterThanOrEqual(0)
})
