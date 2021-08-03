import React, {useState} from 'react';
import {View, Dimensions, Alert} from 'react-native';
import {Auth, API, graphqlOperation} from 'aws-amplify'

import {createOrder} from '../../graphql/mutations';
import RouteMap from "../../components/RouteMap";
import UberTypes from "../../components/UberTypes";

import { useRoute } from '@react-navigation/native';

const SearchResults = (props) => {
  const typeState = useState(null);
  const route = useRoute();
  const {originPlace, destinationPlace} = route.params

  const onSubmit = async () => {
    const [type] = typeState;

    if(!type) {
      return;
    }
    
    try {
      const userInfo = await Auth.currentAuthenticatedUser();
      const date = new Date();
      const input = {
        type,
        createdAt: date.toISOString(),
        originLatitude: originPlace.details.geometry.location.lat,
        originLongitude: originPlace.details.geometry.location.lng,

        destLatitude: destinationPlace.details.geometry.location.lat,
        destLongitude: destinationPlace.details.geometry.location.lng,

        userId: userInfo.attributes.sub,
        carId: '1',
      }

      const response = await API.graphql(
        graphqlOperation(
          createOrder, {
            input
          }
        )
      )

      console.log(response);
      Alert.alert('Hurrraaayyy', "Your order has submitted!")
    } catch (err) {
      console.log('Error', err)
    }
  }

  return (
    <View style={{display: 'flex', justifyContent: 'space-between'}}>
      <View style={{height: Dimensions.get('window').height - 400}}>
        <RouteMap origin={originPlace} destination={destinationPlace} />
      </View>

      <View style={{height: 400}}>
        <UberTypes typeState={typeState} onSubmit={onSubmit} />
      </View>
    </View>
  );
};

export default SearchResults;