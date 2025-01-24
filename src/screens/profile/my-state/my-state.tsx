import React, {FC, useCallback, useMemo, useRef, useState} from 'react';
import {AppText, ScreenWrapper} from '~/components/blocks';

import {FlatList, StyleSheet} from 'react-native';
import {TextVariant, TextColors} from '~/theme';
import {State, useGetActiveStateListQuery} from '~/store/query/state';
import {StateItem} from './components/state-item';
import {useGetAuthUser} from '~/hooks/useGetAuthUser';
import {useUpdateUserMutation} from '~/store/query/user/userApi';
import {BottomSheet, BottomSheetRef} from '~/components';
import {ChangeStateSheet} from './components/change-state-sheet';
import {useIntl} from 'react-intl';

export const MyStateScreen: FC = () => {
  const {data} = useGetActiveStateListQuery();
  const intl = useIntl();
  const {authUser} = useGetAuthUser();
  const [updateUser] = useUpdateUserMutation();
  const [newStateId, setNewStateId] = useState<number>();
  const snapPoints = useMemo(() => ['58%'], []);

  const bottomSheetModalRef = useRef<BottomSheetRef>(null);

  const handlePressItem = useCallback((stateId: number) => {
    setNewStateId(stateId);
    bottomSheetModalRef.current?.open();
  }, []);

  const renderItem = useCallback(
    ({item}: FlatListItem<State>) => (
      <StateItem
        onPress={handlePressItem}
        id={item.id}
        name={item.name}
        isSelected={authUser?.territoryState?.id === item.id}
        icon={item.icon?.url}
      />
    ),
    [authUser, handlePressItem],
  );

  const keyExtractor = (item: State) => item.id.toString();

  const handleCancel = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  const handleSuccess = useCallback(() => {
    if (authUser && newStateId) {
      updateUser({id: authUser.id, territoryState: newStateId});
    }
    bottomSheetModalRef.current?.close();
  }, [authUser, newStateId, updateUser]);

  return (
    <>
      <ScreenWrapper withHeader withTopInsets withBottomInset>
        <AppText variant={TextVariant.H_5} size={26}>
          {intl.formatMessage({
            id: 'screens.profile.change_state.title',
            defaultMessage: 'My State',
          })}
        </AppText>
        <AppText
          variant={TextVariant.S_R}
          style={styles.styleProfile}
          color={TextColors.G090}>
          {intl.formatMessage({
            id: 'screens.profile.change_state.info',
            defaultMessage:
              'Here you can change your current state. Be aware that delivery and pickup options can differ depending on the chosen state.',
          })}
        </AppText>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      </ScreenWrapper>
      <BottomSheet ref={bottomSheetModalRef} snapPoints={snapPoints}>
        <ChangeStateSheet onCancel={handleCancel} onSuccess={handleSuccess} />
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  infotext: {
    marginTop: vp(28),
    marginBottom: vp(14),
  },
  settingsStyle: {
    marginBottom: vp(32),
    marginTop: vp(32),
  },
  textStyle: {
    marginBottom: vp(14),
  },
  styleProfile: {
    marginTop: vp(11),
    marginBottom: vp(15),
    lineHeight: 16,
  },
  buttonLogOut: {
    marginTop: vp(34),
    backgroundColor: '#333333',
    marginBottom: vp(14),
  },
  buttonDelete: {
    backgroundColor: '#1C1C1C',
  },
});
