import { Dispatch, SetStateAction, useEffect } from 'react';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { width } from '../constants/styleConst';

const useMoveTarget = (
  reset: boolean,
  setReset: Dispatch<SetStateAction<boolean>>,
  start: boolean,
  speed: number,
  setSpeed: Dispatch<SetStateAction<number>>,
) => {
  const targetTranslateX = useSharedValue<number>(0);
  const targetTranslateY = useSharedValue<number>(0);

  /*  
  If user presses anywhere on the screen,
  then reste is true and the target will move around.
  This is made is case target is off the screen, 
  thus, user can bring it back in.
  */
  useEffect(() => {
    if (reset)
      setTimeout(() => {
        setReset(false);
      }, 400);

    if (start) {
      moveXAround();
      moveYAround();
    }
  }, [reset, start]);

  // MOVE TARGET
  useEffect(() => {
    const interval = setInterval(() => {
      if (start) {
        moveXAround();
        moveYAround();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  // INCREASE SPEED EVERY 1 SECONDS BY 70
  useEffect(() => {
    const interval = setInterval(() => {
      if (start) {
        setSpeed((prev) => prev + 70);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  const randomNum = () => {
    const nums = [1, 0.5, -1, -1.5, -1, 0.2];
    const n = nums[Math.floor(Math.random() * nums.length)];
    return Math.random() * n * width;
  };

  const moveXAround = () => {
    targetTranslateX.value = withTiming(randomNum(), { duration: speed });
  };

  const moveYAround = () => {
    targetTranslateY.value = withTiming(randomNum(), { duration: speed });
  };

  return { targetTranslateX, targetTranslateY };
};

export default useMoveTarget;
