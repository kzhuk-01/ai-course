import { type Page, type Locator } from "@playwright/test";
import { Logger } from "../utils/logger";

/**
 * Base class for all page objects. Provides common navigation and element interaction methods.
 */
export abstract class BasePage {
  protected readonly page: Page;
  protected readonly logger: Logger;

  /** URL path for this page, used by open(). */
  protected abstract readonly path: string;

  constructor(page: Page) {
    this.page = page;
    this.logger = new Logger(this.constructor.name);
  }

  /** Navigate to the page's own URL path. */
  async open(): Promise<void> {
    this.logger.info(`Navigating to ${this.path}`);
    await this.page.goto(this.path);
  }

  /** Get the current page URL. */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /** Click a link by its accessible name. */
  async clickLink(name: string, options?: { exact?: boolean }): Promise<void> {
    this.logger.info(`Clicking link: ${name}`);
    await this.getByRole("link", { name, ...options }).click();
  }

  /** Click a link by name, wait for navigation to complete, and return the resolved URL. */
  async clickLinkAndWaitForUrl(name: string, urlGlob: string, options?: { exact?: boolean }): Promise<string> {
    await this.clickLink(name, options);
    await this.page.waitForURL(urlGlob);
    return this.getCurrentUrl();
  }

  /** Locate an element by its test ID attribute. */
  protected getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  /** Count all elements matching a data-testid on the page. */
  protected countByTestId(testId: string): Promise<number> {
    return this.page.getByTestId(testId).count();
  }

  /** Get the inner text of an element matching a data-testid at the given zero-based index. */
  protected async getTextByTestId(testId: string, index = 0): Promise<string> {
    return this.page.getByTestId(testId).nth(index).innerText();
  }

  /** Click an element matching a data-testid at the given zero-based index. */
  protected async clickByTestId(testId: string, index = 0): Promise<void> {
    this.logger.info(`Clicking [data-testid="${testId}"] at index ${index}`);
    await this.page.getByTestId(testId).nth(index).click();
  }

  /** Wait for the URL to match a glob pattern and return the resolved URL. */
  protected async waitForUrlAndReturn(urlGlob: string): Promise<string> {
    await this.page.waitForURL(urlGlob);
    return this.getCurrentUrl();
  }

  /** Locate an element by its accessible role and name. */
  protected getByRole(role: Parameters<Page["getByRole"]>[0], options?: Parameters<Page["getByRole"]>[1]): Locator {
    return this.page.getByRole(role, options);
  }

  /** Locate an element by its associated label text. */
  protected getByLabel(text: string, options?: { exact?: boolean }): Locator {
    return this.page.getByLabel(text, options);
  }
}
