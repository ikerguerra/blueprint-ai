import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/')
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Blueprint AI/)
})

test('can navigate to login', async ({ page }) => {
  await page.goto('/')
  // Check if there is a login button or link
  // await page.getByRole('link', { name: 'Login' }).click();
  // await expect(page).toHaveURL(/login/);
})
