export interface Prediction {
  description: string;
  types: string[];
  place_id: string;
}

export interface AutocompleteResponse {
  predictions: Prediction[];
  status: string;
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}
interface Geometry {
  location: {lat: number; lng: number};
}
export interface PlaceDetails {
  address_components: AddressComponent[];
  adr_address: string;
  formatted_address: string;
  geometry: Geometry;
  name: string;
  utc_offset: 240;
  website: string;
  place_id: string;
  reference: string;
}

export interface DetailsResponse {
  status: string;
  result: PlaceDetails;
}
