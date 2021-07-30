import React, {useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import * as Location from 'expo-location';

import Router from './navigation/Root';

export default function App() {
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if(status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      Location.installWebGeolocationPolyfill();
      navigator.geolocation.getCurrentPosition(location);
    })()
  }, [])

  return (
    <>
      <Router />
      <StatusBar style="auto" barStyle="dark-content" />
    </>
  );
}
