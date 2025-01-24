import React, {FC, useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {GLOBAL_STYLES} from '~/theme';
import {SwitchButton, SwitchButtonRef} from '../switch-button/switch-button';
import {AppText} from '~/components/blocks';
import {TextVariant} from '~/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storeIsSwitchOn = async (value: boolean): Promise<void> => {
  const stringValue = value.toString();
  await AsyncStorage.setItem('isSwitchOn', stringValue);
};

const retrieveIsSwitchOn = async (): Promise<boolean> => {
  const stringValue = await AsyncStorage.getItem('isSwitchOn');
  return stringValue !== null ? stringValue === 'true' : false;
};

export const SecretMenu: FC = () => {
  const switcherRef = useRef<SwitchButtonRef>(null);
  const [isSwitchOn, setSwitchOn] = useState<boolean>(false);

  useEffect(() => {
    const loadValue = async () => {
      const value = await retrieveIsSwitchOn();
      value ? switcherRef.current?.on() : switcherRef.current?.off();
      setSwitchOn(value);
    };
    loadValue();
  }, []);

  const handleToggleSwitcher = () => {
    const newValue = !isSwitchOn;
    setSwitchOn(newValue);
    storeIsSwitchOn(newValue);
  };

  return (
    <View style={GLOBAL_STYLES.row_between}>
      <AppText variant={TextVariant.H5_M}>Show hidden brands</AppText>
      <SwitchButton
        ref={switcherRef}
        isOn={isSwitchOn}
        toggleSwitcher={handleToggleSwitcher}
      />
    </View>
  );
};
