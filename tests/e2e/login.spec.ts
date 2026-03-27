// path: tests/e2e/login.spec.ts
import { test, expect } from "../../src/fixtures/baseFixtures";

test.describe("Swag Labs — Login Page", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test("should log in with valid credentials and land on inventory page", async ({ loginPage }) => {
    const url = await loginPage.loginAs("standard_user", "secret_sauce");
    expect(url).toContain("/inventory.html");
  });

  test("should show an error message for a locked-out user", async ({ loginPage }) => {
    await loginPage.attemptLogin("locked_out_user", "secret_sauce");
    const error = await loginPage.getErrorMessage();
    expect(error).toContain("locked out");
  });

  test("should show an error message for invalid credentials", async ({ loginPage }) => {
    await loginPage.attemptLogin("invalid_user", "wrong_password");
    const error = await loginPage.getErrorMessage();
    expect(error).toContain("Username and password do not match");
  });
});
