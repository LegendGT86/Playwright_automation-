import { test, expect } from '@playwright/test';
import path from 'path';
import fs from "fs";
import { parse } from "csv-parse/sync";
import { LoginPage } from "pages/loginPage";
import { trackPerformanceStep, PerfData } from "utils/performanceTracker";

type UserRecord= {
  username: string;
  password: string;
}
// Load the CSV
function loadUsers(): UserRecord[] {
  const filePath = path.resolve(process.cwd(), "data/Users.csv");
  const fileContent = fs.readFileSync(filePath, "utf-8");

  return parse<UserRecord>(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });
}

const users = loadUsers();

test.describe("@performance CSV-driven login test", () => {
  for (const user of users) {
    test(`Performance test for user: ${user.username}`, async ({ page }, testInfo) => {
      const loginPage = new LoginPage(page);
      const perf: PerfData = { totalTime: 0, steps: [] };

      // Step 1: Navigate
      await trackPerformanceStep(
        page,
        `Navigate to login (user=${user.username})`,
        async () => {
          await loginPage.navigateTo();
        },
        testInfo,
        perf
      );

      // Step 2: Login
      await trackPerformanceStep(
        page,
        `Login attempt (user=${user.username})`,
        async () => {
          await loginPage.login(user.username, user.password);
        },
        testInfo,
        perf
      );

      // Step 3: Homepage load verify
      await trackPerformanceStep(
        page,
        `Homepage load (user=${user.username})`,
        async () => {
          await expect(page).toHaveURL(new RegExp(`${loginPage.successURL}$`));
          await expect(page.locator(".app_logo")).toBeVisible();
        },
        testInfo,
        perf
      );

      // Attach JSON summary to Allure
      await testInfo.attach(`Performance Summary (${user.username})`, {
        body: JSON.stringify(perf, null, 2),
        contentType: "application/json",
      });

      console.log(`\n===== Performance Summary for ${user.username} =====`);
      console.log(JSON.stringify(perf, null, 2));
      console.log("====================================================\n");
    });
  }
});
