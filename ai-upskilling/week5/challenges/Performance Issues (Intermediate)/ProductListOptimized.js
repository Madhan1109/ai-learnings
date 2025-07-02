import React, { useMemo } from 'react';

// Optimized ProductList with memoization and performance monitoring
const ProductList = ({ products, filters }) => {
  // Performance monitoring
  console.time('ProductList filtering');
  const filteredProducts = useMemo(() => {
    // Early return if no filters
    if (!filters.sizes.length && filters.maxPrice === Infinity) return products;
    return products.filter(product => {
      // Short-circuit for price first
      if (product.price > filters.maxPrice) return false;
      // Only check sizes if filter is set
      if (filters.sizes.length > 0) {
        return filters.sizes.every(size => product.availableSizes.includes(size));
      }
      return true;
    });
  }, [products, filters.sizes, filters.maxPrice]);
  console.timeEnd('ProductList filtering');

  return (
    <div>
      {filteredProducts.map(product => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList; 