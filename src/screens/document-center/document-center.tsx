import React, {FC, useCallback} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {DocumentCenter} from '~/components';
import {UserStackParamProps, UserStackRoutes} from '~/navigation';
import {useSetRewardsMutation} from '~/store/query/rewards';
import {GLOBAL_STYLES} from '~/theme';

export const DocumentCenterScreen: FC<
  UserStackParamProps<UserStackRoutes.DocumentCenter>
> = ({route, navigation}) => {
  const {params} = route;
  const [setReward] = useSetRewardsMutation();

  const onSaveFilesSuccess = useCallback(() => {
    if (params.dispensaryId && params.productId) {
      setReward({
        dispensary: params.dispensaryId,
        productDetails: [{product: params.productId, quantity: 1}],
      })
        .unwrap()
        .then(() => {
          navigation.reset({
            index: 0,
            routes: [
              {name: UserStackRoutes.TabNavigator},
              {
                name: UserStackRoutes.RewardSuccess,
                params: {
                  isThirdParty: params.isThirdParty,
                  infoI18nKey: 'screens.rewards.success.info',
                  infoI18nParams: {hours: !params.isThirdParty ? 24 : 48},
                },
              },
            ],
          });
        });
    }
  }, [params, setReward, navigation]);

  return (
    <SafeAreaView style={GLOBAL_STYLES.flex_1}>
      <DocumentCenter onSaveFilesSuccess={onSaveFilesSuccess} />
    </SafeAreaView>
  );
};
