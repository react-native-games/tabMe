import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  GestureHandlerRootView,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Slider from '@react-native-community/slider';

import { IOSButton, RenderAnimation } from '../components';

let source = require('../assets/animations/exploding-circles.json');

const colors = {
  black: "#323F4E",
  button: "#F76A6A",
  sink: "#192153",
  text: "#ffffff",
};

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
  const [duration, setDuration] = useState(5);

  const targetRotate = useSharedValue<number>(0);
  const targetRotate2 = useSharedValue<number>(0);
  const targetScale = useSharedValue<number>(0);
  const targetOpacity = useSharedValue<number>(0);
  const targetTranslateX = useSharedValue<number>(0);
  const targetTranslateY = useSharedValue<number>(0);
  const showLottieAnim = useSharedValue<boolean>(false);

  const timerAnimation = useSharedValue(height);
  const buttonAnimation = useSharedValue(0);

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
    if (reset)
      setTimeout(() => {
        setReset(false);
      }, 400);

    if (start) {
      moveXAround();
      moveYAround();
    }
  }, [reset, start]);

  const tapPanGestureEvent = useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
    onStart: (e, ctx) => {
      console.log('tab');
      if (start) {
        runOnJS(setReset)(true);
        runOnJS(setPoints)(points + 3000 - Number(speed));
        showLottieAnim.value = true
        targetTranslateX.value = withSpring(Math.random() * width * 2);
        targetTranslateY.value = withSpring(Math.random() * width * 2);

      }
    },
    onActive: (e, ctx) => {
      console.log('tab2');

    },
    onEnd: (e) => {
      showLottieAnim.value = false
    },
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
        { rotate: handleRotation(targetRotate2, true) },
      ],
    };
  });

  const innerColorAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: targetOpacity.value,
      transform: [{ scale: targetScale.value }],
    };
  });

  const resetHandler = () => {
    setReset(true);
  }


  const animationHandler = () => {
    setStart(true)
    buttonAnimation.value = withTiming(1, { duration: 300 });

    timerAnimation.value = withSequence(
      withDelay(300, withTiming(0, { duration: 300 })),
      (timerAnimation.value = withTiming(height, {
        duration: duration * 1000,
      }))
    );
    buttonAnimation.value = withDelay(
      duration * 1000,
      withTiming(0, { duration: 300 })
    );
    Vibration.cancel();
    Vibration.vibrate();
  };

  useEffect(() => {
    // animationHandler();
  }, [duration]);

  const sinkStyle = useAnimatedStyle(() => {
    return { transform: [{ translateY: timerAnimation.value }] };
  });

  const buttonStyle = useAnimatedStyle(() => {
    const opacity = interpolate(buttonAnimation.value, [0, 1], [1, 0]);
    const translateY = interpolate(buttonAnimation.value, [0, 1], [0, 200]);
    return { opacity, transform: [{ translateY }] };
  });

  return (
    <TouchableOpacity
      onPress={resetHandler}
      style={styles.container}
      disabled={!start}
    >
      <View style={styles.sliderContainer}>
        <View style={styles.valuesContainer}>
          <Text style={styles.values}>500</Text>
          <Text style={[styles.values, { marginLeft: 10 }]}>1500</Text>
          <Text style={styles.values}>2500</Text>
        </View>
        <Slider
          style={{ width: width - 20, height: 40 }}
          value={1500}
          inverted
          tapToSeek
          minimumValue={500}
          maximumValue={2500}
          minimumTrackTintColor="red"
          maximumTrackTintColor="cyan"
          onSlidingComplete={value => setSpeed(value)}
          disabled={start}
        />
      </View>
      <Animated.View
        style={[StyleSheet.absoluteFillObject, styles.sink, sinkStyle]}
      />
      <TapGestureHandler onGestureEvent={tapPanGestureEvent}
        maxDurationMs={200}
        maxDelayMs={200}
        maxDeltaX={4}
        maxDeltaY={4}
        enabled={start}
      >
        <Animated.View
          style={[styles.target, targetAnimStyle]}>
          <Animated.View style={[styles.target, styles.innertarget, targetAnimStyle2]} />
          <Animated.View
            style={[styles.innerColor, innerColorAnimStyle]}
          />
          {showLottieAnim.value ?
            <RenderAnimation
              source={source}
              style={{ transform: [{ scale: 3 }] }}
              soundName='laser.wav'
              soundDelay={1}
            />
            : null
          }
        </Animated.View>
      </TapGestureHandler>
      {
        !start ? <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              justifyContent: "flex-end",
              alignItems: "center",
              paddingBottom: 100,
            },
            buttonStyle,
          ]}>
          <TouchableOpacity onPress={animationHandler}>
            <View style={styles.roundButton} />
          </TouchableOpacity>
        </Animated.View>
          :
          <View style={styles.pointsContainer}>
            <Text style={styles.points}>{points.toFixed(0)}</Text>
          </View>
      }
    </TouchableOpacity>
  );
};

export default TabMe;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'space-between',
    justifyContent: 'center',
    backgroundColor: '#474e7f',
  },
  innertarget: {
    opacity: 0.8,
    position: 'absolute',
    transform: [{ scale: 0.5 }],
  },
  innerColor: {
    width: 10,
    height: 10,
    backgroundColor: 'cyan',
    borderRadius: 5,
    borderWidth: 7,
    borderColor: 'cyan',
  },
  points: {
    color: '#fff',
    fontSize: 30,
  },
  pointsContainer: {
    position: 'absolute',
    top: height - 90,
    left: 20,
  },
  roundButton: {
    width: 80,
    height: 80,
    borderRadius: 80,
    backgroundColor: colors.button,
  },
  sink: {
    height: height,
    width: width,
    backgroundColor: colors.sink,
    opacity: 0.5
  },
  sliderContainer: {
    position: 'absolute',
    top: 50,
    left: 10,
  },
  startBtnContainer: {
    position: 'absolute',
    top: height - 100,
    left: width / 2 - 50,
  },
  target: {
    width: TARGET_WIDTH,
    height: TARGET_WIDTH,
    alignSelf: 'center',
    backgroundColor: '#ffff8a',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'cyan',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
    margin: 0,
  },
  valuesContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  values: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '800'
  },
});
