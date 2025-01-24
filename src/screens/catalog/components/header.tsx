import React, {FC, useCallback} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {GLOBAL_STYLES} from '~/theme';
import ProfileIcon from '~/assets/images/catalog/profile.svg';
import Logo from '~/assets/images/logo.svg';
import {useNavigation} from '@react-navigation/native';
import {UserScreenNavigationProp, UserStackRoutes} from '~/navigation';

interface CatalogHeaderProps {
  onPressZip?: () => void;
}

export const CatalogHeader: FC<CatalogHeaderProps> = () => {
  const navigation = useNavigation<UserScreenNavigationProp>();
  const handlePressProfile = useCallback(() => {
    navigation.navigate(UserStackRoutes.Profile);
  }, []);
  return (
    <View style={styles.root}>
      <Logo />
      <TouchableOpacity onPress={handlePressProfile}>
        <ProfileIcon width={vp(38)} height={vp(38)} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    ...GLOBAL_STYLES.row_between,
    marginTop: vp(11),
    paddingHorizontal: vp(20),
    marginBottom: vp(22),
  },
  userInfo: {
    marginLeft: vp(15),
  },
  zip: {
    marginTop: vp(4),
  },
});
