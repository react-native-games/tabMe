import React, { FC, useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated'
import { RFPercentage } from "react-native-responsive-fontsize";
import IoniconsIcon from 'react-native-vector-icons/Ionicons';

import colors from '../../constants/colors'
import { cache } from '../../utils'
import str from '../../constants/str'
import BoldText from '../UI/BoldText'

interface Props { menuGestureHandler: any, menuAnimStyle: any, menuIsOpen: boolean }
const MenuSheet: FC<Props> = ({ menuGestureHandler, menuAnimStyle, menuIsOpen }) => {
  const iconAnim = useSharedValue(0);

  const [points, setPoints] = useState<number>(0);

  const getPoints = async () => {
    const p = await cache.get(str.points);
    setPoints(p);
  };

  useEffect(() => {
    getPoints();
  }, [menuIsOpen]);

  const animateIcon = () => {
    iconAnim.value = withSequence(
      withSpring(10),
      withSpring(0),
      withSpring(10),
      withSpring(0),
    )
  }

  const iconAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: iconAnim.value }]
    }
  })

  return (
    <PanGestureHandler onGestureEvent={menuGestureHandler} >
      <Animated.View style={[styles.menu, menuAnimStyle]} >
        <Animated.View style={iconAnimStyle} >
          <IoniconsIcon
            name="ios-chevron-down"
            size={30}
            color={colors.button}
            style={{ marginTop: -25 }}
            onPress={animateIcon}
          />
        </Animated.View>
        <View style={styles.menuItems} >
          <View style={styles.scoreContainer} >
            <BoldText>Highest score: </BoldText>
            <BoldText style={styles.points} >{points}</BoldText>
          </View>
          <ScrollView contentContainerStyle={[styles.scrollView]} >
            <Text style={styles.body} >
              {`
1. You may choose the points you want to get per hit from the slider above. Note that the more points you select, the faster the target will move. Note also that the speed of the target increases by 70 milliseconds every second. 

2. Avoid to hit the fake-target (the red one). If you hit it you lose 1000 points. 

3. The yellow line that appears when the game starts is the time limit. Every time you hit the target, you get more time. If the time limit disappears below, then the game is over. 

4. Every time you finish a game, the highest score is saved in memory. 
      `

              }
            </Text>
          </ScrollView>
        </View>
      </Animated.View>
    </PanGestureHandler>
  )
}

export default MenuSheet

const styles = StyleSheet.create({
  body: {
    flex: 1,
    color: '#cec4e1',
    fontSize: RFPercentage(3),
    marginHorizontal: 5
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  infoButton: {
    width: 100,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
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
    alignItems: 'center'
  },
  scrollView: {
    paddingBottom: 88
  },
  title: {
    alignSelf: 'center'
  },
})