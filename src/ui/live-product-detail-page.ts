import type { Page } from '@playwright/test';

/** Quantity interaction on a single public product, with no review or checkout actions. */
export class LiveProductDetailPage {
  /** Bind an isolated page without effects. */
  constructor(private readonly page: Page) {}
  /** Open Blue Top and add exactly three units using the native number input. */
  async addThree(): Promise<void> {
    await this.page.goto('/product_details/1', {
      waitUntil: 'domcontentloaded',
    });
    await this.page.getByRole('spinbutton').fill('3');
    await this.page.getByRole('button', { name: 'Add to cart' }).click();
    await this.page.getByRole('button', { name: 'Continue Shopping' }).click();
  }
}
