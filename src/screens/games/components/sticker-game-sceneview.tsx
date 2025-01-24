import React, {
  FC,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';

import {Scene} from '@babylonjs/core';
import {useTheme, TextVariant} from '~/theme';
import {SceneView} from './sceneview';
import {
  Image,
  Pressable,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';
import {useIntl} from 'react-intl';
import {AppText} from '~/components';
import Logo from '~/assets/images/logo.svg';
import {ArStickerGame, GameStep} from '~/store/query/games/types';
import CloseIcon from '~/assets/images/close.svg';
import FlashIcon from '~/assets/images/games/ic_flash.svg';
import ScannerIcon from '~/assets/images/games/ic_scanner.svg';
import EmptyStepSquareIcon from '~/assets/images/games/ic_empty_square_step.svg';
import EmptyStepCircleIcon from '~/assets/images/games/ic_empty_circle_step.svg';
import EmptyStepRectangleIcon from '~/assets/images/games/ic_empty_rectangle_step.svg';

import {UserStackRoutes, UserScreenNavigationProp} from '~/navigation';
import {useNavigation} from '@react-navigation/native';

import {arGameScanner} from './game-ar-scanner';
import {IScannerListener} from '../interfaces/i-scanner-listener';
import {stickerGame} from './ar-game';
import {GameMode} from '../data/game-mode';
import {IGameListener} from '../interfaces/i-game-listener';
import {GameButton, GameButtonState} from './game-button';
import {ScannerMarker} from '../data/scanner-marker';
import {ISceneTouchListener} from '../interfaces/scene-touch-listener';
import {ISceneListener} from '../interfaces/i-scene-listener';
//@ts-ignore

import Torch from 'react-native-torch';

import {
  orientation,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import {GameCustomAlert, GameCustomAlertRef} from './close-game-dialog';
setUpdateIntervalForType(SensorTypes.orientation, 100);
interface GameSceneElement {
  gameData: ArStickerGame;
  onSaveStep: (step: number, answer: boolean) => void;
  onGameReady?: () => void;
}

export const StickerGameScene: FC<GameSceneElement> = ({
  gameData,
  onSaveStep,
  onGameReady,
}) => {
  const [gameMode, setGameMode] = useState<GameMode>();
  const [currentStep, setCurrentStep] = useState<GameStep>();
  const [quizAnswered, setQuizAnswered] = useState<boolean>();
  const [torchEnabled, setTorchEnabled] = useState<boolean>(false);

  const closeGameRef = useRef<GameCustomAlertRef>(null);

  const [quizLeftButtonState, setQuizLeftButtonState] =
    useState<GameButtonState>(GameButtonState.IDLE);
  const [quizRightButtonState, setQuizRightButtonState] =
    useState<GameButtonState>(GameButtonState.IDLE);
  const navigation = useNavigation<UserScreenNavigationProp>();
  const intl = useIntl();
  const {theme} = useTheme();

  const handleCloseGamePress = useCallback(() => {
    closeGameRef.current?.open();
  }, []);

  const handleExitGame = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{name: UserStackRoutes.TabNavigator}],
    });
  }, [navigation]);

  const handleTorchPress = useCallback(() => {
    (async () => {
      try {
        let newTorchState = !torchEnabled;
        await Torch.switchState(newTorchState);
        setTorchEnabled(newTorchState);
      } catch (e) {}
    })();
  }, [torchEnabled]);

  const gameListener = useMemo<IGameListener>(() => {
    return {
      onGameModeChanged(newGameMode: GameMode) {
        setGameMode(newGameMode);
      },
      onQuizAnswered(answer: boolean, correct: boolean) {
        setQuizAnswered(true);
        let buttonState = correct
          ? GameButtonState.SUCCESS
          : GameButtonState.ERROR;
        if (answer) {
          setQuizRightButtonState(buttonState);
        } else {
          setQuizLeftButtonState(buttonState);
        }
        setTimeout(() => {
          onSaveStep(currentStep?.order!!, answer);
          stickerGame.loadNextStep();
        }, 2000);
      },
      onGameFinished() {
        setGameMode(GameMode.FINISHED);
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [
              {name: UserStackRoutes.TabNavigator},
              {
                name: UserStackRoutes.FinishGameScreen,
                params: {
                  id: gameData.id,
                },
              },
            ],
          });
        }, 2000);
      },
      onNewStep(newStep: GameStep) {
        setCurrentStep(newStep);
        if (newStep) {
          setQuizAnswered(false);
          setQuizLeftButtonState(GameButtonState.IDLE);
          setQuizRightButtonState(GameButtonState.IDLE);
        }
      },
    };
  }, [currentStep, gameData.id, navigation, onSaveStep]);
  stickerGame.setListener(gameListener);
  orientation.subscribe(({qx, qy, qz, qw}) =>
    stickerGame.setOrientationQuaternion(qx, qy, qz, qw),
  );
  const sceneListener = useMemo<ISceneListener>(() => {
    return {
      onSceneReady(scene: Scene) {
        onGameReady?.();
        stickerGame.init(scene, gameData, gameListener);
      },
      onSceneFrame(deltaTime: number) {
        stickerGame.update(deltaTime / 1000);
      },
    };
  }, [gameData.id]);

  const scannerListener = useMemo<IScannerListener>(() => {
    return {
      onMarkerFound(_: ScannerMarker) {
        stickerGame.markerFound();
      },
    };
  }, [gameData.id]);

  const touchListener = useMemo<ISceneTouchListener>(() => {
    return {
      onPinchStart() {
        stickerGame.startScale();
      },
      onPinchEnd() {
        stickerGame.endScale();
      },
      onPinch(scale: number) {
        stickerGame.scaleSticker(scale);
      },
      onStartDrag() {
        stickerGame.startDragMode();
      },
      onEndDrag() {
        stickerGame.endDragMode();
      },
      onScrollHorizontal(offsetX: number) {
        stickerGame.rotateSticker(offsetX, undefined);
      },
      onScrollVertical(offsetY: number) {
        stickerGame.rotateSticker(undefined, offsetY);
      },
    };
  }, [gameData]);

  useEffect(() => {
    stickerGame.setData(gameData);
    setCurrentStep(
      gameData.steps?.find(step => step.order === gameData?.currentStep),
    );
  }, [gameData, gameData.steps]);
  function getShapeImage(shape: number, style: StyleProp<ViewStyle>): any {
    switch (shape) {
      case 0: {
        return <EmptyStepSquareIcon style={style} />;
      }
      case 1: {
        return <EmptyStepCircleIcon style={style} />;
      }
      case 2: {
        return <EmptyStepRectangleIcon style={style} />;
      }
      default: {
        return <EmptyStepSquareIcon style={style} />;
      }
    }
  }

  const onStepClick = useCallback(
    (step: number) => {
      if (gameMode === GameMode.SCANNER || gameMode === GameMode.VIEW) {
        stickerGame.goToStep(step);
      }
    },
    [gameMode],
  );

  const renderSteps = useCallback(
    ({item}: FlatListItem<GameStep>) => (
      <TouchableOpacity
        onPress={() => onStepClick(item.order)}
        style={styles.stepTouchable}>
        <View style={styles.stepBackgroundContainer}>
          <AppText
            variant={TextVariant.D_15_A}
            style={
              item.answeredCorrect
                ? [styles.stepIndex, styles.stepIndexCorrect]
                : styles.stepIndex
            }>
            {item.order + 1 < 10 ? `0${item.order + 1}` : item.order + 1}
          </AppText>

          {item.passed || gameMode === GameMode.FINISHED ? (
            <Image
              style={styles.stepImageSquare}
              source={{uri: item.image.url}}
            />
          ) : (
            getShapeImage(item.shape, {})
          )}
        </View>
        {currentStep?.order === item.order && (
          <View style={styles.stepOverlayContainer}>
            <View style={styles.scannerIconContainer}>
              <ScannerIcon style={styles.scannerIcon} />
            </View>
          </View>
        )}
      </TouchableOpacity>
    ),
    [currentStep?.order, gameMode, onStepClick],
  );

  return (
    <SceneView
      scanner={arGameScanner}
      sceneTouchListener={touchListener}
      sceneListener={sceneListener}
      scannerData={new Array<GameStep>()
        .concat(gameData.steps!!)
        ?.sort((a, b) => a.order - b.order)
        .map(
          step =>
            new ScannerMarker(
              step.order,
              step.image.url,
              currentStep?.order === step.order,
            ),
        )}
      scannerListener={scannerListener}>
      <View style={styles.uiContainer} pointerEvents="box-none">
        <View style={styles.headerContainer} pointerEvents="box-none">
          {gameMode !== GameMode.ZOOM && (
            <>
              {Platform.OS === 'ios' ? (
                <TouchableOpacity
                  onPress={handleTorchPress}
                  hitSlop={30}
                  style={styles.flash}>
                  <FlashIcon />
                </TouchableOpacity>
              ) : (
                <View style={styles.flash} />
              )}

              <Logo style={styles.logo} />
              <Pressable
                onPress={handleCloseGamePress}
                style={styles.close}
                hitSlop={30}>
                <CloseIcon color={theme.colors.textColors.A100} />
              </Pressable>
            </>
          )}
        </View>
        <View style={styles.centerContainer} pointerEvents="box-none">
          {gameMode === GameMode.SCANNER && (
            <Image
              style={styles.tipImage}
              source={{uri: currentStep?.image.url}}
            />
          )}
          {gameMode === GameMode.QUIZ && (
            <View style={styles.quizContainerColumn} pointerEvents="box-none">
              <GameButton
                state={quizRightButtonState}
                disabled={quizAnswered}
                fontSize={12}
                onPress={() => {
                  stickerGame.answerQuiz(currentStep!!.order, true);
                }}
                containerStyle={[styles.quizButton, styles.quizButtonTop]}>
                {currentStep?.rightButtonText}
              </GameButton>
              <GameButton
                state={quizLeftButtonState}
                disabled={quizAnswered}
                fontSize={12}
                onPress={() => {
                  stickerGame.answerQuiz(currentStep!!.order, false);
                }}
                containerStyle={styles.quizButton}>
                {currentStep?.leftButtonText}
              </GameButton>
            </View>
          )}
        </View>
        <View pointerEvents="box-none">
          {gameMode !== GameMode.ZOOM && (
            <>
              <AppText variant={TextVariant.H5_M} style={styles.tipText}>
                {currentStep?.hintText}
              </AppText>
              <FlatList
                style={styles.steps}
                data={new Array<GameStep>()
                  .concat(gameData.steps!!)
                  ?.sort((a, b) => a.order - b.order)}
                renderItem={renderSteps}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.order.toString()}
              />
            </>
          )}
        </View>

        <GameCustomAlert
          title={intl.formatMessage({
            id: 'screens.games.exit_alert.title',
            defaultMessage: 'Want to exit the game?',
          })}
          message={intl.formatMessage({
            id: 'screens.games.exit_alert.message',
            defaultMessage: 'If you exit the game, your progress will be saved',
          })}
          rightText={intl.formatMessage({
            id: 'screens.games.exit_alert.left_button',
            defaultMessage: 'Play',
          })}
          leftText={intl.formatMessage({
            id: 'screens.games.exit_alert.right_button',
            defaultMessage: 'Exit',
          })}
          ref={closeGameRef}
          onLeftBtnPress={handleExitGame}
        />
      </View>
    </SceneView>
  );
};

