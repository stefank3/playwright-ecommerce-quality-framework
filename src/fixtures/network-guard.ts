import type { BrowserContext } from '@playwright/test';
import { FrameworkError } from '../config/errors.ts';
import { productDocument } from '../data/products.ts';

/**
 * Fulfill only the synthetic document and deny every other browser request.
 * @param context Fresh isolated context, configured offline with service workers blocked.
 * @returns An audit assertion to call during teardown; errors contain no request values.
 * @throws FrameworkError from the returned assertion if any request was denied.
 */
export async function installNetworkGuard(
  context: BrowserContext,
): Promise<() => void> {
  let denied = false;
  await context.route('**/*', async (route) => {
    const request = route.request();
    if (
      request.url() === 'https://fixture.invalid/products' &&
      request.method() === 'GET' &&
      request.isNavigationRequest()
    ) {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: productDocument,
      });
    } else {
      denied = true;
      await route.abort('blockedbyclient');
    }
  });
  await context.routeWebSocket('**/*', (socket) => {
    denied = true;
    socket.close();
  });
  /** Fail even if scenario code swallowed a denied request error. */
  return function assertNoUnexpectedRequests(): void {
    if (denied)
      throw new FrameworkError(
        'network',
        'Unexpected browser request blocked.',
      );
  };
}
