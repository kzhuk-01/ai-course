// path: tests/e2e/docs.spec.ts
import { test, expect } from '../../src/fixtures/baseFixtures';

test.describe('Playwright.dev Docs Page', () => {
  test.beforeEach(async ({ docsPage }) => {
    await docsPage.open();
  });

  test('should display the installation heading', async ({ docsPage }) => {
    const heading = await docsPage.getPageHeading();
    expect(heading).toContain('Installation');
  });

  test('should have a visible search button', async ({ docsPage }) => {
    const isVisible = await docsPage.isSearchButtonVisible();
    expect(isVisible).toBe(true);
  });

  test('should navigate to Writing Tests page via sidebar', async ({ docsPage }) => {
    const url = await docsPage.clickSidebarLinkAndWait('Writing tests', '**/docs/writing-tests');
    expect(url).toContain('/docs/writing-tests');
  });
});
