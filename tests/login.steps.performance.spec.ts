import { test, expect } from "@playwright/test";
import { trackPerformanceStep, PerfData } from "utils/performanceTracker";
import { ENV } from "utils/env";
import { LoginPage } from "pages/loginPage";

test("@performance test of login workflow", async ({ page }, testInfo) => {
  const loginPage = new LoginPage(page);
  const perf: PerfData = { totalTime: 0, steps: [] };

  // Step 1: Navigate to login page
  await trackPerformanceStep(page, "Navigate to login page", async () => {
    await loginPage.navigateTo();
  }, testInfo, perf);

  // Step 2: Execute login
  await trackPerformanceStep(page, "Execute login process", async () => {
    if (!ENV.username || !ENV.password) {
      throw new Error(`Missing ENV credentials. username=${ENV.username}, password=${ENV.password}`);
    }
    await loginPage.login(ENV.username, ENV.password);
  }, testInfo, perf);

  // Step 3: Wait for homepage to load
  await trackPerformanceStep(page, "Wait for homepage to load", async () => {
    await expect(page).toHaveURL(new RegExp(`${loginPage.successURL}$`));
    await expect(page.locator(".app_logo")).toBeVisible();
  }, testInfo, perf);

  // --- Console histogram ---
  console.log("\n📊 Performance Histogram:");
  perf.steps.forEach((step) => {
    const bar = "█".repeat(Math.round(step.duration / 50)); // 1 block ~50ms
    console.log(`${step.name.padEnd(25)} | ${bar} ${step.duration} ms`);
  });
  console.log(`\nTotal Test Time: ${perf.totalTime} ms\n`);

  //Attach JSON summary to Allure
  await testInfo.attach("Full Performance Metrics", {
    body: JSON.stringify(perf, null, 2),
    contentType: "application/json",
  });

  // Chart.js HTML
  const chartHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Performance Chart</title>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    </head>
    <body>
      <h2>Login Performance Steps</h2>
      <canvas id="perfChart" width="600" height="400"></canvas>
      <script>
        const ctx = document.getElementById('perfChart').getContext('2d');
        const chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ${JSON.stringify(perf.steps.map(s => s.name))},
            datasets: [{
              label: 'Duration (ms)',
              data: ${JSON.stringify(perf.steps.map(s => s.duration))},
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: false,
            plugins: {
              legend: { display: false },
              title: { display: true, text: 'Login Performance Steps' }
            },
            scales: {
              y: { beginAtZero: true }
            }
          }
        });
      </script>
    </body>
    </html>
  `;

  // Attach HTML chart to Allure
  await testInfo.attach("Performance Chart", {
    body: chartHtml,
    contentType: "text/html"
  });
});
