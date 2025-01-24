import moment from 'moment';
import React, {memo, FC} from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {AppText, Box} from '~/components';
import {TextColors, TextVariant} from '~/theme';

interface NotificationItemProps {
  subject: string;
  message: string;
  date: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export const NotificationItem: FC<NotificationItemProps> = memo(props => {
  return (
    <TouchableOpacity>
      <Box containerStyle={[styles.boxStyle, props.containerStyle]}>
        <View style={styles.root}>
          <AppText variant={TextVariant.H5_M} style={styles.subject}>
            {props.subject}
          </AppText>
          <AppText
            variant={TextVariant.S_R}
            color={TextColors.G100}
            style={styles.message}>
            {props.message}
          </AppText>
          <AppText variant={TextVariant.P_M} style={styles.date}>
            {moment(props.date).format('M/D/YYYY hh:mm A')}
          </AppText>
        </View>
      </Box>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  boxStyle: {
    minHeight: vp(96),
    marginBottom: vp(14),
  },
  root: {
    flex: 1,
    paddingHorizontal: vp(16),
    paddingVertical: vp(19),
  },
  subject: {},
  message: {
    marginTop: 6,
    lineHeight: 20,
  },
  date: {
    marginTop: 15,
  },
});
