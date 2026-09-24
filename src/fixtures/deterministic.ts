import { test as base, expect } from '@playwright/test';
import { ProductClient } from '../api/product-client.ts';
import { buildProducts } from '../data/products.ts';
import { installNetworkGuard } from './network-guard.ts';
import { ProductListPage } from '../ui/product-list-page.ts';
import { requireDeterministicGuard } from '../config/deterministic-guard.ts';

requireDeterministicGuard();

type Fixtures = {
  catalog: ProductListPage;
  productApi: ProductClient;
  networkGuard: void;
};

export const test = base.extend<Fixtures>({
  networkGuard: [
    /** Install fail-closed routes before page creation; fail teardown on any unexpected request. */
    async ({ context }, use) => {
      const assertClean = await installNetworkGuard(context);
      await use();
      assertClean();
    },
    { auto: true },
  ],
  /** Compose the single UI abstraction over an isolated guarded page. */
  catalog: async ({ page }, use) => {
    await use(new ProductListPage(page));
  },
  /** Supply an in-memory endpoint response; no network transport is constructed. */
  // eslint-disable-next-line no-empty-pattern -- Playwright requires destructured fixture parameters.
  productApi: async ({}, use) => {
    await use(
      new ProductClient(async () => ({ status: 200, body: buildProducts() })),
    );
  },
});

export { expect };
