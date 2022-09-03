import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { FC, useEffect } from 'react'
import BoldText from '../components/UI/BoldText'
import Button from '../components/UI/Button'
import colors from '../constants/colors'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { ScrollView } from 'react-native-gesture-handler'

interface Props { renderInfo: () => void }
const Info: FC<Props> = ({ renderInfo }) => {
  const opacity = useSharedValue(.5);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 1000 })
  }, [opacity.value]);

  const animStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value
    }
  })

  return (
    <Animated.View style={[styles.container, animStyle]}>
      <SafeAreaView>
        <ScrollView contentContainerStyle={[styles.scrollView]} >
          <BoldText style={styles.title}>Info </BoldText>
          <Text style={styles.body} >
            {`
1. You may choose the points you want to get per hit from the slider above. Note that the more points you select, the faster the target will move. Note also that the speed of the target increases by 100 milliseconds every 10 seconds. 

2. Avoid to hit the fake-target (the red one). If you hit it you lose 1000 points. 

3. The yellow line that appears when the game starts is the time limit. Every time you hit the target, you get more time. If the time limit disappears below, then the game is over. 

4. Every time you finish a game, the highest score is saved in memory. 
      `

            }
          </Text>
          <Button style={[styles.title, { width: 150 }]} title='Go Back' onPress={renderInfo} />
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  )
}

export default Info

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  scrollView: {
    // backgroundColor: colors.background,
  },
  body: {
    flex: 1,
    color: '#cec4e1',
    fontSize: 25,
    marginHorizontal: 5
  },
  title: {
    alignSelf: 'center'
  }
})