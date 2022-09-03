import React, { Dispatch, SetStateAction, useEffect } from 'react';
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const useStartButton = (
  setPoints: Dispatch<SetStateAction<number>>,
  start: boolean,
) => {
  const buttonAnimation = useSharedValue(0);

  useEffect(() => {
    setPoints(0);
  }, [start]);

  const startBtnStyle = useAnimatedStyle(() => {
    const opacity = interpolate(buttonAnimation.value, [0, 1], [1, 0]);
    const translateY = interpolate(buttonAnimation.value, [0, 1], [0, 200]);
    return { opacity, transform: [{ translateY }] };
  });

  const sliderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(buttonAnimation.value, [0, 1], [1, 0]);
    const translateY = interpolate(buttonAnimation.value, [0, 1], [0, -200]);
    return { opacity, transform: [{ translateY }] };
  });

  return { buttonAnimation, startBtnStyle, sliderStyle };
};

export default useStartButton;
