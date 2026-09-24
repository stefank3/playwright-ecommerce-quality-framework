import { test, expect } from '../../src/fixtures/deterministic.ts';

test('read-only UI: controlled catalog presents one product and price', async ({
  catalog,
}) => {
  await catalog.open();
  await expect(catalog.products().getByRole('listitem')).toHaveCount(1);
  await expect(
    catalog.products().getByRole('heading', { name: 'Synthetic Blue Shirt' }),
  ).toBeVisible();
  await expect(catalog.products()).toContainText('Rs. 500');
});

test('read-only API: controlled product list meets consumer expectations', async ({
  productApi,
}) => {
  const response = await productApi.list();
  expect(response.products).toEqual([
    { id: 1, name: 'Synthetic Blue Shirt', price: 'Rs. 500' },
  ]);
});
