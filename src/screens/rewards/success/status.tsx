import React, {FC, useMemo} from 'react';
import {useIntl} from 'react-intl';
import {StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {AppText} from '~/components';
import {TextVariant} from '~/theme';

const delaydColor = '0, 209, 255';
const immediateColor = '103, 136, 255';

// const topColors = [
//   'rgba(0, 209, 255, 0.03)',
//   'rgba(0, 209, 255, 0.55)',
//   'rgba(0, 209, 255, 0.03)',
// ];
const start = {x: 0, y: 0};
const end = {x: 1, y: 0};

// const bottomColors = [
//   'rgba(0, 209, 255, 0.03)',
//   'rgba(0, 209, 255, 0.25)',
//   'rgba(0, 209, 255, 0.03)',
// ];

interface StatusProps {
  isThirdParty?: boolean;
}

export const Status: FC<StatusProps> = ({isThirdParty}) => {
  const intl = useIntl();
  const topColors = useMemo(() => {
    if (isThirdParty) {
      return [
        `rgba(${delaydColor}, 0.03)`,
        `rgba(${delaydColor}, 0.55)`,
        `rgba(${delaydColor}, 0.03)`,
      ];
    } else {
      return [
        `rgba(${immediateColor}, 0.03)`,
        `rgba(${immediateColor}, 0.55)`,
        `rgba(${immediateColor}, 0.03)`,
      ];
    }
  }, [isThirdParty]);

  const bottomColors = useMemo(() => {
    if (isThirdParty) {
      return [
        `rgba(${delaydColor}, 0.03)`,
        `rgba(${delaydColor}, 0.25)`,
        `rgba(${delaydColor}, 0.03)`,
      ];
    } else {
      return [
        `rgba(${immediateColor}, 0.03)`,
        `rgba(${immediateColor}, 0.25)`,
        `rgba(${immediateColor}, 0.03)`,
      ];
    }
  }, [isThirdParty]);

  return (
    <LinearGradient
      colors={topColors}
      start={start}
      end={end}
      style={styles.root}>
      <LinearGradient
        start={start}
        end={end}
        colors={bottomColors}
        style={styles.body}>
        <AppText
          variant={TextVariant.S_B}
          style={[styles.title, isThirdParty && styles.delayd]}>
          {intl.formatMessage({
            id: `screens.rewardsuccess.${
              isThirdParty ? 'delayed' : 'immediate'
            }`,
            defaultMessage: isThirdParty
              ? 'Order received'
              : 'Ready for pick up',
          })}
        </AppText>
      </LinearGradient>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  root: {
    height: vp(43),
    width: vp(226),
    borderRadius: 24,
    marginVertical: vp(17),
    padding: 1,
  },
  body: {
    flex: 1,
    backgroundColor: 'black',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#6788FF',
    textTransform: 'uppercase',
  },
  delayd: {
    color: '#00D1FF',
  },
});
