import React, {FC, useCallback} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {AppText, Button, ScreenWrapper} from '~/components';
import {UserStackParamProps, UserStackRoutes} from '~/navigation';
import {GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import {useIntl} from 'react-intl';

export const CongratulationsScreen: FC<
  UserStackParamProps<UserStackRoutes.Congratulations>
> = ({route, navigation}) => {
  const {params} = route;
  const intl = useIntl();
  const handlePressOk = useCallback(() => {
    navigation.navigate(UserStackRoutes.Profile);
  }, [navigation]);
  return (
    <ScreenWrapper withBottomInset withTopInsets withStatusBar>
      <View style={GLOBAL_STYLES.flex_1_center}>
        <Image style={styles.img} source={params?.file} />
        <AppText style={styles.title} variant={TextVariant['24_5A']}>
          Congratulations!
        </AppText>
        <AppText variant={TextVariant.S_R} color={TextColors.G090}>
          {intl.formatMessage({
            id: params.infoI18nKey,
          })}
        </AppText>
      </View>
      <Button
        containerStyle={styles.button}
        onPress={handlePressOk}
        title="Okay"
        withImageBackground
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  img: {
    width: vp(130),
    height: vp(130),
  },
  title: {
    marginBottom: vp(15),
    marginTop: vp(50),
  },
  button: {
    marginBottom: vp(25),
  },
});
