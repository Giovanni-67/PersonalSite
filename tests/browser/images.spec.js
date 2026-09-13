import { test, expect } from '@playwright/test'

test('all five supplied project photos load in the requested order', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator('.site-loader')).toBeHidden()
  const photos = page.locator('.project-panel__photo img')
  await expect(photos).toHaveCount(5)
  const urls = await photos.evaluateAll(images => images.map(image => new URL(image.src).pathname))
  expect(urls).toEqual(['exam-registration.jpg', 'minecraft.jpg', 'cal-poly-slo.jpg', 'trading.jpg', 'redis.jpg'].map(name => `/assets/projects/${name}`))
  for (const photo of await photos.all()) {
    // Decode each lazy image too, including panels initially outside the viewport.
    await photo.evaluate(image => { image.loading = 'eager' })
    await expect.poll(() => photo.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true)
  }
  await expect(page.locator('.project-panel__photo figcaption')).toHaveText([
    'Study & learning · Editorial image',
    'Minecraft server development · Editorial image',
    'San Luis Obispo County · Editorial image',
    'Market research · Editorial image',
    'Network connections · Editorial image',
  ])
})
