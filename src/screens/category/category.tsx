import {Search, Wrapper} from '~/components/blocks';
import {RootHeader} from '~/components/headers';
import React, {FC, useCallback, useState} from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Vibration,
} from 'react-native';
import {CatalogStackParamProps, CatalogStackRoutes} from '~/navigation';
import {ProductListItem, EmptyList} from '~/components';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {setAdjustPan, setAdjustNothing} from 'rn-android-keyboard-adjust';
import {
  CategoryProduct,
  useGetCategoryProductsQuery,
} from '~/store/query/catalog';
import {GLOBAL_STYLES} from '~/theme';
import {
  useGetCartProductsQuery,
  usePutCartProductMutation,
} from '~/store/query/cart';

export const CategoryScreen: FC<
  CatalogStackParamProps<CatalogStackRoutes.CategoryScreen>
> = ({route}) => {
  const [addProductToCart] = usePutCartProductMutation();
  const {data: products} = useGetCartProductsQuery();

  const tabBarHeight = useBottomTabBarHeight();
  const [searchText, setSearchText] = useState<string>();
  const {params} = route;
  const {data: categoryList, isSuccess} = useGetCategoryProductsQuery({
    type: [params.id],
    search: searchText,
  });
  const [flag, setFlag] = useState<number>();

  React.useEffect(() => {
    setAdjustPan();
    return () => {
      setAdjustNothing();
    };
  }, []);

  const addToCart = (id: number) => {
    Vibration.vibrate(10);

    setFlag(id);
    const productQuantityCart = products?.cartDetails.find(
      product => product.product.id === id,
    );
    addProductToCart({
      product: id,
      quantity: (productQuantityCart?.quantity || 0) + 1,
    });

    setTimeout(() => {
      setFlag(undefined);
    }, 1200);
  };

  const RenderOrders = ({item}: FlatListItem<CategoryProduct>) => {
    return (
      <ProductListItem
        isSelected={item.id === flag}
        onPressAdd={() => addToCart(item.id)}
        brandName={item.brand.name}
        strain={item.strain?.name}
        image={item.images?.[0]?.file?.url || ''}
        ounceWeight={item.ounceWeight}
        gramWeight={item.gramWeight}
        price={item.price}
        name={item.name}
        thc={item.thc}
      />
    );
  };

  const onGoBack = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  return (
    <Wrapper withStatusBar>
      <KeyboardAvoidingView style={GLOBAL_STYLES.flex_1} behavior="padding">
        <RootHeader
          onGoBack={onGoBack}
          marginTop={7}
          title={params?.categoryName || ''}
        />
        <Search onChange={setSearchText} />

        <FlatList
          data={categoryList}
          renderItem={RenderOrders}
          contentContainerStyle={{paddingBottom: tabBarHeight + 40}}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={isSuccess ? EmptyList : <></>}
        />
      </KeyboardAvoidingView>
    </Wrapper>
  );
};
