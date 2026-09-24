import type { BrowserContext } from '@playwright/test';
import { approvedURL, browserRequestAllowed } from '../config/live.ts';
import { FrameworkError } from '../config/errors.ts';
import type { LiveBudget } from './live-budget.ts';

export type AssetCache = Map<
  string,
  { status: number; headers: Record<string, string>; body: Buffer }
>;

/** Fetch allowlisted requests and manually validate every redirect before dispatch. */
export async function installLiveNetwork(
  context: BrowserContext,
  budget: LiveBudget,
  cache: AssetCache,
): Promise<() => void> {
  let failed = false;
  await context.route('**/*', async (route) => {
    const request = route.request();
    const url = request.url();
    if (!browserRequestAllowed(url, request.method(), request.resourceType())) {
      budget.blocked++;
      if (request.isNavigationRequest()) failed = true;
      await route.abort('blockedbyclient');
      return;
    }
    try {
      const asset = ['stylesheet', 'script'].includes(request.resourceType());
      const cached = asset ? cache.get(url) : undefined;
      if (cached) {
        budget.cached++;
        await route.fulfill(cached);
        return;
      }
      let target = url;
      let response;
      for (let hop = 0; hop < 3; hop++) {
        await budget.dispatch();
        response = await route.fetch({
          url: target,
          maxRedirects: 0,
          maxRetries: 0,
          timeout: 15000,
        });
        if (![301, 302, 303, 307, 308].includes(response.status())) break;
        const location = response.headers().location;
        await response.dispose();
        response = undefined;
        if (!location)
          throw new FrameworkError(
            'network',
            'Missing browser redirect destination.',
          );
        const next = approvedURL(new URL(location, target).href);
        if (
          next.pathname !== new URL(target).pathname ||
          next.search !== new URL(target).search ||
          !browserRequestAllowed(
            next.href,
            request.method(),
            request.resourceType(),
          )
        )
          throw new FrameworkError(
            'network',
            'Unexpected browser redirect blocked.',
          );
        target = next.href;
      }
      if (!response)
        throw new FrameworkError('network', 'Browser redirect limit reached.');
      try {
        const status = response.status();
        const body = await response.body();
        if (
          [401, 403, 429].includes(status) ||
          (request.isNavigationRequest() &&
            /cf-chl-|Just a moment|Access Denied/i.test(body.toString('utf8')))
        )
          budget.stop();
        if (body.length > 2 * 1024 * 1024)
          throw new FrameworkError(
            'network',
            'Browser response exceeds size limit.',
          );
        // Cookies stay in the isolated context, never in cache or report attachments.
        if (asset && status === 200)
          cache.set(url, {
            status,
            body,
            headers: {
              'content-type':
                response.headers()['content-type'] ?? 'text/plain',
            },
          });
        await route.fulfill({ response, body });
      } finally {
        await response.dispose();
      }
    } catch {
      failed = true;
      await route.abort('blockedbyclient').catch(() => {});
    }
  });
  await context.routeWebSocket('**/*', async (socket) => {
    budget.blocked++;
    await socket.close();
  });
  return () => {
    if (failed)
      throw new FrameworkError(
        'network',
        'Live browser request failed or unauthorized navigation was blocked.',
      );
  };
}
