import React, {FC} from 'react';
import {useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import EmptyIcon from '~/assets/images/empty.svg';
import {TextVariant} from '~/theme';
import {AppText} from '..';

export const EmptyList: FC = () => {
  const intl = useIntl();
  return (
    <View style={styles.root}>
      <EmptyIcon />
      <AppText style={styles.text} variant={TextVariant.M_R}>
        {intl.formatMessage({
          id: 'emptyList.title',
          defaultMessage: 'No products found.',
        })}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    marginTop: vp(124),
  },
  text: {
    marginTop: 22,
  },
});
