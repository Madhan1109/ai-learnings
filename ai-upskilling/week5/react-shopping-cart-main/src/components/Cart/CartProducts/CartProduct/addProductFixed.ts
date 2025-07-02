import { ICartProduct } from 'models';

// Corrected addProduct function for cart state management
const addProduct = (
  newProduct: ICartProduct,
  products: ICartProduct[],
  setProducts: (products: ICartProduct[]) => void,
  updateCartTotal: (products: ICartProduct[]) => void
) => {
  const productIndex = products.findIndex(p => p.id === newProduct.id);
  let updatedProducts: ICartProduct[];

  if (productIndex !== -1) {
    // Update quantity immutably
    updatedProducts = products.map((p, idx) =>
      idx === productIndex ? { ...p, quantity: p.quantity + newProduct.quantity } : p
    );
  } else {
    // Add new product with quantity, do not mutate the original object
    updatedProducts = [...products, { ...newProduct }];
  }

  setProducts(updatedProducts);
  updateCartTotal(updatedProducts);
};

export default addProduct; 