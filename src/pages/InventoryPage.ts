// path: src/pages/InventoryPage.ts
import { BasePage } from "./BasePage";
import { SortOption } from "../enums/SortOption";

/**
 * Page object for the Swag Labs inventory / product listing page (/inventory.html).
 */
export class InventoryPage extends BasePage {
  protected readonly path = "/inventory.html";

  /** Get the page header title text ("Products"). */
  async getPageTitle(): Promise<string> {
    return this.getByTestId("title").innerText();
  }

  /** Get the number of product cards displayed on the page. */
  async getProductCount(): Promise<number> {
    return this.countByTestId("inventory-item");
  }

  /** Get the name of a product card at the given zero-based index. */
  async getProductName(index: number): Promise<string> {
    return this.getTextByTestId("inventory-item-name", index);
  }

  /** Get the price text of a product card at the given zero-based index. */
  async getProductPrice(index: number): Promise<string> {
    return this.getTextByTestId("inventory-item-price", index);
  }

  /** Get all product prices as numbers in their current display order. */
  async getAllPrices(): Promise<number[]> {
    const prices = await this.page.getByTestId("inventory-item-price").allInnerTexts();
    return prices.map((p) => parseFloat(p.replace("$", "")));
  }

  /** Click the "Add to cart" button for a product at the given zero-based index. */
  async addProductToCart(index: number): Promise<void> {
    this.logger.info(`Adding product at index ${index} to cart`);
    await this.page.getByTestId("inventory-item").nth(index).getByRole("button", { name: "Add to cart" }).click();
  }

  /** Find a product by its name and click its "Add to cart" button. */
  async addProductToCartByName(name: string): Promise<void> {
    this.logger.info(`Adding product "${name}" to cart`);
    await this.page.getByTestId("inventory-item").filter({ hasText: name }).getByRole("button", { name: "Add to cart" }).click();
  }

  /** Select a sorting option from the product sort dropdown. */
  async sortProductsBy(option: SortOption): Promise<void> {
    this.logger.info(`Sorting products by: ${option}`);
    await this.page.getByTestId("product-sort-container").selectOption(option);
  }

  /** Navigate to a product detail page by clicking its name link. */
  async openProductByName(name: string): Promise<void> {
    this.logger.info(`Opening product: ${name}`);
    await this.getByRole("link", { name, exact: true }).click();
  }
}
