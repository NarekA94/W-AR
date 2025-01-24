import {File, Image} from '~/store/types';
import {Brand, BrandCategory} from '../brand';
import {Category} from '../catalog';

export interface Strain {
  emoji: Nullable<string>;
  id: number;
  name: string;
}

export interface ProductEffect {
  id: number;
  name: string;
  emoji: string;
}

export interface Product {
  id: number;
  amountString: string;
  amount: number;
  animationDuration: number;
  aspectRatio: number;
  brand: Omit<Brand, 'cardImage' | 'logo'>;
  cbd: number;
  gamePoints: number;
  gramWeight: number;
  imageLink: string;
  priceForPoints: number;
  images: Image[];
  ounceWeight: number;
  price: number;
  quantityInStock: number;
  thc: number;
  thcString: string;
  totalCannabinoids: number;
  vendorCode: string;
  visible: boolean;
  wholesalePrice: number;
  name: string;
  type: Category;
  effects: ProductEffect[];
  primaryColor: string;
  strain: Strain;
  modelGlb: File;
  modelUsdz: File;
  description: string;
  labTestLink: Nullable<string>;
  isPromo: boolean;
}

export interface GetProductsResponse {
  products: Product[];
  types: BrandCategory[];
}

export interface GetProductRequest {
  brandId: number;
  tab?: number;
}
