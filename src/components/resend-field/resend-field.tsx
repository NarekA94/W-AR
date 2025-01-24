import React, {FC, memo, useCallback, useMemo} from 'react';
import {useIntl} from 'react-intl';
import {Image, View} from 'react-native';
import {FontWeight, TextColors, TextVariant} from '~/theme';
import {AppText} from '..';
import {useCountDown, formatSeconds} from './hooks/useCountDown';

import HappySmyle from '~/assets/images/happySmyle.png';
import HappySmyleFolded from '~/assets/images/happySmyleFolded.png';
import {styles} from './styles';

export enum VerifyMode {
  PHONE = 'phone',
  EMAIL = 'email',
}

interface ResendFieldProps {
  onPress?: () => void;
  onPressSendCodeToEmail?: () => void;
  verifyMode: VerifyMode;
  phoneOnly?: boolean;
}

export const ResendField: FC<ResendFieldProps> = memo(props => {
  const {phoneOnly, verifyMode} = props;
  const {seconds, startTimer} = useCountDown();
  const isTimerFinished = seconds === 0;
  const intl = useIntl();

  const handlePressResend = useCallback(() => {
    props.onPress?.();
    startTimer();
  }, [props, startTimer]);

  const handlePressSendCodeToEmail = useCallback(() => {
    props.onPressSendCodeToEmail?.();
    startTimer();
  }, [props, startTimer]);

  const renderSendSms = useMemo(() => {
    if (verifyMode === VerifyMode.EMAIL && !isTimerFinished) {
      return null;
    }

    return (
      <AppText
        variant={TextVariant.S_R}
        disabled={!isTimerFinished}
        onPress={handlePressResend}
        color={isTimerFinished ? TextColors.A100 : TextColors.A060}>
        {intl.formatMessage(
          {
            id:
              verifyMode === VerifyMode.PHONE
                ? 'component.resend.resend'
                : 'component.resend.sms',
            defaultMessage: 'Resend',
          },
          {seconds: formatSeconds(seconds)},
        )}{' '}
        {verifyMode === VerifyMode.PHONE && (
          <AppText
            variant={TextVariant.S_R}
            color={isTimerFinished ? TextColors.A060 : TextColors.A100}>
            00:{formatSeconds(seconds)}
          </AppText>
        )}
      </AppText>
    );
  }, [intl, verifyMode, isTimerFinished, seconds, handlePressResend]);

  const renderSendCodeToEmail = useMemo(() => {
    if (phoneOnly || (verifyMode === VerifyMode.PHONE && !isTimerFinished)) {
      return null;
    }
    return (
      <AppText
        onPress={handlePressSendCodeToEmail}
        variant={TextVariant.S_R}
        disabled={!isTimerFinished}
        color={isTimerFinished ? TextColors.A100 : TextColors.A060}>
        {intl.formatMessage({
          id:
            verifyMode === VerifyMode.EMAIL
              ? 'component.resend.resend'
              : 'component.resend.email',
          defaultMessage: 'Send code to email',
        })}{' '}
        {verifyMode === VerifyMode.EMAIL && (
          <AppText
            variant={TextVariant.S_R}
            color={isTimerFinished ? TextColors.A060 : TextColors.A100}>
            00:{formatSeconds(seconds)}
          </AppText>
        )}
      </AppText>
    );
  }, [
    phoneOnly,
    verifyMode,
    isTimerFinished,
    handlePressSendCodeToEmail,
    intl,
    seconds,
  ]);

  return (
    <View style={styles.root}>
      <View style={styles.topSection}>
        <View>{renderSendSms}</View>
        {renderSendCodeToEmail}
      </View>
      {seconds < 50 && (
        <View style={styles.notification}>
          {props.phoneOnly || verifyMode === VerifyMode.PHONE ? (
            <>
              <Image style={styles.icon} source={HappySmyleFolded} />
              <View>
                <AppText
                  variant={TextVariant.P_M}
                  style={styles.notificationTitle}>
                  <AppText
                    variant={TextVariant.P_M}
                    fontWeight={FontWeight.W800}>
                    {intl.formatMessage({
                      id: 'component.resend.email.notification.title.bold',
                      defaultMessage: 'Just wanted to let you know.',
                    })}
                  </AppText>
                  {intl.formatMessage({
                    id: 'component.resend.email.notification.title',
                    defaultMessage:
                      ' Messages \nfrom mobile providers might decide to \nshow up fashionably late.',
                  })}
                </AppText>
                <AppText
                  variant={TextVariant['10_4A']}
                  fontWeight={FontWeight.W600}>
                  {intl.formatMessage({
                    id: 'component.resend.email.notification.subtitle',
                    defaultMessage: 'Thanks a lot for sticking around!',
                  })}
                </AppText>
              </View>
            </>
          ) : (
            <>
              <Image style={styles.icon} source={HappySmyle} />
              <View>
                <AppText
                  variant={TextVariant.P_M}
                  style={styles.notificationTitle}>
                  {intl.formatMessage({
                    id: 'component.resend.phone.notification.title',
                    defaultMessage:
                      "Just so you're aware, emails have their own \nsense of timing sometimes.",
                  })}
                </AppText>
                <AppText
                  variant={TextVariant['10_4A']}
                  fontWeight={FontWeight.W600}>
                  {intl.formatMessage({
                    id: 'component.resend.phone.notification.subtitle',
                    defaultMessage:
                      'Thanks a bunch for your patience while we wait!',
                  })}
                </AppText>
              </View>
            </>
          )}
        </View>
      )}
    </View>
  );
});
