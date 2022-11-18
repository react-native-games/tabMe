import React, { Dispatch, SetStateAction } from 'react';
import {
  runOnJS,
  useAnimatedGestureHandler,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { TapGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { width } from '../constants/styleConst';

const useTapTarget = (
  duration: number,
  points: number,
  setDuration: Dispatch<SetStateAction<number>>,
  setPoints: Dispatch<SetStateAction<number>>,
  speed: number,
  start: boolean,
  targetTranslateX: any,
  targetTranslateY: any,
  timerLevelAnim: any,
) => {
  const showTargetLottieAnim = useSharedValue<boolean>(false);
  const tapTargetPanGestureEvent =
    useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
      onStart: (e, ctx) => {
        if (start) {
          runOnJS(setPoints)(points + 3000 - Number(speed));
          runOnJS(setDuration)(duration + 88);
          runOnJS(timerLevelAnim)();
          showTargetLottieAnim.value = true;
          targetTranslateX.value = withSpring(Math.random() * width * 2);
          targetTranslateY.value = withSpring(Math.random() * width * 2);
        }
      },
      onActive: (e, ctx) => {},
      onEnd: (e) => {
        showTargetLottieAnim.value = false;
      },
    });

  return { tapTargetPanGestureEvent, showTargetLottieAnim };
};

export default useTapTarget;
