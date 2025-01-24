import {useCallback, useState} from 'react';

export const useDetectScrollEnabled = () => {
  const [scrollEnabled, setScrollEnabled] = useState<boolean>(true);

  const handlePressIn = useCallback(() => {
    setScrollEnabled(false);
  }, []);

  const handlePressOut = useCallback(() => {
    setScrollEnabled(true);
  }, []);

  const handlePressOutside = useCallback(() => {
    setScrollEnabled(true);
  }, []);

  return {scrollEnabled, handlePressIn, handlePressOut, handlePressOutside};
};
