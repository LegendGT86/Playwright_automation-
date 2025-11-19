import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { HomePage } from '../../pages/homePage';

const validUsers = [
  { username: 'standard_user', password: 'secret_sauce' },
  { username: 'problem_user', password: 'secret_sauce' },
  { username: 'performance_glitch_user', password: 'secret_sauce' },
  { username: 'visual_user', password: 'secret_sauce' },
  { username: 'error_user', password: 'secret_sauce' },
  { username: 'locked_out_user', password: 'secret_sauce' },
];

test.describe('Multi-user login + inventory navigation performance', () => {

  validUsers.forEach((user, index) => {
    test(`User ${index + 1}: Login as ${user.username}, navigate inventory, cart, and logout`, async ({ page }) => {

      const loginPage = new LoginPage(page);
      const homePage = new HomePage(page);

      // Navigate to homepage and login
      await loginPage.goto();
      await loginPage.login(user.username, user.password);

      // Verify login success
      const inventoryLocator = page.locator('.inventory_list');
      await expect(inventoryLocator).toBeVisible({ timeout: 5000 });

      // Measure navigation to inventory item
      const startTime = Date.now();
      await homePage.gotoInventoryItem(1);
      const duration = Date.now() - startTime;

      console.log(`${user.username} inventory item navigation took ${duration} ms`);

      if (duration > 2000) {
        await page.screenshot({ path: `test-results/${user.username}_slow_navigation.png` });
        console.warn('Warning: Navigation exceeded 2 seconds');
      }

      expect(duration).toBeLessThan(2000);

      // Logout and assert login form visible
      await homePage.logout();

      const usernameField = page.locator('#user-name');
      const passwordField = page.locator('#password');
      const loginButton = page.locator('#login-button');

      await expect(usernameField).toBeVisible();
      await expect(passwordField).toBeVisible();
      await expect(loginButton).toBeVisible();
    });
  });

});
