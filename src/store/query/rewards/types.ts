import {File} from '~/store/types';
import {Brand, Dispensary, ProductTabs} from '../brand';
import {Product} from '../product';
import {UserData} from '~/store/reducers';

export interface Details {
  id: number;
  quantity: number;
  isGiftedProduct: boolean;
  product: Product;
}

export interface RewardTypeInfo {
  icon: File;
  timeTypeText: string;
  typeText: string;
}

export enum RewardState {
  ORDER_RECEIVED,
  PRODUCT_ON_THE_WAY,
  READY_FOR_PICKUP,
  COMPLETED,
  CANCELED,
}

export interface Reward {
  sumBrandPoints: number;
  state: RewardState;
  number: string;
  id: number;
  qrCode: File;
  dispensary: Dispensary;
  details: Details[];
  brand: Brand;
  isCollectibles: boolean;
  deliveryAddress: string;
  sumDollar: number;
  waitingTime: string;
  productSumDollar: number;
  infoText: string;
  createdDate: string;
  createdAt: string;
  type: OrderCollectibleType;
  timeType: number;
  tab: ProductTabs;
  deliveryFee: number;
  stateStyle: {
    textColor: string;
    background: string;
  };
  stateName: string;
  typeInfo: RewardTypeInfo;
}

export interface Gift {
  id: number;
  product: Product;
  user: UserData;
}

export interface RewardsTabInfo {
  tabName: string;
  statuses: number[];
}

export interface RewardsSection {
  title: string;
  data: Reward;
}

export interface RewardsTab {
  tabInfo: RewardsTabInfo;
  orders: RewardsSection;
}

export type GetRewardsResponse = RewardsTab[];

export type GetRewardsResponseKeys = keyof GetRewardsResponse;

interface ProductDetails {
  product: number;
  quantity: number;
}

interface GiftDetails {
  gift: number;
}

export interface SetRewardsRequest {
  dispensary: number;
  productDetails: ProductDetails[];
  giftDetails?: GiftDetails[];
}

export interface GetRewardsCountRes {
  count: number;
}

export enum OrderCollectibleType {
  DELIVERY = 0,
  PICK_UP = 1,
}

export interface SetCollectibleRewardRequest {
  dispensary?: number;
  street?: string;
  houseNumber?: string;
  city?: string;
  zipCode?: string;
  type?: OrderCollectibleType;
  productId?: number;
  addressId?: number;
  addressLine1?: string;
}

export interface CartOrderInfoRequest
  extends Omit<SetCollectibleRewardRequest, 'productId'> {
  tab: ProductTabs;
}

export interface CartOrderInfoItem {
  quantity: number;
  product: Product;
}

export interface CartOrderInfoRes {
  deliveryAddress: Nullable<string>;
  details: CartOrderInfoItem[];
  dispensary: Dispensary;
  infoText: string;
  totalCashFee: number;
  productSumDollar: number;
  typeInfo: RewardTypeInfo;
  deliveryFee: number;
  waitingTime?: string;
}

export interface SetOrderFromCartRes {
  text: string;
  title: string;
}

export interface CartOrderReview {
  valid: boolean;
  message: Nullable<string>;
}
