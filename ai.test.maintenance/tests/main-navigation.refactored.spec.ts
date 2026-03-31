import { test, expect } from "@playwright/test";
import { PlaywrightDevPage } from "../pages/PlaywrightDevPage";

const NAV_ITEMS = [
  { name: "Docs", hrefPattern: /\/docs/, urlPattern: /\/docs/ },
  { name: "API", hrefPattern: /\/docs\/api/, urlPattern: /\/docs\/api/ },
  { name: "Community", hrefPattern: /\/community/, urlPattern: /\/community/ },
] as const;

test.describe("Main Page – Navigation Buttons", () => {
  test.beforeEach(async ({ page }) => {
    const playwrightDev = new PlaywrightDevPage(page);
    await playwrightDev.goto();
  });

  for (const { name, hrefPattern } of NAV_ITEMS) {
    test(`"${name}" button is visible, enabled, and accessible`, async ({ page }) => {
      const playwrightDev = new PlaywrightDevPage(page);
      await playwrightDev.expectNavLinkAccessible(name, hrefPattern);
    });
  }

  for (const { name, urlPattern } of NAV_ITEMS) {
    test(`"${name}" button navigates to the correct page`, async ({ page }) => {
      const link = page.getByRole("link", { name, exact: true }).first();

      await test.step(`click the "${name}" link`, async () => {
        await link.click();
      });

      await test.step("URL matches the expected destination", async () => {
        await expect(page).toHaveURL(urlPattern);
      });
    });
  }
});
