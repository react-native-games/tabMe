import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

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

const { width, height } = Dimensions.get('window');

const TARGET_WIDTH = 88;
const TabMe = () => {
  const [reset, setReset] = useState<boolean>(false);
  const [points, setPoints] = useState<number>(0);

  const targetRotate = useSharedValue(0);
  const targetRotate2 = useSharedValue(0);
  const targetScale = useSharedValue(0);
  const targetOpacity = useSharedValue(0);
  const targetTranslateX = useSharedValue(0);
  const targetTranslateY = useSharedValue(0);

  // Squares rotating
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

  const randomNum = () => {
    const nums = [-1, 1, -1, 1, -1, 1]
    const n = nums[Math.floor(Math.random() * nums.length)]
    console.log(n);

    return Math.random() * n * width - TARGET_WIDTH
  }
  const moveXAround = () => {
    targetTranslateX.value = withRepeat(
      withSequence(
        withTiming(randomNum(), { duration: 500 }),
        withTiming(randomNum(), { duration: 500 }),
        withTiming(randomNum(), { duration: 500 }),
      ),
      -1,
      true,
    );
  };
  const moveYAround = () => {
    targetTranslateY.value = withRepeat(
      withSequence(
        withTiming(randomNum(), { duration: 500 }),
        withTiming(randomNum(), { duration: 500 }),
        withTiming(randomNum(), { duration: 500 }),
      ),
      -1,
      true,
    );
  };

  // Squares moving around
  useEffect(() => {
    if (reset) {
      setTimeout(() => {
        setReset(false);
      }, 400);
    }
    moveXAround();
    moveYAround();
  }, [reset]);

  const tabPanGestureEvent = useAnimatedGestureHandler<
    TapGestureHandlerGestureEvent,
    {
      translateX: number;
      translateY: number;
    }
  >({
    onStart(e, ctx) {
      targetTranslateX.value = withSpring(Math.random() * width * 2);
      targetTranslateY.value = withSpring(Math.random() * width * 2);
      runOnJS(setReset)(true);
      runOnJS(setPoints)(points + 100);

    },
    onActive(e, ctx) { },
    onEnd(e) { },
  });

  const targetAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: targetTranslateX.value },
        { translateY: targetTranslateY.value },
        { rotate: handleRotation(targetRotate, false) },
      ],
    };
  });

  const targetAnimStyle2 = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: targetTranslateX.value },
        { translateY: targetTranslateY.value },
        { rotate: handleRotation(targetRotate2, true) },
      ],
    };
  });

  const nousAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: targetOpacity.value,
      transform: [{ scale: targetScale.value }],
    };
  });

  return (
    <TouchableHighlight onPress={() => setReset(true)} style={styles.container}>
      <View>
        <View style={styles.pointsContainer}>
          <Text style={styles.points}>{points}</Text>
        </View>
        <TapGestureHandler onGestureEvent={tabPanGestureEvent}>
          <Animated.View>
            <Animated.View style={[styles.target, targetAnimStyle]} />
            <Animated.View
              style={[styles.target, styles.innertarget, targetAnimStyle2]}>
              <Animated.View style={[styles.nous, nousAnimStyle]} />
            </Animated.View>
          </Animated.View>
        </TapGestureHandler>
      </View>
    </TouchableHighlight>
  );
};

export default TabMe;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#192153',
  },
  nous: {
    width: 10,
    height: 10,
    backgroundColor: 'cyan',
    borderRadius: 5,
    borderWidth: 7,
    borderColor: 'cyan',
  },
  points: {
    color: '#fff',
    fontSize: 50,
  },
  pointsContainer: {
    position: 'absolute',
    top: height / 2 - 20,
    left: -width / 2 + 50,
  },
  target: {
    width: TARGET_WIDTH,
    height: TARGET_WIDTH,
    backgroundColor: '#ffff8a',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'cyan',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
  },
  innertarget: {
    opacity: 0.8,
    position: 'absolute',
    transform: [{ scale: 0.5 }],
  },
  targetImage: {
    width: TARGET_WIDTH,
    height: TARGET_WIDTH,
  },
});
