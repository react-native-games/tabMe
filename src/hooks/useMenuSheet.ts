import React from 'react';
import {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { height } from '../constants/styleConst';
import { PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';

const MENU_SPRING_CONFIG = {
  damping: 80,
  overshootClamping: true,
  restDisplacementThreshold: 0.1,
  restSpeedThreshold: 0.1,
  stiffness: 500,
};

const useMenuSheet = () => {
  const menuTop = useSharedValue(height);

  const menuHandler = () => {
    menuTop.value = withSpring(height / 2, MENU_SPRING_CONFIG);
  };

  const menuGestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startTop: number }
  >({
    onStart(_, context) {
      context.startTop = menuTop.value;
    },
    onActive(event, context) {
      menuTop.value = context.startTop + event.translationY;
    },
    onEnd() {
      if (menuTop.value > height / 2 + 200) {
        menuTop.value = height;
      } else {
        menuTop.value = height / 2;
      }
    },
  });

  const menuAnimStyle = useAnimatedStyle(() => {
    return {
      /* Just use withSpring here, and you don't need to use it anywhere else! */
      top: withSpring(menuTop.value, MENU_SPRING_CONFIG),
    };
  });
  return { menuHandler, menuGestureHandler, menuAnimStyle };
};

export default useMenuSheet;
