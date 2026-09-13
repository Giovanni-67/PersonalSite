import { test, expect } from '@playwright/test'

for (const viewport of [{ width: 1440, height: 900 }, { width: 375, height: 812 }]) {
  test.describe(`skills at ${viewport.width}x${viewport.height}`, () => {
    test.use({ viewport })

    test('shows neutral topics and bilingual fluency without clipping', async ({ page }) => {
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      await page.goto('/')
      await page.evaluate(() => document.fonts.ready)
      await expect(page.locator('.site-loader')).toBeHidden()
      if (viewport.width < 900) await page.getByRole('button', { name: 'Open navigation' }).click()
      await page.getByRole('link', { name: 'Skills', exact: true }).click()
      await expect(page).toHaveURL(/#skills$/)
      const section = page.locator('#skills')
      await expect.poll(() => section.evaluate(element => Math.abs(element.getBoundingClientRect().top))).toBeLessThan(1)
      await expect(section.locator('h3')).toHaveText([
        'Programming & web languages', 'Frameworks & technologies',
        'Tools & environments', 'Areas of interest', 'Spoken languages',
      ])
      await expect(section).not.toContainText(/Concepts explored|Currently expanding|Binary trees|TCP sockets|Multithreading|race conditions/i)
      await expect(section).toContainText('English (fluent) · Mandarin (fluent)')

      for (const group of await section.locator('.skill-group').all()) {
        await group.scrollIntoViewIfNeeded()
        await expect(group).toHaveCSS('opacity', '1')
        await expect(group).toHaveCSS('transform', 'none')
        await expect(group.locator('h3')).toBeInViewport()
        await expect(group.locator('p')).toBeInViewport()
        const box = await group.boundingBox()
        expect(box.x).toBeGreaterThanOrEqual(0)
        expect(box.x + box.width).toBeLessThanOrEqual(viewport.width)
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      expect(errors).toEqual([])
    })
  })
}
