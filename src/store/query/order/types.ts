import {CartProduct, Discount} from '../cart';

export enum OrderType {
  delivery = 0,
  pickup = 1,
}

export interface CartOrderProduct extends CartProduct {
  id: number;
  isGiftedProduct: boolean;
  orderId: number;
  productId: number;
}

export interface CreateDeliveryOrderRequest {
  name: string;
  city: string;
  addressLine1: string;
  zipCode: string;
  latitudeCoordinate: number;
  longitudeCoordinate: number;
  type: OrderType;
}

export interface CreateDeliveryOrderResponse {
  id: number;
  name: string;
  number: string;
  phone: string;
  city: string;
  addressLine1: string;
  addressLine2: string;
  zipCode: string;
  userId: number;
  sum: number;
  deliverySum: number;
  totalSum: number;
  exciseTaxSum: number;
  salesTaxSum: number;
  cityTaxSum: number;
  profitSum: number;
  taxSum: number;
  state: number;
  detailCount: number;
  latitudeCoordinate: number;
  license: string;
  longitudeCoordinate: number;
  comment: string;
  gramWeight: number;
  discount: Nullable<Discount>;
  orderDetails: CartOrderProduct[];
}

export interface ConfirmOrderRequest {
  id: number;
}
