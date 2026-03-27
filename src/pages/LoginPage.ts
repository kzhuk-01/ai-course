// path: src/pages/LoginPage.ts
import { type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Page object for the Swag Labs login page (https://www.saucedemo.com).
 * Credentials are submitted via data-test attribute inputs.
 */
export class LoginPage extends BasePage {
  protected readonly path = "/";

  /** Enter a username into the username input field. */
  async enterUsername(username: string): Promise<void> {
    this.logger.info(`Entering username: ${username}`);
    await this.getByTestId("username").fill(username);
  }

  /** Enter a password into the password input field. */
  async enterPassword(password: string): Promise<void> {
    this.logger.info("Entering password");
    await this.getByTestId("password").fill(password);
  }

  /** Click the Login button to submit credentials. */
  async submitLogin(): Promise<void> {
    this.logger.info("Submitting login form");
    await this.getByTestId("login-button").click();
  }

  /** Get the error message text shown after a failed login attempt. */
  async getErrorMessage(): Promise<string> {
    return this.getByTestId("error").innerText();
  }

  /**
   * Fill and submit the login form without waiting for navigation.
   * Use for negative test cases where no redirect is expected.
   */
  async attemptLogin(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.submitLogin();
  }

  /**
   * Perform a full login and wait for the inventory page to load.
   * Returns the resolved URL after navigation.
   */
  async loginAs(username: string, password: string): Promise<string> {
    await this.attemptLogin(username, password);
    return this.waitForUrlAndReturn("**/inventory.html");
  }
}
