import React, {FC, memo, useCallback} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {AppText} from '~/components';
import {GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import {BrandBackground} from './brand-background';

interface BrandItemProps {
  name: string;
  colors?: (string | number)[];
  logo?: string;
  id?: number;
  onPress?: (id: number) => void;
}

export const BrandItem: FC<BrandItemProps> = memo(props => {
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
  gradientStyle: {
    height: vp(76),
    width: vp(76),
    borderRadius: 20,
    marginRight: vp(20),
  },
  title: {textAlign: 'center'},
  img: {
    width: vp(40),
    height: vp(40),
  },
});
