import {StyleSheet} from 'react-native';
import {fontFamily} from '~/theme/utils/font-family';

export const styles = StyleSheet.create({
  title: {
    marginBottom: vp(10),
  },
  clearCart: {
    alignSelf: 'flex-end',
    position: 'absolute',
    right: 20,
  },
  horizontal_24: {paddingHorizontal: 24},
  header: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: vp(19),
    marginBottom: vp(12),
  },
  headerTitle: {
    fontFamily: fontFamily[600],
    fontSize: 16,
  },
});
