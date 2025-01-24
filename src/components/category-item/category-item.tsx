import React, {FC, memo, useCallback} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {AppText, CategoryBadge} from '~/components';
import {TextVariant} from '~/theme';

const colors = ['rgba(68, 68, 68, 1)', 'rgba(68, 68, 68, 0)'];
const start = {x: 0, y: 0};
const end = {x: 0, y: 1};
interface CategoryItemProps {
  selectCategory: (id: number) => void;
  name: string;
  isSelected?: boolean;
  uri?: string;
  id: number;
  rewardAvailable?: number;
}
export const CategoryItem: FC<CategoryItemProps> = memo(
  ({isSelected, ...props}) => {
    const selectCategory = useCallback(() => {
      props.selectCategory?.(props.id);
    }, []);
    return (
      <TouchableOpacity style={styles.category} onPress={selectCategory}>
        <View style={styles.section}>
          <LinearGradient
            start={start}
            end={end}
            colors={colors}
            style={styles.categoryImageTop}>
            <View
              style={[
                styles.imageBackground,
                isSelected && styles.selectedImageBackground,
              ]}>
              <Image style={styles.categoryImage} source={{uri: props.uri}} />
            </View>
          </LinearGradient>
          {!!props.rewardAvailable && (
            <View style={styles.badgeBox}>
              <CategoryBadge cost={props.rewardAvailable} />
            </View>
          )}
          <AppText
            numberOfLines={1}
            ellipsizeMode="tail"
            variant={TextVariant['13_4A']}
            style={styles.categoryName}>
            {props.name}
          </AppText>
        </View>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  category: {
    width: vp(78),
    overflow: 'visible',
    paddingTop: vp(25),
  },
  categoryImageTop: {
    width: vp(64),
    height: vp(64),
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBackground: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    width: '100%',
    height: '100%',
  },
  selectedImageBackground: {
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryImageBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  categoryImage: {
    width: '80%',
    height: '80%',
  },
  wrapper: {
    width: vp(60),
    height: vp(60),
    borderRadius: 100,
    backgroundColor: 'black',
  },
  categoryName: {
    textAlign: 'center',
    marginTop: vp(10),
  },
  badgeBox: {
    position: 'absolute',
    right: -10,
    top: -10,
  },
  section: {
    width: vp(60),
    overflow: 'visible',
  },
});
