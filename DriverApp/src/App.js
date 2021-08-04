import {StatusBar} from 'expo-status-bar';
import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import * as Location from 'expo-location';

import HomeScreen from "./screens/HomeScreen";

export default function App() {
  useEffect(() => {
    (async () => {
      const {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
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
      <SafeAreaView>
        <HomeScreen/>
      </SafeAreaView>
      <StatusBar style="dark-content"/>
    </>
  )
}
