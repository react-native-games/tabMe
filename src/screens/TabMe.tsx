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

import { MenuSheet, RenderAnimation, SliderCmp, StartButton, Target } from '../components';
import { cache } from '../utils';
import colors from '../constants/colors';
import * as styleConst from '../constants/styleConst';
import { useMoveTarget, useRotateTarget } from '../hooks';
import useTimerLevel from '../hooks/useTimerLevel';



const { width, height } = Dimensions.get('window');


const MENU_SPRING_CONFIG = {
  damping: 80,
  overshootClamping: true,
  restDisplacementThreshold: 0.1,
  restSpeedThreshold: 0.1,
  stiffness: 500
}



const TabMe = () => {
  const [start, setStart] = useState<boolean>(false);
  const [reset, setReset] = useState<boolean>(false);
  const [points, setPoints] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1500);
  const [duration, setDuration] = useState<number>(5000);

  const showLottieAnim = useSharedValue<boolean>(false);
  const menuTop = useSharedValue(height)


  const buttonAnimation = useSharedValue(0);


  // MOVE TARGET
  const { targetTranslateX, targetTranslateY } =
    useMoveTarget(reset, setReset, start, speed)

  // ROTATE TARGET
  const { targetAnimStyle, targetAnimStyle2, innerColorAnimStyle } =
    useRotateTarget(targetTranslateX, targetTranslateY)

  // TIMER LEVEL
  const { timerLevelAnim, timerLevelAnimStyle } =
    useTimerLevel(
      buttonAnimation,
      duration,
      points,
      setStart,
      start,
      targetTranslateX,
      targetTranslateY,
    )


  const getPoints = async () => {
    const p = await cache.get('points');
    console.log('points', p);
  }

  useEffect(() => {
    getPoints()
  }, [])





  const startBtnStyle = useAnimatedStyle(() => {
    const opacity = interpolate(buttonAnimation.value, [0, 1], [1, 0]);
    const translateY = interpolate(buttonAnimation.value, [0, 1], [0, 200]);
    return { opacity, transform: [{ translateY }] };
  });









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
      <MenuSheet
        menuGestureHandler={menuGestureHandler}
        menuAnimStyle={menuAnimStyle}
      />
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
