import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Extract environment variables
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const API_BASE_URL = process.env.API_BASE_URL || BASE_URL;

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: { timeout: 5000 },

  reporter: [
    ['list', { open: 'never', outputFolder: 'html-report' }],
    ['html', { open: 'never', outputFolder: 'html-report' }],
    ['allure-playwright', { open: 'never', outputFolder: 'test-results/allure' }]
  ],

  // Global settings applied to all tests
  use: {
    baseURL: BASE_URL,
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    launchOptions: {
      headless: true,
      slowMo: 50
    },
    extraHTTPHeaders: {
      'Accept': 'application/json',
    },
  },

  // Multi-project setup for UI + API
  projects: [
    // ----- UI Tests -----
    {
      name: 'ui-tests-chromium',
      testMatch: /.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: BASE_URL,
      },
      fullyParallel: true,
    },
    // {
    //   name: 'ui-tests-firefox',
    //   testMatch: /.*\.spec\.ts/,
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     baseURL: BASE_URL,
    //   },
    //   fullyParallel: true,
    // },
    // {
    //   name: 'ui-tests-safari',
    //   testMatch: /.*\.spec\.ts/,
    //   use: {
    //     ...devices['Desktop Safari'],
    //     baseURL: BASE_URL,
    //   },
    //   fullyParallel: true,
    // },

    // ----- API Tests -----
    {
      name: 'api-tests',
      testMatch: /.*\.api\.ts/,
      use: {
        baseURL: API_BASE_URL,
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      },
      fullyParallel: false,
      retries: 0,
      timeout: 10000,
    },
  ],

  outputDir: 'test-results',
});
