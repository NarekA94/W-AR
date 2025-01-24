import React, {FC, memo} from 'react';
import {ImageBackgroundWrapper} from '~/components';
import Background from '~/assets/images/draft/main-container.png';
import {StyleSheet, View} from 'react-native';
import {RootHeader} from '~/components/headers';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {GLOBAL_STYLES, TextVariant, useTheme} from '~/theme';
import {WIDTH} from '~/constants/layout';

interface MainContainerProps {
  HPadding?: number;
  children?: React.ReactNode;
  notchWidth?: number;
  bottomSpace?: number;
  onGoBack?: () => void;
}

export const MainContainer: FC<MainContainerProps> = memo(
  ({
    HPadding = 24,
    children,
    notchWidth = WIDTH / 2,
    bottomSpace = 16,
    onGoBack,
  }) => {
    const {top, bottom} = useSafeAreaInsets();
    const {theme} = useTheme();
    return (
      <ImageBackgroundWrapper image={Background}>
        <View style={{marginTop: top + 11, ...GLOBAL_STYLES.flex_1}}>
          <View style={{...styles.header, paddingHorizontal: HPadding}}>
            <RootHeader
              titleVariant={TextVariant.M_B}
              onGoBack={onGoBack}
              headerMarginBottom={0}
              title="Registration"
            />
          </View>
          <View style={GLOBAL_STYLES.flex_1}>
            <View
              style={[
                styles.notch,
                {backgroundColor: theme.colors.primary, width: notchWidth},
              ]}
            />
            <View
              style={[
                styles.section,
                {
                  backgroundColor: theme.colors.background.primary,
                  paddingHorizontal: HPadding,
                  paddingBottom: bottom === 0 ? bottomSpace : bottom,
                },
              ]}>
              {children}
            </View>
          </View>
        </View>
      </ImageBackgroundWrapper>
    );
  },
);

const styles = StyleSheet.create({
  header: {
    height: vp(40),
    justifyContent: 'center',
    marginBottom: vp(24),
  },
  section: {
    flex: 1,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    marginBottom: -1,
    paddingTop: 24,
  },
  notch: {
    position: 'absolute',
    height: 30,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    top: -10,
  },
});
