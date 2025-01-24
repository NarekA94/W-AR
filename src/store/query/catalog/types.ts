export interface Category {
  id: number;
  name: string;
  emoji: string;
  productCount: number;
  productsWithModel: number;
  rewardAvailable: number;
}

export interface Brand {
  id: number;
  description: string;
  imageLink: string;
  inStashBox: boolean;
  name: string;
}

export interface File {
  id: number;
  key: string;
  url: string;
}

export interface Image {
  file: File;
}

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

export interface CategoryProduct {
  id: number;
  animationDuration: number;
  aspectRatio: number;
  brand: Brand;
  cbd: number;
  gamePoints: number;
  gramWeight: number;
  imageLink: string;
  images: Image[];
  ounceWeight: number;
  price: number;
  quantityInStock: number;
  thc: number;
  totalCannabinoids: number;
  vendorCode: string;
  visible: boolean;
  wholesalePrice: number;
  strain: Strain;
  name: string;
  type: Category;
  effects: ProductEffect[];
}
