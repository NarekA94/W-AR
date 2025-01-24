import React, {FC, useCallback, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {
  AppText,
  DefaultHeader,
  Element3D,
  GradientWrapper,
  HiddenUIWrapper,
  HR,
  THCBox,
} from '~/components';
import {
  ShippingVariant,
  UserStackParamProps,
  UserStackRoutes,
} from '~/navigation';
import {GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import {DropInfo, PriceBox, SocailMedia} from './components';
import {useGetNftDropQuery} from '~/store/query/nft-drop';
import {useFocusEffect} from '@react-navigation/native';
import {useDetectScrollEnabled} from '~/hooks/useDetectScrollEnabled';

const gradientWrapperColors = [
  'rgba(49, 49, 49, 0.93)',
  'rgba(49, 49, 49, 0.63)',
  'rgba(0, 0, 0, 1)',
];
const gradientWrapperLocations = [0, 0.4, 1];

export const CollectibleScreen: FC<
  UserStackParamProps<UserStackRoutes.CollectibleScreen>
> = ({route, navigation}) => {
  const {params} = route;
  const [isModelLoading, setIsModelLoading] = useState<boolean>(true);
  const {data} = useGetNftDropQuery({id: params.id});

  const {scrollEnabled, ...pressHandlers} = useDetectScrollEnabled();

  const handlePressBuy = useCallback(() => {
    if (data?.product) {
      let variant: ShippingVariant = ShippingVariant.Both;
      if (data.product.brand.isDelivery) {
        variant = ShippingVariant.Address;
      }
      if (data.product.brand.isPickUp) {
        variant = ShippingVariant.Dispensary;
      }
      if (data.product.brand.isDelivery && data.product.brand.isPickUp) {
        variant = ShippingVariant.Both;
      }
      navigation.navigate(UserStackRoutes.CollectiblesShippingMethod, {
        productId: data?.product.id,
        dropId: data.id,
        type: 'collectible',
        variant: variant,
      });
    }
  }, [data, navigation]);

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
  return (
    <GradientWrapper
      colors={gradientWrapperColors}
      locations={gradientWrapperLocations}>
      <DefaultHeader
        headerMarginBottom={0}
        paddingHorizontal={20}
        withSafeZone
        disabled={isModelLoading}
        styles={isModelLoading && styles.transparentHeader}
      />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
        contentContainerStyle={styles.contentContainerStyle}>
        <Element3D
          height={vp(350)}
          onLoadEnd={onLoadEnd}
          modelUri={data?.product.modelGlb.url}
          {...(!isModelLoading ? pressHandlers : {})}
        />

        <View style={GLOBAL_STYLES.horizontal_20}>
          <AppText
            style={styles.company}
            color={TextColors.G090}
            variant={TextVariant.H5_M}>
            {data?.brand}
          </AppText>
          <AppText withGradient variant={TextVariant.H3_A}>
            {data?.name}
          </AppText>
          <AppText style={styles.weight} variant={TextVariant.P_M}>
            {data?.product?.gramWeight} G / {data?.product?.ounceWeight} oz
          </AppText>
          <THCBox
            strain={data?.product?.strain?.name}
            thc={data?.product?.thc}
          />
          <HR />
          <AppText
            style={styles.collection}
            variant={TextVariant.M_R}
            color={TextColors.A100}>
            {data?.shortDescription}
          </AppText>
          <HiddenUIWrapper>
            <PriceBox onPressBuy={handlePressBuy} price={data?.product.price} />
          </HiddenUIWrapper>
          <DropInfo perks={data?.perks} description={data?.description} />
          <SocailMedia artist={data?.artist} />
        </View>
      </ScrollView>
    </GradientWrapper>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingBottom: vp(50),
    paddingTop: vp(20),
  },
  company: {
    marginBottom: vp(17),
    marginTop: vp(8),
  },
  collection: {
    marginTop: vp(22),
    marginBottom: vp(20),
  },
  weight: {
    marginVertical: vp(12),
  },
  transparentHeader: {
    zIndex: -9,
    opacity: 0,
  },
});
