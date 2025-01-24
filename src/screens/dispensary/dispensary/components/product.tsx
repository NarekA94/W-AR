import React, {FC, memo} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {AppText, Points} from '~/components';
import {useGetProductQuery} from '~/store/query/product';
import {GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';

interface ProductProps {
  productId: number;
}

export const Product: FC<ProductProps> = memo(({productId}) => {
  const {data} = useGetProductQuery({id: productId});
  return (
    <View style={styles.root}>
      <View style={[GLOBAL_STYLES.row_vertical_center, GLOBAL_STYLES.flex_1]}>
        <View style={styles.imageBox}>
          {data?.images?.[0]?.file?.url && (
            <Image
              style={styles.image}
              source={{uri: data?.images?.[0].file.url}}
            />
          )}
        </View>
        <View style={GLOBAL_STYLES.flex_1}>
          <AppText
            style={styles.name}
            variant={TextVariant.M_R}
            color={TextColors.A100}>
            {data?.name}
          </AppText>
        </View>
      </View>
      <View>
        <Points points={data?.priceForPoints} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  name: {
    flexShrink: 1,
    // width: vp(170),
    // width: '100%',
    // backgroundColor: 'red',
    marginLeft: vp(25),
  },
  imageBox: {
    width: vp(70),
    height: vp(70),
  },
  image: {
    width: '100%',
    height: '100%',
  },
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: vp(32),
    marginBottom: vp(15),
    width: '100%',
  },
});
