import Sound from 'react-native-sound';

const playsound = (snd: string, delay: number) => {
  Sound.setCategory('Playback');

  const sound = new Sound(snd, Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
    setTimeout(() => {
      sound?.play(() => sound.release());
    }, delay);
  });
  return { sound };
};

export default playsound;
