import { test, expect } from '../../src/fixtures/live.ts';
import { parseProducts } from '../../src/api/contracts/products.ts';
import {
  parseBrands,
  parseRejection,
} from '../../src/api/contracts/provider.ts';

test('API products: HTTP status and consumed product contract', async ({
  api,
}) => {
  const response = await api.send('products');
  expect(response.status).toBe(200);
  const body = parseProducts(response.body);
  expect(body.responseCode).toBe(200);
  expect(body.products).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ id: 1, name: 'Blue Top', price: 'Rs. 500' }),
    ]),
  );
});
test('API brands: non-empty valid brands have unique IDs', async ({ api }) => {
  const response = await api.send('brands');
  expect(response.status).toBe(200);
  const body = parseBrands(response.body);
  expect(new Set(body.brands.map((brand) => brand.id)).size).toBe(
    body.brands.length,
  );
});
test('API search: known product yields matching validated results', async ({
  api,
}) => {
  const response = await api.send('search');
  expect(response.status).toBe(200);
  const body = parseProducts(response.body);
  expect(
    body.products.every((product) =>
      product.name.toLowerCase().includes('blue top'),
    ),
  ).toBe(true);
});
test('API unsupported method: provider 405 is separate from HTTP 200', async ({
  api,
}) => {
  const response = await api.send('unsupported');
  expect(response.status).toBe(200);
  expect(parseRejection(response.body)).toEqual({
    responseCode: 405,
    message: 'This request method is not supported.',
  });
});
test('API malformed search: safe missing-parameter rejection', async ({
  api,
}) => {
  const response = await api.send('malformed');
  expect(response.status).toBe(200);
  expect(parseRejection(response.body)).toEqual({
    responseCode: 400,
    message:
      'Bad request, search_product parameter is missing in POST request.',
  });
});
