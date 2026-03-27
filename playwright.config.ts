// path: playwright.config.ts
import { defineConfig, devices } from "@playwright/test";
import { EnvHelper } from "./src/utils/envHelper";

EnvHelper.load();

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: EnvHelper.getNumber("RETRY_COUNT", 1),
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html"], ["list"]],
  timeout: EnvHelper.getNumber("TIMEOUT", 30000),

  use: {
    baseURL: EnvHelper.get("BASE_URL", "https://www.saucedemo.com"),
    testIdAttribute: "data-test",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    actionTimeout: 10000,
    navigationTimeout: 15000,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
