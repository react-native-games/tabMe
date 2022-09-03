import { StyleSheet, Text, View } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'
import colors from '../../constants/colors'
import { cache } from '../../utils'
import str from '../../constants/str'
import BoldText from '../UI/BoldText'

interface Props { menuGestureHandler: any, menuAnimStyle: any, menuIsOpen: boolean }
const MenuSheet: FC<Props> = ({ menuGestureHandler, menuAnimStyle, menuIsOpen }) => {

  const [points, setPoints] = useState<number>(0);

  const getPoints = async () => {
    const p = await cache.get(str.points);
    setPoints(p);
  };

  useEffect(() => {
    getPoints();
  }, [menuIsOpen]);

  return (
    <PanGestureHandler onGestureEvent={menuGestureHandler} >
      <Animated.View style={[styles.menu, menuAnimStyle]} >
        <View style={styles.menuItems} >
          <View style={styles.scoreContainer} >
            <BoldText>Highest score: </BoldText>
            <BoldText style={styles.points} >{points}</BoldText>
          </View>
        </View>
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
    backgroundColor: colors.darkBlue,
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
  menuItems: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  points: {
    color: colors.text
  },
  scoreContainer: {
    flexDirection: 'row'
  }
})