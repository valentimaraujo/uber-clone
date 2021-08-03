import React from 'react';
import {View, Text} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

import config from '../../config';

const HomeScreen = (props) => {
  return (
    <View>
      <MapView
        style={{width: '100%', height: '100%'}}
        provider={PROVIDER_GOOGLE}
        region={{
          latitude: -23.61560170000001,
          longitude: -46.76984249999999,
          latitudeDelta: 0.0222,
          longitudeDelta: 0.0121
        }}
      >
        <MapViewDirections
          origin={{
            latitude: -23.614804,
            longitude: -46.769398
          }}
          destination={{
            latitude: -23.622438,
            longitude: -46.762194
          }}
          strokeColor="black"
          strokeWidth={4}
          lineDashPattern={[0]}
          apikey={config.GOOGLE_MAPS_APIKEY}
        />
      </MapView>
    </View>
  )
}

export default HomeScreen;