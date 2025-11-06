export type EnvironmentType = 'testing' | 'production';

interface EnvConfig {
  baseUrl: string;
  username?: string;
  password?: string;
  apiBaseUrl?: string;
}

const configs: Record<EnvironmentType, EnvConfig> = {
  testing: {
    baseUrl: 'https://www.saucedemo.com/',
    username: 'standard_user',
    password: 'secret_sauce',
    apiBaseUrl: 'https://api.testing.saucedemo.com/',
  },
  production: {
    baseUrl: 'https://prod.saucedemo.com/',
    username: 'prod_user',
    password: 'prod_password',
    apiBaseUrl: 'https://api.prod.saucedemo.com/',
  },
};

// Detect env from terminal: e.g., `npx playwright test --config playwright.config.ts --env=production`
const ENVIRONMENT = (process.env.ENV as EnvironmentType) || 'testing';

export const ENV = configs[ENVIRONMENT];
