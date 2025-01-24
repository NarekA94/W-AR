import React, {FC, memo, useCallback} from 'react';
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import screenBGIcon from '~/assets/images/collectible/mastercard.png';
import RoundIcon from '~/assets/images/collectible/round.svg';
import {AppText, Box} from '~/components';
import {
  FontWeight,
  GLOBAL_STYLES,
  TextColors,
  TextVariant,
  useTheme,
} from '~/theme';
import {WIDTH} from '~/constants/layout';
import Image from 'react-native-fast-image';

import type {Perk} from '~/store/query/nft-drop';

interface CollectibleProps {
  onPress?: () => void;
  name: string;
  brandName: string;
  imageUri: string;
  perks: Nullable<Perk[]>;
}
const boxgradient = ['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 1)'];

export const CollectibleItem: FC<CollectibleProps> = memo(props => {
  const renderPerks = useCallback(({item, index}: FlatListItem<Perk>) => {
    return (
      <Box
        angle={150}
        gradientColorsBottom={boxgradient}
        containerStyle={[styles.perkBox, index > 0 && styles.heaertIcon]}>
        <View style={GLOBAL_STYLES.flex_1_center}>
          <Image source={{uri: item.image.url}} style={styles.perkIcon} />
        </View>
      </Box>
    );
  }, []);
  return (
    <TouchableOpacity style={styles.block} onPress={props.onPress}>
      <ImageBackground
        resizeMode="stretch"
        style={styles.root}
        imageStyle={styles.image}
        source={screenBGIcon}>
        <View style={styles.body}>
          <View style={styles.logoBox}>
            <View>
              <RoundIcon height={vp(111)} width={vp(111)} />
              <View style={styles.logoTable}>
                <Image
                  resizeMode="contain"
                  source={{uri: props.imageUri}}
                  style={styles.logo}
                />
              </View>
            </View>
          </View>
          <FlatList
            data={props.perks}
            style={GLOBAL_STYLES.flex_1}
            keyExtractor={item => item.id.toString()}
            renderItem={renderPerks}
            horizontal
          />
          <View style={styles.nameBlock}>
            <AppText
              variant={TextVariant.M_B}
              fontWeight={FontWeight.W500}
              color={TextColors.A100}>
              {props.name}
            </AppText>
            <AppText variant={TextVariant.P_M} color={TextColors.G090}>
              {props.brandName}
            </AppText>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
});

export const CollectibleItemSkeleton = memo(() => {
  const {theme} = useTheme();
  return (
    <Box containerStyle={styles.block}>
      <View style={styles.body}>
        <View style={styles.logoBox}>
          <RoundIcon height={vp(93)} width={vp(93)} />
        </View>
        <View
          style={[styles.skeletonPerk, {backgroundColor: theme.colors.primary}]}
        />
      </View>
    </Box>
  );
});

const styles = StyleSheet.create({
  block: {
    marginRight: vp(16),
    width: WIDTH / 2 - 8 - 20,
    height: vp(229),
    marginBottom: vp(16),
  },
  root: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  nameBlock: {flex: 1, justifyContent: 'flex-end', paddingBottom: vp(14)},
  body: {
    flex: 1,
    paddingHorizontal: vp(17),
    paddingTop: 17,
  },
  logoBox: {
    width: '100%',
    alignItems: 'center',
  },
  icons: {
    width: vp(38),
    height: vp(38),
  },
  heaertIcon: {
    marginLeft: -10,
  },
  iconsSection: {
    flexDirection: 'row',
  },
  logoTable: {
    position: 'absolute',
    width: vp(111),
    height: vp(111),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {width: vp(100), height: vp(100)},
  skeletonPerk: {
    width: vp(30),
    height: vp(30),
    borderRadius: 100,
    marginTop: vp(3),
  },
  perkBox: {
    width: vp(35),
    height: vp(35),
  },
  perkIcon: {
    height: vp(26),
    width: vp(26),
  },
});
