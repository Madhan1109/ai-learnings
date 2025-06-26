import axios from 'axios';
import { IGetProductsResponse } from 'models';

const isProduction = process.env.NODE_ENV === 'production';

export const getProducts = async () => {
  let response: IGetProductsResponse | undefined;
  try {
    if (isProduction) {
      response = await axios.get(
        'https://react-shopping-cart-67954.firebaseio.com/products.json'
      );
    } else {
      response = require('static/json/products.json');
    }
    // Defensive: check for missing or malformed data
    const { products } = response.data || {};
    if (!Array.isArray(products)) {
      throw new Error('Invalid products data received.');
    }
    return products;
  } catch (error) {
    // Log error for monitoring
    console.error('Failed to fetch products:', error);
    // Return empty array or rethrow, depending on app needs
    return [];
  }
}; 