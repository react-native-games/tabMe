import {
  Dimensions,
  StyleSheet,
  Text,
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
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';

import Slider from '@react-native-community/slider';

import { RenderAnimation } from '../components';
import { cache } from '../utils';

const explodingCircles = require('../assets/animations/exploding-circles.json');

const { width, height } = Dimensions.get('window');
const TARGET_WIDTH = 88;
const colors = {
  black: "#323F4E",
  button: "#F76A6A",
  buttonText: '#f6f3be',
  darkBlue: "#192153",
  sink: "#f9f10e",
  text: "#ffffff",
  target: '#ffff8a'
};
const MENU_SPRING_CONFIG = {
  damping: 80,
  overshootClamping: true,
  restDisplacementThreshold: 0.1,
  restSpeedThreshold: 0.1,
  stiffness: 500
}

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

const TabMe = () => {
  const [start, setStart] = useState<boolean>(false);
  const [reset, setReset] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [points, setPoints] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1500);
  const [duration, setDuration] = useState<number>(5000);

  const targetRotate = useSharedValue<number>(0);
  const targetRotate2 = useSharedValue<number>(0);
  const targetScale = useSharedValue<number>(0);
  const targetOpacity = useSharedValue<number>(0);
  const targetTranslateX = useSharedValue<number>(0);
  const targetTranslateY = useSharedValue<number>(0);
  const showLottieAnim = useSharedValue<boolean>(false);
  const menuTop = useSharedValue(height)

  const timerLevelAnimation = useSharedValue(height);
  const buttonAnimation = useSharedValue(0);

  const timerLevelAnim =
    () => {
      buttonAnimation.value = withTiming(1, { duration: 300 });
      setStart(true)

      timerLevelAnimation.value = withSequence(
        withTiming(0, { duration: 300 }),
        /* Why add +10: Because at the beginning the timerLevel is at the bottom,
        and at the end we check again if is is at the bottom. 
        So we add 10 and at the end we check if timerLevel is bigger than height.  */
        withTiming(height + 10, {
          duration: duration,
        }),
      )
    }

  const getPoints = async () => {
    const p = await cache.get('points');
    console.log('points', p);
  }

  useEffect(() => {
    getPoints()
  }, [])

  const savePoints = async () => {

    const savedPoints = await cache.get('points')
    console.log('savePoints', savedPoints);
    if (savedPoints) {
      let pnts = savedPoints + points;
      cache.set('points', pnts)
    } else {
      cache.set('points', points)

    }
  }

  const timerLevelAnimStyle = useAnimatedStyle(() => {
    /* Check if time is up */
    if (start && Math.round(timerLevelAnimation.value) > height) {
      buttonAnimation.value = withTiming(0, { duration: 300 })
      runOnJS(setStart)(false);
      runOnJS(savePoints)()
      targetTranslateX.value = withSpring(0)
      targetTranslateY.value = withSpring(0)

    }

    return { transform: [{ translateY: timerLevelAnimation.value }] };
  });

  const startBtnStyle = useAnimatedStyle(() => {
    const opacity = interpolate(buttonAnimation.value, [0, 1], [1, 0]);
    const translateY = interpolate(buttonAnimation.value, [0, 1], [0, 200]);
    return { opacity, transform: [{ translateY }] };
  });


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

  const tapPanGestureEvent = useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
    onStart: (e, ctx) => {
      console.log('tab');
      if (start) {

        // runOnJS(setReset)(true);
        runOnJS(setPoints)(points + 3000 - Number(speed));
        runOnJS(setDuration)(duration + 100);
        runOnJS(timerLevelAnim)()
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

  const menuHandler = () => {
    menuTop.value = withSpring(
      height / 2,
      MENU_SPRING_CONFIG
    )
  }

  const menuGestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, { startTop: number }>({
    onStart(_, context) {
      context.startTop = menuTop.value;
    },
    onActive(event, context) {
      menuTop.value = context.startTop + event.translationY;
    },
    onEnd() {
      if (menuTop.value > height / 2 + 200) {
        menuTop.value = height
      } else {
        menuTop.value = height / 2
      }
    }
  })

  const menuAnimStyle = useAnimatedStyle(() => {


    return {
      /* Just use withSpring here, and you don't need to use it anywhere else! */
      top: withSpring(menuTop.value, MENU_SPRING_CONFIG)
    }
  })

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
        style={[styles.timerLevel, timerLevelAnimStyle]}
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
              source={explodingCircles}
              style={{ transform: [{ scale: 3 }] }}
              soundName='laser.wav'
              soundDelay={1}
            />
            : null
          }
        </Animated.View>
      </TapGestureHandler>
      <Animated.View
        style={[
          styles.startBtnContainer,
          startBtnStyle,
        ]}>
        <TouchableOpacity onPress={timerLevelAnim}>
          <View style={styles.startButton} >
            <Text style={styles.startButtonText} >Start</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
      <IoniconsIcon
        name="menu"
        size={30}
        color={colors.button}
        onPress={menuHandler}
        style={styles.menuIcon}
      />
      {start ?
        <View style={styles.pointsContainer}>
          <Text style={styles.points}>{points.toFixed(0)}</Text>
        </View> : null
      }
      <PanGestureHandler onGestureEvent={menuGestureHandler} >
        <Animated.View style={[styles.menu, menuAnimStyle]} >
          <Text>Sheet</Text>
        </Animated.View>
      </PanGestureHandler>
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
  menuIcon: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  menu: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -80,
    // top: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
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
  sliderContainer: {
    position: 'absolute',
    top: 50,
    left: 10,
  },
  startButton: {
    width: TARGET_WIDTH,
    height: TARGET_WIDTH,
    borderRadius: TARGET_WIDTH,
    backgroundColor: colors.button,
    alignItems: 'center',
    justifyContent: 'center'
  },
  startButtonText: {
    fontSize: 30,
    color: colors.buttonText
  },
  startBtnContainer: {
    position: 'absolute',
    top: height - 150,
    left: width / 2 - (TARGET_WIDTH / 2),
  },
  target: {
    width: TARGET_WIDTH,
    height: TARGET_WIDTH,
    alignSelf: 'center',
    backgroundColor: colors.target,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'cyan',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
    margin: 0,
  },
  timerLevel: {
    height: 10,
    width: width,
    backgroundColor: colors.sink,
  },
  valuesContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  values: {
    fontSize: 20,
    color: colors.buttonText,
    fontWeight: '800'
  },
});
