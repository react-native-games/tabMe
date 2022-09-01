import React, { Dispatch, SetStateAction, useEffect } from 'react';
import {
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { targetWidth, width } from '../constants/styleConst';

const useMoveTarget = (
  reset: boolean,
  setReset: Dispatch<SetStateAction<boolean>>,
  start: boolean,
  speed: number,
) => {
  const targetTranslateX = useSharedValue<number>(0);
  const targetTranslateY = useSharedValue<number>(0);

  // Target moving around
  useEffect(() => {
    if (reset)
      setTimeout(() => {
        setReset(false);
      }, 400);

    if (start) {
      moveXAround();
      moveYAround();
    }
  }, [reset, start]);

  const randomNum = () => {
    const nums = [-1, 1, -1, 1, -1, 1];
    const n = nums[Math.floor(Math.random() * nums.length)];
    return Math.random() * n * width - targetWidth;
  };

  const moveXAround = () => {
    targetTranslateX.value = withRepeat(
      withSequence(
        withTiming(randomNum(), { duration: speed }),
        withTiming(randomNum(), { duration: speed }),
        withTiming(randomNum(), { duration: speed }),
      ),
      -1,
      true,
    );
  };

  const moveYAround = () => {
    targetTranslateY.value = withRepeat(
      withSequence(
        withTiming(randomNum(), { duration: speed }),
        withTiming(randomNum(), { duration: speed }),
        withTiming(randomNum(), { duration: speed }),
      ),
      -1,
      true,
    );
  };

  return { targetTranslateX, targetTranslateY };
};

export default useMoveTarget;
