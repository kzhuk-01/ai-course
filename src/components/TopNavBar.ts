// path: src/components/TopNavBar.ts
import { type Page } from "@playwright/test";
import { BaseComponent } from "./BaseComponent";

/**
 * Component object for the Playwright.dev top navigation bar.
 */
export class TopNavBar extends BaseComponent {
  constructor(page: Page) {
    super(page, page.getByRole("navigation", { name: "Main" }));
  }

  /** Click a top-level navigation link by name. */
  async clickNavLink(name: string): Promise<void> {
    this.logger.info(`Clicking nav link: ${name}`);
    await this.getByRole("link", { name }).click();
  }

  /** Check whether a specific nav link is visible. */
  async isNavLinkVisible(name: string): Promise<boolean> {
    return this.getByRole("link", { name }).isVisible();
  }
}
