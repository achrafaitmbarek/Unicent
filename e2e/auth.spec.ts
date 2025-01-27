import { test, expect } from '@playwright/test'

test.describe('Auth flow', () => {
  test.setTimeout(60000)

  test('Register flow', async ({ page }) => {

    const timestamp = Date.now()
    const uniqueEmail = `john.doe+${timestamp}@example.com`


    await page.goto('http://localhost:3000/auth/register')


    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', uniqueEmail)


    await page.click('button[type="submit"]')


    try {
      await expect(page.locator('[data-testid="success-message"]'))
        .toBeVisible({ timeout: 15000 })
    } catch (error) {

      console.log('Page Content:', await page.content())
      throw error
    }
  })

  test('Login flow', async ({ page }) => {

    const timestamp = Date.now()
    const uniqueEmail = `john.doe+${timestamp}@example.com`


    await page.goto('http://localhost:3000/auth/register')
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="email"]', uniqueEmail)
    await page.click('button[type="submit"]')


    await expect(page.locator('[data-testid="success-message"]'))
      .toBeVisible({ timeout: 25000 })


    await page.goto('http://localhost:3000/auth/login')


    await page.fill('input[name="email"]', uniqueEmail)


    await page.click('button[type="submit"]')


    try {
      await expect(page.locator('[data-testid="success-message"]'))
        .toBeVisible({ timeout: 25000 })
    } catch (error) {

      console.log('Page Content:', await page.content())
      throw error
    }
  })
})