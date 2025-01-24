import {useCallback, useMemo, useRef} from 'react';
import {BottomSheetRef} from '~/components';
import {useGetSelectedBrandTab} from '~/context/brand/hooks';
import {
  useIncrementCartProductMutation,
  useGetCartCountQuery,
  useDeleteCartMutation,
} from '~/store/query/v2-cart';
import {triggerHapticFeedback} from '~/plugins/hapticFeedback';

export const useCartForm = () => {
  const [incrementProduct] = useIncrementCartProductMutation();
  const [deleteCart] = useDeleteCartMutation();
  const savedProductId = useRef<{id: number} | null>(null);
  const {data: productCartCount} = useGetCartCountQuery();
  const {selectedTab} = useGetSelectedBrandTab();
  const deleteSheetRef = useRef<BottomSheetRef>(null);

  const addProductToCart = useCallback(
    (id: number) => {
      if (selectedTab?.tab === undefined) {
        return;
      }
      incrementProduct({
        product: id,
        tab: selectedTab?.tab,
      });
    },
    [incrementProduct, selectedTab?.tab],
  );

  const handlePressAddButton = useCallback(
    async (id: number, brandId: number) => {
      triggerHapticFeedback();
      if (!brandId) {
        addProductToCart(id);
        return;
      }
      if (
        brandId !== productCartCount?.brandId &&
        productCartCount?.count !== 0
      ) {
        deleteSheetRef.current?.open();
        savedProductId.current = {id};
        return;
      }
      if (
        brandId !== productCartCount?.brandId &&
        productCartCount?.count === 0
      ) {
        await deleteCart().unwrap();
      }
      addProductToCart(id);
    },
    [
      addProductToCart,
      productCartCount?.brandId,
      deleteCart,
      productCartCount?.count,
    ],
  );

  const handlePressDeleteCart = useCallback(async () => {
    if (savedProductId.current?.id) {
      await deleteCart().unwrap();
      addProductToCart(savedProductId.current?.id);
      deleteSheetRef.current?.close();
    }
  }, [deleteCart, addProductToCart]);

  return useMemo(
    () => ({
      handlePressAddButton,
      deleteSheetRef,
      addProductToCart,
      handlePressDeleteCart,
    }),
    [
      handlePressAddButton,
      deleteSheetRef,
      addProductToCart,
      handlePressDeleteCart,
    ],
  );
};
