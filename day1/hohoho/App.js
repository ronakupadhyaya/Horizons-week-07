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
import LoginScreen from './Screens/LoginScreen';
import RegisterScreen from './Screens/RegisterScreen';
import UsersScreen from './Screens/UsersScreen';
import MessagesScreen from './Screens/MessagesScreen';
import ConversationScreen from './Screens/ConversationScreen';

//Navigator
export default StackNavigator({
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
}, {initialRouteName: 'Login'});
