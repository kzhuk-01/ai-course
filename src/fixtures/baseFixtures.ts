// path: src/fixtures/baseFixtures.ts
import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";
import { AppHeader } from "../components/AppHeader";
import { Logger } from "../utils/logger";

/** Type definitions for custom test fixtures. */
type TestFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  appHeader: AppHeader;
  logger: Logger;
};

/**
 * Extended base test with pre-built page objects and component fixtures.
 * Provides setup/teardown lifecycle hooks and injects POM instances automatically.
 */
export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  appHeader: async ({ page }, use) => {
    await use(new AppHeader(page));
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
