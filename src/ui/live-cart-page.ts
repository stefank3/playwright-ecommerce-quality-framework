import type { Locator, Page } from '@playwright/test';

/** Session-only cart; domain row IDs avoid positional selectors in the provider table. */
export class LiveCartPage {
  /** Bind the same isolated page as the product flow. */
  constructor(private readonly page: Page) {}
  /** Navigate to the cart without account or checkout interactions. */
  async open(): Promise<void> {
    await this.page.goto('/view_cart', { waitUntil: 'domcontentloaded' });
  }
  /** Return the row for one approved product ID. */
  row(id: 1 | 2): Locator {
    return this.page.locator(`#product-${id}`);
  }
  /** Return consumed cells using stable domain classes because cells have no accessible labels. */
  cells(id: 1 | 2): {
    name: Locator;
    price: Locator;
    quantity: Locator;
    total: Locator;
  } {
    const row = this.row(id);
    return {
      name: row.getByRole('heading'),
      price: row.locator('.cart_price'),
      quantity: row.locator('.cart_quantity'),
      total: row.locator('.cart_total_price'),
    };
  }
  /** Remove only product 1 from this isolated session; the icon link lacks an accessible name. */
  async remove(): Promise<void> {
    await this.row(1).locator('.cart_quantity_delete').click();
  }
}
