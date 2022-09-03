import React, { Dispatch, SetStateAction } from 'react';
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import str from '../constants/str';
import { height } from '../constants/styleConst';
import { cache } from '../utils';

const useTimerLevel = (
  buttonAnimation: any,
  duration: number,
  points: number,
  setStart: Dispatch<SetStateAction<boolean>>,
  start: boolean,
  targetTranslateX: any,
  targetTranslateY: any,
) => {
  const timerLevelAnimation = useSharedValue(height);

  const timerLevelAnim = () => {
    buttonAnimation.value = withTiming(1, { duration: 300 });
    setStart(true);

    timerLevelAnimation.value = withSequence(
      withTiming(0, { duration: 300 }),
      /* Why add +10: Because at the beginning the timerLevel is at the bottom,
      and at the end we check again if it is at the bottom. 
      So we add 10 and at the end we check if timerLevel is bigger than height.  */
      withTiming(height + 10, {
        duration: duration,
      }),
    );
  };

  const savePoints = async () => {
    const savedPoints = await cache.get(str.points);
    if (savedPoints) {
      if (savedPoints > points) return;
      else cache.set(str.points, points);
    } else {
      cache.set(str.points, points);
    }
    const pnts = await cache.get(str.points);
  };

  const timerLevelAnimStyle = useAnimatedStyle(() => {
    /* Check if time is up */
    if (Math.round(timerLevelAnimation.value) > height) {
      buttonAnimation.value = withTiming(0, { duration: 300 });
      runOnJS(setStart)(false);
      runOnJS(savePoints)();
      targetTranslateX.value = withSpring(0);
      targetTranslateY.value = withSpring(0);
    }

    return { transform: [{ translateY: timerLevelAnimation.value }] };
  });

  return { timerLevelAnim, timerLevelAnimStyle };
};

export default useTimerLevel;
