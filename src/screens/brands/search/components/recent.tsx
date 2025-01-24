import React, {FC, memo, useCallback} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {AppText} from '~/components';
import {GLOBAL_STYLES, TextVariant} from '~/theme';
import {BrandBackground} from './brand-background';

interface RecentBrandProps {
  name: string;
  colors?: (string | number)[];
  logo?: string;
  id?: number;
  onPress?: (id: number) => void;
}

export const RecentBrand: FC<RecentBrandProps> = memo(props => {
  const {id, onPress} = props;

  const handlePressItem = useCallback(() => {
    if (id) {
      onPress?.(id);
    }
  }, [id, onPress]);

  return (
    <TouchableOpacity onPress={handlePressItem} style={styles.root}>
      <BrandBackground
        colors={props.colors}
        gradientStyle={styles.gradientStyle}>
        <View style={GLOBAL_STYLES.flex_1_center}>
          <Image style={styles.img} source={{uri: props.logo}} />
        </View>
      </BrandBackground>
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
  },
  gradientStyle: {
    height: vp(76),
    width: vp(76),
    borderRadius: 20,
    marginBottom: vp(8),
  },
  title: {textAlign: 'center', fontSize: vp(10)},
  textWrap: {
    paddingHorizontal: vp(3),
  },
  img: {
    width: vp(40),
    height: vp(40),
  },
});
