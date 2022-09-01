import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const useStartButton = () => {
  const buttonAnimation = useSharedValue(0);

  const startBtnStyle = useAnimatedStyle(() => {
    const opacity = interpolate(buttonAnimation.value, [0, 1], [1, 0]);
    const translateY = interpolate(buttonAnimation.value, [0, 1], [0, 200]);
    return { opacity, transform: [{ translateY }] };
  });

  return { buttonAnimation, startBtnStyle };
};

export default useStartButton;

const styles = StyleSheet.create({});
