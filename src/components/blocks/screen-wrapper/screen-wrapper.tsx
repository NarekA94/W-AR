import React, {FC} from 'react';

import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FocusAwareStatusBar} from '~/components/focus-aware-status-bar/focus-aware-status-bar';
import {DefaultHeader, DefaultHeaderProps} from '~/components/headers';
import {useTheme} from '~/theme';

type Props = {
  dark?: boolean;
  children: React.ReactNode;
  withBottomInset?: boolean;
  horizontalPadding?: number;
  withStatusBar?: boolean;
  withHeader?: boolean;
  headerProps?: DefaultHeaderProps;
  withTopInsets?: boolean;
};

export const ScreenWrapper: FC<Props> = ({
  dark = true,
  children,
  horizontalPadding = 20,
  withStatusBar,
  withBottomInset,
  withHeader = false,
  headerProps,
  withTopInsets = true,
}) => {
  const styles = useStyles({
    dark,
    horizontalPadding,
    withBottomInset,
    withTopInsets,
  });

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
        {children}
      </View>
    </>
  );
};

const useStyles = ({
  horizontalPadding,
  withBottomInset,
  withTopInsets,
}: Pick<
  Props,
  'dark' | 'horizontalPadding' | 'withBottomInset' | 'withTopInsets'
>) => {
  const {theme} = useTheme();
  const {top, bottom} = useSafeAreaInsets();
  return StyleSheet.create({
    root: {
      paddingHorizontal: horizontalPadding,
      flex: 1,
      ...(withBottomInset ? {paddingBottom: bottom} : {}),

      ...(withTopInsets ? {paddingTop: top} : {}),
    },
    dark: {
      backgroundColor: theme.colors.primary,
    },
    light: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
  });
};
