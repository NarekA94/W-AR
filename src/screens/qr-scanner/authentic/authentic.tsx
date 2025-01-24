import React, {FC, useCallback, useMemo} from 'react';
import {
  AppText,
  Button,
  ButtonImageBackground,
  Element3D,
  GradientWrapper,
  Points,
  THCBox,
} from '~/components';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AuthenticProduct} from './components/authentic-product';
import {Linking, StyleSheet, View} from 'react-native';
import {ButtonVariant, GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import {WIDTH} from '~/constants/layout';
import {useCheckQrCodeMutation} from '~/store/query/qrcode';
import {useIntl} from 'react-intl';
import {UserStackParamProps, UserStackRoutes} from '~/navigation';
import {useModelLoading} from '~/hooks/useModelLoading';

const gradientWrapperLocations = [0, 1];
const gradientEndColor = 'rgba(0, 0, 0, 1)';

export const AuthenticScreen: FC<
  UserStackParamProps<UserStackRoutes.Authentic>
> = ({route, navigation}) => {
  const {params} = route;
  const {isModelLoading, onLoadEnd} = useModelLoading();
  const [, {data}] = useCheckQrCodeMutation({
    fixedCacheKey: 'authentic_product',
  });
  const intl = useIntl();

  const backgroundGradient = useMemo(() => {
    return [data?.primaryColor || gradientEndColor, gradientEndColor];
  }, [data?.primaryColor]);

  const handlePressCoa = useCallback(() => {
    if (data?.coaStatusDocument) {
      Linking.openURL(data?.coaStatusDocument.url);
    }
  }, [data?.coaStatusDocument]);

  const resetNavigator = useCallback(
    (token?: string) => {
      navigation.reset({
        index: 0,
        routes: [
          {name: UserStackRoutes.TabNavigator},
          {
            name: UserStackRoutes.BrandScreen,
            params: {
              brandId: data?.brand.id,
              ...(token ? {qrToken: token} : {}),
            },
          },
        ],
      });
    },
    [data?.brand, navigation],
  );

  const handlePressUseYourPoints = useCallback(() => {
    if (data?.used) {
      resetNavigator();
    } else {
      resetNavigator(params?.qrToken);
    }
  }, [data?.used, params?.qrToken, resetNavigator]);
  return (
    <GradientWrapper
      colors={backgroundGradient}
      locations={gradientWrapperLocations}>
      <SafeAreaView edges={['top']}>
        <AuthenticProduct />
        <Element3D
          modelUri={data?.modelGlb.url}
          height={vp(350)}
          onLoadEnd={onLoadEnd}
        />
        <View style={[GLOBAL_STYLES.padding_24, styles.info]}>
          <View style={[GLOBAL_STYLES.row_between, styles.points]}>
            <View>
              <AppText variant={TextVariant.S_5W}>{data?.brand.name}</AppText>
              <AppText
                variant={TextVariant['24_5A']}
                style={styles.company}
                withGradient>
                {data?.name}
              </AppText>
              <AppText style={styles.weight} variant={TextVariant.P_M}>
                {data?.gramWeight} G / {data?.ounceWeight} oz
              </AppText>
              <THCBox thc={data?.thc} />
            </View>
            <View style={styles.pointBlock}>
              {!data?.used && (
                <>
                  <AppText
                    variant={TextVariant.S_R}
                    style={styles.youHave}
                    color={TextColors.G090}>
                    {intl.formatMessage({
                      id: 'authentic.you.have',
                      defaultMessage: 'You have',
                    })}
                  </AppText>
                  <Points withAdaptiveSize points={data?.brandPoints} />
                </>
              )}
            </View>
          </View>
          {data?.coaStatusDocument && (
            <Button
              disabled={isModelLoading}
              variant={ButtonVariant.GRAY}
              width={'100%'}
              title={intl.formatMessage({
                id: 'authentic.button.labTest',
                defaultMessage: 'Laboratory test',
              })}
              onPress={handlePressCoa}
            />
          )}

          <ButtonImageBackground
            disabled={isModelLoading}
            containerStyle={styles.usePoints}
            title={intl.formatMessage({
              id: data?.used
                ? 'authentic.button.viewBrand'
                : 'authentic.button.usePoints',
              defaultMessage: data?.used ? 'View brand' : 'Use your points',
            })}
            onPress={handlePressUseYourPoints}
          />
        </View>
      </SafeAreaView>
    </GradientWrapper>
  );
};

const styles = StyleSheet.create({
  info: {
    marginTop: vp(10),
  },
  points: {
    marginBottom: vp(25),
  },
  company: {
    width: WIDTH * 0.65,
    marginTop: vp(8),
  },
  usePoints: {marginTop: vp(18)},
  weight: {
    marginVertical: vp(10),
  },
  pointBlock: {
    alignSelf: 'flex-end',
  },
  youHave: {
    marginBottom: vp(3),
  },
});
