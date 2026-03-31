import { test } from "@playwright/test";
import { PlaywrightDevPage } from "../pages/PlaywrightDevPage";

test("has title", async ({ page }) => {
  const playwrightDev = new PlaywrightDevPage(page);
  await playwrightDev.goto();
  await playwrightDev.expectTitle(/Playwright/);
});

test("get started link", async ({ page }) => {
  const playwrightDev = new PlaywrightDevPage(page);
  await playwrightDev.goto();
  await playwrightDev.clickGetStarted();
  await playwrightDev.expectInstallationVisible();
});
