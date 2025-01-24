import type {Image} from '~/store/types';

export interface CheckQrCodeReq {
  uniqueString: string;
}

interface Model {
  id: number;
  key: string;
  url: string;
}

interface Brand {
  gradientEndColorHex: string;
  gradientStartColorHex: string;
  id: number;
  inStashBox: boolean;
  name: string;
  productsAmount: number;
  visible: boolean;
  description: number;
}

interface CoaStatusDocument extends Model {}

interface ModelGlb extends Model {}

interface ModelUsdz extends Model {}

export interface CheckQrCodeRes {
  id: number;
  animationDuration: number;
  aspectRatio: number;
  brandPoints: number;
  cbd: number;
  description: number;
  gamePoints: number;
  gramWeight: number;
  isNft: boolean;
  isOnboarded: boolean;
  isPromo: boolean;
  labTestLink: Nullable<string>;
  name: string;
  ounceWeight: number;
  price: number;
  primaryColor: string;
  thc: number;
  totalCannabinoids: number;
  vendorCode: string;
  visible: boolean;
  brand: Brand;
  coaStatusDocument: Nullable<CoaStatusDocument>;
  modelGlb: ModelGlb;
  modelUsdz: ModelUsdz;
  images: Image[];
  used: boolean;
}

export interface QrCodeRedeemReq {
  uniqueString: string;
}
export interface QrCodeRedeemRes {}
