import React, {FC, memo, useMemo} from 'react';
import {Pressable, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {TextVariant} from '~/theme';
import {AppText} from '~/components';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ArrowBackImage from '~/assets/images/arrowBack.svg';

interface AnimatedHeaderProps {
  title?: string | null;
  withBackIcon?: boolean;
  description?: string | null;
  headerMarginBottom?: number;
  withSafeZone?: boolean;
  backGroundColor?: string;
  marginTop?: number;
  styles?: StyleProp<ViewStyle>;
  titleVariant?: TextVariant;
  onGoBack?: () => void;
}

export const AnimatedHeader: FC<AnimatedHeaderProps> = memo(
  ({
    withBackIcon = true,
    headerMarginBottom = 25,
    marginTop = 0,
    backGroundColor,
    titleVariant = TextVariant.H4_B,
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
            <Pressable style={styles.backIcon} hitSlop={20} onPress={goBack}>
              <ArrowBackImage width={24} height={24} />
            </Pressable>

            {!!props.title && (
              <AppText style={styles.title} variant={titleVariant}>
                {props.title}
              </AppText>
            )}
          </View>
        )}
      </View>
    );
  },
);

const useStyles = (
  props: Pick<
    AnimatedHeaderProps,
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
          height: 40,
          justifyContent: 'center',
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
