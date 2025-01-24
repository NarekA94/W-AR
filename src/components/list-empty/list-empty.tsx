import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import SearchIcon from '~/assets/images/listEmpty.svg';
import {TextColors, TextVariant} from '~/theme';
import {AppText} from '..';
import {useIntl} from 'react-intl';
export const ListEmpty: FC = () => {
  const intl = useIntl();
  return (
    <View style={styles.root}>
      <SearchIcon />
      <AppText style={styles.title} variant={TextVariant['24_4A']} withGradient>
        {intl.formatMessage({
          id: 'component.search.notFound',
          defaultMessage: 'No search results found',
        })}
      </AppText>
      <AppText variant={TextVariant.S_R} color={TextColors.G090}>
        {intl.formatMessage({
          id: 'component.search.query',
          defaultMessage: 'Try changing your query',
        })}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    marginTop: vp(70),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: vp(20),
    marginBottom: vp(17),
  },
});
