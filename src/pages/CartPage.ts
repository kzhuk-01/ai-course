// path: src/pages/CartPage.ts
import { type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Page object for the Swag Labs shopping cart page (/cart.html).
 */
export class CartPage extends BasePage {
  protected readonly path = "/cart.html";

  /** Get the number of line items currently in the cart. */
  async getCartItemCount(): Promise<number> {
    return this.countByTestId("inventory-item");
  }

  /** Get the name of a cart item at the given zero-based index. */
  async getCartItemName(index: number): Promise<string> {
    return this.getTextByTestId("inventory-item-name", index);
  }

  /** Remove a cart item at the given zero-based index. */
  async removeItem(index: number): Promise<void> {
    this.logger.info(`Removing cart item at index ${index}`);
    await this.clickByTestId("remove", index);
  }

  /** Click "Continue Shopping" to return to the inventory page. Returns the resolved URL. */
  async continueShopping(): Promise<string> {
    return this.clickLinkAndWaitForUrl("Continue Shopping", "**/inventory.html");
  }

  /** Click "Checkout" to proceed to the checkout step 1 page. Returns the resolved URL. */
  async proceedToCheckout(): Promise<string> {
    this.logger.info("Proceeding to checkout");
    await this.clickByTestId("checkout");
    return this.waitForUrlAndReturn("**/checkout-step-one.html");
  }
}
