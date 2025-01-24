import {useMemo} from 'react';
import {MMKVLoader, useMMKVStorage} from 'react-native-mmkv-storage';
import {StorageKeys} from './entities';

export const MMKVStorage = new MMKVLoader().initialize();

export const useStorage = <Returned>(
  key: StorageKeys,
  defaultValue?: Returned,
): [
  Returned,
  (value: Returned | ((prevValue: Returned) => Returned)) => void,
] => {
  const [value, setValue] = useMMKVStorage<Returned>(
    key,
    MMKVStorage,
    defaultValue,
  );
  return useMemo(() => [value, setValue], [value, setValue]);
};
