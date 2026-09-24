import type { APIRequestContext, APIResponse } from '@playwright/test';
import { approvedURL } from '../config/live.ts';
import { FrameworkError } from '../config/errors.ts';

export type ApiOperation =
  'products' | 'brands' | 'search' | 'unsupported' | 'malformed';
export type ApiResponse = Readonly<{ status: number; body: unknown }>;
type Dispatcher = { dispatch(): Promise<void>; stop(): never };
/** Minimal response surface permits deterministic adapter tests without a real HTTP stack. */
export type HttpResponse = Pick<
  APIResponse,
  'status' | 'headers' | 'body' | 'dispose'
>;
/** Narrow injectable HTTP boundary; Playwright's context satisfies it structurally. */
export type HttpRequester = {
  fetch(
    url: string,
    options: Parameters<APIRequestContext['fetch']>[1],
  ): Promise<HttpResponse>;
};
const operations = {
  products: { path: '/api/productsList', method: 'GET' },
  brands: { path: '/api/brandsList', method: 'GET' },
  search: { path: '/api/searchProduct', method: 'POST' },
  unsupported: { path: '/api/productsList', method: 'POST' },
  malformed: { path: '/api/searchProduct', method: 'POST' },
} as const;

/** Typed fixed-operation HTTP adapter: no arbitrary URLs, credentials, or response logging. */
export class LiveHttpTransport {
  /** Inject an isolated request context, approved origin and shared dispatch budget. No request here. */
  constructor(
    private readonly request: HttpRequester,
    private readonly baseURL: string,
    private readonly budget: Dispatcher,
  ) {}

  /** Send one safe operation, check each redirect before dispatch, and return HTTP status separately. */
  async send(operation: ApiOperation): Promise<ApiResponse> {
    const spec = operations[operation];
    let url = approvedURL(this.baseURL + spec.path);
    for (let hop = 0; hop < 3; hop++) {
      await this.budget.dispatch();
      let response;
      try {
        response = await this.request.fetch(url.href, {
          method: spec.method,
          ...(operation === 'search'
            ? { form: { search_product: 'Blue Top' } }
            : {}),
          timeout: 15000,
          maxRedirects: 0,
          maxRetries: 0,
        });
      } catch {
        throw new FrameworkError(
          'transport',
          'Live API transport failed before a response.',
        );
      }
      try {
        const status = response.status();
        if ([401, 403, 429].includes(status)) this.budget.stop();
        if ([301, 302, 307, 308].includes(status)) {
          const next = approvedURL(
            new URL(response.headers().location ?? '', url).href,
          );
          if (
            next.pathname !== spec.path ||
            next.search ||
            next.href === url.href
          )
            throw new FrameworkError(
              'network',
              'Unexpected API redirect blocked.',
            );
          url = next;
          continue;
        }
        const bytes = await response.body();
        if (bytes.length > 1024 * 1024)
          throw new FrameworkError(
            'contract',
            'API response exceeds size limit.',
          );
        let body: unknown;
        try {
          body = JSON.parse(bytes.toString('utf8'));
        } catch {
          throw new FrameworkError('contract', 'API response is not JSON.');
        }
        return { status, body };
      } finally {
        await response.dispose();
      }
    }
    throw new FrameworkError('network', 'API redirect limit reached.');
  }
}
