import { test, expect } from "../../src/fixtures/baseFixtures";
import { EnvHelper } from "../../src/utils/envHelper";

const PRODUCT_NAME = "Sauce Labs Backpack";

test.describe("Swag Labs — Checkout Flow", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.loginAs(EnvHelper.get("STANDARD_USER"), EnvHelper.get("USER_PASSWORD"));
  });

  test("should find a product, add it to the cart, and display the order total on checkout overview", async ({
    inventoryPage,
    cartPage,
    checkoutPage,
    checkoutOverviewPage,
    appHeader,
  }) => {
    await inventoryPage.addProductToCartByName(PRODUCT_NAME);
    expect(await appHeader.getCartBadgeCount()).toBe(1);

    await appHeader.openCart();
    expect(await cartPage.getCartItemName(0)).toBe(PRODUCT_NAME);

    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo("John", "Doe", "12345");
    await checkoutPage.continue();

    const total = await checkoutOverviewPage.getTotal();
    expect(total).toBe("Total: $32.39");
  });
});
