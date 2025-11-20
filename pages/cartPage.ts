import { Page, expect } from "@playwright/test";
import { BasePage } from "./base/basePage";

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

    get cartIcon(){
    return this.page.locator('.shopping_cart_badge');
    }

    async getCartCount(): Promise<number>{
        const text = await this.cartIcon.textContent(); // this grabs the inner text of the element
        const cleaned = text?.trim() ?? "";
        return cleaned ? parseInt(cleaned) : 0; //similar to if statement: If (text), return parseInt(text) else return 0
    }

    async assertCartNotEmpty() {
        const count = await this.getCartCount();
        expect(count, "cart is empty, cannot proceed to checkout").toBeGreaterThan(0);
    }
        
  removeButton(productName: string) {
    return this.page.locator(`[data-test="remove-${productName}"]`);
  }

  get continueShopping(){
    return this.page.locator('button[data-test = "continue-shopping"]');
  }

  get checkoutButton() {
    return this.page.locator('#checkout');
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async assertOnCartPage(){
    await expect (this.continueShopping).toBeVisible({ timeout: 5000 });
  }
}