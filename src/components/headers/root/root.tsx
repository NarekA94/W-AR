import React, {FC, memo, useMemo} from 'react';
import {Pressable, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {TextVariant} from '~/theme';
import {AppText} from '~/components';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ArrowBackImage from '~/assets/images/arrowBack.svg';
import CloseIcon from '~/assets/images/closeDark.svg';

export interface HeaderProps {
  title?: string | null;
  withBackIcon?: boolean;
  description?: string | null;
  right?: boolean;
  headerMarginBottom?: number;
  withSafeZone?: boolean;
  backGroundColor?: string;
  marginTop?: number;
  styles?: StyleProp<ViewStyle>;
  titleVariant?: TextVariant;
  onGoBack?: () => void;
  modal?: boolean;
}

export const RootHeader: FC<HeaderProps> = memo(
  ({
    withBackIcon = true,
    right = false,
    headerMarginBottom = 25,
    marginTop = 0,
    backGroundColor,
    titleVariant = TextVariant.H4_B,
    modal = false,
    ...props
  }) => {
    const navigation = useNavigation();

    const goBack = () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
      props.onGoBack?.();
    };

    const styles = useStyles({
      headerMarginBottom,
      backGroundColor,
      withBackIcon,
      marginTop,
    });

    return (
      <View style={[styles.root, props.styles]}>
        {props.withSafeZone && <View style={styles.safeZone} />}
        {withBackIcon && (
          <View style={styles.mainHeader}>
            {!modal && (
              <Pressable style={styles.backIcon} hitSlop={20} onPress={goBack}>
                <ArrowBackImage width={24} height={24} />
              </Pressable>
            )}
            {modal && (
              <Pressable style={styles.closeIcon} hitSlop={30} onPress={goBack}>
                <CloseIcon width={vp(15)} height={vp(15)} />
              </Pressable>
            )}
            {!!props.title && (
              <AppText style={styles.title} variant={titleVariant}>
                {props.title}
              </AppText>
            )}

            <View style={styles.rightBox}>{right && <Pressable />}</View>
          </View>
        )}
      </View>
    );
  },
);

const useStyles = (
  props: Pick<
    HeaderProps,
    'headerMarginBottom' | 'backGroundColor' | 'withBackIcon' | 'marginTop'
  >,
) => {
  const {top} = useSafeAreaInsets();
  return useMemo(
    () =>
      StyleSheet.create({
        backIcon: {
          position: 'absolute',
          left: 0,
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
        },
        mainHeader: {
          flexDirection: 'row',
          justifyContent: 'center',
          height: vp(26),
          alignItems: 'center',
          width: '100%',
          position: 'relative',
        },
        safeZone: {
          height: top,
        },
        title: {
          textAlign: 'center',
        },
      }),
    [],
  );
};
