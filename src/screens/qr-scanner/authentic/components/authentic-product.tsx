import React, {FC, memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {AppText} from '~/components';
import {GLOBAL_STYLES, TextVariant} from '~/theme';
import DoneIcon from '~/assets/images/qrscanner/check.svg';
import {useIntl} from 'react-intl';

export const AuthenticProduct: FC = memo(() => {
  const intl = useIntl();
  return (
    <View style={styles.root}>
      <View style={GLOBAL_STYLES.row_vertical_center}>
        <DoneIcon />
        <AppText style={styles.title} variant={TextVariant.H5_M} withGradient>
          {intl.formatMessage({
            id: 'authentic.product',
            defaultMessage: 'Authentic product',
          })}
        </AppText>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    width: '100%',
    marginVertical: vp(33),
  },
  title: {
    marginLeft: vp(9),
  },
});
