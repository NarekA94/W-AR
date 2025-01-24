import React, {FC, memo} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {AppText, Button} from '~/components';
import {TextColors, TextVariant} from '~/theme';
import ThanksIcon from '~/assets/images/profile/thanks.png';
import {useIntl} from 'react-intl';

interface SendSuccessSheetProps {
  onPressOkay: () => void;
}

export const SendSuccessSheet: FC<SendSuccessSheetProps> = memo(
  ({onPressOkay}) => {
    const intl = useIntl();

    return (
      <>
        <View style={styles.body}>
          <Image style={styles.img} resizeMode="contain" source={ThanksIcon} />
          <AppText variant={TextVariant['24_5A']}>
            {intl.formatMessage({
              id: 'screens.profile.contact_us.alert.title',
              defaultMessage: 'Thank you!',
            })}
          </AppText>
          <AppText
            style={styles.info}
            variant={TextVariant.S_R}
            color={TextColors.G090}>
            {intl.formatMessage({
              id: 'screens.profile.contact_us.alert.info',
              defaultMessage: 'Your message has been successfully sent',
            })}
          </AppText>
        </View>

        <Button
          onPress={onPressOkay}
          title="Okay"
          width="100%"
          withImageBackground
        />
      </>
    );
  },
);

const styles = StyleSheet.create({
  buttonLogOut: {
    marginTop: vp(34),
    marginBottom: vp(14),
  },
  buttonDelete: {
    backgroundColor: '#1C1C1C',
  },
  img: {
    width: vp(113),
    height: vp(113),
    marginBottom: vp(47),
  },
  body: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    marginTop: vp(9),
    marginBottom: vp(39),
    textAlign: 'center',
    lineHeight: 18,
  },
});
