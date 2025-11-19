"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const loginPage_1 = require("../../pages/loginPage");
const dataloader_1 = require("../../utils/dataloader");
//Though user credential list is small, we maintain a .csv file for scalability
const users = (0, dataloader_1.loadTestData)("data/DataSheet1.csv");
test_1.test.describe('Sign In Page', () => {
    //basic visibility checks
    (0, test_1.test)('should have email and password fields', async ({ page }) => {
        const loginPage = new loginPage_1.LoginPage(page);
        await loginPage.goto();
        await (0, test_1.expect)(loginPage.passwordInput).toBeVisible({ timeout: 5000 });
        await (0, test_1.expect)(loginPage.usernameInput).toBeVisible({ timeout: 5000 });
    });
    //need to add index to avoid duplicate test title
    users.forEach((user, index) => {
        (0, test_1.test)(`should sign in with user #${index} (${user.username}, error: ${user.error || 'false'})`, async ({ page }) => {
            const loginPage = new loginPage_1.LoginPage(page);
            await loginPage.goto();
            await loginPage.login(user.username, user.password);
            if (user.error === 'true') {
                const errorMessage = await loginPage.getError();
                await (0, test_1.expect)(errorMessage).toBeTruthy();
                await page.screenshot({ path: 'screenshots/error_user_${index}.png', fullPage: true });
            }
            else {
                await (0, test_1.expect)(loginPage.getPage().locator('.inventory_list')).toBeVisible({ timeout: 5000 });
            }
        });
    });
});
