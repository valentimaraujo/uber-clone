import React from "react";
import { Image } from "react-native";
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

const OrderMap = ({ car }) => {

  const getImage = (type) => {
    if (type === 'UberX') {
      return require('../../assets/images/cars/top-UberX.png');
    }
    if (type === 'Comfort') {
      return require('../../assets/images/cars/top-Comfort.png');
    }
    return require('../../assets/images/cars/top-UberXL.png');
  };

  return (
    <MapView
      style={{width: '100%', height: '100%'}}
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
      initialRegion={{
        latitude: -23.61560170000001,
        longitude: -46.76984249999999,
        latitudeDelta: 0.0222,
        longitudeDelta: 0.0121,
      }}>

      {car && (<Marker
        coordinate={{latitude: car.latitude, longitude: car.longitude}}
      >
        <Image
          style={{
            width: 35,
            height: 35,
            resizeMode: 'contain',
            transform: [{
              rotate: `${car.heading}deg`
            }]
          }}
          source={getImage(car.type)}
        />
      </Marker>)}
    </MapView>
  );
};
