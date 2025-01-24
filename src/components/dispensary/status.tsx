import React, {FC, memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {AppText, AppTextProps} from '~/components';
import {FontWeight, GLOBAL_STYLES, TextVariant} from '~/theme';
import ImmediateIcon from '~/assets/images/dispensaries/immediate.svg';
import DelayIcon from '~/assets/images/dispensaries/delayed.svg';
import {useIntl} from 'react-intl';
interface DispensaryStatusProps {
  isThirdParty?: boolean;
  textProps?: AppTextProps;
  iconSize?: number;
}

export const DispensaryStatus: FC<DispensaryStatusProps> = memo(
  ({isThirdParty, textProps, iconSize}) => {
    const intl = useIntl();
    if (isThirdParty === undefined) {
      return null;
    }
    return (
      <View style={GLOBAL_STYLES.row_vertical_center}>
        {isThirdParty ? (
          <DelayIcon {...(iconSize && {width: iconSize, height: iconSize})} />
        ) : (
          <ImmediateIcon
            {...(iconSize && {width: iconSize, height: iconSize})}
          />
        )}

        <AppText
          style={styles.title}
          variant={TextVariant.P_M}
          fontWeight={FontWeight.W500}
          {...textProps}>
          {intl.formatMessage({
            id: isThirdParty
              ? 'phrases.in_store_delivery'
              : 'phrases.same_day_pickup',
            defaultMessage: 'In store delivery',
          })}
        </AppText>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  title: {
    marginLeft: vp(6),
  },
});
