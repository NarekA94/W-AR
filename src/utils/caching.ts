import RNFS from 'react-native-fs';
import {logger} from './logger';

/**
 * Downloads a file from the given URL and saves it to the cache directory.
 * @param url The URL of the file to be downloaded.
 * @returns The URI of the saved file in the cache directory if successful, otherwise undefined.
 */
export async function downloadAndSaveFileToCache(
  url?: string,
): Promise<string | undefined> {
  if (!url) {
    return undefined;
  }
  // Extract the file name from the URL
  const name = url.split('/').pop();
  // Create the destination URI in the cache directory
  const toUri = `file://${RNFS.DocumentDirectoryPath}/${name}`;
  try {
    // Check if the file already exists in the cache directory
    const exists = await RNFS.exists(toUri);
    // If the file already exists, return the URI
    if (exists) {
      return toUri;
    }
    // Download the file and wait for the download to finish
    const result = await RNFS.downloadFile({
      fromUrl: url,
      toFile: toUri,
    }).promise;
    // Check the status code to determine if the download was successful
    if (result.statusCode === 200) {
      return toUri; // File was successfully saved to cache, so return the URI
    } else {
      // If the status code is not 200, throw an error
      return undefined;
    }
  } catch (error) {
    // If there is an error during the download or saving process, log a warning
    logger.warn(error);
    return undefined;
  }
}
