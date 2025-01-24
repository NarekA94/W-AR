import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  OR: {
    marginVertical: vp(15),
  },
  topSection: {
    marginBottom: vp(17),
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  start: {
    justifyContent: 'flex-start',
  },
  end: {
    justifyContent: 'flex-end',
  },
  icon: {
    height: vp(20),
    width: vp(20),
  },
  notification: {
    flexDirection: 'row',
    gap: vp(18),
    padding: vp(14),
    paddingBottom: vp(16),
    borderRadius: 8,
    width: '100%',
    borderColor: '#313131',
    borderWidth: 1,
  },
  notificationTitle: {marginBottom: vp(8), lineHeight: 16},
});
