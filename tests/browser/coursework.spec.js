import { test, expect } from '@playwright/test'

const codes = ['CSC 2001', 'CSC 1000', 'CIT 230', 'CS 202', 'CIT 130', 'CIT 260', 'CIT 180', 'CIT 129', 'AP CS A']

for (const viewport of [{ width: 1440, height: 900 }, { width: 375, height: 812 }]) {
  test(`coursework preserves hover and keyboard expansion at ${viewport.width}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/')
    await expect(page.locator('.site-loader')).toBeHidden()
    await page.evaluate(() => document.fonts.ready)
    const coursework = page.getByRole('region', { name: 'Relevant coursework', exact: true })
    await coursework.scrollIntoViewIfNeeded()
    await expect(coursework.locator('..')).toHaveCSS('opacity', '1')
    await expect(coursework.locator('..')).toHaveCSS('transform', 'none')
    const buttons = coursework.getByRole('button')
    await expect(buttons.locator('span:first-child')).toHaveText(codes)
    for (const code of codes) {
      const button = buttons.filter({ hasText: code })
      const row = button.locator('..')
      const summary = row.locator('.coursework__summary')
      await button.hover()
      await expect(button).toHaveAttribute('aria-expanded', 'true')
      await expect(summary).toHaveClass(/--open/)
      await expect.poll(() => summary.evaluate(element => element.clientHeight)).toBeGreaterThan(20)
      await expect(coursework.locator('[aria-expanded="true"]')).toHaveCount(1)
      await page.mouse.move(0, 0)
      await expect(button).toHaveAttribute('aria-expanded', 'false')
      await button.focus()
      await expect(button).toHaveAttribute('aria-expanded', 'true')
      await button.press('Enter')
      await expect(button).toHaveAttribute('aria-expanded', 'false')
      await button.press('Enter')
      await expect(button).toHaveAttribute('aria-expanded', 'true')
      await button.press('Enter')
      await expect(button).toHaveAttribute('aria-expanded', 'false')
      // Finish the closing animation before targeting the next moving row.
      await expect.poll(() => summary.evaluate(element => element.clientHeight)).toBe(0)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })
}
