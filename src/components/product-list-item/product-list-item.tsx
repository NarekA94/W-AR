import React, {FC, memo} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {useStyles} from './styles';
import AddImage from '~/assets/images/add.svg';
import AddedImage from '~/assets/images/added.svg';
import {AppText} from '~/components';
import {TextColors, TextVariant, useTheme} from '~/theme';
import {useIntl} from 'react-intl';
import {ToFixNumber} from '~/utils/utils';

interface CategoryListItemProps {
  brandName: string;
  name: string;
  thc: number;
  image: string;
  price: number;
  gramWeight: number;
  ounceWeight: number;
  isSelected: boolean;
  onPressAdd?: () => void;
  onPress?: () => void;
  strain: string;
}

export const ProductListItem: FC<CategoryListItemProps> = memo(props => {
  const intl = useIntl();
  const {theme} = useTheme();
  const styles = useStyles();
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.order}>
      <View style={styles.imageBox}>
        <Image
          resizeMode="center"
          style={styles.orderImage}
          source={{uri: props.image}}
        />
      </View>
      <View style={styles.content}>
        <AppText variant={TextVariant.R} color={TextColors.B040}>
          {props.brandName}
        </AppText>
        <AppText variant={TextVariant.S_R} style={styles.title}>
          {props.name}
        </AppText>
        <View style={[styles.row, styles.box]}>
          <View
            style={[styles.thc, {backgroundColor: theme.colors.pink.medium}]}>
            <AppText variant={TextVariant.B} style={styles.thcText}>
              {intl.formatMessage({
                id: 'thc',
                defaultMessage: 'THC',
              })}
              : {Math.floor(props.thc)}%
            </AppText>
          </View>
          <View style={styles.indica}>
            <AppText variant={TextVariant.B} style={styles.indicaText}>
              {props.strain}
            </AppText>
          </View>
        </View>
        <View style={styles.row}>
          <AppText variant={TextVariant.M_B}>${props.price}.00</AppText>
          <AppText variant={TextVariant.R} style={styles.secondary}>
            {ToFixNumber(props.gramWeight)}g / {props.ounceWeight}oz
          </AppText>
        </View>
      </View>

      <TouchableOpacity style={styles.addBtn} onPress={props.onPressAdd}>
        {props.isSelected ? <AddedImage /> : <AddImage />}
      </TouchableOpacity>
    </TouchableOpacity>
  );
});
