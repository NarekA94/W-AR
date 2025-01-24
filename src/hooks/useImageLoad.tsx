import {useState} from 'react';

export const useImageLoad = (isLoading?: boolean) => {
  const [isImageLoading, setIsImageLoading] = useState(isLoading);

  const onImageLoadStart = () => {
    setIsImageLoading(true);
  };

  const onImageLoadEnd = () => {
    setIsImageLoading(false);
  };

  return {
    isImageLoading,
    onImageLoadStart,
    onImageLoadEnd,
  };
};
