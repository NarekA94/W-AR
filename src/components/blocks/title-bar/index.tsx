import React, {FC} from 'react';
import {StyleSheet} from 'react-native';
import {AppText} from '~/components';
import {TextColors, TextVariant} from '~/theme';

type TitleBarProps = {
  title: string;
};

const TitleBar: FC<TitleBarProps> = ({title}) => {
  return (
    <AppText
      style={styles.root}
      variant={TextVariant.H2_B}
      color={TextColors.secondary}>
      {title}
    </AppText>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingVertical: 12,
  },
});

export default TitleBar;
