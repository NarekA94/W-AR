import Cure from '~/assets/images/catalog/cure.png';
import Crown from '~/assets/images/catalog/crown.png';

export interface MockBrands {
  points: number;
  source: any;
}

export const brandsMock: MockBrands[] = [
  {points: 246, source: Cure},
  {points: 57, source: Crown},
];
