import {StyleSheet} from 'react-native';
import {GLOBAL_STYLES} from '~/theme';

export const styles = StyleSheet.create({
  orderNumber: {
    textTransform: 'uppercase',
    marginLeft: vp(4),
  },
  horizontal_16: {
    paddingHorizontal: vp(16),
  },
  root: {
    paddingTop: vp(16),
    flex: 1,
  },
  boxStyle: {
    marginBottom: vp(20),
  },
  imageBox: {
    width: vp(50),
    height: vp(50),
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productSection: {
    ...GLOBAL_STYLES.row_between,
    marginTop: vp(10),
    paddingHorizontal: vp(16),
    marginBottom: vp(18),
    alignItems: 'flex-end',
  },
  nameBox: {
    flex: 1,
    paddingLeft: vp(15),
  },
  name: {
    marginBottom: vp(12),
  },
  seeAll: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: vp(10),
  },
  hr: {
    width: '100%',
    marginLeft: 0,
    marginBottom: vp(20),
  },
  hr2: {
    width: '100%',
    marginLeft: 0,
    marginBottom: vp(15),
    marginTop: 0,
  },
  dispensaryBlock: {
    paddingHorizontal: vp(16),
    marginTop: vp(20),
    marginBottom: vp(20),
  },
  location: {alignSelf: 'flex-start', marginLeft: vp(10)},
  cancel: {
    paddingHorizontal: vp(16),
    marginBottom: vp(28),
  },
  isDelivery: {
    position: 'absolute',
    right: vp(15),
    bottom: -vp(15),
  },
  workDays: {
    textTransform: 'capitalize',
    fontSize: 16,
  },
  cost: {
    ...GLOBAL_STYLES.row_vertical_center,
    marginTop: vp(5),
  },
  footer: {
    paddingTop: vp(10),
  },
  createdDate: {
    marginLeft: vp(16),
    marginTop: vp(5),
  },
  dispensaryName: {
    marginLeft: vp(16),
    marginTop: vp(15),
  },
  rewardTab: {
    marginBottom: vp(15),
  },
  rewardTabShowAll: {
    marginBottom: vp(22),
  },
  titleStyles: {
    fontSize: 16,
    lineHeight: 17,
  },
  infoText: {
    marginBottom: vp(22),
  },
  priceBox: {
    ...GLOBAL_STYLES.row_between,
    marginBottom: vp(17),
  },
  orderCost: {
    marginRight: 4,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 26,
  },
});
