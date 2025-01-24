import React, {FC, memo, useCallback} from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {AppText} from '~/components';
import {TextColors, TextVariant} from '~/theme';

interface CollectibleItemProps {
  name: string;
  colors?: (string | number)[];
  logo?: string;
  id?: number;
  onPress?: (id: number) => void;
}

export const CollectibleItem: FC<CollectibleItemProps> = memo(props => {
  const {id, onPress} = props;

  const handlePressItem = useCallback(() => {
    if (id) {
      onPress?.(id);
    }
  }, [id, onPress]);

  return (
    <TouchableOpacity onPress={handlePressItem} style={styles.root}>
      <Image style={styles.img} source={{uri: props.logo}} />

      <AppText
        numberOfLines={1}
        style={styles.title}
        color={TextColors.A100}
        variant={TextVariant.S_R}>
        {props.name}
      </AppText>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  root: {
    marginRight: vp(12),
    flexDirection: 'row',
    marginBottom: vp(18),
    alignItems: 'center',
  },

  title: {textAlign: 'center'},
  img: {
    width: vp(60),
    height: vp(60),
    marginRight: vp(20),
  },
});
