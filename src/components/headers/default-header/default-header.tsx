import React, {FC, memo, useCallback, useMemo} from 'react';
import {Pressable, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {TextVariant} from '~/theme';
import {AppText} from '~/components';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ArrowBackImage from '~/assets/images/arrowLeft.svg';
import Logo from '~/assets/images/logo.svg';

export const defaultHeaderHeight = vp(26);
export const defaultHeaderMarginBottom = vp(31);
export const defaultHeaderTop = vp(23);

export interface DefaultHeaderProps {
  title?: string | null;
  withBackIcon?: boolean;
  description?: string | null;
  headerMarginBottom?: number;
  withSafeZone?: boolean;
  backGroundColor?: string;
  marginTop?: number;
  styles?: StyleProp<ViewStyle>;
  titleVariant?: TextVariant;
  handleBackPressed?: () => boolean;
  modal?: boolean;
  right?: React.ReactElement;
  paddingHorizontal?: number;
  withLogo?: boolean;
  disabled?: boolean;
}

export const DefaultHeader: FC<DefaultHeaderProps> = memo(
  ({
    withBackIcon = true,
    headerMarginBottom = defaultHeaderMarginBottom,
    marginTop = defaultHeaderTop,
    paddingHorizontal = 0,
    backGroundColor,
    right,
    titleVariant = TextVariant.H5_M,
    disabled,
    handleBackPressed,
    ...props
  }) => {
    const navigation = useNavigation();

    const goBack = useCallback(() => {
      !!handleBackPressed?.() ||
        (navigation.canGoBack() && navigation.goBack());
    }, [navigation, handleBackPressed]);

    const styles = useStyles({
      headerMarginBottom,
      backGroundColor,
      withBackIcon,
      marginTop,
      paddingHorizontal,
    });

    return (
      <View style={[styles.root, props.styles]}>
        {props.withSafeZone && <View style={styles.safeZone} />}
        {withBackIcon && (
          <View style={styles.mainHeader}>
            <Pressable
              disabled={disabled}
              style={styles.backIcon}
              hitSlop={25}
              onPress={goBack}>
              <ArrowBackImage />
            </Pressable>

            {!!props.title && (
              <AppText style={styles.title} variant={titleVariant}>
                {props.title}
              </AppText>
            )}
            {props.withLogo && <Logo width={vp(107)} />}
            <View style={styles.rightBox}>{right}</View>
          </View>
        )}
      </View>
    );
  },
);

const useStyles = (
  props: Pick<
    DefaultHeaderProps,
    | 'headerMarginBottom'
    | 'backGroundColor'
    | 'withBackIcon'
    | 'marginTop'
    | 'paddingHorizontal'
  >,
) => {
  const {top} = useSafeAreaInsets();
  return useMemo(
    () =>
      StyleSheet.create({
        backIcon: {
          position: 'absolute',
          left: 0,
          paddingBottom: 2,
        },
        closeIcon: {
          position: 'absolute',
          right: 0,
        },
        rightBox: {
          position: 'absolute',
          right: 0,
        },
        root: {
          marginBottom: props.headerMarginBottom,
          backgroundColor: props.backGroundColor,
          position: 'relative',
          marginTop: props.marginTop,
          paddingHorizontal: props.paddingHorizontal,
        },
        mainHeader: {
          flexDirection: 'row',
          justifyContent: 'center',
          height: defaultHeaderHeight,
          alignItems: 'center',
          width: '100%',
          position: 'relative',
        },
        safeZone: {
          height: top,
        },
        title: {
          textAlign: 'center',
          marginTop: 1,
        },
      }),
    [],
  );
};
