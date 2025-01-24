import {CategoryProduct} from '../catalog/types';

export interface Product extends CategoryProduct {}
export interface CartProduct {
  product: Product;
  quantity: number;
}

export enum DiscountType {
  'promoCode',
  'firstOrder',
  'perkCoupon',
}
export interface Discount {
  measure: number;
  type: DiscountType;
  value: number;
}
export interface GetCartProductsResponse {
  cartDetails: CartProduct[];
  deliverySum: number;
  discount: Nullable<Discount>;
  minOrderSum: number;
  priceCorresponds: boolean;
  productsSum: number;
  sum: number;
  totalSum: number;
  totalWeight: number;
  userCash: number;
  giftProducts: unknown[];
}

export interface PutCartProductRequest {
  product: number;
  quantity: number;
  userCash?: number;
  promoCode?: string;
}
