import type { Locator, Page } from '@playwright/test';

/** User-facing interactions for the controlled read-only product listing. */
export class ProductListPage {
  private readonly page: Page;

  /** Bind an isolated page without navigation or assertions. */
  constructor(page: Page) {
    this.page = page;
  }

  /** Navigate to the intercepted fixture document; never a live target. */
  async open(): Promise<void> {
    await this.page.goto('https://fixture.invalid/products');
  }

  /** Return the accessible product list for scenario-owned assertions. */
  products(): Locator {
    return this.page.getByRole('list', { name: 'Products' });
  }
}
