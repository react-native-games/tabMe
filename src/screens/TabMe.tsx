import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import React, { useState } from 'react';
import Animated from 'react-native-reanimated';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';

import { FakeTarget, FractalsAnimation, MenuSheet, SliderCmp, StarsAnimation, StartButton, Target } from '../components';
import colors from '../constants/colors';
import { useFakeTapTarget, useMenuSheet, useMoveTarget, useRotateFakeTarget, useRotateTarget, useStartButton, useTapTarget, useTimerLevel } from '../hooks';
import { height, width } from '../constants/styleConst';
import useMoveFakeTarget from '../hooks/useMoveFakeTarget';

const TabMe = () => {
  const [start, setStart] = useState<boolean>(false);
  const [reset, setReset] = useState<boolean>(false);
  const [points, setPoints] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1500);
  const [initialSpeed, setInitialSpeed] = useState<number>(1500);
  const [duration, setDuration] = useState<number>(3000);

  // MOVE TARGET
  const { targetTranslateX, targetTranslateY } =
    useMoveTarget(reset, setReset, start, speed, setSpeed)

  // ROTATE TARGET
  const { targetAnimStyle, targetAnimStyle2, innerColorAnimStyle } =
    useRotateTarget(targetTranslateX, targetTranslateY);

  // MOVE FAKE TARGET
  const { fakeTargetTranslateX, fakeTargetTranslateY } =
    useMoveFakeTarget(reset, setReset, start, speed, setSpeed)

  // ROTATE FAKE TARGET
  const { fakeTargetAnimStyle, fakeTargetAnimStyle2, innerColorFakeAnimStyle } =
    useRotateFakeTarget(fakeTargetTranslateX, fakeTargetTranslateY);

  // START BUTTON
  const { buttonAnimation, startBtnStyle, sliderStyle } = useStartButton(setPoints, start)

  // TIMER LEVEL
  const { timerLevelAnim, timerLevelAnimStyle } =
    useTimerLevel(
      buttonAnimation,
      duration,
      points,
      setStart,
      targetTranslateX,
      targetTranslateY,
      setSpeed,
      initialSpeed
    );

  // TAP TARGET
  const { tapTargetPanGestureEvent, showTargetLottieAnim } = useTapTarget(
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

  // TAP FAKE TARGET
  const { tapFakeTargetPanGestureEvent, showFakeTargetLottieAnim } = useFakeTapTarget(
    duration,
    points,
    setPoints,
    speed,
    start,
    fakeTargetTranslateX,
    fakeTargetTranslateY,
  );

  // MENU SHEET
  const { menuHandler, menuGestureHandler, menuAnimStyle, menuIsOpen } =
    useMenuSheet(start)

  const resetHandler = () => {
    setReset(true);
  }

  return (
    <TouchableOpacity
      onPress={resetHandler}
      style={styles.container}
      disabled={!start}
    >
      <StarsAnimation top={30} />
      <StarsAnimation top={200} />
      <FractalsAnimation top={height / 2 - 150} />
      <StarsAnimation top={height - 350} />
      <StarsAnimation top={height - 200} />

      <SliderCmp start={start} setSpeed={setSpeed} setInitialSpeed={setInitialSpeed} sliderStyle={sliderStyle} />

      <Animated.View
        style={[styles.timerLevel, timerLevelAnimStyle]}
      />
      <Target
        start={start}
        tapTargetPanGestureEvent={tapTargetPanGestureEvent}
        targetAnimStyle={targetAnimStyle}
        targetAnimStyle2={targetAnimStyle2}
        innerColorAnimStyle={innerColorAnimStyle}
        showTargetLottieAnim={showTargetLottieAnim}
      />
      {start ?
        <FakeTarget
          start={start}
          tapPanGestureEvent={tapFakeTargetPanGestureEvent}
          targetAnimStyle={fakeTargetAnimStyle}
          targetAnimStyle2={fakeTargetAnimStyle2}
          innerColorAnimStyle={innerColorFakeAnimStyle}
          showFakeTargetLottieAnim={showFakeTargetLottieAnim}
        /> : null}
      <StartButton
        startBtnStyle={startBtnStyle}
        timerLevelAnim={timerLevelAnim}
      />

      {start
        ?
        <View style={styles.pointsContainer}>
          <Text style={styles.points}>{points.toFixed(0)}</Text>
        </View>
        : <IoniconsIcon
          name="information-circle-outline"
          size={44}
          color={colors.button}
          onPress={menuHandler}
          style={styles.menuIcon}
        />
      }

      <MenuSheet
        menuGestureHandler={menuGestureHandler}
        menuAnimStyle={menuAnimStyle}
        menuIsOpen={menuIsOpen}
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
