import {File} from '~/store/types';
import {Category} from '../catalog';

export interface SettingForOrder {
  deliveryFee: number;
  deliveryType: number;
  freeDelivery: number;
  id: number;
  minOrder: number;
}

export enum ProductTabs {
  FULL_CATALOG = 0,
  SCHEDULED_IN_STORE_PICK_UP = 1,
  SAME_DAY_IN_STORE_PICK_UP = 2,
  SCHEDULED_DELIVERY = 3,
  SAME_DAY_DELIVERY = 4,
  SAME_DAY = 5,
  SCHEDULED = 6,
}

export const ProductTabName = {
  [ProductTabs.FULL_CATALOG]: 'Full catalog',
  [ProductTabs.SCHEDULED_IN_STORE_PICK_UP]: 'Scheduled pick up',
  [ProductTabs.SAME_DAY_IN_STORE_PICK_UP]: 'Same-day pick up',
  [ProductTabs.SCHEDULED_DELIVERY]: 'Scheduled delivery',
  [ProductTabs.SAME_DAY_DELIVERY]: 'Same-day delivery',
  [ProductTabs.SAME_DAY]: 'Same-day',
  [ProductTabs.SCHEDULED]: 'Scheduled',
};
export interface BrandTab {
  description: string;
  name: string;
  needZipCode: boolean;
  shortDescription: string;
  tab: ProductTabs;
  title: string;
}

export interface Brand {
  id: number;
  name: string;
  visible: boolean;
  description: string;
  points: number;
  gradientStartColorHex: string;
  gradientEndColorHex: string;
  inStashBox: boolean;
  productsAmount: number;
  logo: File;
  cardImage: File;
  rewardAvailable: number;
  isDelivery: boolean;
  isPickUp: boolean;
  tabs: BrandTab[];
  settingForOrder: SettingForOrder;
}

export interface BrandCategory extends Category {
  image: File;
}

export type CalendarDays =
  | 'sun'
  | 'mon'
  | 'tue'
  | 'wed'
  | 'thu'
  | 'fri'
  | 'sat';

export interface WorkTime {
  from: string;
  to: string;
  work: boolean;
}

export type WorkDays = Record<CalendarDays, WorkTime>;

export interface DispensaryTabInfo {
  icon: File;
  name: string;
}
export interface Dispensary {
  id: number;
  name: string;
  visible: boolean;
  zipCode: string;
  zipCodes: string[];
  address: string;
  phone: string;
  webSite: string;
  assignedProducts: number;
  workTime: WorkDays;
  latitudeCoordinate: number;
  longitudeCoordinate: number;
  isThirdParty: boolean;
  isFavourite: boolean;
  distance: Nullable<string>;
  tabInfo?: DispensaryTabInfo;
}

export interface DispensaryWithDistanceRequest {
  brandId: number;
  latitudeCoordinate?: number;
  longitudeCoordinate?: number;
  search?: string;
  tab?: ProductTabs;
}
