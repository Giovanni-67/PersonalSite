import { test, expect } from '@playwright/test'

test('clicked selection stays stable throughout navigation and Contact stays active', async ({ page }) => {
  // Ten transitions sample 1,000 rendered frames on software-rendered CI.
  test.setTimeout(process.env.CI ? 300000 : 60000)
  await page.setViewportSize({ width: 1724, height: 1320 })
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator('.site-loader')).toBeHidden()
  const nav = page.getByRole('navigation')
  for (const name of ['Work', 'About', 'Experience', 'Education', 'Skills', 'Contact', 'Skills', 'Education', 'Experience', 'About']) {
    await nav.getByRole('link', { name, exact: true }).click()
    await page.mouse.move(50, 400)
    const samples = await page.evaluate(async () => {
      const values = []
      for (let i = 0; i < 100; i++) {
        await new Promise(requestAnimationFrame)
        values.push(document.querySelector('nav .nav-item--highlighted a')?.textContent)
      }
      return values
    })
    expect([...new Set(samples)], `No intermediate selection while navigating to ${name}`).toEqual([name])
    await expect(nav.getByRole('link', { name, exact: true })).toHaveClass('is-active')
  }
  // Manual scrolling takes ownership again, including the short final section.
  await page.mouse.wheel(0, 50000)
  await expect(nav.getByRole('link', { name: 'Contact', exact: true })).toHaveClass('is-active')
  await page.mouse.wheel(0, -50000)
  await expect(nav.locator('.is-active')).toHaveCount(0)
})

test('wheel input interrupts clicked selection and rapid clicks choose the latest target', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.site-loader')).toBeHidden()
  const nav = page.getByRole('navigation')
  await nav.getByRole('link', { name: 'Contact', exact: true }).click()
  await nav.getByRole('link', { name: 'About', exact: true }).click()
  await page.mouse.move(50, 400)
  await expect.poll(() => page.locator('#about').evaluate(section => Math.abs(section.getBoundingClientRect().top))).toBeLessThan(2)
  await expect(nav.getByRole('link', { name: 'About', exact: true })).toHaveClass('is-active')
  await nav.getByRole('link', { name: 'Contact', exact: true }).click()
  await page.mouse.move(50, 400)
  await page.mouse.wheel(0, -50000)
  // A wheel event may first stop native smooth scrolling rather than apply its delta.
  await expect(nav.getByRole('link', { name: 'Contact', exact: true })).not.toHaveClass('is-active')
  await page.mouse.wheel(0, -50000)
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0)
  await expect(nav.locator('.is-active')).toHaveCount(0)
})
