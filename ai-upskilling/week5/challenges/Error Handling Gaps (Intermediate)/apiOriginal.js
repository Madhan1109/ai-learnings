// Original API functions with missing error handling
export const fetchProducts = async () => {
  const response = await fetch('/api/products');
  const data = await response.json(); // No error handling!
  return data;
};

export const processPayment = async (paymentData) => {
  const response = await fetch('/api/payment', {
    method: 'POST',
    body: JSON.stringify(paymentData)
  });
  return response.json(); // No validation or error handling!
}; 