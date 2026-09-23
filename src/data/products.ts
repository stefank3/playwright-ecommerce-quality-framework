import type { ProductList } from '../api/contracts/products.ts';

/** Return fresh synthetic product data; mutations never leak between tests. */
export function buildProducts(): ProductList {
  return {
    responseCode: 200,
    products: [{ id: 1, name: 'Synthetic Blue Shirt', price: 'Rs. 500' }],
  };
}

export const productDocument = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Controlled product listing</title></head>
<body><main><h1>Products</h1><ul aria-label="Products"><li>
<h2>Synthetic Blue Shirt</h2><p>Rs. 500</p>
</li></ul></main></body></html>`;
