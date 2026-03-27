// path: src/pages/DocsPage.ts
import { type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Page object for the Playwright.dev documentation pages.
 */
export class DocsPage extends BasePage {
  protected readonly path = "/docs/intro";

  constructor(page: Page) {
    super(page);
  }

  /** Get the main content heading text. */
  async getPageHeading(): Promise<string> {
    return this.getHeadingText({ level: 1 });
  }

  /** Click a sidebar link and wait for navigation to complete. Returns the resolved URL. */
  async clickSidebarLinkAndWait(name: string, urlGlob: string): Promise<string> {
    return this.clickLinkAndWaitForUrl(name, urlGlob, { exact: true });
  }

  /** Check whether the search button is visible on the docs page. */
  async isSearchButtonVisible(): Promise<boolean> {
    return this.isButtonVisible("Search");
  }
}
