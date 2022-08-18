import React, { FC, useLayoutEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';
import AnimatedLottieView from 'lottie-react-native';
import { playsound } from '../../utils';
interface Props {
  source: string;
  loop?: boolean;
  soundName?: string;
  soundDelay?: number;
  style?: object;
}

const RenderAnimation: FC<Props> = ({
  source,
  loop,
  soundName,
  soundDelay,
  style,
}) => {
  const animation = useRef<AnimatedLottieView>(null);

  useLayoutEffect(() => {
    if (animation.current) animation.current.play();
  }, []);

  useLayoutEffect(() => {
    if (animation.current) animation.current.play();

    if (soundName && soundDelay) {
      const { sound } = playsound(soundName, soundDelay);
      return () => {
        sound.release();
      };
    }
  }, [soundName, soundDelay]);

  return (
    <LottieView
      ref={animation}
      source={source}
      loop={loop ? loop : false}
      style={style}
    />
  );
};

export default RenderAnimation;
