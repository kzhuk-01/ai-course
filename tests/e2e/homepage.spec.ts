// path: tests/e2e/homepage.spec.ts
import { test, expect } from "../../src/fixtures/baseFixtures";

test.describe("Playwright.dev Home Page", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  test("should display the hero heading", async ({ homePage }) => {
    const isVisible = await homePage.isHeroVisible();
    expect(isVisible).toBe(true);
  });

  test("should have the correct page title", async ({ homePage }) => {
    const title = await homePage.getTitle();
    expect(title).toContain("Playwright");
  });

  test('should navigate to docs when clicking Get started', async ({ homePage }) => {
    const url = await homePage.goToDocs();
    expect(url).toContain('/docs/intro');
  });
});
