import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ListView,
  Alert,
  Button,
  RefreshControl,
  AsyncStorage,
} from 'react-native';
import {
  StackNavigator,
} from 'react-navigation';
import {
  Location,
  Permissions,
  MapView
} from 'expo';

//Screens
import SplashScreen from './Screens/SplashScreen';
import LoginScreen from './Screens/LoginScreen';
import RegisterScreen from './Screens/RegisterScreen';
import UsersScreen from './Screens/UsersScreen';
import MessagesScreen from './Screens/MessagesScreen';
import ConversationScreen from './Screens/ConversationScreen';

//Navigator
export default StackNavigator({
  Splash: {
    screen: SplashScreen,
  },
  Login: {
    screen: LoginScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  Users: {
    screen: UsersScreen,
  },
  Messages: {
    screen: MessagesScreen,
  },
  Conversation: {
    screen: ConversationScreen,
  },
}, {initialRouteName: 'Splash'});

// var portscanner = require('portscanner')
//
// var ip = require("ip");
// var ipheader = ip.address().split(".")
// ipheader.pop();
//
// var ipheader = ipheader.join(".")+"."
//
// var promiseArr = [];
// for (var i = 1; i < 254; i ++){
//   promiseArr.push(portscanner.checkPortStatus(8228, ipheader+i));
// }
//
// Promise.all(promiseArr)
// .then( (x) => x.map( (y,i) => {
//   if(y === "open") console.log(ipheader+(i+1));
// }))
// .catch(err => console.log(err))
