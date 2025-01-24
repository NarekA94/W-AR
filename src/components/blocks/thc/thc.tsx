import React, {FC, memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {AppText} from '../app-text/app-text';
import {TextColors, TextVariant} from '~/theme';
import {useIntl} from 'react-intl';
import {HiddenUIWrapper} from '../hidden-ui-wrapper/hidden-ui-wrapper';

interface THCBoxProps {
  thc?: number;
  strain?: string;
}

export const THCBox: FC<THCBoxProps> = memo(props => {
  const intl = useIntl();
  return (
    <HiddenUIWrapper>
      <View style={styles.sectionThc}>
        <AppText
          style={styles.thc}
          variant={TextVariant.M_R}
          color={TextColors.A045}>
          {intl.formatMessage({
            id: 'thc',
            defaultMessage: 'THC',
          })}
        </AppText>
        <AppText variant={TextVariant.M_R} color={TextColors.A100}>
          {props?.thc} %
        </AppText>
        {props.strain && (
          <>
            <AppText
              style={styles.horizontal_12}
              variant={TextVariant.M_R}
              color={TextColors.A045}>
              |
            </AppText>
            <AppText variant={TextVariant.M_R} color={TextColors.A100}>
              {props?.strain}
            </AppText>
          </>
        )}
      </View>
    </HiddenUIWrapper>
  );
});

const styles = StyleSheet.create({
  thc: {
    marginRight: vp(8),
  },
  horizontal_12: {
    marginHorizontal: vp(12),
  },
  sectionThc: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
