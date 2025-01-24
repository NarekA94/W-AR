import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {ScreenWrapper} from '~/components';
import {
  UserStackRoutes,
  UserStackParamProps,
  UserScreenNavigationProp,
} from '~/navigation';

import {
  useGetArStickerGameQuery,
  usePassStepMutation,
} from '~/store/query/games';
import {StickerGameScene} from './components/sticker-game-sceneview';
import {StartGameScreen} from './start-game-screen';
import {Alert, Linking, StyleSheet} from 'react-native';
import {gameModel} from '~/storage/models/game';
import {useNavigation} from '@react-navigation/native';
import {useIntl} from 'react-intl';
import {Camera} from 'react-native-vision-camera';

export const StickerGameScreen: FC<
  UserStackParamProps<UserStackRoutes.StickerGameScreen>
> = ({route}) => {
  const {id} = route.params;
  const dataLoaded = useRef<boolean>(false);
  const delayedStart = useRef<boolean>(false);

  const intl = useIntl();

  const {data} = useGetArStickerGameQuery({
    id: id,
  });
  const navigation = useNavigation<UserScreenNavigationProp>();

  const [passStep] = usePassStepMutation();
  const [gameReady, setGameReady] = useState<boolean>(false);
  const [gameLoading, setGameLoading] = useState<boolean>(true);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const onSaveStep = useCallback(
    (step: number, answer: boolean) => {
      passStep({gameId: id, order: step, answer: Number(answer)});
    },
    [id, passStep],
  );
  const onGameReady = useCallback(() => {
    setGameReady(true);
    setGameLoading(false);
    if (delayedStart.current) {
      setGameStarted(true);
    }
  }, []);

  const [hasPermission, setHasPermission] = useState(false);
  const permissionDeniedHandler = useCallback(() => {
    setGameLoading(false);
    Alert.alert(
      intl.formatMessage({
        id: 'screens.games.startGame.permission_alert.title',
        defaultMessage: 'Need permission',
      }),
      intl.formatMessage({
        id: 'screens.games.startGame.permission_alert.message',
        defaultMessage:
          'Camera permission is required to play the game. You can grant it in app settings.',
      }),
      [
        {
          text: intl.formatMessage({
            id: 'screens.games.startGame.permission_alert.cancel',
            defaultMessage: 'Not right now',
          }),
        },
        {
          text: intl.formatMessage({
            id: 'screens.games.startGame.permission_alert.go_to_settings',
            defaultMessage: 'Go to settings',
          }),
          onPress: Linking.openSettings,
        },
      ],
      {
        cancelable: true,
      },
    );
  }, [intl]);

  const handePressStartGame = useCallback(() => {
    (async () => {
      if (!hasPermission) {
        const status = await Camera.requestCameraPermission();
        setHasPermission(status === 'authorized');
        if (status === 'denied') {
          permissionDeniedHandler();
        } else {
          if (gameReady) {
            setGameStarted(true);
          } else {
            setGameLoading(true);
            delayedStart.current = true;
          }
        }
      } else {
        if (gameReady) {
          setGameStarted(true);
        } else {
          setGameLoading(true);
          delayedStart.current = true;
        }
      }
    })();
  }, [hasPermission, permissionDeniedHandler, gameReady]);
  useEffect(() => {
    gameModel.removeGameToken();
    if (data && !dataLoaded.current) {
      dataLoaded.current = true;

      if (data?.gamePassed === true && !data.gamePassedAndReplay) {
        navigation.reset({
          index: 0,
          routes: [
            {name: UserStackRoutes.TabNavigator},
            {
              name: UserStackRoutes.AlreadyPlayedGameScreen,
              params: {
                id: data.id,
              },
            },
          ],
        });
      } else {
        (async () => {
          if (!hasPermission) {
            const status = await Camera.requestCameraPermission();
            setHasPermission(status === 'authorized');
            if (status === 'denied') {
              permissionDeniedHandler();
            }
          }
        })();
      }
    }
  }, [data]);
  return (
    <ScreenWrapper horizontalPadding={0} dark withTopInsets>
      {data && (
        <>
          {hasPermission && (
            <StickerGameScene
              gameData={data}
              onSaveStep={(step, answer) => onSaveStep(step, answer)}
              onGameReady={onGameReady}
            />
          )}

          {!gameStarted && (
            <StartGameScreen
              containerStyle={styles.startContainer}
              gameData={data}
              gameLoading={gameLoading}
              onStartPress={handePressStartGame}
            />
          )}
        </>
      )}
    </ScreenWrapper>
  );
};
const styles = StyleSheet.create({
  startContainer: {
    position: 'absolute',
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
