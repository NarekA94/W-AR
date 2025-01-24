import {StyleSheet} from 'react-native';
import {useTheme} from '~/theme';

export const useStyles = () => {
  const {theme} = useTheme();
  return StyleSheet.create({
    root: {
      marginTop: 20,
      height: vp(120),
      marginHorizontal: 24,
      overflow: 'visible',
      justifyContent: 'center',
    },
    firstSection: {
      height: vp(114),
      backgroundColor: theme.colors.background.primary,
    },
    order: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: theme.colors.background.primary,
    },
    orderImage: {
      width: vp(98),
      height: vp(98),
      borderRadius: 24,
    },
    imageBox: {
      borderWidth: 2,
      borderRadius: 24,
      padding: 1,
      borderColor: theme.colors.border.E005,
    },
    content: {
      width: '50%',
      marginLeft: vp(12),
    },
    title: {
      marginTop: 9,
      marginBottom: 5,
      width: '100%',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingTop: 4,
    },
    thc: {
      paddingHorizontal: 12,
      borderRadius: 18,
      height: 23,
      justifyContent: 'center',
    },
    thcText: {
      color: theme.colors.pink.bold,
      marginTop: 2,
    },
    indica: {
      marginLeft: 4,
      backgroundColor: 'rgba(75, 100, 255, 0.05);',
      height: 23,
      justifyContent: 'center',
      paddingHorizontal: 12,
      borderRadius: 18,
    },
    indicaText: {
      color: '#4B64FF',
    },
    secondary: {
      marginLeft: 6,
    },
    addBtn: {
      marginLeft: 4,
    },
    box: {
      marginBottom: 4,
    },
    stylesDeleteBox: {
      paddingLeft: vp(25),
      justifyContent: 'center',
    },
    vr: {
      width: 1,
      backgroundColor: theme.colors.border.E01,
      height: '100%',
      marginRight: 8,
    },
    section3: {
      flex: 1,
      justifyContent: 'space-between',
      height: vp(113),
      alignItems: 'center',
    },
    count: {
      borderWidth: 2,
      borderRadius: 12,
      height: vp(46),
      width: vp(32),
      borderColor: theme.colors.border.E01,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};
