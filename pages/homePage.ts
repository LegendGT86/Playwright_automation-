import { expect, Page } from "@playwright/test";
import { LoginPage } from "./loginPage";

export class HomePage {
    constructor(private page: Page) {
        this.page = page;
    }

    async gotoInventoryItem(id: number) {
        await this.page.goto(`https://www.saucedemo.com/inventory-item.html?id=${id}`, { waitUntil: 'networkidle' });
    }

    async isAddToCartVisible() {
        return await this.page.locator('button[data-test^="add-to-cart"]').isVisible();
    }

    async getItemName() {
        return await this.page.textContent('.inventory_details_name');
    }

    async goToCart() {
        await this.page.click('.shopping_cart_link');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForURL(/cart\.html/);
    }

    async linkedIn_link() {
        const href = await this.page.getAttribute('a[data-test="social-linkedin"]', 'href');
        expect(href).toBe('https://www.linkedin.com/company/sauce-labs/');

        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.page.click('a[data-test="social-linkedin"]')
        ]);
        await newPage.waitForLoadState();
        expect(newPage.url()).toContain('https://www.linkedin.com/company/sauce-labs.com/');
        await newPage.close();
    }

    async checkout() {
        await this.page.click('a[data-test="checkout"]');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForURL(/checkout-step-one\.html/);
    }

    async goToAbout() { 
        await this.page.click('#react-burger-menu-btn');
        await this.page.waitForLoadState('networkidle');
        await this.page.click('#about_sidebar_link');
        await this.page.waitForURL(/.*saucelabs.com\.com/);
    }

    async logout() {
        await this.page.click('#react-burger-menu-btn');
        await this.page.click('#logout_sidebar_link');
        await this.page.waitForLoadState('networkidle');
        const usernameInputField = this.page.locator('input[name="user-name"]');
        await expect(usernameInputField).toBeVisible({ timeout: 5000 });
        const passwordInputField = this.page.locator('input[name="password"]');
        await expect(passwordInputField).toBeVisible({ timeout: 5000 });
        console.log('Logout successful, back on login page.');
    }
}