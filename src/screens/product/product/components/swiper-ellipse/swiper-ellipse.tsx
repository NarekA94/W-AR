import React, {FC, memo, useCallback} from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Defs, LinearGradient, Path, Stop, Svg} from 'react-native-svg';
import ArIcon from 'src/assets/images/product/ar.png';
import Icon3D from 'src/assets/images/product/3d.png';
import ColorsIcon from 'src/assets/images/product/colors.png';
import ArIconActive from 'src/assets/images/product/ar_active.png';
import Icon3DActive from 'src/assets/images/product/3d_active.png';
import ColorsIconActive from 'src/assets/images/product/colors_active.png';
import {AppText} from '~/components';
import {TextColors, TextVariant} from '~/theme';

const EllipsePath =
  'M287.5 29C287.5 30.8215 286.586 32.6557 284.724 34.4881C282.861 36.3216 280.087 38.1141 276.469 39.8367C269.236 43.2806 258.738 46.3953 245.725 49.0159C219.707 54.2556 183.742 57.5 144 57.5C104.258 57.5 68.2929 54.2556 42.2753 49.0159C29.2624 46.3953 18.7641 43.2806 11.5312 39.8367C7.91348 38.1141 5.13925 36.3216 3.27629 34.4881C1.41431 32.6557 0.5 30.8215 0.5 29C0.5 27.1785 1.41431 25.3443 3.27629 23.5119C5.13925 21.6784 7.91348 19.8859 11.5312 18.1633C18.7641 14.7194 29.2624 11.6047 42.2753 8.98406C68.2929 3.74441 104.258 0.5 144 0.5C183.742 0.5 219.707 3.74441 245.725 8.98406C258.738 11.6047 269.236 14.7194 276.469 18.1633C280.087 19.8859 282.861 21.6784 284.724 23.5119C286.586 25.3443 287.5 27.1785 287.5 29Z';

const BlockHeight = vp(58);
const ICON_IDLE_SIZE = vp(38);
const ICON_ACTIVE_SIZE = vp(48);
const FONT_SIZE_IDLE = 8;
const FONT_SIZE_ACTIVE = 10;
const FONT_COLOR_ACTIVE = TextColors.A100;
const FONT_COLOR = TextColors.A060;
export enum ScreenMode {
  AR = 'AR',
  '3D' = '3D',
  COLORS = 'Colors',
}

interface SwiperEllipse {
  onPressSwiperIcon: (type: ScreenMode) => void;
  screenMode: ScreenMode;
  disabled: boolean;
}

export const SwiperEllipse: FC<SwiperEllipse> = memo(
  ({disabled, onPressSwiperIcon, ...props}) => {
    const handlePressSwitchIcon = useCallback(
      (type: ScreenMode) => {
        return () => {
          onPressSwiperIcon(type);
        };
      },
      [onPressSwiperIcon],
    );
    const isColorsMode = useCallback((): boolean => {
      return props.screenMode === ScreenMode.COLORS;
    }, [props.screenMode]);
    const isArMode = useCallback((): boolean => {
      return props.screenMode === ScreenMode.AR;
    }, [props.screenMode]);
    const is3DMode = useCallback((): boolean => {
      return props.screenMode === ScreenMode['3D'];
    }, [props.screenMode]);
    return (
      <View style={[styles.container, isArMode() && styles.bottom_45]}>
        <View style={styles.ellipseBlock}>
          <Svg width="100%" height="100%" viewBox="0 0 288 58" fill="none">
            <Path
              opacity="0.2"
              d={EllipsePath}
              stroke="url(#paint0_linear_16387_82843)"
            />
            <Defs>
              <LinearGradient
                id="paint0_linear_16387_82843"
                x1="144.435"
                y1="14.5"
                x2="144.117"
                y2="58.0009"
                gradientUnits="userSpaceOnUse">
                <Stop stopColor="white" stopOpacity="0.07" />
                <Stop offset="1" stopColor="white" />
              </LinearGradient>
            </Defs>
          </Svg>
          <View pointerEvents="box-none" style={[StyleSheet.absoluteFill]}>
            <TouchableOpacity
              disabled={disabled}
              onPress={handlePressSwitchIcon(ScreenMode.AR)}
              style={[
                styles.modeIcon,
                styles.arIcon,
                isArMode() && styles.modeIconActive,
              ]}>
              <AppText
                style={[styles.title, isArMode() && styles.titleActive]}
                color={isArMode() ? FONT_COLOR_ACTIVE : FONT_COLOR}
                variant={TextVariant.S_R}
                size={isArMode() ? FONT_SIZE_ACTIVE : FONT_SIZE_IDLE}>
                AR
              </AppText>
              <Image
                style={styles.image}
                source={isArMode() ? ArIconActive : ArIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={disabled}
              onPress={handlePressSwitchIcon(ScreenMode['3D'])}
              style={[
                styles.modeIcon,
                styles.icon3D,
                is3DMode() && [styles.modeIconActive, styles.icon3DActive],
              ]}>
              <Image
                style={styles.image}
                source={is3DMode() ? Icon3DActive : Icon3D}
              />
              <AppText
                style={[styles.title, is3DMode() && styles.titleActive]}
                color={is3DMode() ? FONT_COLOR_ACTIVE : FONT_COLOR}
                variant={TextVariant.S_R}
                size={is3DMode() ? FONT_SIZE_ACTIVE : FONT_SIZE_IDLE}>
                3D
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={disabled}
              onPress={handlePressSwitchIcon(ScreenMode.COLORS)}
              style={[
                styles.modeIcon,
                styles.colorsIcon,
                isColorsMode() && styles.modeIconActive,
              ]}>
              <AppText
                style={[styles.title, isColorsMode() && styles.titleActive]}
                color={isColorsMode() ? FONT_COLOR_ACTIVE : FONT_COLOR}
                variant={TextVariant.S_R}
                size={isColorsMode() ? FONT_SIZE_ACTIVE : FONT_SIZE_IDLE}>
                Colors
              </AppText>
              <Image
                source={isColorsMode() ? ColorsIconActive : ColorsIcon}
                style={styles.image}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: vp(24),
    position: 'absolute',
    bottom: 0,
    overflow: 'visible',
  },
  ellipseBlock: {
    height: BlockHeight,
    width: '100%',
  },
  // styles should be changed after animation integration
  modeIcon: {
    height: ICON_IDLE_SIZE,
    width: ICON_IDLE_SIZE,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeIconActive: {
    height: ICON_ACTIVE_SIZE,
    width: ICON_ACTIVE_SIZE,
  },
  arIcon: {
    left: 0,
    top: BlockHeight / 2 - ICON_IDLE_SIZE / 2,
  },
  icon3DActive: {
    top: BlockHeight / 2 + vp(5),
  },
  icon3D: {
    alignSelf: 'center',
    top: ICON_IDLE_SIZE,
  },
  colorsIcon: {
    right: 0,
    top: BlockHeight / 2 - ICON_IDLE_SIZE / 2,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    top: ICON_IDLE_SIZE + vp(2),
    position: 'absolute',
  },
  titleActive: {
    top: ICON_ACTIVE_SIZE + vp(2),
  },
  bottom_45: {
    paddingBottom: vp(45),
  },
});
