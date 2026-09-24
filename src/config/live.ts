import { FrameworkError } from './errors.ts';

export type LiveConfig = Readonly<{ baseURL: string }>;

/** Validate exact raw HTTPS origins without URL-parser normalization accepting tricks. */
export function readLiveConfig(
  env: Readonly<Record<string, string | undefined>>,
): LiveConfig {
  if (
    Object.keys(env).some(
      (key) =>
        key.startsWith('QE_') && !['QE_LIVE', 'QE_BASE_URL'].includes(key),
    ) ||
    env.QE_LIVE !== 'true' ||
    !/^https:\/\/(www\.)?automationexercise\.com\/?$/.test(
      env.QE_BASE_URL ?? '',
    )
  ) {
    throw new FrameworkError(
      'configuration',
      'Live requires QE_LIVE=true and an exact approved HTTPS origin in QE_BASE_URL.',
    );
  }
  return Object.freeze({ baseURL: new URL(env.QE_BASE_URL!).origin });
}

/** Reject credentials, ports, fragments, encoded authorities, and unapproved redirect hosts. */
export function approvedURL(raw: string): URL {
  if (
    !/^https:\/\/(www\.)?automationexercise\.com(?:\/|$)/.test(raw) ||
    /[\\\s]/.test(raw)
  ) {
    throw new FrameworkError('network', 'Unapproved live URL blocked.');
  }
  const url = new URL(raw);
  if (url.username || url.password || url.port || url.hash)
    throw new FrameworkError('network', 'Unsafe live URL blocked.');
  return url;
}

/** Restrict browser effects to public product pages, two session-cart products and necessary assets. */
export function browserRequestAllowed(
  raw: string,
  method: string,
  resource: string,
): boolean {
  let url: URL;
  try {
    url = approvedURL(raw);
  } catch {
    return false;
  }
  if (method !== 'GET') return false;
  const path = url.pathname;
  if (resource === 'stylesheet' || resource === 'script') {
    return (
      /^\/static\/(css|js)\/[a-zA-Z0-9._-]+\.(css|js)$/.test(path) &&
      !url.search &&
      !path.includes('subscription')
    );
  }
  if (!['document', 'xhr', 'fetch'].includes(resource)) return false;
  if (path === '/products')
    return (
      !url.search ||
      url.search === '?search=Blue%20Top' ||
      url.search === '?search=Blue+Top'
    );
  if (['/view_cart', '/product_details/1', '/delete_cart/1'].includes(path))
    return !url.search;
  if (/^\/add_to_cart\/[12]$/.test(path))
    return !url.search || url.search === '?quantity=3';
  return false;
}
