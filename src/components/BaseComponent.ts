// path: src/components/BaseComponent.ts
import { type Page, type Locator } from '@playwright/test';
import { Logger } from '../utils/logger';

/**
 * Base class for reusable UI components (Component Object Model).
 * Each component is scoped to a root locator within the page.
 */
export abstract class BaseComponent {
  protected readonly page: Page;
  protected readonly root: Locator;
  protected readonly logger: Logger;

  constructor(page: Page, rootLocator: Locator) {
    this.page = page;
    this.root = rootLocator;
    this.logger = new Logger(this.constructor.name);
  }

  /** Check whether the component root element is visible. */
  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  /** Locate an element by test ID scoped within this component. */
  protected getByTestId(testId: string): Locator {
    return this.root.getByTestId(testId);
  }

  /** Locate an element by accessible role scoped within this component. */
  protected getByRole(role: Parameters<Locator['getByRole']>[0], options?: Parameters<Locator['getByRole']>[1]): Locator {
    return this.root.getByRole(role, options);
  }

  /** Locate an element by label text scoped within this component. */
  protected getByLabel(text: string, options?: { exact?: boolean }): Locator {
    return this.root.getByLabel(text, options);
  }
}
