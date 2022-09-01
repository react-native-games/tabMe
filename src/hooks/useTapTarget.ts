import { StyleSheet, Text, View } from 'react-native';
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
  const showLottieAnim = useSharedValue<boolean>(false);
  const tapPanGestureEvent =
    useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
      onStart: (e, ctx) => {
        console.log('tab');
        if (start) {
          // runOnJS(setReset)(true);
          runOnJS(setPoints)(points + 3000 - Number(speed));
          runOnJS(setDuration)(duration + 100);
          runOnJS(timerLevelAnim)();
          showLottieAnim.value = true;
          targetTranslateX.value = withSpring(Math.random() * width * 2);
          targetTranslateY.value = withSpring(Math.random() * width * 2);
        }
      },
      onActive: (e, ctx) => {
        console.log('tab2');
      },
      onEnd: (e) => {
        showLottieAnim.value = false;
      },
    });

  return { tapPanGestureEvent, showLottieAnim };
};

export default useTapTarget;

const styles = StyleSheet.create({});
