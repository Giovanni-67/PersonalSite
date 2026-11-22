import { test, expect } from '@playwright/test'

test('all supplied project images load in the requested order', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator('.site-loader')).toBeHidden()
  const photos = page.locator('.project-panel__photo img')
  await expect(photos).toHaveCount(6)
  const urls = await photos.evaluateAll(images => images.map(image => new URL(image.src).pathname))
  expect(urls).toEqual(['newton.png', 'exam-registration.jpg', 'minecraft.png', 'cal-poly-slo.jpg', 'rewind.png', 'redis.jpg'].map(name => `/assets/projects/${name}`))
  for (const photo of await photos.all()) {
    // Decode each lazy image too, including panels initially outside the viewport.
    await photo.evaluate(image => { image.loading = 'eager' })
    await expect.poll(() => photo.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true)
  }
  expect(await photos.evaluateAll(images => [images[1], images[2], images[5]].map(image => [image.naturalWidth, image.naturalHeight]))).toEqual([[4160, 6240], [3840, 2400], [2500, 1875]])
  await expect(page.locator('.project-panel__photo figcaption')).toHaveText([
    'Hackathon presentation cover',
    'Study & learning · Editorial image',
    'Minecraft server development · Editorial image',
    'San Luis Obispo County · Editorial image',
    'AI debugging illustration · Editorial image',
    'Network connections · Editorial image',
  ])
})
