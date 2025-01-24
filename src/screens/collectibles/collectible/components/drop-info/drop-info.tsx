import React, {FC, memo, useCallback} from 'react';
import {FlatList, Image, StyleSheet, View} from 'react-native';
import {AppText, Box} from '~/components';
import {GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import type {Perk} from '~/store/query/nft-drop';

interface DropInfoProps {
  description?: string;
  perks?: Nullable<Perk[]>;
}
const boxgradient = ['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 1)'];

export const DropInfo: FC<DropInfoProps> = memo(props => {
  const renderPerks = useCallback(({item}: FlatListItem<Perk>) => {
    return (
      <View>
        <Box
          angle={150}
          radius={100}
          gradientColorsBottom={boxgradient}
          containerStyle={styles.perkBox}>
          <View style={GLOBAL_STYLES.flex_1_center}>
            <Image source={{uri: item.image.url}} style={styles.perk} />
          </View>
        </Box>
        <AppText style={styles.perkName} variant={TextVariant.P_M}>
          {item.name}
        </AppText>
      </View>
    );
  }, []);
  return (
    <View>
      <AppText
        style={styles.desciption}
        variant={TextVariant.H_6_W5}
        withGradient>
        Description
      </AppText>
      <AppText
        style={styles.info}
        color={TextColors.G090}
        variant={TextVariant.S_L}>
        {props.description}
      </AppText>
      <AppText
        style={styles.desciption}
        variant={TextVariant.H_6_W5}
        withGradient>
        Perks
      </AppText>
      <FlatList horizontal data={props.perks} renderItem={renderPerks} />
    </View>
  );
});

const styles = StyleSheet.create({
  info: {
    marginBottom: vp(24),
    lineHeight: 17,
  },
  desciption: {
    marginBottom: vp(16),
    marginTop: vp(25),
  },
  perk: {
    width: vp(75),
    height: vp(75),
  },
  perkBox: {
    width: vp(95),
    height: vp(95),
  },
  perkName: {
    textAlign: 'center',
    marginTop: vp(10),
  },
});
