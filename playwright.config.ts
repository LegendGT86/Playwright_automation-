import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: './tests',               
  timeout: 15000,               
  expect: {
    timeout: 5000,            
  },
  fullyParallel: true,               // run tests in parallel
  forbidOnly: !!process.env.CI,      // fail if test.only is left in code on CI
  retries: process.env.CI ? 2 : 0,   // retry failed tests on CI
  workers: process.env.CI ? 1 : undefined, // control parallelism on CI

  reporter: [
    ['list'],          
    ['html', {
      outputFolder: path.resolve(__dirname, 'playwright-report'),
      open: 'never',      
    }],
  ],

  use: {
    headless: true,                
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',  
    //video: 'retain-on-failure',      
    actionTimeout: 5000,             // max time per action (fill/click/etc)
    baseURL: 'https://qa-challenge.codesubmit.io/',
  },

  projects: [
    //All UI tests can be run in Paralell on different browsers
    {
      name: 'ui-tests-chromium',
      testMatch: /.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      fullyParallel: true,
    },
    {
      name: 'ui-tests-firefox',
      testMatch: /.*\.spec\.ts/,
      use: { ...devices['Desktop Firefox'] },
      fullyParallel: true,
    },
    {
      name:'ui-tests-safari',
      testMatch: /.*\.spec\.ts/,
      use: { ...devices['Desktop Safari'] },
      fullyParallel: true,
    },

    //API tests must be run in serial to avoid rate limiting issues
    {
      name: 'api-tests',
      testMatch: /.*\.api\.ts/,
      use: { 
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
