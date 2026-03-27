// path: src/pages/LoginPage.ts
import { type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Page object for the Login page.
 */
export class LoginPage extends BasePage {
  protected readonly path = "/login";

  constructor(page: Page) {
    super(page);
  }

  /** Retrieve the error message displayed on failed login. */
  async getErrorMessage(): Promise<string> {
    return this.getByTestId("login-error").innerText();
  }

  /** Perform a full login with the given credentials. */
  async loginAs(username: string, password: string): Promise<void> {
    await this.fillField("Username", username);
    await this.fillField("Password", password);
    await this.clickButton("Log in");
  }
}
