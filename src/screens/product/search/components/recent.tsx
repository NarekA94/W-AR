import React, {FC, memo, useCallback, useMemo} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {AppText} from '~/components';
import {GLOBAL_STYLES, TextVariant} from '~/theme';
import LinearGradient from 'react-native-linear-gradient';

interface RecentBrandProps {
  name: string;
  colors?: (string | number)[];
  logo?: string;
  primaryColor?: string;
  id?: number;
  onPress?: (id: number, color: string) => void;
}
const loaction = [0, 0.6, 1];

export const RecentBrand: FC<RecentBrandProps> = memo(props => {
  const {primaryColor = 'black', onPress, id} = props;

  const handlePressItem = useCallback(() => {
    if (id) {
      onPress?.(id, primaryColor);
    }
  }, [id, onPress, primaryColor]);

  const colors = useMemo(() => {
    return [primaryColor, 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 1)'];
  }, [primaryColor]);

  return (
    <TouchableOpacity onPress={handlePressItem} style={styles.root}>
      <View style={styles.gradientStyle}>
        <LinearGradient
          style={styles.gradient}
          locations={loaction}
          colors={colors}>
          <View style={GLOBAL_STYLES.flex_1_center}>
            <Image style={styles.img} source={{uri: props.logo}} />
          </View>
        </LinearGradient>
      </View>

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
  title: {textAlign: 'center', fontSize: vp(10)},
  textWrap: {
    paddingHorizontal: vp(3),
  },
  img: {
    width: vp(40),
    height: vp(40),
  },
  gradient: {
    borderRadius: 20,
    left: -1,
    top: -1,
    bottom: -1,
    right: -1,
    position: 'absolute',
    opacity: 1,
  },
  gradientStyle: {
    height: vp(76),
    width: vp(76),
    borderRadius: 20,
    marginRight: vp(20),
    borderWidth: 1,
    borderColor: 'rgba(102, 102, 102, 0.7)',
    backgroundColor: 'black',
    marginBottom: vp(8),
  },
});
