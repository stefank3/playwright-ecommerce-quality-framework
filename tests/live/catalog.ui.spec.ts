import { test, expect } from '../../src/fixtures/live.ts';
import type { LiveCartPage } from '../../src/ui/live-cart-page.ts';

/** Assert displayed values and independently check integer currency arithmetic. */
async function checkRow(
  cart: LiveCartPage,
  id: 1 | 2,
  name: string,
  price: number,
  quantity: number,
): Promise<void> {
  const cells = cart.cells(id);
  await expect(cells.name).toHaveText(name);
  await expect(cells.price).toHaveText(`Rs. ${price}`);
  await expect(cells.quantity).toHaveText(String(quantity));
  await expect(cells.total).toHaveText(`Rs. ${price * quantity}`);
  const displayedPrice = Number(
    (await cells.price.innerText()).replace('Rs.', '').trim(),
  );
  const displayedQuantity = Number((await cells.quantity.innerText()).trim());
  const displayedTotal = Number(
    (await cells.total.innerText()).replace('Rs.', '').trim(),
  );
  expect(displayedTotal).toBe(displayedPrice * displayedQuantity);
}

test('UI product search shows matching product information', async ({
  products,
}) => {
  await products.open();
  await products.search();
  await expect(products.searchedHeading()).toBeVisible();
  await expect(products.product('Blue Top')).toHaveCount(1);
  await expect(products.product('Blue Top')).toContainText('Rs. 500');
});
test('UI multiple-product cart preserves both prices, quantities and totals', async ({
  products,
  cart,
}) => {
  await products.open();
  await products.add('Blue Top');
  await products.add('Men Tshirt');
  await cart.open();
  await checkRow(cart, 1, 'Blue Top', 500, 1);
  await checkRow(cart, 2, 'Men Tshirt', 400, 1);
});
test('UI product quantity is exactly three with the matching total', async ({
  detail,
  cart,
}) => {
  await detail.addThree();
  await cart.open();
  await checkRow(cart, 1, 'Blue Top', 500, 3);
});
test('UI removal removes the product from this session cart', async ({
  products,
  cart,
}) => {
  await products.open();
  await products.add('Blue Top');
  await cart.open();
  await expect(cart.row(1)).toBeVisible();
  await cart.remove();
  await expect(cart.row(1)).toHaveCount(0);
});
