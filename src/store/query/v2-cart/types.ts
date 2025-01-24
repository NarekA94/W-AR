import {File} from '~/store/types';
import {ProductTabs} from '../brand';
import {OrderType} from '../order';
import {Product} from '../product';

export interface SetCartRequest {
  product: number;
  quantity: number;
  tab: ProductTabs;
}

export interface GetCartCountResponse {
  count: number;
  brandId: number;
}

export interface CartTabInfo {
  name: string;
  tab: ProductTabs;
  icon: File;
}

export interface IncrementCartProduct {
  product: number;
  tab: number;
}

export interface CartItemDetail {
  id: number;
  quantity: number;
  tab: ProductTabs;
  totalCashSum: number;
  totalPointsSum: number;
  product: Product;
}

export interface CartEntity {
  brandId: number;
  cashFee: number;
  deliveryFee: number;
  isFreeDelivery: boolean;
  notification: Nullable<string>;
  pointsFee: number;
  priceCorresponds: boolean;
  totalCashFee: number;
  tabInfo: CartTabInfo;
  details: CartItemDetail[];
  showReceiptTypeButtons: boolean;
  currentReceiptType: OrderType;
  availableTypesOfReceipt: OrderType[];
}

export interface PutReceiptTypeRequest {
  tab: ProductTabs;
  type: OrderType;
}
