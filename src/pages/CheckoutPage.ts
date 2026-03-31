import { BasePage } from "./BasePage";

/**
 * Page object for the Swag Labs checkout step-one page (/checkout-step-one.html).
 * Handles shipping information form.
 */
export class CheckoutPage extends BasePage {
  protected readonly path = "/checkout-step-one.html";

  /** Fill the shipping information form. */
  async fillShippingInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    this.logger.info(`Filling shipping info for ${firstName} ${lastName}`);
    await this.getByTestId("firstName").fill(firstName);
    await this.getByTestId("lastName").fill(lastName);
    await this.getByTestId("postalCode").fill(postalCode);
  }

  /** Submit the form and proceed to the order overview. Returns the resolved URL. */
  async continue(): Promise<string> {
    this.logger.info("Continuing to order overview");
    await this.clickByTestId("continue");
    return this.waitForUrlAndReturn("**/checkout-step-two.html");
  }
}
