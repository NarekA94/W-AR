import React, {FC, useCallback, useMemo} from 'react';

import {SafeAreaView} from 'react-native-safe-area-context';

import {StyleSheet, View, Image} from 'react-native';
import {ImageColorBackgroundWrapper, AppText, Button} from '~/components';
import {
  useTheme,
  GLOBAL_STYLES,
  TextColors,
  ButtonVariant,
  FontWeight,
  TextVariant,
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
import {useNavigation} from '@react-navigation/native';
import {GameType} from './data/game-type';
import {useIntl} from 'react-intl';
import {useGetAuthUser} from '~/hooks/useGetAuthUser';
import {GameButton, GameButtonState} from './components/game-button';

export const AlreadyPlayedGameScreen: FC<
  UserStackParamProps<UserStackRoutes.AlreadyPlayedGameScreen>
> = ({route}) => {
  const {id} = route.params;
  const {data, refetch} = useGetArStickerGameQuery({
    id: id,
  });
  const intl = useIntl();
  const {authUser} = useGetAuthUser();
  const navigation = useNavigation<UserScreenNavigationProp>();
  const {theme} = useTheme();
  const [resetGame, {isLoading}] = useResetGameMutation();

  const handlePressFinishGame = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{name: UserStackRoutes.TabNavigator}],
    });
  }, [navigation]);
  const handlePressRestartGame = useCallback(async () => {
    await resetGame({gameId: id}).unwrap();
    await refetch();

    navigation.reset({
      index: 0,
      routes: [{name: UserStackRoutes.StickerGameScreen, params: {id: id}}],
    });
  }, [id, resetGame, navigation, refetch]);
  const backgroundImage = useMemo(() => {
    return data?.alreadyPlayedScreen?.background?.url
      ? {
          uri: data?.alreadyPlayedScreen?.background?.url,
        }
      : undefined;
  }, [data?.alreadyPlayedScreen?.background?.url]);
  const content = useMemo(() => {
    if (data) {
      return (
        <View style={styles.contentContainer}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.brandLogo}
              resizeMode="contain"
              source={{uri: data?.alreadyPlayedScreen.image?.url}}
            />
          </View>
          <View style={styles.topContainer}>
            <AppText style={styles.gameTitle} variant={TextVariant.O_H1_M}>
              {data.alreadyPlayedScreen.title}
            </AppText>
            {data.type === GameType.OFFLINE_GIFT && (
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
            )}
          </View>
          <View>
            <AppText
              style={styles.gameDescription}
              size={14}
              fontWeight={FontWeight.W400}
              color={TextColors.B100}>
              {data.alreadyPlayedScreen.description}
            </AppText>
            <View style={styles.buttonContainer}>
              <Button
                onPress={handlePressFinishGame}
                variant={ButtonVariant.PRIMARY}
                textStyle={styles.buttonText}
                containerStyle={styles.finishBtn}
                width="100%"
                title={data.alreadyPlayedScreen.buttonText}
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
  imageContainer: {
    flex: 1,
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
    marginTop: 25,
    marginHorizontal: 30,
    marginBottom: 42,
    lineHeight: 18.2,
  },
  gameTitle: {
    textTransform: 'uppercase',
    textAlign: 'center',
    marginHorizontal: 40,
    letterSpacing: 8,
    lineHeight: 36.4,
  },
  brandLogo: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  logo: {
    marginTop: 40,
    alignSelf: 'center',
  },
  lotteryText: {
    marginTop: 10,
    flexDirection: 'row',
  },
  finishBtn: {
    borderRadius: 28,
  },
  replayBtn: {
    marginTop: 16,
  },
});
