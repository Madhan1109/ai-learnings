// Original addProduct logic from useCartProducts.ts
const addProduct = (newProduct) => {
  let updatedProducts;
  const isProductAlreadyInCart = products.some(
    (product) => newProduct.id === product.id
  );

  if (isProductAlreadyInCart) {
    updatedProducts = products.map((product) => {
      return updateQuantitySafely(product, newProduct, newProduct.quantity);
    });
  } else {
    updatedProducts = [...products, newProduct];
  }

  setProducts(updatedProducts);
  updateCartTotal(updatedProducts);
}; 