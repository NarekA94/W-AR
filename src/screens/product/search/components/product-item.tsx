import React, {FC, memo, useCallback, useMemo} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {AppText} from '~/components';
import {GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import {useIntl} from 'react-intl';
import LinearGradient from 'react-native-linear-gradient';

interface ProductItemProps {
  name: string;
  colors?: (string | number)[];
  logo?: string;
  id?: number;
  onPress?: (id: number, color: string) => void;
  thc?: number;
  strain?: string;
  primaryColor?: string;
}
const loaction = [0, 0.6, 1];

export const ProductItem: FC<ProductItemProps> = memo(props => {
  const {id, onPress, primaryColor = 'black'} = props;
  const intl = useIntl();

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
      <View>
        <AppText
          numberOfLines={1}
          style={styles.title}
          color={TextColors.A100}
          variant={TextVariant.S_R}>
          {props.name}
        </AppText>
        <View style={styles.sectionThc}>
          <AppText
            style={styles.thc}
            variant={TextVariant.P_M}
            color={TextColors.A045}>
            {intl.formatMessage({
              id: 'thc',
              defaultMessage: 'THC',
            })}
          </AppText>
          <AppText variant={TextVariant.P_M} color={TextColors.A100}>
            {props.thc} %
          </AppText>
          <AppText
            style={styles.horizontal_8}
            variant={TextVariant.P_M}
            color={TextColors.A045}>
            |
          </AppText>
          <AppText variant={TextVariant.P_M} color={TextColors.A100}>
            {props.strain}
          </AppText>
        </View>
      </View>
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
    borderWidth: 1,
    borderColor: 'rgba(102, 102, 102, 0.7)',
    backgroundColor: 'black',
  },
  title: {marginBottom: vp(10)},
  img: {
    width: vp(40),
    height: vp(40),
  },
  sectionThc: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  horizontal_8: {
    marginHorizontal: vp(8),
  },
  thc: {
    marginRight: vp(5),
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
});
