import React, {FC, memo} from 'react';
import {useIntl} from 'react-intl';
import {Pressable, StyleSheet, View} from 'react-native';
import {TextVariant} from '~/theme';
import {getResponsiveValue} from '~/utils/layout';
import {AppText, SvgImageBackground} from '..';
import ButtonBack from '~/assets/images/buttons/button-background.svg';
import {IS_IOS} from '~/constants/layout';

interface MissingZipCodeProps {
  handlePressGotToCatalog?: () => void;
  navigateToCatalog?: boolean;
  type?: 'screen' | 'modal';
}

export const MissingZipCode: FC<MissingZipCodeProps> = memo(props => {
  const intl = useIntl();

  return (
    <View style={styles.root}>
      <Pressable style={styles.button} onPress={props.handlePressGotToCatalog}>
        <SvgImageBackground
          containerStyle={styles.containerStyle}
          svgComponent={<ButtonBack width="100%" height={'100%'} />}>
          <AppText variant={TextVariant.M_B}>
            {intl.formatMessage({
              id: 'zipCode.goToCatalog',
              defaultMessage: 'Go to Catalog',
            })}
          </AppText>
        </SvgImageBackground>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  button: {
    height: vp(50),
    width: '100%',
    marginBottom: IS_IOS ? 0 : vp(20),
  },
  text: {
    textAlign: 'center',
    marginTop: getResponsiveValue(26),
    marginBottom: getResponsiveValue(62),
    lineHeight: 20,
  },
  containerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
