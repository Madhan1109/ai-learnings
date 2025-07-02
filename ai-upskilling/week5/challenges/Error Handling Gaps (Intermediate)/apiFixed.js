// Production-ready API functions with robust error handling and retry logic

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMsg = `HTTP error! Status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
};

const fetchWithRetry = async (url, options = {}, retries = MAX_RETRIES) => {
  let lastError;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, options);
      return await handleResponse(response);
    } catch (error) {
      lastError = error;
      if (attempt < retries - 1) {
        await new Promise(res => setTimeout(res, RETRY_DELAY));
      }
    }
  }
  throw lastError;
};

export const fetchProducts = async (setLoading, setError) => {
  setLoading(true);
  setError(null);
  try {
    const data = await fetchWithRetry('/api/products');
    setLoading(false);
    return data;
  } catch (error) {
    setLoading(false);
    setError(error.message || 'Failed to fetch products. Please try again.');
    return null;
  }
};

export const processPayment = async (paymentData, setLoading, setError) => {
  setLoading(true);
  setError(null);
  try {
    const data = await fetchWithRetry('/api/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    setLoading(false);
    return data;
  } catch (error) {
    setLoading(false);
    setError(error.message || 'Payment failed. Please try again.');
    return null;
  }
}; 