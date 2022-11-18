import { StyleSheet, Text, View } from 'react-native'
import React, { Dispatch, FC, SetStateAction } from 'react'
import Slider from '@react-native-community/slider'
import { width } from '../../constants/styleConst'
import colors from '../../constants/colors'
import Animated from 'react-native-reanimated'

interface Props {
  setSpeed: Dispatch<SetStateAction<number>>,
  setInitialSpeed: Dispatch<SetStateAction<number>>
  start: boolean,
  sliderStyle: any
}
const SliderCmp: FC<Props> = ({ setSpeed, setInitialSpeed, start, sliderStyle }) => {
  return (
    <Animated.View style={[styles.sliderContainer, sliderStyle]}>
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
        onSlidingComplete={value => {
          setInitialSpeed(value)
          setSpeed(value)
        }}
        disabled={start}
      />
    </Animated.View>
  )
}

export default SliderCmp

const styles = StyleSheet.create({
  sliderContainer: {
    position: 'absolute',
    top: 50,
    left: 10,
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
})