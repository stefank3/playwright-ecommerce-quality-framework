import { z } from 'zod';
import { FrameworkError } from '../../config/errors.ts';

const productSchema = z
  .object({
    id: z.number().int().positive(),
    name: z.string().min(1).max(120),
    price: z.string().regex(/^Rs\. \d+$/),
  })
  .strict();
const responseSchema = z
  .object({
    responseCode: z.literal(200),
    products: z.array(productSchema).min(1).max(100),
  })
  .strict();

export type Product = z.infer<typeof productSchema>;
export type ProductList = z.infer<typeof responseSchema>;

/**
 * Parse the synthetic consumer contract; this is not a verified live schema.
 * @param value Untrusted decoded payload.
 * @returns Validated product listing.
 * @throws FrameworkError with no payload values when validation fails.
 */
export function parseProducts(value: unknown): ProductList {
  const parsed = responseSchema.safeParse(value);
  if (!parsed.success)
    throw new FrameworkError('contract', 'Invalid product-list response.');
  return parsed.data;
}
