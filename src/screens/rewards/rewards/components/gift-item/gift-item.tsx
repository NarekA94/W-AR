import {useNavigation} from '@react-navigation/native';
import React, {FC, memo, useCallback, useMemo} from 'react';
import {Image, ImageBackground, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BGimage from '~/assets/images/rewards/Stars.webp';
import {AppText, Button} from '~/components';
import {UserScreenNavigationProp, UserStackRoutes} from '~/navigation';
import {GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
interface GiftItemProps {
  primaryColor: string;
  imageUri: string;
  name: string;
  productId: number;
  brandId: number;
}

const loaction = [0.1, 0.65, 1];

export const GiftItem: FC<GiftItemProps> = memo(
  ({primaryColor = 'black', brandId, productId, ...props}) => {
    const colors = useMemo(() => {
      return [primaryColor, 'rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 1)'];
    }, [primaryColor]);
    const navigation = useNavigation<UserScreenNavigationProp>();
    const handlePressReddem = useCallback(() => {
      navigation.navigate(UserStackRoutes.Dispensaries, {
        brandId,
        productId,
        hasPoints: true,
      });
    }, [brandId, productId, navigation]);

    return (
      <View style={styles.root}>
        <LinearGradient
          useAngle
          angle={165}
          style={styles.gradient}
          locations={loaction}
          colors={colors}>
          <ImageBackground style={GLOBAL_STYLES.flex_1} source={BGimage}>
            <View style={styles.section}>
              <View>
                <Image style={styles.image} source={{uri: props.imageUri}} />
              </View>
              <View style={styles.nameBox}>
                <AppText
                  variant={TextVariant.S_B}
                  color={TextColors.A100}
                  withGradient>
                  {props.name}
                </AppText>
              </View>
              <View>
                <Button
                  onPress={handlePressReddem}
                  containerStyle={{height: vp(42)}}
                  textStyle={styles.buttonTextStyle}
                  title="Redeem"
                  width={vp(88)}
                  withImageBackground
                />
              </View>
            </View>
          </ImageBackground>
        </LinearGradient>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  buttonTextStyle: {fontSize: 12},
  buttonContainerStyle: {height: vp(42)},
  root: {
    height: vp(112),
    width: vp(335),
    borderWidth: 1,
    borderColor: 'rgba(102, 102, 102, 0.7)',
    borderRadius: 25,
    marginBottom: vp(20),
    backgroundColor: 'black',
  },
  gradient: {
    borderRadius: 25,
    left: -1,
    top: -1,
    bottom: -1,
    right: -1,
    position: 'absolute',
    opacity: 1,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: vp(20),
  },
  image: {
    width: vp(50),
    height: vp(50),
  },
  nameBox: {
    flex: 1,
    paddingLeft: vp(15),
  },
});
