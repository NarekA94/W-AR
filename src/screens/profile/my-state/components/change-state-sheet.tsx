import React, {FC, memo} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {AppText, Button} from '~/components';
import {ButtonVariant, GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import ChangeIcon from '~/assets/images/profile/change-state.png';
import {useIntl} from 'react-intl';

interface ChangeStateSheetProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

export const ChangeStateSheet: FC<ChangeStateSheetProps> = memo(
  ({onCancel, onSuccess}) => {
    const intl = useIntl();
    return (
      <>
        <View style={styles.body}>
          <Image style={styles.img} resizeMode="contain" source={ChangeIcon} />
          <AppText variant={TextVariant['24_5A']}>
            {intl.formatMessage({
              id: 'screens.profile.change_state.alert.title',
              defaultMessage: 'Change state',
            })}
          </AppText>
          <AppText
            style={styles.info}
            variant={TextVariant.S_R}
            color={TextColors.G090}>
            {intl.formatMessage({
              id: 'screens.profile.change_state.alert.info',
              defaultMessage: 'Are you sure you want to change the state?',
            })}
          </AppText>
        </View>

        <View style={GLOBAL_STYLES.row_between}>
          <Button
            title="Cancel"
            onPress={onCancel}
            width="48%"
            variant={ButtonVariant.GRAY}
          />
          <Button
            onPress={onSuccess}
            title="Yea, I am"
            width="48%"
            withImageBackground
          />
        </View>
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
  },
});
