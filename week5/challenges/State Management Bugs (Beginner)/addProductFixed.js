// Corrected addProduct function with immutable update patterns
const addProduct = (product) => {
  setProducts((prevProducts) => {
    const productIndex = prevProducts.findIndex(p => p.id === product.id);
    if (productIndex !== -1) {
      // Create a new array and update the quantity immutably
      return prevProducts.map((p, idx) =>
        idx === productIndex ? { ...p, quantity: p.quantity + 1 } : p
      );
    } else {
      // Add a new product with quantity 1, do not mutate the original product object
      return [...prevProducts, { ...product, quantity: 1 }];
    }
  });
}; 