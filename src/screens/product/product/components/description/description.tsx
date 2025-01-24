import React, {FC, memo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  AddButton,
  AppText,
  BottomSheet,
  CircularProgress,
  Effects,
  HiddenUIWrapper,
  HR,
} from '~/components';
import {GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import {Dispensaries} from '../dispensaries/dispensaries';
import {LabTest} from '../lab-test/lab-test';
import {Product} from '~/store/query/product';
import {useIntl} from 'react-intl';
import {UserScreenNavigationProp, UserStackRoutes} from '~/navigation';
import {useNavigation} from '@react-navigation/native';
import {ProductTabs} from '~/store/query/brand';
import {useCartForm} from '~/screens/brands/brand/components/products/hooks';
import {DeleteSheet} from '~/screens/brands/brand/components/products/delete-sheet';

interface DescriptionProps {
  product?: Product;
  tab?: ProductTabs;
  isModelLoading?: boolean;
}

const snapPoints = ['65%'];

export const Description: FC<DescriptionProps> = memo(
  ({product, tab, isModelLoading}) => {
    const intl = useIntl();
    const navigation = useNavigation<UserScreenNavigationProp>();
    const {handlePressAddButton, deleteSheetRef, handlePressDeleteCart} =
      useCartForm();

    const handlePressPoints = useCallback(() => {
      if (product?.brand.id && product?.id) {
        navigation.navigate(UserStackRoutes.Dispensaries, {
          brandId: product?.brand.id,
          productId: product?.id,
          hasPoints: true,
        });
      }
    }, [product?.brand.id, product?.id, navigation]);
    const onPressAdd = useCallback(() => {
      if (product?.id && product?.brand?.id) {
        handlePressAddButton(product?.id, product?.brand.id);
      }
    }, [handlePressAddButton, product?.brand.id, product?.id]);

    return (
      <>
        <View style={styles.root}>
          <View style={GLOBAL_STYLES.row_between}>
            <View style={styles.productName}>
              <View style={styles.name}>
                <AppText style={styles.title} variant={TextVariant.H3_A}>
                  {product?.name}
                </AppText>
                {!!product?.amount && (
                  <AppText style={styles.grams} variant={TextVariant.P_M}>
                    {product?.amountString}
                  </AppText>
                )}
                {!!product?.gramWeight && (
                  <AppText style={styles.grams} variant={TextVariant.P_M}>
                    {intl.formatMessage(
                      {
                        id: 'phrases.weight',
                        defaultMessage: '{gramWeight} G / {ounceWeight} oz',
                      },
                      {
                        gramWeight: product?.gramWeight,
                        ounceWeight: product?.ounceWeight,
                      },
                    )}
                  </AppText>
                )}
              </View>
              <HiddenUIWrapper>
                <View style={styles.sectionThc}>
                  <AppText
                    style={styles.thc}
                    variant={TextVariant.M_R}
                    color={TextColors.A045}>
                    {intl.formatMessage({
                      id: 'thc',
                      defaultMessage: 'THC',
                    })}
                  </AppText>
                  <AppText variant={TextVariant.M_R} color={TextColors.A100}>
                    {product?.thcString}
                  </AppText>
                  {product?.strain && (
                    <>
                      <AppText
                        style={styles.horizontal_12}
                        variant={TextVariant.M_R}
                        color={TextColors.A045}>
                        |
                      </AppText>
                      <AppText
                        variant={TextVariant.M_R}
                        color={TextColors.A100}>
                        {product?.strain?.name}
                      </AppText>
                    </>
                  )}
                </View>
                <AppText
                  style={styles.disclaimer}
                  variant={TextVariant['10_4A']}
                  color={TextColors.A045}>
                  {intl.formatMessage({
                    id: 'thc-disclaimer',
                    defaultMessage: '(THC percentage may vary)',
                  })}
                </AppText>
              </HiddenUIWrapper>
            </View>
            <HiddenUIWrapper>
              {product && !!tab && (
                <AddButton onPress={onPressAdd} price={product?.price} />
              )}
              {product && product?.isPromo && (
                <CircularProgress
                  showFooter
                  onPress={handlePressPoints}
                  max={product?.priceForPoints}
                  percentage={product?.brand.points}
                  isModelLoading={isModelLoading}
                />
              )}
            </HiddenUIWrapper>
          </View>
          <HR />
          <HiddenUIWrapper>
            <View style={styles.cbd}>
              <AppText
                style={styles.cannabinoids}
                variant={TextVariant.S_R}
                color={TextColors.A100}>
                {intl.formatMessage(
                  {
                    id: 'product.cannabinoids',
                    defaultMessage: 'Cannabinoids {totalCannabinoids}%',
                  },
                  {totalCannabinoids: product?.totalCannabinoids},
                )}
              </AppText>
              <AppText variant={TextVariant.S_R} color={TextColors.A100}>
                {intl.formatMessage(
                  {
                    id: 'product.cbd',
                    defaultMessage: 'CBD {cbd}%',
                  },
                  {cbd: product?.cbd},
                )}
              </AppText>
            </View>
          </HiddenUIWrapper>
          {product?.effects && product.effects.length > 0 && (
            <Effects effects={product.effects} />
          )}
          {product?.priceForPoints === null && (
            <Dispensaries
              disabled={isModelLoading}
              productId={product?.id}
              brandId={product?.brand.id}
            />
          )}

          <AppText
            style={styles.desciption}
            variant={TextVariant.H_6_W5}
            color={TextColors.A045}>
            {intl.formatMessage({
              id: 'titles.description',
              defaultMessage: 'Description',
            })}
          </AppText>
          <AppText
            style={styles.info}
            color={TextColors.G090}
            variant={TextVariant.S_L}>
            {product?.description}
          </AppText>
          {!!product?.labTestLink && (
            <LabTest labTestUrl={product.labTestLink} />
          )}
        </View>
        <BottomSheet ref={deleteSheetRef} snapPoints={snapPoints}>
          <DeleteSheet
            onPressDelete={handlePressDeleteCart}
            close={deleteSheetRef.current?.close}
          />
        </BottomSheet>
      </>
    );
  },
);

const styles = StyleSheet.create({
  root: {
    ...GLOBAL_STYLES.horizontal_20,
    paddingBottom: vp(30),
  },
  title: {
    marginBottom: vp(12),
  },
  cannabinoids: {
    marginRight: vp(29),
  },
  pointsBox: {
    alignItems: 'flex-end',
  },
  info: {
    marginBottom: vp(24),
    lineHeight: 17,
  },
  desciption: {
    marginBottom: vp(16),
  },
  cbd: {
    flexDirection: 'row',
    marginVertical: vp(19),
  },
  thc: {
    marginRight: vp(8),
  },
  horizontal_12: {
    marginHorizontal: vp(12),
  },
  sectionThc: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  point: {
    fontSize: 42,
    marginRight: 3,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  points: {
    flexDirection: 'row',
    top: 7,
  },
  pointsToRedeem: {
    flexShrink: 1,
    marginTop: vp(10),
  },
  productName: {
    width: '90%',
    flexShrink: 1,
    height: '100%',
  },
  grams: {
    marginBottom: vp(12),
  },

  disclaimer: {
    marginTop: vp(8),
  },
  name: {flex: 1, justifyContent: 'center'},
});
