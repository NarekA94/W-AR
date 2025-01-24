import React, {FC, useMemo, useCallback} from 'react';

import {SafeAreaView} from 'react-native-safe-area-context';

import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {ImageColorBackgroundWrapper, AppText} from '~/components';
import {useTheme, GLOBAL_STYLES, TextColors, TextVariant} from '~/theme';
import Logo from '~/assets/images/logo.svg';

import {ArStickerGame} from '~/store/query/games';
import {UserStackRoutes, UserScreenNavigationProp} from '~/navigation';
import {useIntl} from 'react-intl';
import {useNavigation} from '@react-navigation/native';
import {GameButton, GameButtonState} from './components/game-button';

interface StartGameProps {
  gameData: ArStickerGame;
  containerStyle?: StyleProp<ViewStyle>;
  gameLoading: boolean | undefined;
  onStartPress?: () => void;
}
export const StartGameScreen: FC<StartGameProps> = ({
  gameData,
  containerStyle,
  gameLoading,
  onStartPress,
}) => {
  const navigation = useNavigation<UserScreenNavigationProp>();
  const {theme} = useTheme();
  const intl = useIntl();

  const handlePressGoToApp = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{name: UserStackRoutes.TabNavigator}],
    });
  }, [navigation]);

  const handePressStartGame = useCallback(() => {
    onStartPress?.();
  }, [onStartPress]);
  const backgroundImage = useMemo(() => {
    return gameData.startScreen?.background?.url
      ? {
          uri: gameData.startScreen?.background?.url,
        }
      : undefined;
  }, [gameData.startScreen?.background?.url]);

  const content = useMemo(() => {
    if (gameData) {
      return (
        <View style={styles.contentContainer}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.brandLogo}
              resizeMode="contain"
              source={{uri: gameData.startScreen.image?.url}}
            />
          </View>
          <View>
            <AppText style={styles.gameTitle} variant={TextVariant['24_4A']}>
              {gameData.startScreen.title}
            </AppText>
            <AppText
              style={styles.gameDescription}
              variant={TextVariant.S_R}
              color={TextColors.secondary}>
              {gameData.currentStep === 0
                ? gameData.startScreen.description
                : gameData.description_paused}
            </AppText>
            <View style={styles.buttonContainer}>
              <GameButton
                state={
                  gameLoading ? GameButtonState.LOADING : GameButtonState.IDLE
                }
                disabled={gameLoading}
                onPress={handePressStartGame}>
                {gameData.currentStep === 0
                  ? intl.formatMessage({
                      id: 'screens.games.startGame.start',
                      defaultMessage: 'Start Game',
                    })
                  : intl.formatMessage({
                      id: 'screens.games.startGame.continue',
                      defaultMessage: 'Continue game',
                    })}
              </GameButton>
            </View>
            <TouchableOpacity
              onPress={handlePressGoToApp}
              hitSlop={20}
              style={styles.backBtnContainer}>
              <AppText variant={TextVariant.M_B} color={TextColors.secondary}>
                {intl.formatMessage({
                  id: 'screens.games.goToWeedarApp',
                  defaultMessage: 'GO TO WEEDAR APP',
                })}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }, [gameData, gameLoading, handePressStartGame, handlePressGoToApp, intl]);

  return (
    <ImageColorBackgroundWrapper
      containerStyle={containerStyle}
      image={backgroundImage}
      backgroundColor={theme.colors.primary}
      statusBarStyle="light-content">
      <SafeAreaView style={GLOBAL_STYLES.flex_1}>
        <Logo style={styles.logo} />
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
  imageContainer: {
    flex: 1,
    marginHorizontal: 70,
  },
  backBtnContainer: {
    alignSelf: 'center',
    marginTop: 32,
    marginBottom: 34,
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginTop: 66,
    height: vp(48),
  },
  gameDescription: {
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 14,
    marginHorizontal: 20,
  },
  gameTitle: {
    textTransform: 'uppercase',
    alignSelf: 'center',
  },
  brandLogo: {
    width: '100%',
    height: '100%',
    marginBottom: vp(94),
    alignSelf: 'center',
  },
  logo: {
    marginTop: 40,
    alignSelf: 'center',
  },
});
