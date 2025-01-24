import React, {FC, memo, useCallback} from 'react';
import {useIntl} from 'react-intl';
import {FlatList, StyleSheet, View} from 'react-native';
import {AppText, Box} from '~/components';
import {ProductEffect} from '~/store/query/product';
import {FontWeight, TextColors, TextVariant} from '~/theme';

interface EffectsProps {
  effects: ProductEffect[];
}

const boxHeight = vp(48);

export const Effects: FC<EffectsProps> = memo(({effects}) => {
  const intl = useIntl();
  const renderItem = useCallback(({item}: FlatListItem<ProductEffect>) => {
    return (
      <Box containerStyle={styles.box} height={boxHeight} radius={12}>
        <View style={styles.root}>
          <AppText size={14} color={TextColors.A100} style={styles.emoji}>
            {item.emoji}
          </AppText>
          <AppText variant={TextVariant.S_R} color={TextColors.A100}>
            {item.name}
          </AppText>
        </View>
      </Box>
    );
  }, []);

  return (
    <>
      <AppText
        style={styles.title}
        fontWeight={FontWeight.W400}
        variant={TextVariant.H_6_W5}>
        {intl.formatMessage({
          id: 'phrases.effects',
          defaultMessage: 'Effects',
        })}
      </AppText>
      <FlatList
        horizontal
        data={effects}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        style={styles.flatList}
      />
    </>
  );
});

const styles = StyleSheet.create({
  box: {
    marginRight: vp(8),
  },
  flatList: {
    marginBottom: vp(32),
  },
  root: {
    paddingLeft: vp(14),
    paddingRight: vp(12),
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  emoji: {
    marginRight: vp(4),
    marginTop: -2,
  },
  title: {
    marginBottom: vp(16),
    marginTop: vp(10),
  },
});
