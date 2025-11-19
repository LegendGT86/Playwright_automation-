import { Page, expect } from "@playwright/test";
import { BasePage } from "./base/basePage";

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

    get CartIcon(){
    return this.page.locator('.shopping_cart_badge');
    }

    async getCartCount(): Promise<number>{
        const text = await this.CartIcon.textContent(); // this grabs the inner text of the element
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

  async proceedToCheckout() {
    await this.page.locator('#checkout').click();
  }
}