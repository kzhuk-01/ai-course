// path: src/components/AppHeader.ts
import { type Page } from "@playwright/test";
import { BaseComponent } from "./BaseComponent";

/**
 * Component object for the Swag Labs application header.
 * Covers the burger menu, page title, and shopping cart icon.
 */
export class AppHeader extends BaseComponent {
  constructor(page: Page) {
    super(page, page.getByTestId("primary-header"));
  }

  /** Get the cart badge count. Returns 0 when the badge is not visible. */
  async getCartBadgeCount(): Promise<number> {
    const badge = this.page.getByTestId("shopping-cart-badge");
    const isVisible = await badge.isVisible();
    if (!isVisible) return 0;
    return parseInt(await badge.innerText(), 10);
  }

  /** Open the shopping cart by clicking the cart icon. Returns the resolved URL. */
  async openCart(): Promise<string> {
    this.logger.info("Opening shopping cart");
    await this.page.getByTestId("shopping-cart-link").click();
    return this.waitForUrlAndReturn("**/cart.html");
  }

  /** Open the burger navigation menu. */
  async openMenu(): Promise<void> {
    this.logger.info("Opening burger menu");
    await this.getByRole("button", { name: "Open Menu" }).click();
  }

  /** Click a menu item by its visible name (requires menu to be open first). */
  async clickMenuItem(name: string): Promise<void> {
    this.logger.info(`Clicking menu item: ${name}`);
    await this.page.getByRole("link", { name }).click();
  }

  /** Log out via the burger menu. Returns the resolved URL. */
  async logout(): Promise<string> {
    await this.openMenu();
    await this.clickMenuItem("Logout");
    return this.waitForUrlAndReturn("**/");
  }
}
