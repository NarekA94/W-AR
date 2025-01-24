import React, {FC, useCallback, useMemo, useRef, useState} from 'react';
import {
  FlatList,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  AppText,
  Button,
  CustomAlert,
  CustomAlertRef,
  ScreenWrapper,
} from '~/components';
import {FontWeight, TextColors, TextVariant} from '~/theme';
import Logo from '~/assets/images/logo.svg';
import {useGetActiveStateListQuery} from '~/store/query/state/stateApi';
import {State} from '~/store/query/state/type';
import {useIntl} from 'react-intl';
import {AuthStackParamProps, AuthStackRoutes} from '~/navigation';
import {userModel} from '~/storage/models/user';
import {logger} from '~/utils';
import {useGetUserAddress} from '~/hooks/useGetUserAddress';
import {IS_IOS} from '~/constants/layout';
import {selectStatusForHiddenUi} from '~/store/reducers';
import {useAppSelector} from '~/store/hooks';

const webUrl = 'https://weedar.io';

export const SelectStateScreen: FC<
  AuthStackParamProps<AuthStackRoutes.SelectState>
> = ({navigation}) => {
  const intl = useIntl();
  const shouldBeHidden = useAppSelector(selectStatusForHiddenUi);

  const {getAddress} = useGetUserAddress();

  const [selectedStateID, setSelectedStateID] = useState<number>();
  const {data: stateList} = useGetActiveStateListQuery();
  const alertRef = useRef<CustomAlertRef>(null);

  const renderStateList = useCallback((item: State, index: number) => {
    return (
      <AppText key={item.id}>
        {index > 0 && (
          <AppText
            fontWeight={FontWeight.W700}
            variant={TextVariant.H4_B}
            color={TextColors.A100}>
            {' '}
            and{' '}
          </AppText>
        )}
        <AppText
          fontWeight={FontWeight.W700}
          variant={TextVariant.H4_B}
          color={TextColors.A100}>
          {item.name}
        </AppText>
      </AppText>
    );
  }, []);

  const handlePressState = useCallback(
    (id: number, stateName: string) => {
      return async () => {
        if (IS_IOS || !shouldBeHidden) {
          userModel.setUserRegionId(id);
          navigation.navigate(AuthStackRoutes.RegisterScreen);
          return;
        }
        setSelectedStateID(id);
        try {
          const userAddress = await getAddress();
          if (userAddress.state === stateName || __DEV__) {
            userModel.setUserRegionId(id);
            navigation.navigate(AuthStackRoutes.RegisterScreen, {
              showLocationAlert: true,
            });
          } else {
            alertRef.current?.open();
          }
        } catch (error) {
          logger.warn(error);
        } finally {
          setSelectedStateID(undefined);
        }
      };
    },
    [getAddress, navigation],
  );

  const renderItems = useCallback(
    ({item}: FlatListItem<State>) => {
      return (
        <Button
          onPress={handlePressState(item.id, item.name)}
          containerStyle={styles.item}
          title={item.name}
          withImageBackground
          isLoading={selectedStateID === item.id}
        />
      );
    },
    [handlePressState, selectedStateID],
  );

  const ListHeaderComponent = useMemo(() => {
    return (
      <View style={styles.root}>
        <Logo width={vp(183)} height={vp(32)} style={styles.logo} />
        <AppText style={styles.available} variant={TextVariant.H5_M}>
          Now WEEDAR is available in
        </AppText>
        <AppText>{stateList?.map(renderStateList)}</AppText>
        <AppText
          style={styles.selectState}
          color={TextColors.G090}
          variant={TextVariant.S_R}>
          {intl.formatMessage({
            id: 'screens.state.select',
            defaultMessage: 'Select your state to proceed or exit the app',
          })}
        </AppText>
      </View>
    );
  }, [intl, renderStateList, stateList]);

  const handlePressFooter = useCallback(() => {
    alertRef.current?.open();
  }, []);

  const ListFooterComponent = useMemo(() => {
    return (
      <TouchableOpacity onPress={handlePressFooter} style={styles.footer}>
        <AppText variant={TextVariant.S_R} color={TextColors.A100}>
          {intl.formatMessage({
            id: 'screens.state.footer',
            defaultMessage: 'I don’t live there',
          })}
        </AppText>
      </TouchableOpacity>
    );
  }, [handlePressFooter]);

  const handlePressGoToSite = useCallback(() => {
    Linking.openURL(webUrl);
  }, []);

  return (
    <>
      <ScreenWrapper withBottomInset withTopInsets withStatusBar>
        <FlatList
          ListHeaderComponent={ListHeaderComponent}
          data={stateList}
          renderItem={renderItems}
          ListFooterComponent={ListFooterComponent}
        />
      </ScreenWrapper>
      <CustomAlert
        onPress={handlePressGoToSite}
        title={intl.formatMessage({
          id: 'screens.preview.alert.title',
        })}
        message={intl.formatMessage({
          id: 'screens.state.alert.body',
        })}
        rightText="Go to site"
        ref={alertRef}
      />
    </>
  );
};

const styles = StyleSheet.create({
  logo: {
    marginBottom: vp(120),
    marginTop: vp(141),
  },
  available: {
    marginBottom: vp(10),
  },
  selectState: {
    marginTop: vp(46),
    marginBottom: vp(20),
  },
  root: {
    alignItems: 'center',
  },
  item: {
    marginBottom: vp(16),
  },
  footer: {
    marginTop: vp(23),
    alignSelf: 'center',
  },
});
