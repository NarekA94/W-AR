import React, {FC, memo, useCallback} from 'react';
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import screenBGIcon from '~/assets/images/collectible/mastercard.png';
import RoundIcon from '~/assets/images/collectible/round.svg';
import {AppText, Box} from '../blocks';
import {GLOBAL_STYLES, TextVariant, useTheme} from '~/theme';
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
export const CollectibleItem: FC<CollectibleProps> = props => {
  const renderPerks = useCallback((item: Perk, index: number) => {
    return (
      <Box
        key={index}
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
              <RoundIcon height={vp(93)} width={vp(93)} />
              <View style={styles.logoTable}>
                <Image
                  resizeMode="contain"
                  source={{uri: props.imageUri}}
                  style={styles.logo}
                />
              </View>
            </View>
          </View>
          <View style={styles.iconsSection}>
            {props.perks?.map(renderPerks)}
          </View>
          <AppText variant={TextVariant.S_5W} style={styles.name}>
            {props.name}
          </AppText>
          <AppText variant={TextVariant['10_4G']}>{props.brandName}</AppText>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

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
    width: vp(127),
    height: vp(206),
  },
  root: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  name: {
    marginTop: vp(6),
    marginBottom: vp(5),
  },
  body: {
    flex: 1,
    paddingHorizontal: vp(17),
    paddingTop: 17,
  },
  logoBox: {
    width: '100%',
    alignItems: 'center',
  },
  perkBox: {
    width: vp(30),
    height: vp(30),
  },
  perkIcon: {
    height: vp(26),
    width: vp(26),
  },
  heaertIcon: {
    marginLeft: -10,
  },
  iconsSection: {
    flexDirection: 'row',
    marginTop: vp(3),
  },
  logoTable: {
    position: 'absolute',
    width: vp(93),
    height: vp(93),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {width: vp(89), height: vp(89)},
  skeletonPerk: {
    width: vp(30),
    height: vp(30),
    borderRadius: 100,
    marginTop: vp(3),
  },
});
