import React, {FC, useCallback, useMemo} from 'react';

import {SafeAreaView} from 'react-native-safe-area-context';

import {StyleSheet, View, Image} from 'react-native';
import {ImageColorBackgroundWrapper, AppText, Button} from '~/components';
import {
  useTheme,
  GLOBAL_STYLES,
  TextColors,
  TextVariant,
  ButtonVariant,
  FontWeight,
} from '~/theme';
import Logo from '~/assets/images/logo_dark.svg';

import {
  useGetArStickerGameQuery,
  useResetGameMutation,
} from '~/store/query/games';
import {
  UserStackParamProps,
  UserStackRoutes,
  UserScreenNavigationProp,
} from '~/navigation';
import {useIntl} from 'react-intl';
import {useNavigation} from '@react-navigation/native';
import {GameType} from './data/game-type';
import {useGetAuthUser} from '~/hooks/useGetAuthUser';
import {GameButton, GameButtonState} from './components/game-button';

export const FinishGameScreen: FC<
  UserStackParamProps<UserStackRoutes.FinishGameScreen>
> = ({route}) => {
  const {id} = route.params;
  const {data, refetch} = useGetArStickerGameQuery({
    id: id,
  });
  const [resetGame, {isLoading}] = useResetGameMutation();
  const navigation = useNavigation<UserScreenNavigationProp>();
  const {theme} = useTheme();
  const intl = useIntl();
  const {authUser} = useGetAuthUser();

  const handlePressFinishGame = useCallback(() => {
    switch (data?.type) {
      case GameType.BRAND_POINTS:
        navigation.reset({
          index: 0,
          routes: [
            {name: UserStackRoutes.TabNavigator},
            {
              name: UserStackRoutes.BrandScreen,
              params: {
                brandId: data.brand.id!!,
                gameId: data.id,
              },
            },
          ],
        });
        break;
      default:
        navigation.reset({
          index: 0,
          routes: [{name: UserStackRoutes.TabNavigator}],
        });
        break;
    }
  }, [data, navigation]);

  const handlePressRestartGame = useCallback(async () => {
    await resetGame({gameId: id}).unwrap();
    await refetch();
    navigation.reset({
      index: 0,
      routes: [{name: UserStackRoutes.StickerGameScreen, params: {id: id}}],
    });
  }, [id, resetGame, navigation]);

  const backgroundImage = useMemo(() => {
    return data?.finishScreen?.background?.url
      ? {
          uri: data?.finishScreen?.background?.url,
        }
      : undefined;
  }, [data?.finishScreen?.background?.url]);

  const content = useMemo(() => {
    if (data) {
      return (
        <View style={styles.contentContainer}>
          <View style={styles.topContainer}>
            <AppText style={styles.gameTitle} variant={TextVariant.O_H1_M}>
              {data.finishScreen.title}
            </AppText>
            {data.type === GameType.OFFLINE_GIFT && (
              <>
                <View style={styles.lotteryText}>
                  <AppText
                    size={18}
                    fontWeight={FontWeight.W400}
                    color={TextColors.B100}>
                    {intl.formatMessage({
                      id: 'screens.games.finishGame.your_lottery_number',
                      defaultMessage: 'Your lottery number:',
                    })}
                  </AppText>
                  <AppText
                    size={18}
                    fontWeight={FontWeight.W600}
                    color={TextColors.B100}>
                    {authUser?.id}
                  </AppText>
                </View>
                <View style={styles.lotteryText}>
                  <AppText
                    size={14}
                    fontWeight={FontWeight.W400}
                    color={TextColors.B100}>
                    {intl.formatMessage({
                      id: 'screens.games.finishGame.make_screenshot',
                      defaultMessage: 'Make a screenshot of the current screen',
                    })}
                  </AppText>
                </View>
              </>
            )}
            {!!data.points && (
              <AppText
                style={styles.earnedPoints}
                size={24}
                fontWeight={FontWeight.W400}
                color={TextColors.B100}>
                {intl.formatMessage(
                  {
                    id: 'screens.games.finishGame.earned_points',
                    defaultMessage: 'You earned 0 points',
                  },
                  {points: data.points},
                )}
              </AppText>
            )}
            {data.brandPointsText && (
              <AppText
                style={styles.pointsSubtitle}
                size={14}
                fontWeight={FontWeight.W400}
                color={TextColors.gray}>
                {data.brandPointsText}
              </AppText>
            )}
          </View>
          <View style={styles.imageContainer}>
            <Image
              style={styles.brandLogo}
              resizeMode="contain"
              source={{uri: data?.finishScreen.image?.url}}
            />
          </View>
          <View>
            <AppText
              style={styles.gameDescription}
              size={14}
              fontWeight={FontWeight.W400}
              color={TextColors.B100}>
              {data.finishScreen.description}
            </AppText>
            <View style={styles.buttonContainer}>
              <Button
                onPress={handlePressFinishGame}
                variant={ButtonVariant.PRIMARY}
                textStyle={styles.buttonText}
                containerStyle={styles.finishBtn}
                width="100%"
                title={data.finishScreen.buttonText}
              />
              {data?.canReplay && (
                <GameButton
                  state={
                    isLoading ? GameButtonState.LOADING : GameButtonState.IDLE
                  }
                  containerStyle={styles.replayBtn}
                  disabled={isLoading}
                  onPress={handlePressRestartGame}>
                  {data.finishScreen.playAgainText}
                </GameButton>
              )}
            </View>
          </View>
        </View>
      );
    }
  }, [
    data,
    handlePressFinishGame,
    intl,
    authUser,
    handlePressRestartGame,
    isLoading,
  ]);

  return (
    <ImageColorBackgroundWrapper
      containerStyle={GLOBAL_STYLES.flex_1}
      image={backgroundImage}
      backgroundColor={theme.colors.background.primary}
      statusBarStyle="dark-content">
      <SafeAreaView style={GLOBAL_STYLES.flex_1}>
        <Logo fill={theme.colors.primary} style={styles.logo} />
        {content}
      </SafeAreaView>
    </ImageColorBackgroundWrapper>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  topContainer: {
    alignItems: 'center',
  },
  lotteryText: {
    marginTop: 10,
    flexDirection: 'row',
  },
  earnedPoints: {
    marginTop: 18,
  },
  pointsSubtitle: {
    marginTop: 2,
  },
  imageContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginBottom: 45,
  },
  buttonText: {
    textTransform: 'uppercase',
  },
  gameDescription: {
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 14,
    marginHorizontal: 20,
    marginBottom: 50,
  },
  gameTitle: {
    textTransform: 'uppercase',
    marginTop: 48,
    textAlign: 'center',
    marginHorizontal: 24,
    letterSpacing: 8,
    lineHeight: 36.4,
  },
  brandLogo: {
    width: '100%',
    height: '100%',
    marginBottom: vp(20),
    alignSelf: 'center',
  },
  logo: {
    marginTop: 40,
    alignSelf: 'center',
  },
  finishBtn: {
    borderRadius: 28,
  },
  replayBtn: {
    marginTop: 16,
  },
});
