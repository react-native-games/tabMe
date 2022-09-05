import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen'

import { TabMe } from './src/screens';

const App = () => {

  useEffect(() => {
    SplashScreen.hide();
  }, [])
  return <TabMe />;
};

export default App;
