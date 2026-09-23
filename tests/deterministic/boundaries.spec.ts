import { test, expect } from '@playwright/test';
import { ProductClient } from '../../src/api/product-client.ts';
import { parseProducts } from '../../src/api/contracts/products.ts';
import { readConfig } from '../../src/config/runtime.ts';
import { buildProducts } from '../../src/data/products.ts';
import { FrameworkError } from '../../src/config/errors.ts';
import { installNetworkGuard } from '../../src/fixtures/network-guard.ts';

test('configuration defaults are immutable and deterministic', () => {
  const config = readConfig({});
  expect(config).toEqual({
    mode: 'deterministic',
    timeoutMs: 30000,
    artifactRoot: 'test-results',
  });
  expect(Object.isFrozen(config)).toBe(true);
});

for (const environment of [
  { QE_MODE: 'live' },
  { QE_TIMEOUT_MS: 'NaN' },
  { QE_TIMEOUT_MS: '30001' },
  { QE_BASE_URL: 'https://fixture.invalid' },
]) {
  test(`invalid configuration fails closed: ${Object.keys(environment)[0]} ${Object.values(environment)[0]}`, () => {
    expect(() => readConfig(environment)).toThrow(FrameworkError);
  });
}

for (const body of [
  {},
  { responseCode: 200, products: [] },
  {
    responseCode: 200,
    products: [{ id: '1', name: 'Synthetic', price: 'Rs. 1' }],
  },
]) {
  test(`malformed consumer contract is rejected: ${JSON.stringify(body)}`, () => {
    expect(() => parseProducts(body)).toThrow('Invalid product-list response.');
  });
}

test('client requests only the fixed endpoint and sanitizes transport failures', async () => {
  const paths: string[] = [];
  const client = new ProductClient(async (path) => {
    paths.push(path);
    throw new Error('sensitive upstream detail');
  });
  await expect(client.list()).rejects.toMatchObject({
    kind: 'transport',
    message: 'Product-list transport failed.',
  });
  expect(paths).toEqual(['/api/productsList']);
});

test('client rejects non-success status before accepting a valid body', async () => {
  const client = new ProductClient(async () => ({
    status: 503,
    body: buildProducts(),
  }));
  await expect(client.list()).rejects.toMatchObject({ kind: 'transport' });
});

test('synthetic builders isolate mutable data', () => {
  const first = buildProducts();
  first.products.length = 0;
  expect(buildProducts().products).toHaveLength(1);
});

test('Node outbound requests are denied before transport', async () => {
  await expect(fetch('https://blocked.invalid')).rejects.toThrow(
    'Node network access is disabled',
  );
});

test('unexpected browser navigation is blocked and audited even when caught', async ({
  context,
  page,
}) => {
  const assertClean = await installNetworkGuard(context);
  await expect(page.goto('https://blocked.invalid/')).rejects.toThrow();
  expect(assertClean).toThrow('Unexpected browser request blocked.');
});

test('Playwright APIRequestContext cannot bypass Node transport denial', async ({
  request,
}) => {
  await expect(request.get('https://blocked.invalid/')).rejects.toThrow(
    'Node network access is disabled',
  );
});

test('unexpected WebSocket is closed and audited', async ({
  context,
  page,
}) => {
  const assertClean = await installNetworkGuard(context);
  await page.goto('https://fixture.invalid/products');
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        const socket = new WebSocket('wss://blocked.invalid/socket');
        socket.onclose = () => resolve();
      }),
  );
  expect(assertClean).toThrow('Unexpected browser request blocked.');
});
