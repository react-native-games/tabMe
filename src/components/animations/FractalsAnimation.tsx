/* eslint-disable @typescript-eslint/no-var-requires */
import { StyleSheet } from 'react-native'
import React, { FC } from 'react'
import Animated from 'react-native-reanimated'
import RenderAnimation from './RenderAnimation';
import { height, width } from '../../constants/styleConst';

const fractals = require('../../assets/animations/fractal.json');

interface Props { top: number }

const FractalsAnimation: FC<Props> = ({ top }) => {
  let scale = 1.2;
  if (width > 500) scale = 2
  return (
    <Animated.View style={[styles.stars, { top, transform: [{ scale }] }]}>
      <RenderAnimation
        source={fractals}
        loop
      />
    </Animated.View>
  )
}

export default FractalsAnimation

const styles = StyleSheet.create({
  stars: {
    position: 'absolute',
    height: 300,
    width: "100%"
  },
})