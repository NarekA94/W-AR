import React, {FC, memo, PropsWithChildren, useCallback, useMemo} from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {AppText, Box} from '~/components';
import SelectedIcon from '~/assets/images/buttons/rounded.png';
import {TextColors, TextVariant} from '~/theme';

interface StateItemProps {
  name: string;
  icon?: string;
  isSelected: boolean;
  id: number;
  onPress?: (id: number) => void;
}

const SelectedBackground: FC<PropsWithChildren> = ({children}) => {
  return (
    <Box radius={18} containerStyle={styles.box}>
      <>
        {children}
        <View style={styles.selectedBox}>
          <ImageBackground source={SelectedIcon} style={styles.selectedIcon}>
            <View style={styles.dot} />
          </ImageBackground>
        </View>
      </>
    </Box>
  );
};

export const StateItem: FC<StateItemProps> = memo(
  ({name, icon, isSelected, id, onPress}) => {
    const handlePressItem = useCallback(() => {
      onPress?.(id);
    }, [id, onPress]);

    const body = useMemo(() => {
      return (
        <View style={styles.body}>
          <View>
            <Image
              resizeMode="contain"
              style={styles.stateIcon}
              source={{uri: icon}}
            />
          </View>
          <AppText
            variant={TextVariant.M_B}
            color={isSelected ? TextColors.A100 : TextColors.G100}>
            {name}
          </AppText>
        </View>
      );
    }, [icon, name, isSelected]);

    return (
      <TouchableOpacity
        onPress={handlePressItem}
        disabled={isSelected}
        style={styles.root}>
        {isSelected ? <SelectedBackground>{body}</SelectedBackground> : body}
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  root: {
    marginBottom: vp(10),
  },
  body: {
    backgroundColor: 'black',
    flex: 1,
    flexDirection: 'row',
    height: vp(58),
    borderRadius: 18,
    alignItems: 'center',
  },
  box: {
    height: vp(58),
  },
  selectedIcon: {
    width: vp(18),
    height: vp(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBox: {
    position: 'absolute',
    right: 15,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  dot: {
    backgroundColor: 'black',
    borderRadius: 50,
    width: vp(6),
    height: vp(6),
  },
  stateIcon: {
    height: vp(35),
    width: vp(35),
    marginRight: vp(20),
    marginLeft: vp(18),
  },
});
