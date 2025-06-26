import DOMPurify from 'dompurify';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

// Secure ProductDetails with XSS protection and input validation
const isValidImageUrl = (url) => {
  try {
    const parsed = new URL(url, window.location.origin);
    // Only allow images from the same origin or trusted domains
    return parsed.origin === window.location.origin || parsed.hostname.endsWith('trusted.com');
  } catch {
    return false;
  }
};

const isValidId = (id) => /^[a-zA-Z0-9_-]+$/.test(id);

const ProductDetails = ({ product }) => {
  const history = useHistory();
  const safeDescription = DOMPurify.sanitize(product.description || '');
  const safeImageUrl = isValidImageUrl(product.imageUrl) ? product.imageUrl : '/default-image.png';
  const safeId = isValidId(product.id) ? product.id : '';

  const handleViewDetails = () => {
    if (safeId) {
      history.push(`/product/${safeId}`);
    } else {
      alert('Invalid product ID.');
    }
  };

  return (
    <div>
      <h2>{product.title}</h2>
      {/* XSS protected */}
      <div dangerouslySetInnerHTML={{ __html: safeDescription }} />
      {/* Image source validated */}
      <img src={safeImageUrl} alt={product.title} />
      <button onClick={handleViewDetails}>
        View Details
      </button>
    </div>
  );
};

ProductDetails.propTypes = {
  product: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    imageUrl: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
};

export default ProductDetails; 