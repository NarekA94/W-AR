import React, {FC, memo, useCallback} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {AppText} from '~/components';
import {TextVariant} from '~/theme';

interface RecentBrandProps {
  name: string;
  colors?: (string | number)[];
  logo?: string;
  id?: number;
  onPress?: (id: number) => void;
}

export const RecentCollectible: FC<RecentBrandProps> = memo(props => {
  const {id, onPress} = props;

  const handlePressItem = useCallback(() => {
    if (id) {
      onPress?.(id);
    }
  }, [id, onPress]);

  return (
    <TouchableOpacity onPress={handlePressItem} style={styles.root}>
      <Image style={styles.img} source={{uri: props.logo}} />

      <View style={styles.textWrap}>
        <AppText
          numberOfLines={1}
          style={styles.title}
          variant={TextVariant['10_4A']}>
          {props.name}
        </AppText>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  root: {
    marginRight: vp(12),
    width: vp(76),
    alignItems: 'center',
  },
  gradientStyle: {
    height: vp(76),
    width: vp(76),
    borderRadius: 20,
    marginBottom: vp(8),
  },
  title: {textAlign: 'center', fontSize: vp(11)},
  textWrap: {
    paddingHorizontal: vp(3),
  },
  img: {
    width: vp(60),
    height: vp(60),
    marginBottom: vp(8),
  },
});
