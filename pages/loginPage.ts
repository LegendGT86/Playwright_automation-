import { expect, Page } from "@playwright/test";

export class LoginPage {
usernameInput: any;
passwordInput: any;
successURL: any;

constructor(private page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="user-name"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.successURL = "/inventory.html";
}
public getPage(): Page {
    return this.page;
}

async goto() {
    await this.page.goto('https://www.saucedemo.com/', {waitUntil: 'networkidle'});
}

async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    const loginButton = this.page.locator('[data-test="login-button"]');
    await loginButton.waitFor({state: 'visible', timeout: 5000});
    await loginButton.click();
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
