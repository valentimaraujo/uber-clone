import React, {useEffect, useState} from "react";
import {Image, FlatList} from "react-native";
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {API, graphqlOperation} from 'aws-amplify';
import {listCars} from '../../graphql/queries';

const HomeMap = (props) => {
  const [currentLocation] = useState({
    latitude: -23.61560170000001,
    longitude: -46.76984249999999,
    latitudeDelta: 0.0222,
    longitudeDelta: 0.0121,
  });

  const [cars, setCars] = useState([])

  const getImage = (type) => {
    if (type === 'UberX') {
      return require('../../assets/images/cars/top-UberX.png');
    }
    if (type === 'Comfort') {
      return require('../../assets/images/cars/top-Comfort.png');
    }
    return require('../../assets/images/cars/top-UberXL.png');
  };

  useEffect(() => {
    (async () => {
      try {
        const showCars = await API.graphql(graphqlOperation(listCars));
        if(showCars.data.listCars.items) {
          setCars(showCars.data.listCars.items)
        }
      } catch (err) {
        console.log('ERR', err)
      }
    })()
  }, [])

  return (
    <MapView
      style={{width: '100%', height: '100%'}}
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
      region={currentLocation}>
      {cars.map((car) => (
        <Marker
          key={car.id}
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
        </Marker>
      ))}
    </MapView>
  );
};

export default HomeMap;