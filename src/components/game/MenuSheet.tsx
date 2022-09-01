import { StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'

interface Props { menuGestureHandler: any, menuAnimStyle: any }
const MenuSheet: FC<Props> = ({ menuGestureHandler, menuAnimStyle }) => {
  return (
    <PanGestureHandler onGestureEvent={menuGestureHandler} >
      <Animated.View style={[styles.menu, menuAnimStyle]} >
        <Text>Sheet</Text>
      </Animated.View>
    </PanGestureHandler>
  )
}

export default MenuSheet

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -80,
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
})