import { parseProducts, type ProductList } from './contracts/products.ts';
import { FrameworkError } from '../config/errors.ts';

export type ProductTransport = (
  path: '/api/productsList',
) => Promise<Readonly<{ status: number; body: unknown }>>;

/** Narrow product-list client; M1 injects a controlled transport with no HTTP implementation. */
export class ProductClient {
  private readonly transport: ProductTransport;

  /** Store a transport supplied by a fixture; construction has no side effects. */
  constructor(transport: ProductTransport) {
    this.transport = transport;
  }

  /**
   * Request and validate one read-only product listing.
   * @returns Parsed consumer-contract data.
   * @throws FrameworkError for transport/status or schema failure; raw errors are discarded.
   */
  async list(): Promise<ProductList> {
    let response: Awaited<ReturnType<ProductTransport>>;
    try {
      response = await this.transport('/api/productsList');
    } catch {
      throw new FrameworkError('transport', 'Product-list transport failed.');
    }
    if (response.status !== 200)
      throw new FrameworkError('transport', 'Product-list request failed.');
    return parseProducts(response.body);
  }
}
