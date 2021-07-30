import React, {useState, useEffect} from "react";
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from "expo-location";

const GOOGLE_MAPS_APIKEY = 'xxxxxxxxxxxxxxxx';

const RouteMap = ({ origin, destination }) => {
  const [currentLocation, setCurrentLocation] = useState({
    latitude: -23.61560170000001,
    longitude: -46.76984249999999,
    latitudeDelta: 0.0222,
    longitudeDelta: 0.0121,
  });
  const originLoc = {
    // latitude: origin.details.geometry.location.lat,
    // longitude: origin.details.geometry.location.lng,
    latitude: -23.61560170000001,
    longitude: -46.76984249999999,
  };

  const destinationLoc = {
    // latitude: destination.details.geometry.location.lat,
    // longitude: destination.details.geometry.location.lng,
    latitude: -23.6543466,
    longitude: -46.7896513,
  };

  console.log('======== ORIGINLOC***\n', originLoc)
  console.log('======== DESTINATIONLOC***\n', destinationLoc)

  // useEffect(() => {
  //   (async () => {
  //     const location = await Location.getCurrentPositionAsync({});
  //     setCurrentLocation(location)
  //   })()
  // }, [])

  return (
    <MapView.Polyline
      style={{width: '100%', height: '100%'}}
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
      // initialRegion={currentLocation}>
      region={currentLocation}>
      <MapViewDirections
        origin={originLoc}
        destination={destinationLoc}
        apikey={GOOGLE_MAPS_APIKEY}
        // strokeWidth={3}
        strokeColor="black"
        lineDashPattern={[3]}
      />
      <Marker
        coordinate={originLoc}
        title={'Origin'}
      />
      <Marker
        coordinate={destinationLoc}
        title={"Destination"}
      />
    </MapView.Polyline>
  );
};

export default RouteMap;