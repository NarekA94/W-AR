import React, {memo, useCallback, FC} from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
  Linking,
} from 'react-native';
import {AppText, Box} from '~/components';
import {FontWeight, GLOBAL_STYLES, TextVariant} from '~/theme';
import LocationIcon from '~/assets/images/zip/location.svg';
import AlarmIcon from '~/assets/images/alarm.svg';
import PhoneIcon from '~/assets/images/phone.svg';
import {RowItem} from './row-item';
import LinearGradient from 'react-native-linear-gradient';
import {DispensaryStatus} from './status';
import {DispensaryBoxSectionRight} from './section-right';
import Clipboard from '@react-native-clipboard/clipboard';
import {getWorkingDaysFromWeekDays} from './utils';
import type {Dispensary, WorkDays} from '~/store/query/brand';
import {DispensaryType} from '../dispensaries-screen/dispensaries-screen';
import {phoneNumberWithoutSymbols} from '~/utils/form';
import {logger} from '~/utils';

const colors = ['#2F2F2F', '#525252', '#2F2F2F'];
const start = {x: 0, y: 0};
const end = {x: 1, y: 0};

interface DispensaryItemProps {
  name: string;
  address: string;
  phone: string;
  longitudeCoordinate: number;
  latitudeCoordinate: number;
  onPress?: (id: number) => void;
  id: number;
  isThirdParty?: boolean;
  isFavourite?: boolean;
  workTime?: WorkDays;
  disabled?: boolean;
  distance: Nullable<string>;
  type?: DispensaryType;
  tabInfo?: Dispensary['tabInfo'];
  containerStyle?: StyleProp<ViewStyle>;
  onAddressCopied?: () => void;
  onLikeSuccess?: (dispensaryId: number, isFavorite: boolean) => void;
}

export const DispensaryItem: FC<DispensaryItemProps> = memo(
  ({onAddressCopied, onPress, disabled, ...props}) => {
    const {id} = props;
    const handlePressCopy = useCallback(
      (copyText: string) => {
        onAddressCopied?.();
        Clipboard.setString(copyText);
      },
      [onAddressCopied],
    );

    const handlePressItem = useCallback(() => {
      if (!disabled) {
        onPress?.(id);
      }
    }, [id, onPress, disabled]);

    const handlePressPhoneNumber = useCallback(async () => {
      try {
        await Linking.openURL(`tel:${phoneNumberWithoutSymbols(props.phone)}`);
      } catch (err: any) {
        logger.error('Error', err?.message);
      }
    }, [props]);

    return (
      <TouchableOpacity disabled={disabled} onPress={handlePressItem}>
        <Box containerStyle={[styles.boxStyle, props.containerStyle]}>
          <View style={styles.root}>
            <View style={GLOBAL_STYLES.row_between}>
              <AppText
                style={GLOBAL_STYLES.flex_1}
                numberOfLines={1}
                variant={TextVariant.H_5}
                fontWeight={FontWeight.W500}>
                {props.name}
              </AppText>
              {props.type === DispensaryType.BRAND ? (
                <View style={GLOBAL_STYLES.row_vertical_center}>
                  <Image
                    resizeMode="contain"
                    style={styles.tabInfoImage}
                    source={{uri: props.tabInfo?.icon?.url}}
                  />
                  <AppText
                    variant={TextVariant.P_M}
                    fontWeight={FontWeight.W500}>
                    {props.tabInfo?.name}
                  </AppText>
                </View>
              ) : (
                <DispensaryStatus isThirdParty={props.isThirdParty} />
              )}
            </View>
            <View style={[GLOBAL_STYLES.row_between, styles.body]}>
              <View style={styles.section}>
                <RowItem
                  title={props.address}
                  active={true}
                  icon={<LocationIcon width={vp(20)} />}
                  withCopy
                  onPress={handlePressItem}
                  onLongPress={handlePressCopy}
                />
                <LinearGradient
                  colors={colors}
                  start={start}
                  end={end}
                  style={styles.linearGradient}
                />
                <RowItem
                  titleStyles={styles.titleStyles}
                  title={getWorkingDaysFromWeekDays(props.workTime)}
                  icon={<AlarmIcon width={vp(20)} />}
                />
                <RowItem
                  onPress={handlePressPhoneNumber}
                  active={true}
                  title={props.phone}
                  icon={<PhoneIcon width={vp(20)} />}
                  phoneMask
                />
              </View>
              <View style={styles.sectionRight}>
                <DispensaryBoxSectionRight
                  distance={props.distance}
                  dispensaryId={props.id}
                  longitudeCoordinate={props.longitudeCoordinate}
                  latitudeCoordinate={props.latitudeCoordinate}
                  isFavourite={props.isFavourite}
                  onLikeSuccess={props.onLikeSuccess}
                />
              </View>
            </View>
          </View>
        </Box>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  boxStyle: {
    minHeight: vp(183),
    marginBottom: vp(14),
  },
  root: {
    flex: 1,
    paddingHorizontal: vp(16),
    paddingTop: vp(19),
  },
  section: {
    width: '73%',
    flex: 1,
  },
  body: {
    marginTop: vp(14),
    flex: 1,
  },
  listItemName: {
    marginLeft: vp(14),
    lineHeight: 20,
    marginTop: -4,
  },
  linearGradient: {
    height: 1,
    marginBottom: vp(11),
    marginLeft: -vp(15),
  },
  location: {paddingRight: 5},
  sectionRight: {
    width: '27%',
    height: '100%',
    alignItems: 'flex-end',
  },
  titleStyles: {
    textTransform: 'capitalize',
  },
  tabInfoImage: {
    marginRight: vp(8),
    height: vp(15),
    width: vp(15),
    marginBottom: vp(2),
  },
});
