import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/auth/login')
  await page.locator('button.button-f2h6uQ:nth-child(2)').click()
})
// TODO: Fix headers
test.describe('Group', () => {
  test('POST - invalid/missing body should responde with error', async ({ request, page }) => {
    const res = await request.post('/api/group')
    const data = await res.json()

    expect(res.ok()).toBeFalsy()
    // expect(data.message).toEqual()
  })
})
