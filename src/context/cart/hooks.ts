import {useContext} from 'react';
import {CartContext} from './cart-context';

export const useCartCtx = () => {
  const brandCtx = useContext(CartContext);
  return brandCtx;
};
