import type { Locator, Page } from '@playwright/test';

/** Product-list interactions; CSS fallbacks target the provider's unlabeled search/cart controls. */
export class LiveProductsPage {
  /** Bind one isolated browser page; construction performs no I/O. */
  constructor(private readonly page: Page) {}
  /** Open the public product listing once. */
  async open(): Promise<void> {
    await this.page.goto('/products', { waitUntil: 'domcontentloaded' });
  }
  /** Search the known public fixture term with the site's own submission control. */
  async search(): Promise<void> {
    await this.page.getByPlaceholder('Search Product').fill('Blue Top');
    await this.page.locator('#submit_search').click();
  }
  /** Scope a card to its exact product text, excluding its duplicate hover presentation. */
  product(name: string): Locator {
    return this.page
      .locator('.productinfo')
      .filter({ has: this.page.getByText(name, { exact: true }) });
  }
  /** Add an explicitly scoped product and wait for the site's confirmation before continuing. */
  async add(name: string): Promise<void> {
    await this.product(name).locator('.add-to-cart').click();
    await this.page.getByRole('button', { name: 'Continue Shopping' }).click();
  }
  /** Expose the result heading for a scenario-owned assertion. */
  searchedHeading(): Locator {
    return this.page.getByRole('heading', {
      name: 'Searched Products',
      exact: true,
    });
  }
}
