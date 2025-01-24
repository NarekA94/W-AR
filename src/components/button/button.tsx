import React, {FC, memo, useCallback, useEffect} from 'react';
import {
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {AppText, ButtonLight} from '~/components';
import {ButtonVariant, GLOBAL_STYLES, TextVariant, useTheme} from '~/theme';
import ArrowForwardIcon from '~/assets/images/arrowForwardLight.svg';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface ButtonProps {
  title: string | React.ReactNode;
  isLoading?: boolean;
  variant?: ButtonVariant;
  width?: number | string;
  fill?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  withIcon?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  withImageBackground?: boolean;
  loaderStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button: FC<ButtonProps> = memo(props => {
  const styles = useStyles({
    variant: props.disabled ? ButtonVariant.DISABLED : props.variant,
    width: props.width,
    fill: props.fill,
    withImageBackground: props.withImageBackground,
  });
  const loaderPosition = useSharedValue<number | string>(5);
  const [buttonWidth, setButtonWidth] = React.useState(
    typeof props.width === 'number' ? props.width : 0,
  );

  useEffect(() => {
    loaderPosition.value = withRepeat(
      withTiming(
        buttonWidth ? Number(buttonWidth) - Number(buttonWidth) * 0.14 : '85%',
        {
          duration: 800,
          easing: Easing.linear,
        },
      ),
      -1,
      true,
    );
    if (props.isLoading) {
      loaderPosition.value = withRepeat(
        withTiming(
          buttonWidth
            ? Number(buttonWidth) - Number(buttonWidth) * 0.14
            : '85%',
          {
            duration: 800,
            easing: Easing.linear,
          },
        ),
        -1,
        true,
      );
    } else {
      cancelAnimation(loaderPosition);
      loaderPosition.value = 5;
    }

    return () => {
      cancelAnimation(loaderPosition);
    };
  }, [props.isLoading]);

  const animatedLoaderStyle = useAnimatedStyle(() => {
    return {
      left: loaderPosition.value,
    };
  }, [loaderPosition]);
  const handleLayout = (event: LayoutChangeEvent) => {
    const {width} = event.nativeEvent.layout;
    if (width) {
      setButtonWidth(width);
    }
  };
  const ButtonContent = useCallback(
    () => (
      <>
        {props.isLoading ? (
          <Animated.View
            style={[
              styles.loader,
              {width: Number(buttonWidth) * 0.12},
              animatedLoaderStyle,
              props.loaderStyle,
            ]}
          />
        ) : (
          <View style={GLOBAL_STYLES.row_center}>
            {typeof props.title === 'string' ||
            typeof props.title === 'number' ? (
              <AppText
                style={[styles.text, props.textStyle]}
                variant={TextVariant.M_B}>
                {props.title}
              </AppText>
            ) : (
              props.title
            )}

            {!!props.withIcon && (
              <View style={styles.icon}>
                <ArrowForwardIcon />
              </View>
            )}
          </View>
        )}
      </>
    ),
    [props.isLoading, props.title, props.variant],
  );

  if (props.withImageBackground) {
    return (
      <ButtonLight
        disabled={props.disabled || props.isLoading}
        containerStyle={props.containerStyle}
        width={props.width}
        onPress={props.onPress}>
        <View onLayout={handleLayout} style={styles.imageBackgroudnBox}>
          <ButtonContent />
        </View>
      </ButtonLight>
    );
  }

  return (
    <TouchableOpacity
      disabled={props.disabled || props.isLoading}
      onLayout={handleLayout}
      onPress={props.onPress}
      style={[styles.root, props.containerStyle]}>
      <ButtonContent />
    </TouchableOpacity>
  );
});

const useStyles = (
  props: Pick<
    ButtonProps,
    'variant' | 'width' | 'fill' | 'withImageBackground'
  >,
) => {
  const {theme} = useTheme();
  const defaultStyles = theme.button[props.variant || ButtonVariant.PRIMARY];

  return StyleSheet.create({
    root: {
      height: vp(50),
      width: props.width,
      minWidth: 146,
      paddingVertical: 12,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      borderRadius: 18,
      ...(props.fill ? {flex: 1} : {}),
      ...defaultStyles,
    },
    text: {
      color: props.withImageBackground
        ? theme.colors.textColors.B100
        : defaultStyles.textColor,
    },
    icon: {
      marginLeft: 14,
    },
    loader: {
      height: 6,
      backgroundColor: props.withImageBackground
        ? theme.colors.textColors.B040
        : theme.colors.background.primary,
      position: 'absolute',
      borderRadius: 12,
    },
    imageBackgroudnBox: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};
