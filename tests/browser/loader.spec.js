import { test, expect } from '@playwright/test'

test('loading overlay is removed even if its fade animation stalls', async ({ page }) => {
  await page.addInitScript(() => {
    window.pausedLoaderFades = 0
    const observer = new MutationObserver(() => {
      const loader = document.querySelector('.site-loader--done')
      if (!loader) return
      const fades = loader.getAnimations()
      if (!fades.length) return
      fades.forEach(animation => animation.pause())
      window.pausedLoaderFades = fades.length
      observer.disconnect()
    })
    observer.observe(document, { attributes: true, attributeFilter: ['class'], childList: true, subtree: true })
  })
  await page.goto('/')
  await expect.poll(() => page.evaluate(() => window.pausedLoaderFades)).toBeGreaterThan(0)
  await expect(page.locator('.site-loader')).toHaveCount(0)
  await page.getByRole('link', { name: 'About', exact: true }).click()
  await expect(page).toHaveURL(/#about$/)
})
