import React, {FC, memo, useCallback, useMemo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {FontWeight, GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import {AppText, CircularProgress, HiddenUIWrapper} from '..';
import {useIntl} from 'react-intl';
import {AddButton} from './add-button';
import Image from 'react-native-fast-image';
interface ProductItemProps {
  uri: string;
  onPressProduct?: (id: number, productColor: string) => void;
  primaryColor: string;
  name: string;
  thcString: string;
  points: number;
  priceForPoints: number;
  id: number;
  brandId: number;
  onPressPoints?: (points: {productId: number}) => void;
  gramWeight: number;
  ounceWeight: number;
  isRedeemable?: boolean;
  price?: number;
  onPressAddButton?: (id: number, brandId: number) => void;
  amountString: string;
  amount: number;
}
const boxHeight = vp(325);
export const ProductBoxWidth = vp(293);

export const ProductItem: FC<ProductItemProps> = memo(
  ({
    uri,
    onPressProduct,
    onPressAddButton,
    primaryColor,
    id: productId,
    onPressPoints,
    brandId,
    ...props
  }) => {
    const intl = useIntl();

    const handlePressProduct = useCallback(() => {
      onPressProduct?.(productId, primaryColor);
    }, [onPressProduct, productId, primaryColor]);

    const handlePressPoints = useCallback(() => {
      onPressPoints?.({
        productId: productId,
      });
    }, [productId, onPressPoints]);

    const gradientColors = useMemo(() => {
      return [primaryColor, 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.8)'];
    }, [primaryColor]);

    const handlePressAddButton = useCallback(() => {
      onPressAddButton?.(productId, brandId);
    }, [onPressAddButton, productId, brandId]);

    return (
      <TouchableOpacity onPress={handlePressProduct}>
        <View style={styles.root} />
        <LinearGradient colors={gradientColors} style={styles.gradient}>
          <Image resizeMode="contain" style={styles.image} source={{uri}} />
          <View style={styles.infoSection}>
            <View style={GLOBAL_STYLES.row_between}>
              <View style={GLOBAL_STYLES.flexShrink_1}>
                <AppText
                  style={styles.name}
                  variant={TextVariant.H4_B}
                  color={TextColors.A100}
                  fontWeight={FontWeight.W400}>
                  {props.name}
                </AppText>
                {!!props.amount && (
                  <AppText style={styles.grams} variant={TextVariant.P_M}>
                    {props.amountString}
                  </AppText>
                )}
                {!!props.gramWeight && (
                  <AppText style={styles.grams} variant={TextVariant.P_M}>
                    {intl.formatMessage(
                      {
                        id: 'phrases.weight',
                        defaultMessage: '{gramWeight} G / {ounceWeight} oz',
                      },
                      {
                        gramWeight: props?.gramWeight,
                        ounceWeight: props?.ounceWeight,
                      },
                    )}
                  </AppText>
                )}
                <HiddenUIWrapper>
                  <View style={styles.sectionThc}>
                    <AppText
                      style={styles.thc}
                      variant={TextVariant.S_R}
                      color={TextColors.A045}>
                      {intl.formatMessage({
                        id: 'thc',
                        defaultMessage: 'THC',
                      })}
                    </AppText>
                    <AppText variant={TextVariant.S_R} color={TextColors.A100}>
                      {props.thcString}
                    </AppText>
                  </View>
                </HiddenUIWrapper>
              </View>
              <HiddenUIWrapper>
                {!props.isRedeemable ? (
                  <AddButton
                    onPress={handlePressAddButton}
                    price={props.price}
                  />
                ) : (
                  props.priceForPoints !== null && (
                    <CircularProgress
                      onPress={handlePressPoints}
                      max={props.priceForPoints}
                      percentage={props.points}
                    />
                  )
                )}
              </HiddenUIWrapper>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  thc: {
    marginRight: vp(8),
  },
  point: {
    fontSize: 34,
    top: 2,
    marginRight: 3,
  },
  horizontal_10: {
    marginHorizontal: vp(10),
  },
  sectionThc: {
    marginTop: vp(14),
    flexDirection: 'row',
    alignItems: 'center',
  },
  root: {
    width: ProductBoxWidth,
    height: boxHeight,
    borderWidth: 1,
    borderColor: 'rgba(102, 102, 102, 0.7)',
    borderRadius: 25,
    marginRight: vp(20),
    backgroundColor: 'black',
  },
  gradient: {
    width: ProductBoxWidth,
    height: boxHeight,
    position: 'absolute',
    borderRadius: 25,
    paddingTop: vp(11),
    flex: 1,
  },
  image: {
    width: vp(213),
    height: vp(165),
    alignSelf: 'center',
    marginTop: vp(5),
  },
  name: {
    flexShrink: 1,
  },
  infoSection: {
    paddingHorizontal: vp(16),
    flex: 1,
    justifyContent: 'center',
  },
  pointsToRedeem: {
    flexShrink: 1,
    marginTop: vp(14),
  },
  productInfo: {
    borderWidth: 1,
  },
  grams: {
    marginTop: vp(15),
  },
});
