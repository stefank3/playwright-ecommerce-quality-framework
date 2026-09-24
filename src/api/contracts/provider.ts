import { z } from 'zod';
import { FrameworkError } from '../../config/errors.ts';

const brands = z.object({
  responseCode: z.literal(200),
  brands: z
    .array(
      z.object({
        id: z.number().int().positive(),
        brand: z.string().min(1).max(120),
      }),
    )
    .min(1)
    .max(1000),
});
const rejection = z.object({
  responseCode: z.union([z.literal(400), z.literal(405)]),
  message: z.string().min(1).max(200),
});
export type Brands = z.infer<typeof brands>;
export type ProviderRejection = z.infer<typeof rejection>;

/** Validate consumed brand fields; extra provider fields are discarded. Throws a safe contract error. */
export function parseBrands(body: unknown): Brands {
  const result = brands.safeParse(body);
  if (!result.success)
    throw new FrameworkError('contract', 'Invalid brand-list response.');
  return result.data;
}

/** Validate provider rejection independently from HTTP status; discard unconsumed fields. */
export function parseRejection(body: unknown): ProviderRejection {
  const result = rejection.safeParse(body);
  if (!result.success)
    throw new FrameworkError('contract', 'Invalid provider rejection.');
  return result.data;
}
