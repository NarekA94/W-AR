import {useNavigation} from '@react-navigation/native';
import React, {FC, memo, useMemo} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ArrowBack from '~/assets/images/arrowBack.svg';
import ArrowBackLight from '~/assets/images/arrowBackLight.svg';

interface BackButtonProps {
  withInsets?: boolean;
  mode?: 'dark' | 'light';
}

export const BackButton: FC<BackButtonProps> = memo(
  ({withInsets, mode = 'dark'}) => {
    const styles = useStyles({withInsets});
    const navigation = useNavigation();
    const handlePress = () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    };
    return (
      <Pressable hitSlop={25} style={styles.root} onPress={handlePress}>
        {mode === 'dark' ? <ArrowBack /> : <ArrowBackLight />}
      </Pressable>
    );
  },
);

const useStyles = ({withInsets}: Pick<BackButtonProps, 'withInsets'>) => {
  const {top} = useSafeAreaInsets();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          width: 50,
          marginTop: withInsets ? top : 0,
          height: 40,
          justifyContent: 'center',
        },
      }),
    [],
  );
};
