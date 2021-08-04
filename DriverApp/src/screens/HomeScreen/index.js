import React, {useState, useEffect} from "react";
import {View, Text, Dimensions, Pressable} from "react-native";
import MapView, {PROVIDER_GOOGLE} from "react-native-maps";
import MapViewDirections from 'react-native-maps-directions';
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from './styles.js'
import NewOrderPopup from "../../components/NewOrderPopup";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import config from "../../config";

import {Auth, API, graphqlOperation} from 'aws-amplify';
import {getCar, listOrders} from '../../graphql/queries';
import {updateCar} from '../../graphql/mutations';

const GOOGLE_MAPS_APIKEY = config.GOOGLE_MAPS_APIKEY;

const HomeScreen = () => {
  const [car, setCar] = useState(null);
  const [myPosition, setMyPosition] = useState(null);
  const [order, setOrder] = useState(null);
  const [newOrders, setNewOrders] = useState([]);

  const [newOrder, setNewOrder] = useState(null)
  // const [newOrder, setNewOrder] = useState({
  //   id: '1',
  //   type: 'UberX',
  //
  //   originLatitude: -23.610773,
  //   oreiginLongitude: -46.7701274,
  //
  //   destLatitude: -23.594348,
  //   destLongitude: -46.726028,
  //
  //   user: {
  //     rating: 4.8,
  //     name: 'Ciara',
  //   }
  // })

  const fetchCar = async () => {
    try {
      const userData = await Auth.currentAuthenticatedUser();
      const carData = await API.graphql(
        graphqlOperation(getCar, {id: userData.attributes.sub}),
      );
      setCar(carData.data.getCar);
    } catch (e) {
      console.error(e);
    }
  }

  const fetchOrders = async () => {
    try {
      const ordersData = await API.graphql(
        graphqlOperation(
          listOrders,
          { filter: { status: { eq: 'NEW'}}}
        )
      );
      console.log(ordersData.data.listOrders.items)
      setNewOrders(ordersData.data.listOrders.items);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    fetchCar();
    fetchOrders();
  }, []);

  const onDecline = () => {
    setNewOrder(null);
  }

  const onAccept = (newOrder) => {
    setOrder(newOrder);
    setNewOrder(null);
  }

  const onGoPress = async () => {
    try {
      const userData = await Auth.currentAuthenticatedUser();
      const input = {
        id: userData.attributes.sub,
        isActive: !car.isActive,
      }
      const updatedCarData = await API.graphql(
        graphqlOperation(updateCar, { input })
      )
      setCar(updatedCarData.data.updateCar);
    } catch (e) {
      console.error(e);
    }
  }

  const onUserLocationChange = (event) => {
    setMyPosition(event.nativeEvent.coordinate);
  }

  const onDirectionFound = (event) => {
    console.log("Direction found: ", event);
    if (order) {
      setOrder({
        ...order,
        distance: event.distance,
        duration: event.duration,
        pickedUp: order.pickedUp || event.distance < 0.2,
        isFinished: order.pickedUp && event.distance < 0.2,
      })
    }
  }

  const getDestination = () => {
    if (order && order.pickedUp) {
      return {
        latitude: order.destLatitude,
        longitude: order.destLongitude,
      }
    }
    return {
      latitude: order.originLatitude,
      longitude: order.originLongitude,
    }
  }

  const renderBottomTitle = () => {
    if (order && order.isFinished) {
      return (
        <View style={{alignItems: 'center'}}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#cb1a1a',
            width: 200,
            padding: 10,
          }}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>COMPLETE {order.type}</Text>
          </View>
          <Text style={styles.bottomText}>{order.user.name}</Text>
        </View>
      )
    }

    if (order && order.pickedUp) {
      return (
        <View style={{alignItems: 'center'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text>{order.duration ? order.duration.toFixed(1) : '?'} min</Text>
            <View style={{
              backgroundColor: '#d41212',
              marginHorizontal: 10,
              width: 30,
              height: 30,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 20
            }}>
              <FontAwesome name={"user"} color={"white"} size={20}/>
            </View>
            <Text>{order.distance ? order.distance.toFixed(1) : '?'} km</Text>
          </View>
          <Text style={styles.bottomText}>Dropping off {order.user.name}</Text>
        </View>
      )
    }

    if (order) {
      return (
        <View style={{alignItems: 'center'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text>{order.duration ? order.duration.toFixed(1) : '?'} min</Text>
            <View style={{
              backgroundColor: '#1e9203',
              marginHorizontal: 10,
              width: 30,
              height: 30,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 20
            }}>
              <FontAwesome name={"user"} color={"white"} size={20}/>
            </View>
            <Text>{order.distance ? order.distance.toFixed(1) : '?'} km</Text>
          </View>
          <Text style={styles.bottomText}>Picking up {order.user.name}</Text>
        </View>
      )
    }
    if (car?.isActive) {
      return (
        <Text style={styles.bottomText}>You're online</Text>
      )
    }
    return (<Text style={styles.bottomText}>You're offline</Text>);
  }

  return (
    <View>
      <MapView
        style={{width: '100%', height: Dimensions.get('window').height - 150}}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        onUserLocationChange={onUserLocationChange}
        region={{
          latitude: -23.61560170000001,
          longitude: -46.76984249999999,
          latitudeDelta: 0.0222,
          longitudeDelta: 0.0121
        }}
      >
        {order && (
          <MapViewDirections
            origin={myPosition}
            onReady={onDirectionFound}
            destination={getDestination()}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={5}
            strokeColor="black"
            lineDashPattern={[0]}
          />
        )}
      </MapView>

      <Pressable
        onPress={() => console.warn('Balance')}
        style={styles.balanceButton}>
        <Text style={styles.balanceText}>
          <Text style={{color: 'green'}}>$</Text>
          {' '}
          0.00
        </Text>
      </Pressable>

      <Pressable
        onPress={() => console.warn('Hey')}
        style={[styles.roundButton, {top: 10, left: 10}]}>
        <Entypo name={"menu"} size={24} color="#4a4a4a"/>
      </Pressable>

      <Pressable
        onPress={() => console.warn('Hey')}
        style={[styles.roundButton, {top: 10, right: 10}]}>
        <Entypo name={"menu"} size={24} color="#4a4a4a"/>
      </Pressable>

      <Pressable
        onPress={() => console.warn('Hey')}
        style={[styles.roundButton, {bottom: 110, left: 10}]}>
        <Entypo name={"menu"} size={24} color="#4a4a4a"/>
      </Pressable>

      <Pressable
        onPress={() => console.warn('Hey')}
        style={[styles.roundButton, {bottom: 110, right: 10}]}>
        <Entypo name={"menu"} size={24} color="#4a4a4a"/>
      </Pressable>

      <Pressable
        onPress={onGoPress}
        style={styles.goButton}>
        <Text style={styles.goText}>
          {car?.isActive ? 'END' : 'GO'}
        </Text>
      </Pressable>

      <View style={styles.bottomContainer}>
        <Ionicons name={"options"} size={30} color="#4a4a4a"/>
        {renderBottomTitle()}
        <Entypo name={"menu"} size={30} color="#4a4a4a"/>
      </View>

      {newOrder && <NewOrderPopup
        newOrder={newOrder}
        duration={2}
        distance={0.5}
        onDecline={onDecline}
        onAccept={() => onAccept(newOrder)}
      />}
    </View>
  );
};

export default HomeScreen;