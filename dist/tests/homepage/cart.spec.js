"use strict";
// Navigate to cart
await homePage.goToCart();
const cartLocator = page.locator('.cart_list');
await expect(cartLocator).toBeVisible({ timeout: 5000 });
