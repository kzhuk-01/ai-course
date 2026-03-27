// path: src/pages/CheckoutOverviewPage.ts
import { BasePage } from "./BasePage";

/**
 * Page object for the Swag Labs checkout step-two page (/checkout-step-two.html).
 * Displays the order summary including item total, tax, and grand total.
 */
export class CheckoutOverviewPage extends BasePage {
  protected readonly path = "/checkout-step-two.html";

  /** Get the item subtotal line (e.g. "Item total: $29.99"). */
  async getItemTotal(): Promise<string> {
    return this.getByTestId("subtotal-label").innerText();
  }

  /** Get the tax line (e.g. "Tax: $2.40"). */
  async getTax(): Promise<string> {
    return this.getByTestId("tax-label").innerText();
  }

  /** Get the grand total line (e.g. "Total: $32.39"). */
  async getTotal(): Promise<string> {
    return this.getByTestId("total-label").innerText();
  }
}
