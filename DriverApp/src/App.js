import {StatusBar} from 'expo-status-bar';
import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import * as Location from 'expo-location';
import Amplify, {Auth, API, graphqlOperation} from 'aws-amplify';
import {withAuthenticator} from 'aws-amplify-react-native';

import config from './aws-exports';
Amplify.configure({
  ...config,
  Analytics: {
    disabled: true,
  },
});

import {getCarId} from "./graphql/queries";
import {createCar} from "./graphql/mutations";

import HomeScreen from "./screens/HomeScreen";

const App = () => {
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

  useEffect(() => {
    const updateUserCar = async () => {
      // Get authenticated user
      const authenticatedUser = await Auth.currentAuthenticatedUser({ bypassCache: true });
      if (!authenticatedUser) {
        return;
      }

      // Check if the user has already a car
      const carData = await API.graphql(
        graphqlOperation(
          getCarId,
          { id: authenticatedUser.attributes.sub }
        )
      )

      if (!!carData.data.getCar) {
        console.log("User already has a car assigned");
        return;
      }

      // If not, create a new car for the user
      const newCar = {
        id: authenticatedUser.attributes.sub,
        type: 'UberX',
        userId: authenticatedUser.attributes.sub,
      }
      await API.graphql(graphqlOperation(
        createCar, { input: newCar }
      ))
    };

    updateUserCar();
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

export default withAuthenticator(App);
