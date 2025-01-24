import {logger} from './logger';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
Geolocation.setRNConfiguration({skipPermissionRequests: true});

export const distanceBetweenCoordinates = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371000; // radius of the earth in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d || 0;
};

// meters to miles
export const metersToMiles = (meters: number) => meters * 0.000621371;

export const distanceBetweenCoordinatesByMiles = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  return metersToMiles(distanceBetweenCoordinates(lat1, lon1, lat2, lon2));
};

// get user current location
export const getUserCurrentLocation =
  async (): Promise<GeolocationResponse> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          resolve(position);
        },
        error => {
          reject(error);
        },
      );
    });
  };

export const getDistanceBetweenUserAndLocation = async (
  lat: number,
  lon: number,
) => {
  try {
    const userCurrentLocation = await getUserCurrentLocation();
    const distance = distanceBetweenCoordinatesByMiles(
      userCurrentLocation.coords.latitude,
      userCurrentLocation.coords.longitude,
      lat,
      lon,
    );
    return distance;
  } catch (error) {
    throw error;
  }
};

export const checkUserLocationByState = async () => {
  try {
    // Get the user's current latitude and longitude
    const {
      coords: {latitude, longitude},
    } = await getUserCurrentLocation(); // Assuming this function returns the user's location

    // Define California's geographical boundaries
    const californiaBoundaries = {
      minLatitude: 32.5341,
      maxLatitude: 35.8099,
      minLongitude: -124.482,
      maxLongitude: -114.1315,
    };

    // Check if the user's location is within California
    if (
      latitude >= californiaBoundaries.minLatitude &&
      latitude <= californiaBoundaries.maxLatitude &&
      longitude >= californiaBoundaries.minLongitude &&
      longitude <= californiaBoundaries.maxLongitude
    ) {
      return true; // User is in California
    } else {
      return false; // User is not in California
    }
  } catch (error) {
    // Handle errors and log them
    logger.warn(error); // Assuming this logs warnings using your logger utility
    return false; // Unable to determine user's location, assume not in California
  }
};
