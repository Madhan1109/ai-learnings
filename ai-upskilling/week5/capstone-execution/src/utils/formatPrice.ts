/**
 * Formats a price value according to the given currency.
 * @param price - The price as a number.
 * @param currencyId - The currency code (e.g., 'USD', 'BRL').
 * @returns The formatted price as a string.
 */
const formatPrice = (price: number, currencyId: string): string => {
  switch (currencyId) {
    case 'BRL':
      return price.toFixed(2).replace('.', ',');
    default:
      return price.toFixed(2);
  }
};

export default formatPrice; 