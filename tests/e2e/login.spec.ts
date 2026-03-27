// path: tests/e2e/login.spec.ts
import { test, expect } from "../../src/fixtures/baseFixtures";
import { EnvHelper } from "../../src/utils/envHelper";

test.describe("Swag Labs — Login Page", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test("should log in with valid credentials and land on inventory page", async ({ loginPage }) => {
    const url = await loginPage.loginAs(EnvHelper.get("STANDARD_USER"), EnvHelper.get("USER_PASSWORD"));
    expect(url).toContain("/inventory.html");
  });

  test("should show an error message for a locked-out user", async ({ loginPage }) => {
    await loginPage.attemptLogin(EnvHelper.get("LOCKED_OUT_USER"), EnvHelper.get("USER_PASSWORD"));
    const error = await loginPage.getErrorMessage();
    expect(error).toContain("locked out");
  });

  test("should show an error message for invalid credentials", async ({ loginPage }) => {
    await loginPage.attemptLogin("invalid_user", "wrong_password");
    const error = await loginPage.getErrorMessage();
    expect(error).toContain("Username and password do not match");
  });
});
