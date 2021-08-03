import React, {useState, useEffect} from "react";
import MapView, {PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

import config from '../../config';

const RouteMap = ({ origin, destination }) => {
  const [currentLocation] = useState({
    latitude: -23.61560170000001,
    longitude: -46.76984249999999,
    latitudeDelta: 0.0222,
    longitudeDelta: 0.0121,
  });
  const originLoc = {
    latitude: origin.details.geometry.location.lat,
    longitude: origin.details.geometry.location.lng,
  };

  const destinationLoc = {
    latitude: destination.details.geometry.location.lat,
    longitude: destination.details.geometry.location.lng,
  };

  return (
    <MapView
      style={{width: '100%', height: '100%'}}
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
      region={currentLocation}
    >
      <MapViewDirections
        origin={originLoc}
        destination={destinationLoc}
        apikey={config.GOOGLE_MAPS_APIKEY}
        strokeWidth={3}
        strokeColor="black"
        lineDashPattern={[0]}
      />
      <Marker
        coordinate={originLoc}
        title={'Origin'}
        description="This is the test description"
      />
      <Marker
        coordinate={destinationLoc}
        title={"Destination"}
        description="This is the test description"
      />
    </MapView>
  );
};

export default RouteMap;