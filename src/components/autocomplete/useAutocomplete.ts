import axios from 'axios';
import {useCallback, useState} from 'react';
import config from '~/config/services';
import {logger} from '~/utils';
import {AutocompleteResponse, DetailsResponse, Prediction} from './types';
import {useGetAuthUser} from '~/hooks/useGetAuthUser';

const autocompleteUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${config.Google_Places_Key}&language=en&components=country:us`;
const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?key=${config.Google_Places_Key}&language=en`;

export const useAutocomplete = () => {
  const [address, setAddress] = useState<string>();
  const [data, setData] = useState<Prediction[]>();
  const {authUser} = useGetAuthUser();

  const handleChangeAddress = useCallback((inputText: string) => {
    setAddress(inputText);
    requestAddress(inputText);
  }, []);

  const requestAddress = useCallback((inputText: string) => {
    const state = inputText ? authUser?.territoryState?.name || '' : '';
    axios
      .get<AutocompleteResponse>(
        autocompleteUrl + `&input=${state} ${inputText}`,
      )
      .then(res => {
        setData(res.data.predictions);
      })
      .catch(e => {
        logger.warn(e);
      });
  }, []);

  const requestDetails = useCallback((placeId: string) => {
    return axios.get<DetailsResponse>(detailsUrl + `&placeid=${placeId}`);
  }, []);

  return {
    address,
    handleChangeAddress,
    data,
    requestDetails,
    setAddress,
  };
};
