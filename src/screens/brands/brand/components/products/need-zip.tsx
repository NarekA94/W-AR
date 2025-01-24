import React, {FC, memo} from 'react';
import {useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import {AppText, Box, Button} from '~/components';
import {WIDTH} from '~/constants/layout';
import {ButtonVariant, FontWeight, TextColors, TextVariant} from '~/theme';

interface NeedZipProps {
  emptyZip?: boolean;
  brandId?: number;
  onPressChooseZipCode: () => void;
}

export const NeedZip: FC<NeedZipProps> = memo(
  ({emptyZip, onPressChooseZipCode}) => {
    const intl = useIntl();

    return (
      <>
        <View style={styles.needZip}>
          <Box containerStyle={styles.box} angle={180}>
            <View style={styles.zipCodeBody}>
              <AppText
                variant={TextVariant.H4_B}
                fontWeight={FontWeight.W500}
                color={TextColors.A100}>
                {intl.formatMessage({
                  id: !emptyZip
                    ? 'screens.brand.components.products.needZipCode.not_cover'
                    : 'screens.brand.components.products.needZipCode',
                  defaultMessage: 'Enter your zip-code',
                })}
              </AppText>
              <AppText
                style={styles.description}
                variant={TextVariant.S_R}
                color={TextColors.G090}>
                {intl.formatMessage({
                  id: !emptyZip
                    ? 'screens.brand.components.products.needZipCode.description.not_cover'
                    : 'screens.brand.components.products.needZipCode.description',
                  defaultMessage:
                    'Enter your zip-code or allow to use your location to detect it, so we could show you an available catalog in your zip-code.',
                })}
              </AppText>
              <Button
                width="100%"
                onPress={onPressChooseZipCode}
                variant={ButtonVariant.GRAY}
                title={intl.formatMessage({
                  id: 'screens.brand.components.products.needZipCode.button',
                  defaultMessage: 'Choose zip code',
                })}
              />
            </View>
          </Box>
        </View>
      </>
    );
  },
);

const styles = StyleSheet.create({
  zipCodeBody: {
    justifyContent: 'center',
    paddingHorizontal: vp(20),
  },
  description: {
    marginTop: vp(14),
    marginBottom: vp(32),
    lineHeight: 17,
  },
  skeleton: {
    width: vp(293),
    height: vp(451),
    borderWidth: 1,
    borderColor: 'rgba(102, 102, 102, 0.7)',
    borderRadius: 25,
    marginRight: vp(20),
    backgroundColor: 'black',
  },
  needZip: {
    marginBottom: vp(60),
    width: WIDTH - 40,
    height: vp(281),
  },
  box: {
    width: '100%',
    height: '100%',
  },
});
