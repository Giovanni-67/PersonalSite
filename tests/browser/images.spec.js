import { test, expect } from '@playwright/test'

test('every project uses a distinct editorial image and keeps the Minecraft image', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.site-loader')).toBeHidden()
  const photos = page.locator('.project-panel__photo img')
  await expect(photos).toHaveCount(5)
  const urls = await photos.evaluateAll(images => images.map(image => image.src.split('?')[0]))
  expect(new Set(urls).size).toBe(5)
  expect(urls[1]).toContain('photo-1558494949-ef010cbdcc31')
  for (const index of [0, 2, 3, 4]) {
    expect(urls[index]).not.toMatch(/photo-1558494949-ef010cbdcc31|photo-1518770660439-4636190af475/)
  }
  await expect(page.locator('.project-panel__photo figcaption')).toHaveText([
    'Study & learning · Editorial image',
    'Minecraft server development · Editorial image',
    'San Luis Obispo County · Editorial image',
    'Market research · Editorial image',
    'Network connections · Editorial image',
  ])
})
