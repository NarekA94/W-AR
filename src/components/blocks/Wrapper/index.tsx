import React, {FC} from 'react';

import {
  ScrollView,
  StyleSheet,
  View,
  ScrollViewProps,
  Animated,
  Pressable,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FocusAwareStatusBar} from '~/components/focus-aware-status-bar/focus-aware-status-bar';
import {DefaultHeader, DefaultHeaderProps} from '~/components/headers';
import {Tab_Bar_Inset, WIDTH} from '~/constants/layout';
import {useTheme} from '~/theme';
import {fontFamily} from '~/theme/utils/font-family';
import CloseIcon from '~/assets/images/close-light.svg';
import ArrowBackImage from '~/assets/images/arrowBack.svg';
import {useNavigation} from '@react-navigation/native';

interface AnimtedHeaderProps extends DefaultHeaderProps {
  marginHorizontal?: number;
}

type Props = {
  dark?: boolean;
  children: React.ReactNode;
  withTabBottomInset?: boolean;
  horizontalPadding?: number;
  withStatusBar?: boolean;
  withImageBackground?: boolean;
  withHeader?: boolean;
  headerProps?: DefaultHeaderProps;
  withScroll?: boolean;
  scrollProps?: ScrollViewProps;
  withAnimatedHeader?: boolean;
  animtedHeaderProps?: AnimtedHeaderProps;
  onPressClose?: () => void;
  withTopInsets?: boolean;
};

export const Wrapper: FC<Props> = ({
  dark,
  children,
  horizontalPadding = 20,
  withStatusBar,
  withTabBottomInset,
  withHeader,
  headerProps,
  withScroll,
  scrollProps,
  withAnimatedHeader,
  animtedHeaderProps,
  onPressClose,
  withTopInsets = true,
}) => {
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const styles = useStyles({
    dark,
    horizontalPadding,
    withTabBottomInset,
    withTopInsets,
  });
  const {theme} = useTheme();

  // eslint-disable-next-line react/no-unstable-nested-components
  const AnimatedHeader = () => (
    <>
      <View
        style={[
          styles.header,
          {marginHorizontal: animtedHeaderProps?.marginHorizontal},
        ]}>
        <Animated.Text
          style={{
            ...styles.headerTitle,
            color: theme.colors.primary,
            opacity: scrollY.interpolate({
              inputRange: [20, 60],
              outputRange: [0, 1],
            }),
          }}>
          {animtedHeaderProps?.title}
        </Animated.Text>
        {!animtedHeaderProps?.modal && (
          <Pressable style={styles.backIcon} hitSlop={20} onPress={goBack}>
            <ArrowBackImage width={24} height={24} />
          </Pressable>
        )}
        {animtedHeaderProps?.modal && (
          <Pressable
            style={styles.closeIcon}
            hitSlop={30}
            onPress={onPressClose}>
            <CloseIcon width={vp(14)} height={vp(14)} />
          </Pressable>
        )}
      </View>
      <Animated.View
        style={{
          marginLeft: -horizontalPadding,
          width: WIDTH,
          backgroundColor: theme.colors.border.E020,
          height: scrollY.interpolate({
            inputRange: [20, 60],
            outputRange: [0, 0.5],
            extrapolate: 'clamp',
          }),
        }}
      />
    </>
  );

  const scrollContiner = () => {
    if (withScroll) {
      return (
        <ScrollView
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {
              useNativeDriver: false,
            },
          )}
          showsVerticalScrollIndicator={false}
          {...scrollProps}>
          {children}
        </ScrollView>
      );
    }
    return children;
  };
  return (
    <>
      {withStatusBar && (
        <FocusAwareStatusBar
          translucent
          barStyle={dark ? 'light-content' : 'dark-content'}
        />
      )}

      <View style={[styles.root, dark ? styles.dark : styles.light]}>
        {withHeader && <DefaultHeader {...headerProps} />}
        {withAnimatedHeader && <AnimatedHeader />}
        {scrollContiner()}
      </View>
    </>
  );
};

const useStyles = ({
  horizontalPadding,
  withTabBottomInset,
  withTopInsets,
}: Pick<
  Props,
  'dark' | 'horizontalPadding' | 'withTabBottomInset' | 'withTopInsets'
>) => {
  const {theme} = useTheme();
  const {top} = useSafeAreaInsets();
  return StyleSheet.create({
    root: {
      paddingHorizontal: horizontalPadding,
      flex: 1,
      paddingBottom: withTabBottomInset ? Tab_Bar_Inset : 0,
      ...(withTopInsets ? {paddingTop: top === 0 ? 11 : top} : {}),
    },
    dark: {
      backgroundColor: theme.colors.primary,
    },
    light: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      paddingHorizontal: 24,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: vp(19),
      marginBottom: vp(12),
    },
    headerTitle: {
      fontFamily: fontFamily[600],
      fontSize: 16,
    },
    closeIcon: {
      position: 'absolute',
      right: 0,
    },
    backIcon: {
      position: 'absolute',
      left: 0,
    },
  });
};
