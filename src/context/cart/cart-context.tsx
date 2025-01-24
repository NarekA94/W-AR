import React, {createContext, FC, PropsWithChildren} from 'react';
import {useSharedValue, SharedValue} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {HEIGHT} from '~/constants/layout';

interface ICartContext {
  positionY: SharedValue<number>;
  contextY: SharedValue<number>;
}

export const CartContext = createContext<ICartContext>({
  positionY: {value: 0},
  contextY: {value: 0},
});

export const CartContextProvider: FC<PropsWithChildren<{}>> = ({children}) => {
  const {bottom} = useSafeAreaInsets();

  const positionY = useSharedValue(HEIGHT - vp(100) - bottom);
  const contextY = useSharedValue(0);

  return (
    <CartContext.Provider
      value={{
        positionY,
        contextY,
      }}>
      {children}
    </CartContext.Provider>
  );
};
