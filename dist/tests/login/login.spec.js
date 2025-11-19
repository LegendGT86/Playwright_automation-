"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const loginPage_1 = require("../../pages/loginPage");
const dataloader_1 = require("../../utils/dataloader");
const users = (0, dataloader_1.loadTestData)("data/Users.csv");
test_1.test.describe('login tests for all users', () => {
    (0, test_1.test)('@ui login with valid and invalid user from .csv data source', async ({ page }) => {
        for (const user of users) {
            const loginPage = new loginPage_1.LoginPage(page);
            await loginPage.goto();
            await loginPage.login(user.username, user.password);
            await loginPage.verifyLogin();
            await test_1.test.step("Login navigation", async () => {
                await loginPage.goto();
            });
            await test_1.test.step(`Attempted login with user ${user.username}`, async () => {
                await loginPage.login(user.username, user.password);
            });
            await test_1.test.step(`verify login or log error`, async () => {
                try {
                    await loginPage.verifyLogin();
                    console.log(`${user.username} logged in successfully`);
                }
                catch {
                    const errMsg = await loginPage.getError();
                    console.log(`${user.username} failed to login successfully`);
                }
            });
        }
    });
});
