import { expect, type Locator, type Page } from "@playwright/test";

export class PlaywrightDevPage {
  readonly page: Page;
  readonly getStartedLink: Locator;
  readonly installationHeader: Locator;
  readonly navLinks: { docs: Locator; api: Locator; community: Locator };

  constructor(page: Page) {
    this.page = page;
    this.getStartedLink = page.getByRole("link", { name: "Get started" });
    this.installationHeader = page.getByRole("heading", { name: "Installation" });
    this.navLinks = {
      docs: page.getByRole("link", { name: "Docs", exact: true }),
      api: page.getByRole("link", { name: "API", exact: true }),
      community: page.getByRole("link", { name: "Community", exact: true }),
    };
  }

  async goto() {
    await this.page.goto("/");
  }

  async clickGetStarted() {
    await this.getStartedLink.click();
  }

  async expectTitle(pattern: string | RegExp) {
    await expect(this.page).toHaveTitle(pattern);
  }

  async expectInstallationVisible() {
    await expect(this.installationHeader).toBeVisible();
  }

  async expectNavLinksVisible() {
    await expect(this.navLinks.docs).toBeVisible();
    await expect(this.navLinks.api).toBeVisible();
    await expect(this.navLinks.community).toBeVisible();
  }

  async clickNavLink(name: string) {
    const key = name.toLowerCase() as keyof typeof this.navLinks;
    const link = this.navLinks[key];
    if (!link) throw new Error(`No nav link registered for "${name}". Valid keys: ${Object.keys(this.navLinks).join(", ")}`);
    await link.click();
  }

  async expectNavLinkAccessible(name: string, hrefPattern: RegExp) {
    const key = name.toLowerCase() as keyof typeof this.navLinks;
    const link = this.navLinks[key];
    if (!link) throw new Error(`No nav link registered for "${name}". Valid keys: ${Object.keys(this.navLinks).join(", ")}`);
    await expect(link).toBeVisible();
    await expect(link).toBeEnabled();
    await expect(link).toHaveAttribute("href", hrefPattern);
  }
}
