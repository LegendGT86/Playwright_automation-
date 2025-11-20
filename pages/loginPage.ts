import { expect, Page } from "@playwright/test";
import { BasePage } from 'pages/base/basePage';

export class LoginPage extends BasePage {
readonly usernameInput;
readonly passwordInput;
readonly successURL;
readonly loginButton;
readonly errorMessage; 

constructor(public page: Page) {
    super(page);
    this.usernameInput = page.locator('input[name = "user-name"]');
    this.passwordInput = page.locator('input[name = "password"]');
    this.successURL = "/inventory.html";
    this.loginButton = page.locator('button[name ="login"]');
    this.errorMessage = page.locator('[data-test = "error"]');
}

async navigateTo() {
    await super.navigateTo("/login");
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
