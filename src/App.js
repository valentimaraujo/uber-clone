import React, {useEffect} from 'react';
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react-native'

import config from './aws-exports';
Amplify.configure(config);

import Router from './navigation/Root';

const App = () => {
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

export default withAuthenticator(App)
