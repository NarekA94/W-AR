import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useState} from 'react';

export const useModelLoading = () => {
  const [isModelLoading, setIsModelLoading] = useState<boolean>(true);

  const onLoadEnd = useCallback(() => {
    setTimeout(() => {
      setIsModelLoading(false);
    }, 200);
  }, [setIsModelLoading]);

  useFocusEffect(
    useCallback(() => {
      setIsModelLoading(true);
    }, []),
  );

  return {
    isModelLoading,
    onLoadEnd,
  };
};
