import React, { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const handleRotation = (
  targetRotate: Animated.SharedValue<number>,
  target2: boolean,
) => {
  'worklet';
  if (target2) {
    return `${targetRotate.value * 2 * Math.PI + 45}rad`;
  } else {
    return `${targetRotate.value * 2 * Math.PI}rad`;
  }
};

const useRotateTarget = (
  fakeTargetTranslateX: any,
  fakeTargetTranslateY: any,
) => {
  const targetOpacity = useSharedValue<number>(0);
  const targetScale = useSharedValue<number>(0);
  const targetRotate = useSharedValue<number>(0);
  const targetRotate2 = useSharedValue<number>(0);

  // Target rotating
  useEffect(() => {
    targetScale.value = withRepeat(withTiming(8, { duration: 1000 }), -1, true);
    targetOpacity.value = withRepeat(
      withTiming(0.8, { duration: 2000 }),
      -1,
      true,
    );

    targetRotate.value = withRepeat(
      withTiming(0.5, {
        duration: 2000,
        easing: Easing.out(Easing.cubic),
      }),
      -1,
    );

    targetRotate2.value = withRepeat(
      withTiming(-1, {
        duration: 2000,
        easing: Easing.out(Easing.cubic),
      }),
      -1,
    );
  }, []);

  const fakeTargetAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: fakeTargetTranslateX.value },
        { translateY: fakeTargetTranslateY.value },
        { rotate: handleRotation(targetRotate, false) },
      ],
    };
  });

  const fakeTargetAnimStyle2 = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: handleRotation(targetRotate2, true) }],
    };
  });

  const innerColorFakeAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: targetOpacity.value,
      transform: [{ scale: targetScale.value }],
    };
  });

  return { fakeTargetAnimStyle, fakeTargetAnimStyle2, innerColorFakeAnimStyle };
};

export default useRotateTarget;
