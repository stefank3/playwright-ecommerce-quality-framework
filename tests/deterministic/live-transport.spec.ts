import { test, expect } from '@playwright/test';
import {
  LiveHttpTransport,
  type HttpRequester,
  type HttpResponse,
} from '../../src/api/http-transport.ts';
import { FrameworkError } from '../../src/config/errors.ts';

/** In-memory response factory; no real provider bytes or connections are used. */
function response(
  status: number,
  body = '{}',
  location?: string,
): HttpResponse {
  return {
    status: () => status,
    headers: () => (location ? { location } : {}),
    body: async () => Buffer.from(body),
    dispose: async () => {},
  };
}
/** A fake dispatcher makes request count observable without delays or network. */
function dispatcher() {
  return {
    sent: 0,
    async dispatch() {
      this.sent++;
    },
    stop(): never {
      throw new FrameworkError('network', 'Live safety stop');
    },
  };
}
test('HTTP adapter validates a redirect before a second dispatch', async () => {
  const budget = dispatcher();
  const request: HttpRequester = {
    fetch: async () =>
      response(302, '', 'https://evil.invalid/api/productsList'),
  };
  const client = new LiveHttpTransport(
    request,
    'https://automationexercise.com',
    budget,
  );
  await expect(client.send('products')).rejects.toThrow('Unapproved live URL');
  expect(budget.sent).toBe(1);
});
test('HTTP adapter counts canonical redirects and separates HTTP/provider statuses', async () => {
  const budget = dispatcher();
  const calls: string[] = [];
  const request: HttpRequester = {
    fetch: async (url, options) => {
      calls.push(url);
      expect(options?.maxRedirects).toBe(0);
      expect(options?.maxRetries).toBe(0);
      return calls.length === 1
        ? response(
            307,
            '',
            'https://www.automationexercise.com/api/productsList',
          )
        : response(
            200,
            '{"responseCode":405,"message":"This request method is not supported."}',
          );
    },
  };
  const result = await new LiveHttpTransport(
    request,
    'https://automationexercise.com',
    budget,
  ).send('unsupported');
  expect(budget.sent).toBe(2);
  expect(result.status).toBe(200);
  expect(result.body).toMatchObject({ responseCode: 405 });
});
test('HTTP adapter stops on throttling without parsing or another request', async () => {
  const budget = dispatcher();
  const client = new LiveHttpTransport(
    { fetch: async () => response(429, 'private detail') },
    'https://automationexercise.com',
    budget,
  );
  await expect(client.send('brands')).rejects.toThrow('Live safety stop');
  expect(budget.sent).toBe(1);
});
test('HTTP adapter sanitizes transport errors and rejects non-JSON', async () => {
  const client = new LiveHttpTransport(
    {
      fetch: async () => {
        throw new Error('secret upstream value');
      },
    },
    'https://automationexercise.com',
    dispatcher(),
  );
  await expect(client.send('search')).rejects.toThrow(
    'Live API transport failed before a response.',
  );
  const malformed = new LiveHttpTransport(
    { fetch: async () => response(200, 'private body') },
    'https://automationexercise.com',
    dispatcher(),
  );
  await expect(malformed.send('malformed')).rejects.toThrow(
    'API response is not JSON.',
  );
});
