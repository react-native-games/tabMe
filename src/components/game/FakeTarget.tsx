import { StyleSheet } from 'react-native'
import React, { FC, } from 'react'
import { TapGestureHandler, } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'

import RenderAnimation from '../animations/RenderAnimation';
import { targetWidth } from '../../constants/styleConst';
import colors from '../../constants/colors';

const springles = require('../../assets/animations/springles.json');
interface Props {
  start: boolean,
  tapPanGestureEvent: any,
  targetAnimStyle: any,
  targetAnimStyle2: any,
  innerColorAnimStyle: any,
  showFakeTargetLottieAnim: any
}
const FakeTarget: FC<Props> = ({ start, tapPanGestureEvent, targetAnimStyle, targetAnimStyle2, innerColorAnimStyle, showFakeTargetLottieAnim }) => {

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
        {showFakeTargetLottieAnim.value ?
          <RenderAnimation
            source={springles}
            style={{ transform: [{ scale: 3 }] }}
            soundName='boin.wav'
            soundDelay={1}
          />
          : null
        }
      </Animated.View>
    </TapGestureHandler>
  )
}

export default FakeTarget;

const styles = StyleSheet.create({
  target: {
    width: targetWidth * 2,
    height: targetWidth * 2,
    alignSelf: 'center',
    backgroundColor: colors.fakeTarget,
    borderWidth: 7,
    borderColor: colors.fakeTargetInner,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
    margin: 0,
    borderTopLeftRadius: 200,
    borderBottomRightRadius: 200,
  },
  innertarget: {
    opacity: 0.8,
    position: 'absolute',
    transform: [{ scale: 0.5 }],
  },
  innerColor: {
    width: 20,
    height: 20,
    backgroundColor: colors.fakeTargetInner,
    borderRadius: 10,
    borderWidth: 14,
    borderTopLeftRadius: 200,
    borderBottomRightRadius: 200,
    borderColor: colors.fakeTargetInner,
  },
})