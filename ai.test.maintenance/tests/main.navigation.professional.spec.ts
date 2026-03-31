import { test, expect } from "@playwright/test";
import { PlaywrightDevPage } from "../pages/PlaywrightDevPage";

/**
 * Test case IDs:
 *   TC-NAV-001..003 – link visibility, correct href, and interactivity per nav item
 *   TC-NAV-004..006 – navigation to the correct destination per nav item
 *   TC-NAV-007      – edge case: links are not hidden from assistive technology
 *   TC-NAV-008      – edge case: links do not resolve to home, fragment, or external domain
 */
const NAV_ITEMS = [
  { name: "Docs", hrefPattern: /\/docs/, urlPattern: /\/docs/, accessTc: "TC-NAV-001", navTc: "TC-NAV-004" },
  { name: "API", hrefPattern: /\/docs\/api/, urlPattern: /\/docs\/api/, accessTc: "TC-NAV-002", navTc: "TC-NAV-005" },
  { name: "Community", hrefPattern: /\/community/, urlPattern: /\/community/, accessTc: "TC-NAV-003", navTc: "TC-NAV-006" },
] as const;

test.describe("Main Page – Navigation Buttons", () => {
  // Single POM instance shared within the beforeEach closure.
  // Each Playwright worker is isolated, so this is safe from cross-test contamination.
  let playwrightDev: PlaywrightDevPage;

  test.beforeEach(async ({ page }) => {
    playwrightDev = new PlaywrightDevPage(page);
    await playwrightDev.goto();
  });

  // --- TC-NAV-001..003: link attributes & interactivity -------------------------
  for (const { name, hrefPattern, accessTc } of NAV_ITEMS) {
    test(`[${accessTc}] "${name}" link has correct href and is interactive`, async () => {
      await playwrightDev.expectNavLinkAccessible(name, hrefPattern);
    });
  }

  // --- TC-NAV-004..006: navigation to correct destination -----------------------
  for (const { name, urlPattern, navTc } of NAV_ITEMS) {
    test(`[${navTc}] "${name}" link navigates to the correct page`, async ({ page }) => {
      await test.step(`click the "${name}" nav link`, async () => {
        await playwrightDev.clickNavLink(name);
      });

      await test.step("URL matches the expected destination", async () => {
        await expect(page).toHaveURL(urlPattern);
      });

      await test.step("destination page has main content (not a 404)", async () => {
        await expect(page.getByRole("main")).toBeVisible();
      });
    });
  }

  // --- TC-NAV-007: edge case – links visible to assistive technology ------------
  test("[TC-NAV-007] nav links are not aria-hidden and are keyboard-focusable", async () => {
    // Regression guard: aria-hidden="true" or tabindex="-1" would violate WCAG 2.1 SC 4.1.2
    for (const { name } of NAV_ITEMS) {
      const key = name.toLowerCase() as keyof typeof playwrightDev.navLinks;
      const link = playwrightDev.navLinks[key];
      await expect(link).not.toHaveAttribute("aria-hidden", "true");
      await expect(link).not.toHaveAttribute("tabindex", "-1");
    }
  });

  // --- TC-NAV-008: edge case – nav links do not resolve to unintended destinations --
  test("[TC-NAV-008] nav links do not point to the home page, a fragment, or an external domain", async () => {
    // Guards against regressions where a link href is reset to "/", "#", or an off-domain URL.
    const EXPECTED_ORIGINS = ["https://playwright.dev"];

    for (const { name } of NAV_ITEMS) {
      const key = name.toLowerCase() as keyof typeof playwrightDev.navLinks;
      const link = playwrightDev.navLinks[key];

      const href = await link.getAttribute("href");

      await test.step(`"${name}" href is not null, empty, or a bare fragment`, async () => {
        expect(href).toBeTruthy();
        expect(href).not.toBe("/");
        expect(href).not.toMatch(/^#/);
      });

      await test.step(`"${name}" href resolves to an expected origin`, async () => {
        // Relative hrefs (e.g. "/docs") are acceptable — they inherit the base origin.
        // Absolute hrefs must not point outside playwright.dev.
        if (href && href.startsWith("http")) {
          const { origin } = new URL(href);
          expect(EXPECTED_ORIGINS).toContain(origin);
        }
      });
    }
  });
});
