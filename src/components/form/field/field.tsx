import React, {ReactNode} from 'react';
import {FieldError} from 'react-hook-form';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {AppText} from '~/components';
import {TextVariant, useTheme} from '~/theme';

interface Props {
  label?: string | null;
  error?: FieldError;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  childrenContainerStyles?: StyleProp<ViewStyle>;
  informer?: string | null;
  isDirty?: boolean;
  showError?: boolean;
  bottomSpace?: number;
}

export const Field: React.FC<Props> = ({
  label,
  error,
  style,
  children,
  bottomSpace = vp(20),
  showError = false,
  childrenContainerStyles,
}) => {
  const styles = useStyles();
  return (
    <View style={[{marginBottom: bottomSpace}, style]}>
      {label && (
        <AppText variant={TextVariant.P_M} style={styles.label}>
          {label}
        </AppText>
      )}
      <View style={childrenContainerStyles}>{children}</View>
      {error?.message && (error.type === 'server' || showError) && (
        <AppText variant={TextVariant.R} style={styles.error}>
          {error.message}
        </AppText>
      )}
    </View>
  );
};

const useStyles = () => {
  const {theme} = useTheme();

  return StyleSheet.create({
    root: {
      marginBottom: 24,
    },
    label: {
      marginBottom: vp(10),
    },
    error: {
      marginTop: vp(7),
      color: theme.colors.common.error,
      marginLeft: 12,
    },
    informer: {
      marginTop: 8,
    },
  });
};
