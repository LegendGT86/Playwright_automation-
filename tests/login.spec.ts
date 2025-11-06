import {test, expect} from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { ENV } from '../utils/env';
import { loadTestData } from "../utils/dataloader";

const users = loadTestData <{username: string; password: string}>("data/Users.csv")

test.describe('login tests for all users', () => {

    test('Successful login with valid user from .csv data source', async ({ page }) => {
        for (const user of users) {
            const loginPage = new LoginPage(page);
            await loginPage.goto();
            await loginPage.login(user.username,user.password);
            await loginPage.verifyLogin();

            await test.step("Login navigation", async() => {
                await loginPage.goto();
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
                    console.log(`${user.username} failed to login successfully`);
                }
            });
        }
    });   
})

