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
  soulRotate: Animated.SharedValue<number>,
  soul2: boolean,
) => {
  'worklet';
  if (soul2) {
    return `${soulRotate.value * 2 * Math.PI + 45}rad`;
  } else {
    return `${soulRotate.value * 2 * Math.PI}rad`;
  }
};

const { width, height } = Dimensions.get('window');
const SOUL_WIDTH = 88;
const TabMe = () => {
  const [reset, setReset] = useState<boolean>(false);
  const [points, setPoints] = useState<number>(0);

  const soulRotate = useSharedValue(0);
  const soulRotate2 = useSharedValue(0);
  const soulScale = useSharedValue(0);
  const soulOpacity = useSharedValue(0);
  const soulTranslateX = useSharedValue(0);
  const soulTranslateY = useSharedValue(0);

  // Squares rotating
  useEffect(() => {
    soulScale.value = withRepeat(withTiming(8, { duration: 1000 }), -1, true);
    soulOpacity.value = withRepeat(
      withTiming(0.8, { duration: 2000 }),
      -1,
      true,
    );

    soulRotate.value = withRepeat(
      withTiming(0.5, {
        duration: 2000,
        easing: Easing.out(Easing.cubic),
      }),
      -1,
    );

    soulRotate2.value = withRepeat(
      withTiming(-1, {
        duration: 2000,
        easing: Easing.out(Easing.cubic),
      }),
      -1,
    );
  }, []);

  const moveXAround = () => {
    soulTranslateX.value = withRepeat(
      withSequence(
        withTiming(Math.random() * width, { duration: 1000 }),
        withTiming(Math.random() * width, { duration: 1000 }),
        withTiming(Math.random() * width, { duration: 1000 }),
      ),
      -1,
      true,
    );
  };
  const moveYAround = () => {
    soulTranslateY.value = withRepeat(
      withSequence(
        withTiming(Math.random() * width, { duration: 1000 }),
        withTiming(Math.random() * width, { duration: 1000 }),
        withTiming(Math.random() * width, { duration: 1000 }),
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
      ctx.translateX = soulTranslateX.value;
      ctx.translateY = soulTranslateY.value;
      console.log('tabed');
      runOnJS(setReset)(true);
      runOnJS(setPoints)(points + 100);
      soulTranslateX.value = withSpring(Math.random() * width);
      soulTranslateY.value = withSpring(Math.random() * height);
    },
    onActive(e, ctx) { },
    onEnd(e) { },
  });

  const soulAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: soulTranslateX.value },
        { translateY: soulTranslateY.value },
        { rotate: handleRotation(soulRotate, false) },
      ],
    };
  });

  const soulAnimStyle2 = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: soulTranslateX.value },
        { translateY: soulTranslateY.value },
        { rotate: handleRotation(soulRotate2, true) },
      ],
    };
  });

  const nousAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: soulOpacity.value,
      transform: [{ scale: soulScale.value }],
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
            <Animated.View style={[styles.soul, soulAnimStyle]} />
            <Animated.View
              style={[styles.soul, styles.innersoul, soulAnimStyle2]}>
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
  soul: {
    width: SOUL_WIDTH,
    height: SOUL_WIDTH,
    backgroundColor: '#ffff8a',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'cyan',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
  },
  innersoul: {
    opacity: 0.8,
    position: 'absolute',
    transform: [{ scale: 0.5 }],
  },
  soulImage: {
    width: SOUL_WIDTH,
    height: SOUL_WIDTH,
  },
});
