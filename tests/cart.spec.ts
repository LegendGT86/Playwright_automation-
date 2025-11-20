import { test, expect } from '@playwright/test';
import { CartPage } from 'pages/cartPage';

// Navigate to cart
test('cart page test', async ({ page }) => {
      const cart = new CartPage(page);
      const productName = "sauce-labs-backpack";

      await cart.navigateTo('/cart');
      await cart.assertOnCartPage();

      await cart.continueShopping.click();
      await expect (page).toHaveURL('/inventory');
      await cart.navigateTo('/cart'); //Once we test the 'continue shopping' redirects, we need to go back to cart page
      
      const count = await cart.getCartCount();

      if (count>0){
            console.log (`Cart has ${count} items, checkout is possible`)
            await cart.removeButton(productName).click();
      }else {
            console.log ("cart is empty, skipping the checkout test")
      }

      const updatedCount = await cart.getCartCount();
      expect(updatedCount).toBeGreaterThan(0);   
      
});

