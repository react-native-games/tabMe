import { StyleSheet } from 'react-native'
import React, { FC, } from 'react'
import { TapGestureHandler, } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'

import RenderAnimation from '../animations/RenderAnimation';
import { targetWidth } from '../../constants/styleConst';
import colors from '../../constants/colors';

const explodingCircles = require('../../assets/animations/exploding-circles.json');
interface Props {
  start: boolean,
  tapPanGestureEvent: any,
  targetAnimStyle: any,
  targetAnimStyle2: any,
  innerColorAnimStyle: any,
  showLottieAnim: any
}
const Target: FC<Props> = ({ start, tapPanGestureEvent, targetAnimStyle, targetAnimStyle2, innerColorAnimStyle, showLottieAnim }) => {

  return (
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
  )
}

export default Target

const styles = StyleSheet.create({
  target: {
    width: targetWidth,
    height: targetWidth,
    alignSelf: 'center',
    backgroundColor: colors.target,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.targetInner,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
    margin: 0,
  },
  innertarget: {
    opacity: 0.8,
    position: 'absolute',
    transform: [{ scale: 0.5 }],
  },
  innerColor: {
    width: 10,
    height: 10,
    backgroundColor: colors.targetInner,
    borderRadius: 5,
    borderWidth: 7,
    borderColor: colors.targetInner,
  },
})