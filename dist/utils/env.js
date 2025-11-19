"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
const configs = {
    testing: {
        baseUrl: 'https://www.saucedemo.com/',
        username: 'standard_user',
        password: 'secret_sauce',
        apiBaseUrl: 'https://api.testing.saucedemo.com/',
    },
    //There is currently no production ENV as this is a testing site, this setup illustrates the use of 2 required ENV's in regular testing
    production: {
        baseUrl: 'https://prod.saucedemo.com/',
        username: 'prod_user',
        password: 'prod_password',
        apiBaseUrl: 'https://api.prod.saucedemo.com/',
    },
};
// Detect env from terminal: e.g., `npx playwright test --config playwright.config.ts --env=production`
const ENVIRONMENT = process.env.ENV || 'testing';
exports.ENV = configs[ENVIRONMENT];
