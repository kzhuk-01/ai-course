// path: src/fixtures/baseFixtures.ts
import { test as base } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { DocsPage } from "../pages/DocsPage";
import { TopNavBar } from "../components/TopNavBar";
import { Logger } from "../utils/logger";

/** Type definitions for custom test fixtures. */
type TestFixtures = {
  homePage: HomePage;
  docsPage: DocsPage;
  topNavBar: TopNavBar;
  logger: Logger;
};

/**
 * Extended base test with pre-built page objects and component fixtures.
 * Provides setup/teardown lifecycle hooks and injects POM instances automatically.
 */
export const test = base.extend<TestFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  docsPage: async ({ page }, use) => {
    await use(new DocsPage(page));
  },

  topNavBar: async ({ page }, use) => {
    await use(new TopNavBar(page));
  },

  logger: [
    async ({}, use) => {
      const logger = new Logger("Test");
      logger.info("--- Test started ---");
      await use(logger);
      logger.info("--- Test finished ---");
    },
    { auto: true },
  ],
});

export { expect } from "@playwright/test";
