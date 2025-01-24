import {Dimensions, Platform, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');

export const ITEM_SIZE = Platform.OS === 'ios' ? width * 0.88 : width * 0.9;
export const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2;

export const styles = StyleSheet.create({
  carouselDots: {
    width: 7,
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  flex_1: {
    flex: 1,
  },
  carouselContainer: {
    top: 0,
  },
  dotsBox: {
    height: 7,
    position: 'relative',
  },
  steper: {
    flexDirection: 'row',
    marginTop: 43,
    marginBottom: 12,
    justifyContent: 'center',
  },
  step: {
    backgroundColor: '#C1C1C1',
    width: 6,
    height: 4,
    borderRadius: 4,
    marginRight: 4,
  },
  activeStep: {
    backgroundColor: '#40D183',
    width: 16,
  },
  empty: {width: EMPTY_ITEM_SIZE},
  item: {width: ITEM_SIZE},
});
