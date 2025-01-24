import {StyleSheet} from 'react-native';
import {useTheme} from '~/theme';

export const useStyles = () => {
  const {theme} = useTheme();
  return StyleSheet.create({
    order: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginTop: 24,
      height: vp(113),
    },
    orderImage: {
      width: vp(113),
      height: vp(113),
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
      marginLeft: 12,
    },
    title: {
      marginTop: 8,
      marginBottom: 2,
      width: '90%',
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
  });
};
