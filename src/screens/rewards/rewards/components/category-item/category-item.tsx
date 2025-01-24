import React, {FC, memo, useCallback, useMemo} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {AppText} from '~/components';
import {TextColors, TextVariant, useTheme} from '~/theme';

interface CategoryItemProps {
  title?: string;
  isSelected: boolean;
  onPress?: (title?: string) => void;
}

export const CategoryItem: FC<CategoryItemProps> = memo(props => {
  const {isSelected} = props;
  const {theme} = useTheme();
  const gradientColors = useMemo(() => {
    return [
      'rgba(102, 102, 102, 0.7)',
      isSelected ? 'rgba(102, 102, 102, 0.7)' : 'rgba(102, 102, 102, 0.4)',
    ];
  }, [isSelected]);

  const handlePress = useCallback(() => {
    props.onPress?.(props.title);
  }, [props]);

  return (
    <TouchableOpacity onPress={handlePress} style={styles.root}>
      <LinearGradient
        angle={160}
        useAngle
        style={styles.gradient}
        colors={gradientColors}>
        <View
          style={[
            styles.body,
            {
              backgroundColor: isSelected
                ? theme.colors.primary
                : theme.colors.background.gray,
            },
          ]}>
          <AppText variant={TextVariant.S_R} color={TextColors.A100}>
            {props.title}
          </AppText>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  root: {
    borderRadius: 12,
    marginRight: vp(8),
  },
  gradient: {
    height: vp(45),
    borderRadius: 12,
    padding: 1,
  },
  body: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
});
