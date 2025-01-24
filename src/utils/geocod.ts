import axios, {AxiosResponse} from 'axios';
import config from '~/config/services';

interface ILatLng {
  lat: number;
  lng: number;
}
interface PlusCode {
  compound_code: string;
  global_code: string;
}

interface GeocoderResponse {
  plus_code: PlusCode;
  results: {
    address_components: {
      long_name: string;
      short_name: string;
      types: string[];
    }[];
    formatted_address: string;
    geometry: {
      bounds: {
        northeast: ILatLng;
        southwest: ILatLng;
      };
      location: ILatLng;
      location_type: 'APPROXIMATE' | 'ROOFTOP' | string;
      viewport: {
        northeast: ILatLng;
        southwest: ILatLng;
      };
    };
    place_id: string;
    types: string[];
    plus_code: PlusCode;
  }[];
  status: 'OK' | string;
}

export const fetchAddressByPlaceId = async (
  place_id: string,
): Promise<AxiosResponse<GeocoderResponse>> => {
  return axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?key=${config.Google_Places_Key}&place_id=${place_id}`,
  );
};
