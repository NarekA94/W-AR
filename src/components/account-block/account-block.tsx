import React, {FC, ReactNode} from 'react';
import {RadialGradient} from '~/components/gradient';
import {AppText} from '~/components/blocks';
import {WIDTH} from '~/constants/layout';
import {TextColors, TextVariant, useTheme} from '~/theme';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import ArrowRight from '~/assets/images/arrowRight.svg';

const colors = ['#242424', 'black'];
interface AccountBlockProps {
  title?: string;
  text?: string;
  withArrow?: boolean;
  svgIcon?: ReactNode;
  switcher?: ReactNode;
  onPress?: () => void;
}

export const AccountBlock: FC<AccountBlockProps> = ({
  title,
  text,
  withArrow,
  svgIcon,
  switcher,
  onPress,
}) => {
  const {theme} = useTheme();

  return (
    <TouchableOpacity disabled={!onPress} onPress={onPress} style={styles.main}>
      <RadialGradient height={vp(58)} width={WIDTH - 40} colors={colors}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            {svgIcon}
            <AppText
              numberOfLines={1}
              variant={TextVariant.H_6_W5}
              style={styles.title}>
              {title}
            </AppText>
          </View>
          {text && (
            <AppText
              style={styles.value}
              numberOfLines={1}
              variant={TextVariant.S_R}
              color={TextColors.A100}>
              {text}
            </AppText>
          )}
          {withArrow && <ArrowRight color={theme.colors.background.primary} />}
          {switcher}
        </View>
      </RadialGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  main: {
    marginBottom: vp(10),
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: vp(15),
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: vp(58),
  },
  title: {
    marginLeft: vp(16),
  },
  value: {
    flex: 1.75,
    textAlign: 'right',
  },
});
