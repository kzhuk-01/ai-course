// path: src/pages/HomePage.ts
import { type Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page object for the Playwright.dev home page.
 */
export class HomePage extends BasePage {
  protected readonly path = '/';

  constructor(page: Page) {
    super(page);
  }

  /** Get the main hero heading text. */
  async getHeroTitle(): Promise<string> {
    return this.getHeadingText({ name: 'Playwright' });
  }

  /** Click "Get started" and wait for the docs intro page to load. Returns the resolved URL. */
  async goToDocs(): Promise<string> {
    return this.clickLinkAndWaitForUrl('Get started', '**/docs/intro');
  }

  /** Check whether the hero section heading is visible. */
  async isHeroVisible(): Promise<boolean> {
    return this.isHeadingVisible('Playwright');
  }
}
