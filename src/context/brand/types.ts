import {BrandTab} from '~/store/query/brand';
import {OrderType} from '~/store/query/order';

export interface IBrandContext {
  selectedTab: BrandTab | null;
  setSelectedTab: (tab: BrandTab | null) => void;
  selectedCategory?: number | null;
  setSelectedCategory?: (tab: number | null | undefined) => void;
  selectedShippingMethod?: OrderType | null;
  setSelectedShippingMethod?: (type: OrderType | null) => void;
  lastPoints?: number | null;
  setLastPoints?: (points: number | null) => void;
  brandId?: number | null;
  setBrandId?: (brandId: number | null) => void;
  pendingPoints?: number | null;
  setPendingPoints?: (points: number | null) => void;
}
