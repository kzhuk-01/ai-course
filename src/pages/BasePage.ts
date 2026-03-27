// path: src/pages/BasePage.ts
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

  /** Navigate to an arbitrary URL path. For internal use by subclasses only. */
  protected async navigate(path: string): Promise<void> {
    this.logger.info(`Navigating to ${path}`);
    await this.page.goto(path);
  }

  /** Wait for the page to reach a load state. */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
  }

  /** Get the current page title. */
  async getTitle(): Promise<string> {
    return this.page.title();
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

  /** Click a button by its accessible name. */
  async clickButton(name: string): Promise<void> {
    this.logger.info(`Clicking button: ${name}`);
    await this.getByRole("button", { name }).click();
  }

  /** Fill a form field identified by its label. */
  async fillField(label: string, value: string): Promise<void> {
    this.logger.info(`Filling field "${label}"`);
    await this.getByLabel(label).fill(value);
  }

  /** Get heading text, optionally filtered by name or level. */
  async getHeadingText(options?: { name?: string | RegExp; level?: 1 | 2 | 3 | 4 | 5 | 6 }): Promise<string> {
    return this.getByRole("heading", options).first().innerText();
  }

  /** Check whether a heading with the given name is visible. */
  async isHeadingVisible(name: string): Promise<boolean> {
    return this.getByRole("heading", { name }).isVisible();
  }

  /** Check whether a button with the given name is visible. */
  async isButtonVisible(name: string): Promise<boolean> {
    return this.getByRole("button", { name }).isVisible();
  }

  /** Locate an element by its test ID attribute. */
  protected getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
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
