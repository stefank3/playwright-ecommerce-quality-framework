import { test as base, expect } from '@playwright/test';
import { readLiveConfig } from '../config/live.ts';
import { sanitizeFailure } from '../config/sanitize-failure.ts';
import { LiveHttpTransport } from '../api/http-transport.ts';
import { LiveBudget } from './live-budget.ts';
import { installLiveNetwork, type AssetCache } from './live-network.ts';
import { LiveProductsPage } from '../ui/live-products-page.ts';
import { LiveCartPage } from '../ui/live-cart-page.ts';
import { LiveProductDetailPage } from '../ui/live-product-detail-page.ts';

type Worker = { budget: LiveBudget; cache: AssetCache };
type Fixtures = {
  products: LiveProductsPage;
  cart: LiveCartPage;
  detail: LiveProductDetailPage;
  api: LiveHttpTransport;
  audit: void;
};
export const test = base.extend<Fixtures, Worker>({
  /** Share a single counter and throttle across the sequential UI and API scenarios. */
  budget: [
    // eslint-disable-next-line no-empty-pattern -- Playwright fixture signatures require destructuring.
    async ({}, use) => {
      await use(new LiveBudget());
    },
    { scope: 'worker' },
  ],
  /** Cache only first-party static asset bytes, never cookies or session HTML. */
  cache: [
    // eslint-disable-next-line no-empty-pattern -- Playwright fixture signatures require destructuring.
    async ({}, use) => {
      await use(new Map());
    },
    { scope: 'worker' },
  ],
  /** Install browser policy before pages and attach only cumulative numeric traffic diagnostics. */
  audit: [
    async ({ context, budget, cache }, use, info) => {
      const audit = await installLiveNetwork(context, budget, cache);
      try {
        await use();
        audit();
      } finally {
        info.errors.forEach(sanitizeFailure);
        await info.attach('traffic', {
          body: JSON.stringify(budget.summary()),
          contentType: 'application/json',
        });
      }
    },
    { auto: true },
  ],
  /** Compose product interactions over this test's isolated page. */
  products: async ({ page }, use) => {
    await use(new LiveProductsPage(page));
  },
  /** Compose the session-cart view over the same isolated page. */
  cart: async ({ page }, use) => {
    await use(new LiveCartPage(page));
  },
  /** Compose the quantity flow over the same isolated page. */
  detail: async ({ page }, use) => {
    await use(new LiveProductDetailPage(page));
  },
  /** Supply an isolated HTTP context with the shared budget and fixed operations. */
  api: async ({ request, budget }, use) => {
    await use(
      new LiveHttpTransport(
        request,
        readLiveConfig(process.env).baseURL,
        budget,
      ),
    );
  },
});
export { expect };
