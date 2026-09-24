import { test, expect } from '@playwright/test';
import {
  readLiveConfig,
  approvedURL,
  browserRequestAllowed,
} from '../../src/config/live.ts';
import { parseProducts } from '../../src/api/contracts/products.ts';
import {
  parseBrands,
  parseRejection,
} from '../../src/api/contracts/provider.ts';
import { LiveBudget } from '../../src/fixtures/live-budget.ts';
import { sanitizeFailure } from '../../src/config/sanitize-failure.ts';

test('live errors discard payloads, stack, DOM context and nested causes before retention', () => {
  const error = {
    message: 'expect(received) private-value',
    stack: 'private-stack',
    errorContext: 'private-dom',
    cause: { token: 'private-token' },
  };
  sanitizeFailure(error);
  expect(error).toEqual({
    message:
      'Live failure: assertion mismatch. Raw values withheld; inspect the scenario and numeric traffic evidence.',
  });
});

test('live opt-in is mandatory and configuration is immutable', () => {
  expect(() => readLiveConfig({})).toThrow();
  expect(() =>
    readLiveConfig({ QE_BASE_URL: 'https://automationexercise.com' }),
  ).toThrow();
  expect(() =>
    readLiveConfig({
      QE_LIVE: 'true',
      QE_BASE_URL: 'https://automationexercise.com',
      QE_EXTRA: 'x',
    }),
  ).toThrow();
  expect(
    Object.isFrozen(
      readLiveConfig({
        QE_LIVE: 'true',
        QE_BASE_URL: 'https://automationexercise.com',
      }),
    ),
  ).toBe(true);
});
for (const url of [
  'http://automationexercise.com',
  'https://user:pass@automationexercise.com',
  'https://automationexercise.com#fragment',
  'https://automationexercise.com:444',
  'https://%61utomationexercise.com',
  'https://automationexercise.com.evil.invalid',
  'https://sub.automationexercise.com',
  'https://automationexercise.com\\@evil.invalid',
  'https://automationexercise.com/path',
]) {
  test(`live origin rejects ${url}`, () => {
    expect(() =>
      readLiveConfig({ QE_LIVE: 'true', QE_BASE_URL: url }),
    ).toThrow();
  });
}
test('request policy allows canonical host but blocks persistent operations and third parties', () => {
  expect(
    approvedURL('https://www.automationexercise.com/products').hostname,
  ).toBe('www.automationexercise.com');
  expect(
    browserRequestAllowed(
      'https://automationexercise.com/add_to_cart/1?quantity=3',
      'GET',
      'xhr',
    ),
  ).toBe(true);
  for (const path of [
    '/login',
    '/contact_us',
    '/payment',
    '/api/createAccount',
    '/delete_cart/2',
    '/products?secret=x',
  ]) {
    expect(
      browserRequestAllowed(
        'https://automationexercise.com' + path,
        'GET',
        'document',
      ),
    ).toBe(false);
  }
  expect(
    browserRequestAllowed('https://ads.invalid/ad.js', 'GET', 'script'),
  ).toBe(false);
  expect(
    browserRequestAllowed(
      'https://automationexercise.com/products',
      'POST',
      'document',
    ),
  ).toBe(false);
});
test('provider schemas tolerate additive data while checking every consumed field', () => {
  expect(
    parseProducts({
      responseCode: 200,
      extra: true,
      products: [{ id: 1, name: 'Blue Top', price: 'Rs. 500', brand: 'Extra' }],
    }).products[0],
  ).toEqual({ id: 1, name: 'Blue Top', price: 'Rs. 500' });
  expect(
    parseBrands({
      responseCode: 200,
      brands: [{ id: 1, brand: 'Synthetic', extra: 42 }],
    }).brands,
  ).toHaveLength(1);
  expect(() =>
    parseBrands({ responseCode: 200, brands: [{ id: '1', brand: '' }] }),
  ).toThrow();
  expect(() =>
    parseRejection({ responseCode: 200, message: 'wrong' }),
  ).toThrow();
});
test('budget exhaustion and explicit stop remain sticky without network', async () => {
  const budget = new LiveBudget();
  budget.sent = 100;
  await expect(budget.dispatch()).rejects.toThrow('Live safety stop');
  budget.sent = 0;
  await expect(budget.dispatch()).rejects.toThrow('Live safety stop');
});
