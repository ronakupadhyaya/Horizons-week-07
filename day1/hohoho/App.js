import React from 'react';
import {
  AsyncStorage,     
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ListView,
  Alert,
  Button
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import LoginScreen from './components/login_screen';
import MessagesScreen from './components/messages_screen';
import RegisterScreen from './components/register_screen';
import UsersScreen from './components/users_screen';
import styles from './assets/stylesheets/style';

console.log(LoginScreen)
//Navigator
export default StackNavigator({
  Login: {
    screen: LoginScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  User: {
    screen: UsersScreen
  },
  Messages: {
    screen: MessagesScreen
  },
}, { initialRouteName: 'Login' });


