// path: tests/e2e/inventory.spec.ts
import { test, expect } from '../../src/fixtures/baseFixtures';

test.describe('Swag Labs — Inventory Page', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.loginAs('standard_user', 'secret_sauce');
  });

  test('should display the "Products" page title', async ({ inventoryPage }) => {
    const title = await inventoryPage.getPageTitle();
    expect(title).toBe('Products');
  });

  test('should display six products', async ({ inventoryPage }) => {
    const count = await inventoryPage.getProductCount();
    expect(count).toBe(6);
  });

  test('should add a product to the cart and update the cart badge', async ({ inventoryPage, appHeader }) => {
    await inventoryPage.addProductToCart(0);
    const badgeCount = await appHeader.getCartBadgeCount();
    expect(badgeCount).toBe(1);
  });

  test('should navigate to the cart page via the header icon', async ({ appHeader }) => {
    const url = await appHeader.openCart();
    expect(url).toContain('/cart.html');
  });

  test('should log out via the burger menu', async ({ appHeader }) => {
    const url = await appHeader.logout();
    expect(url).toContain('saucedemo.com');
    expect(url).not.toContain('inventory');
  });
});
