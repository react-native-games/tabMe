import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Animated from 'react-native-reanimated';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';

import { MenuSheet, SliderCmp, StartButton, Target } from '../components';
import { cache } from '../utils';
import colors from '../constants/colors';
import { useMenuSheet, useMoveTarget, useRotateTarget, useStartButton, useTapTarget, useTimerLevel } from '../hooks';
import { height, width } from '../constants/styleConst';

const TabMe = () => {
  const [start, setStart] = useState<boolean>(false);
  const [reset, setReset] = useState<boolean>(false);
  const [points, setPoints] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1500);
  const [duration, setDuration] = useState<number>(5000);

  // MOVE TARGET
  const { targetTranslateX, targetTranslateY } =
    useMoveTarget(reset, setReset, start, speed)

  // ROTATE TARGET
  const { targetAnimStyle, targetAnimStyle2, innerColorAnimStyle } =
    useRotateTarget(targetTranslateX, targetTranslateY);

  // START BUTTON
  const { buttonAnimation, startBtnStyle, sliderStyle } = useStartButton()

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
    );

  // TAP TARGET
  const { tapPanGestureEvent, showLottieAnim } = useTapTarget(
    duration,
    points,
    setDuration,
    setPoints,
    speed,
    start,
    targetTranslateX,
    targetTranslateY,
    timerLevelAnim,
  );

  // MENU SHEET
  const { menuHandler, menuGestureHandler, menuAnimStyle } =
    useMenuSheet()

  const getPoints = async () => {
    const p = await cache.get('points');
    console.log('points', p);
    setPoints(p)
  }
  useEffect(() => {
    getPoints()
  }, [start])

  const resetHandler = () => {
    setReset(true);
  }

  return (
    <TouchableOpacity
      onPress={resetHandler}
      style={styles.container}
      disabled={!start}
    >
      <SliderCmp start={start} setSpeed={setSpeed} sliderStyle={sliderStyle} />

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

      <MenuSheet
        menuGestureHandler={menuGestureHandler}
        menuAnimStyle={menuAnimStyle}
      />


      {start ?
        <View style={styles.pointsContainer}>
          <Text style={styles.points}>{points.toFixed(0)}</Text>
        </View> : <IoniconsIcon
          name="menu"
          size={30}
          color={colors.menu}
          onPress={menuHandler}
          style={styles.menuIcon}
        />
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
    backgroundColor: colors.background,
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
