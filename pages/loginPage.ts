import { expect, Page } from "@playwright/test";
import { ENV } from "../utils/env";

export class LoginPage {
readonly usernameInput;
readonly passwordInput;
readonly successURL;
readonly loginButton;
readonly errorMessage;

constructor(public page: Page) {
    this.usernameInput = page.locator('input[name = "user-name"]');
    this.passwordInput = page.locator('input[name = "password"]');
    this.successURL = ENV.baseUrl + "inventory.html";
    this.loginButton = page.locator('button[name ="login"]');
    this.errorMessage = page.locator('[data-test = "error"]');
}

async navigateTo() {
    await this.page.goto(ENV.baseUrl);
    await expect (this.page).toHaveURL(ENV.baseUrl);
}

async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.waitFor({state: 'visible', timeout: 5000});
    await this.loginButton.click();
    }

    async verifyLogin(){
        await this.page.waitForURL(`**${this.successURL}`, { timeout: 10000 });
        await expect (this.page).toHaveURL(new RegExp(`${this.successURL}$`));
    }

async getError(): Promise<string> {
    const error = await this.page.locator('[data-test="error"]');
    if (await error.count() > 0) {
        return (await error.textContent())?.trim() || "";
    }
    return "";
}
}
