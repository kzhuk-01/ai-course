import { test } from "@playwright/test";
import { PlaywrightDevPage } from "../pages/PlaywrightDevPage";

test("main page should display navigation buttons: Docs, API, Community", async ({ page }) => {
  const playwrightDev = new PlaywrightDevPage(page);
  await playwrightDev.goto();
  await playwrightDev.expectNavLinksVisible();
});
