import { test, expect, Page } from "@playwright/test";
import { trackPerformanceStep } from "../../utils/performanceTracker";
import { ENV } from "../../utils/env";
import { LoginPage } from "../../pages/loginPage"; // assuming you have this

test ('@performance test of login workflow' , async({ page }, testInfo) => {
    const loginPage = new LoginPage(page);
    const perf = { totalTime: 0};

    await trackPerformanceStep(page,'Navigate to login page', async() => {
        await loginPage.navigateTo();
    },testInfo,perf);

    await trackPerformanceStep(page,'execute login process', async() =>{
        if (!ENV.username || !ENV.password){
            throw new Error('Missing credentials in ENV configurations');          
        }
        await loginPage.login(ENV.username!, ENV.password!);
    }, testInfo,perf);
        
    await trackPerformanceStep(page, 'Wait for homepage to load', async() => {
        await expect(page).toHaveURL(new RegExp(`${loginPage.successURL}$`));
        await page.waitForSelector(".app_logo");
        await expect(page.locator(".app_logo")).toBeVisible();      
    }, testInfo,perf);

    const totalMsg = `test time total: ${perf.totalTime}$ ms`;
    console.log (totalMsg);
    await testInfo.attach(' Total Performance Summary',{
        body: totalMsg,
        contentType:'text/plain',
    });
});