import {useState, useEffect, useMemo, useCallback, useRef} from 'react';
import {AppState} from 'react-native';

const SECONDS = 60;

export const formatSeconds = (seconds: number): string => {
  if (seconds === 0) {
    return '00';
  }
  if (seconds.toString().length === 1) {
    return `0${seconds}`;
  }
  return seconds.toString();
};

let cachedTime: number;

export const useCountDown = () => {
  const [seconds, setSeconds] = useState<number>(SECONDS);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
  const appState = useRef(AppState.currentState);

  const startTimer = useCallback(() => {
    setIsTimerActive(true);
    setSeconds(SECONDS);
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      const now = Date.now();
      if (appState.current.match(/background/) && nextAppState === 'active') {
        setSeconds(prevSeconds => {
          const recoveredSeconds =
            prevSeconds - Math.floor((now - cachedTime) / 1000);
          if (recoveredSeconds <= 0) {
            setIsTimerActive(false);
            return 0;
          }

          return recoveredSeconds;
        });
      }

      if (nextAppState === 'background') {
        cachedTime = now;
      }
      appState.current = nextAppState;
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    let resetInterval: NodeJS.Timer | null = null;

    if (isTimerActive) {
      resetInterval = setInterval(() => {
        setSeconds(prev => {
          if (prev !== 0) {
            return prev - 1;
          }

          setIsTimerActive(false);
          return 0;
        });
      }, 1000);
    } else if (resetInterval) {
      clearInterval(resetInterval);
    }

    return () => {
      if (resetInterval) {
        clearInterval(resetInterval);
        setIsTimerActive(false);
      }
    };
  }, [isTimerActive]);

  return useMemo(
    () => ({
      seconds,
      startTimer,
    }),
    [startTimer, seconds],
  );
};