const styles = StyleSheet.create({
  quizButton: {},
  quizButtonTop: {
    marginBottom: 12,
  },

  quizContainer: {
    flexDirection: 'row',
    marginHorizontal: 62,
    flex: 1,
  },
  quizContainerColumn: {
    marginHorizontal: 62,
    flex: 1,
    justifyContent: 'flex-end',
  },
  root: {
    width: '100%',
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 32,
  },
  flash: {width: 24, height: 24},
  close: {width: 24, height: 24},
  logo: {},
  tipText: {
    alignSelf: 'center',
    textAlign: 'center',
    marginHorizontal: 32,
  },
  tipImage: {
    width: vp(269),
    height: vp(269),
    resizeMode: 'contain',
    alignSelf: 'center',
    opacity: 0.5,
  },
  scannerIconContainer: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerIcon: {},
  stepBackgroundContainer: {},
  stepOverlayContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  stepTouchable: {
    marginEnd: 8,
  },
  uiContainer: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  centerContainer: {
    height: vp(391),
    justifyContent: 'space-between',
    marginTop: vp(60),
  },
  steps: {
    paddingStart: 36,
    paddingEnd: 36,
    marginBottom: 30,
    marginTop: 28,
    alignSelf: 'center',
  },
  testText: {
    color: '#ffffff',
    flex: 1,
    fontSize: 40,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject,
    paddingBottom: vp(50),
  },
  stepImageSquare: {
    width: 42,
    height: 42,
    resizeMode: 'contain',
  },
  stepIndex: {
    alignSelf: 'center',
    marginBottom: 8,
  },
  stepIndexCorrect: {
    color: '#07CC64',
  },
});
