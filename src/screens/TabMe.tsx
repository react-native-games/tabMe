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

import { RenderAnimation, SliderCmp, StartButton, Target } from '../components';
import { cache } from '../utils';
import colors from '../constants/colors';
import * as styleConst from '../constants/styleConst';



const { width, height } = Dimensions.get('window');


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
        and at the end we check again if it is at the bottom. 
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
    return Math.random() * n * width - styleConst.targetWidth
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
      <SliderCmp start={start} setSpeed={setSpeed} />
      <Animated.View
        style={[styles.timerLevel, timerLevelAnimStyle]}
      />
      <Target
        start={start}
        tapPanGestureEvent={tapPanGestureEvent}
        targetAnimStyle={targetAnimStyle}
        targetAnimStyle2={targetAnimStyle2}
        innerColorAnimStyle={innerColorAnimStyle}
        showLottieAnim={showLottieAnim}
      />
      <StartButton
        startBtnStyle={startBtnStyle}
        timerLevelAnim={timerLevelAnim}
      />
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
  timerLevel: {
    height: 10,
    width: width,
    backgroundColor: colors.sink,
  },
});
