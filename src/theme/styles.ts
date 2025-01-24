import {StyleSheet} from 'react-native';

export const GLOBAL_STYLES = StyleSheet.create({
  flex_1: {
    flex: 1,
  },
  text_center: {
    textAlign: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flex_1_center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row_vertical_center: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  row_center: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  row_between: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wrap: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  margin_24: {
    marginHorizontal: 24,
  },
  padding_24: {
    paddingHorizontal: 24,
  },
  horizontal_20: {
    paddingHorizontal: 20,
  },
  overflow_visible: {overflow: 'visible'},
  flexGrow_1: {
    flexGrow: 1,
  },
  flexShrink_1: {
    flexShrink: 1,
  },
  full_height_width: {
    width: '100%',
    height: '100%',
  },
});
