import React, { useEffect, useState } from 'react';
import {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { height } from '../constants/styleConst';
import { PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { cache } from '../utils';
import str from '../constants/str';

const MENU_SPRING_CONFIG = {
  damping: 80,
  overshootClamping: true,
  restDisplacementThreshold: 0.1,
  restSpeedThreshold: 0.1,
  stiffness: 500,
};

const useMenuSheet = (start: boolean) => {
  const menuTop = useSharedValue(height);
  /* menuIsOpen is used to get from async storage the points,
  and show them in the MenuSheet */
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);

  const menuHandler = () => {
    menuTop.value = withSpring(height / 2, MENU_SPRING_CONFIG);
    setMenuIsOpen(true);
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
        runOnJS(setMenuIsOpen)(false);
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
  return { menuHandler, menuGestureHandler, menuAnimStyle, menuIsOpen };
};

export default useMenuSheet;
