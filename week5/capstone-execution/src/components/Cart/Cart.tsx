import formatPrice from 'utils/formatPrice';
import CartProducts from './CartProducts';
import PropTypes from 'prop-types';
import { useCart } from 'contexts/cart-context';
import * as S from './style';
import { useMemo } from 'react';

const Cart = () => {
  const { products, total, isOpen, openCart, closeCart } = useCart();

  // Memoize total calculation for performance (if total is not already memoized in context)
  const memoizedTotal = useMemo(() => total, [total]);

  const handleCheckout = () => {
    if (memoizedTotal.productQuantity) {
      alert(
        `Checkout - Subtotal: ${memoizedTotal.currencyFormat} ${formatPrice(
          memoizedTotal.totalPrice,
          memoizedTotal.currencyId
        )}`
      );
    } else {
      alert('Add some product in the cart!');
    }
  };

  const handleToggleCart = (isOpen) => () =>
    isOpen ? closeCart() : openCart();

  return (
    <S.Container isOpen={isOpen}>
      <S.CartButton onClick={handleToggleCart(isOpen)}>
        {isOpen ? (
          <span>X</span>
        ) : (
          <S.CartIcon>
            <S.CartQuantity title="Products in cart quantity">
              {memoizedTotal.productQuantity}
            </S.CartQuantity>
          </S.CartIcon>
        )}
      </S.CartButton>

      {isOpen && (
        <S.CartContent>
          <S.CartContentHeader>
            <S.CartIcon large>
              <S.CartQuantity>{memoizedTotal.productQuantity}</S.CartQuantity>
            </S.CartIcon>
            <S.HeaderTitle>Cart</S.HeaderTitle>
          </S.CartContentHeader>

          <CartProducts products={products} />

          <S.CartFooter>
            <S.Sub>SUBTOTAL</S.Sub>
            <S.SubPrice>
              <S.SubPriceValue>{`${memoizedTotal.currencyFormat} ${formatPrice(
                memoizedTotal.totalPrice,
                memoizedTotal.currencyId
              )}`}</S.SubPriceValue>
              <S.SubPriceInstallment>
                {memoizedTotal.installments ? (
                  <span>
                    {`OR UP TO ${memoizedTotal.installments} x ${
                      memoizedTotal.currencyFormat
                    } ${formatPrice(
                      memoizedTotal.totalPrice / memoizedTotal.installments,
                      memoizedTotal.currencyId
                    )}`}
                  </span>
                ) : null}
              </S.SubPriceInstallment>
            </S.SubPrice>
            <S.CheckoutButton onClick={handleCheckout} autoFocus>
              Checkout
            </S.CheckoutButton>
          </S.CartFooter>
        </S.CartContent>
      )}
    </S.Container>
  );
};

Cart.propTypes = {};
// Add PropTypes for runtime validation if needed

export default Cart; 