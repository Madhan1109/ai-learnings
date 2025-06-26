import { IProduct } from 'models';
import Product from './Product';
import * as S from './style';
import { useMemo } from 'react';

interface IProps {
  products: IProduct[];
}

const Products = ({ products }: IProps) => {
  // Memoize the products array to avoid unnecessary re-renders
  const memoizedProducts = useMemo(() => products, [products]);

  return (
    <S.Container>
      {memoizedProducts?.map((p) => (
        <Product product={p} key={p.sku} />
      ))}
    </S.Container>
  );
};

export default Products; 