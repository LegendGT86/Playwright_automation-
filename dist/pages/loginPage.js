"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
const test_1 = require("@playwright/test");
const _1 = require("");
/env";
class LoginPage {
    page;
    usernameInput;
    passwordInput;
    successURL;
    loginButton;
    errorMessage;
    constructor(page) {
        this.page = page;
        this.usernameInput = page.locator('input[name = "user-name"]');
        this.passwordInput = page.locator('input[name = "password"]');
        this.successURL = "/inventory.html";
        this.loginButton = page.locator('button[name ="login"]');
        this.errorMessage = page.locator('[data-test = "error"]');
    }
    async goto() {
        await (0, test_1.expect)(_1.ENV.this.page).toHaveURL(new RegExp(`${this.successURL}`));
    }
    async login(username, password) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.waitFor({ state: 'visible', timeout: 5000 });
        await this.loginButton.click();
    }
    async verifyLogin() {
        await this.page.waitForURL(`**${this.successURL}`, { timeout: 10000 });
        await (0, test_1.expect)(this.page).toHaveURL(new RegExp(`${this.successURL}$`));
    }
    async getError() {
        const error = await this.page.locator('[data-test="error"]');
        if (await error.count() > 0) {
            return (await error.textContent())?.trim() || "";
        }
        return "";
    }
}
exports.LoginPage = LoginPage;
