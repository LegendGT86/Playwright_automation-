import {test, expect} from '@playwright/test';
import { LoginPage } from 'pages/loginPage';
import { loadTestData } from 'utils/dataloader';

const users = loadTestData <{username: string; password: string}>("data/Users.csv")

test.describe('login tests for all users', () => {

    test('@ui login with valid and invalid user from .csv data source', async ({ page }) => {

        for (const user of users) {
            const loginPage = new LoginPage(page);
            await loginPage.verifyLogin();

            await test.step("Login navigation", async() => {
                await loginPage.navigateTo();
            });

            await test.step(`Attempted login with user ${user.username}`, async() =>{
                await loginPage.login(user.username,user.password);
            });

            await test.step(`verify login or log error`, async() => {
                try{
                    await loginPage.verifyLogin();
                    console.log(`${user.username} logged in successfully`)
                } catch {
                    const errMsg = await loginPage.getError();
                    console.log(`${user.username} failed to login successfully with error: ${errMsg}`);
                }
            });
        }
    });   
})

