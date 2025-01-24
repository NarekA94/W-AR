export interface UserState {
  isAuth: boolean;
  data: UserData | null;
  error?: unknown;
  needToHideUi: boolean;
}

export interface UserAddresses {
  addressLine1: string;
  addressLine2: string;
  city: string;
  id: number;
  latitudeCoordinate: number;
  longitudeCoordinate: number;
  zipCode: string;
  street: string;
  houseNumber: string;
}

export interface UserRole {
  code: string;
  id: number;
  name: string;
}

export enum UserStatus {
  registered = '0', // User created account
  phone_given = '1', // User saved his phone in our database
  phone_verified = '2', // User confirmed his phone number
  id_provided = '3', // User provided ID card
  terms_accepted = '4', // User accepted T&C
}

interface TerritoryState {
  id: number;
  isDelivery: boolean;
  isPickUp: boolean;
  name: string;
  visible: boolean;
}

export interface UserData {
  addresses: UserAddresses[];
  catalogZipCode: number;
  catalogZipCodeIsValid: boolean;
  email: string;
  enableNotifications: boolean;
  gamePoints: number;
  id: number;
  name: string;
  passportPhotoLink: string;
  phone: string;
  phoneConfirmed: boolean;
  physicianRecPhotoLink: Nullable<string>;
  recentCatalogZipCode: string[];
  role: UserRole;
  roleId: number;
  showDiscountBanner: boolean;
  state: UserStatus;
  storeCredit: number;
  wallet: Nullable<string>;
  territoryState: Nullable<TerritoryState>;
  receiveMarketingSms: boolean;
}
