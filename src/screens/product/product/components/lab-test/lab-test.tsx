import React, {FC, memo, useCallback} from 'react';
import {Linking, StyleSheet, TouchableOpacity} from 'react-native';
import {AppText} from '~/components';
import {TextColors, TextVariant} from '~/theme';
import LabTestIcon from '~/assets/images/product/labTest.svg';
import {useIntl} from 'react-intl';
import {logger} from '~/utils';

interface LabTestProps {
  labTestUrl: string;
}

export const LabTest: FC<LabTestProps> = memo(({labTestUrl}) => {
  const intl = useIntl();

  const handlePressLabTest = useCallback(async () => {
    try {
      await Linking.openURL(labTestUrl);
    } catch (err) {
      logger.warn(err);
    }
  }, [labTestUrl]);

  return (
    <TouchableOpacity onPress={handlePressLabTest} style={styles.root}>
      <LabTestIcon />
      <AppText
        style={styles.title}
        variant={TextVariant.M_B}
        color={TextColors.A100}>
        {intl.formatMessage({
          id: 'buttons.lab',
          defaultMessage: 'Lab test',
        })}
      </AppText>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: vp(50),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333333',
    borderRadius: 18,
    flexDirection: 'row',
  },
  title: {
    marginLeft: vp(16),
    marginTop: 2,
  },
});
