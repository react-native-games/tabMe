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
import Slider from '@react-native-community/slider';

import { IOSButton } from '../components';

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
  const [start, setStart] = useState<boolean>(false);
  const [reset, setReset] = useState<boolean>(false);
  const [points, setPoints] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1500);

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

  // Squares moving around
  useEffect(() => {
    if (reset) {
      setTimeout(() => {
        setReset(false);
      }, 400);
    }
    if (start) {
      moveXAround();
      moveYAround();
    }
  }, [reset, start]);

  const tabPanGestureEvent = useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
    onStart(e, ctx) {
      if (start) {
        targetTranslateX.value = withSpring(Math.random() * width * 2);
        targetTranslateY.value = withSpring(Math.random() * width * 2);
        runOnJS(setReset)(true);
        runOnJS(setPoints)(points + 3000 - Number(speed));
      }
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
    <TouchableHighlight disabled={!start} onPress={() => setReset(true)} style={styles.container}>
      <View>
        <View style={styles.sliderContainer}>

          <Slider
            style={{ width: width - 20, height: 40 }}
            value={1500}
            inverted
            minimumValue={500}
            maximumValue={2500}
            minimumTrackTintColor="red"
            maximumTrackTintColor="cyan"
            onSlidingComplete={value => setSpeed(value)}
            disabled={start}
          />
        </View>
        <View style={styles.pointsContainer}>
          <Text style={styles.points}>{points.toFixed(2)}</Text>
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
        <View style={styles.startBtnContainer}>
          <IOSButton title='Start' onPress={() => setStart(true)} disabled={start} />
        </View>
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
    top: height / 2 - 25,
    left: -width / 2 + 55,
  },
  sliderContainer: {
    position: 'absolute',
    top: -height / 2 + 100,
    right: -150,
  },
  startBtnContainer: {
    position: 'absolute',
    top: height / 2 - 20,
    left: 0,
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
