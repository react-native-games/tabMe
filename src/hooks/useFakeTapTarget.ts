import React, { Dispatch, SetStateAction } from 'react';
import {
  runOnJS,
  useAnimatedGestureHandler,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { TapGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { width } from '../constants/styleConst';

const useFakeTapTarget = (
  duration: number,
  points: number,
  setDuration: Dispatch<SetStateAction<number>>,
  setPoints: Dispatch<SetStateAction<number>>,
  speed: number,
  start: boolean,
  fakeTargetTranslateX: any,
  fakeTargetTranslateY: any,
  timerLevelAnim: any,
) => {
  const showFakeTargetLottieAnim = useSharedValue<boolean>(false);
  const tapFakeTargetPanGestureEvent =
    useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
      onStart: (e, ctx) => {
        console.log('fake tab');
        if (start) {
          // runOnJS(setReset)(true);
          runOnJS(setPoints)(points - 1000);
          runOnJS(setDuration)(duration - 100);
          runOnJS(timerLevelAnim)();
          showFakeTargetLottieAnim.value = true;
          fakeTargetTranslateX.value = withSpring(Math.random() * width * 2);
          fakeTargetTranslateY.value = withSpring(Math.random() * width * 2);
        }
      },
      onActive: (e, ctx) => {
        console.log('fake tab2');
      },
      onEnd: (e) => {
        showFakeTargetLottieAnim.value = false;
      },
    });

  return { tapFakeTargetPanGestureEvent, showFakeTargetLottieAnim };
};

export default useFakeTapTarget;
