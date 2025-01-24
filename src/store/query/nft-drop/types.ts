import {File} from '~/store/types';
import {Product} from '../product';

export interface Perk {
  active: boolean;
  description: string;
  description_es: string;
  id: number;
  image: File;
  name: string;
  overdue: boolean;
  visible: boolean;
}

export interface NFTDrop {
  id: number;
  name: string;
  isPublic: boolean;
  shortDescription: string;
  shortDescription_es: string;
  description: string;
  description_es: string;
  artist: string;
  brand: string;
  product: Product;
  perks: Nullable<Perk[]>;
  nftModel: File;
  cube: File;
  nftPreview: File;
}

export interface GetDispensariesWithDistanceRequest {
  productId: number;
  latitudeCoordinate?: number;
  longitudeCoordinate?: number;
}
