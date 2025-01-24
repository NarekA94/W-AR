import React, {FC, memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {AppText} from '~/components';
import {GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import HTML from 'react-native-render-html';
import {WIDTH} from '~/constants/layout';
import Danger from '~/assets/images/danger.svg';
import {customHTMLElementModels} from '~/utils/html';
import {TouchableOpacity} from 'react-native-gesture-handler';

const HTML_ALERT_STYLE = {
  p: {color: 'rgba(187, 187, 187, 1)'},
};
interface NotificationProps {
  message?: string | null;
  deliveryFee?: number;
  error?: boolean;
  hasErrorAction?: boolean;
  errorActionText?: string;
  errorActionPressHandler?: () => void;
}

export const Notification: FC<NotificationProps> = memo(props => {
  if (props.error) {
    return (
      <View style={styles.error}>
        <View style={styles.errorMessageContainer}>
          <Danger style={styles.danger} />
          <View style={GLOBAL_STYLES.flexShrink_1}>
            {props.message && (
              <HTML
                tagsStyles={HTML_ALERT_STYLE}
                contentWidth={WIDTH - 48}
                source={{
                  html: props.message,
                }}
                customHTMLElementModels={customHTMLElementModels}
              />
            )}
          </View>
        </View>

        {props.hasErrorAction && (
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.actionTouchable}
              onPress={props.errorActionPressHandler}>
              <AppText
                style={styles.actionText}
                variant={TextVariant.S_B}
                color={TextColors.A100}>
                {props.errorActionText}
              </AppText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
  return (
    <View style={styles.root}>
      <View style={styles.html}>
        {props.message && (
          <HTML
            tagsStyles={HTML_ALERT_STYLE}
            contentWidth={WIDTH - 48}
            source={{
              html: props.message,
            }}
            customHTMLElementModels={customHTMLElementModels}
          />
        )}
      </View>
      {props.deliveryFee && (
        <>
          <View style={GLOBAL_STYLES.row_between}>
            <AppText variant={TextVariant.S_R} style={styles.text_color}>
              Delivery fee
            </AppText>
            <AppText variant={TextVariant.M_B} style={styles.text_color}>
              ${props.deliveryFee}
            </AppText>
          </View>
        </>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  danger: {
    marginHorizontal: vp(13),
    marginTop: 12,
  },
  error: {
    borderWidth: 1,
    borderColor: 'rgba(255, 76, 86, 1)',
    marginHorizontal: vp(24),
    borderRadius: 22,
    backgroundColor: 'rgba(255, 76, 86, 0.15)',
    paddingRight: vp(19),
    marginBottom: vp(27),
  },
  errorMessageContainer: {
    flexDirection: 'row',
  },
  root: {
    borderWidth: 1,
    borderColor: 'rgba(253, 194, 80, 1)',
    backgroundColor: 'rgba(253, 194, 80, 0.15)',
    paddingHorizontal: vp(18),
    paddingVertical: vp(16),
    marginHorizontal: vp(24),
    borderRadius: 22,
    marginBottom: vp(27),
  },
  text_color: {
    color: 'rgba(253, 194, 80, 1)',
  },
  html: {
    marginTop: vp(-15),
  },
  actionContainer: {
    marginBottom: vp(18),
    marginLeft: vp(19),
  },
  actionText: {
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  actionTouchable: {
    paddingVertical: 10,
    overflow: 'hidden',
  },
});
