import React from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
// import { PermissionsAndroid, Platform } from 'react-native';

// navigator.geolocation = require('@react-native-community/geolocation');

import Router from './navigation/Root';

export default function App() {
  // const androidPermission = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //       {
  //         title: "Uber App Camera Permission",
  //         message:
  //           "Uber App needs access to your location " +
  //           "so you can take awesome rides.",
  //         buttonNeutral: "Ask Me Later",
  //         buttonNegative: "Cancel",
  //         buttonPositive: "OK"
  //       }
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       console.log("You can use the location");
  //     } else {
  //       console.log("Location permission denied");
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // }

  // useEffect(() => {
  //   if (Platform.OS === 'android') {
  //     androidPermission();
  //   } else {
  //     // IOS
  //     Geolocation.requestAuthorization();
  //   }
  // }, [])

  return (
    <>
      <Router />
      <StatusBar style="auto" barStyle="dark-content" />
    </>
  );
}
