import {useMemo, useState} from 'react';

export const useIsFocusedInput = (defaultValue?: boolean) => {
  const [isFocused, setIsFocused] = useState<boolean>(defaultValue || false);

  const onFocus = () => {
    setIsFocused(true);
  };

  const onBlur = () => {
    setIsFocused(false);
  };
  return useMemo(
    () => ({
      event: {onFocus, onBlur},
      isFocused,
    }),
    [isFocused],
  );
};
