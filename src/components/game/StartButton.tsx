import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC } from 'react'
import Animated from 'react-native-reanimated'
import { height, targetWidth, width } from '../../constants/styleConst'
import colors from '../../constants/colors'

interface Props {
  startBtnStyle: any,
  timerLevelAnim: any

}
const StartButton: FC<Props> = ({
  startBtnStyle, timerLevelAnim }) => {
  return (
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
  )
}

export default StartButton;

const styles = StyleSheet.create({
  startBtnContainer: {
    position: 'absolute',
    top: height - 150,
    left: width / 2 - (targetWidth / 2),
  },
  startButton: {
    width: targetWidth,
    height: targetWidth,
    borderRadius: targetWidth,
    backgroundColor: colors.button,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.buttonText
  },
  startButtonText: {
    fontSize: 30,
    color: colors.buttonText
  },
})