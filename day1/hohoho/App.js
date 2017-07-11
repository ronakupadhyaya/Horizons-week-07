import React from 'react';
import {
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
import LoginScreen from './components/LoginScreen'
import RegisterScreen from './components/RegisterScreen'
import Users from './components/Users'
import LoginPage from './components/LoginPage'

//Navigator
export default StackNavigator({
  Login: {
    screen: LoginScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  LoginPage: {
    screen: LoginPage,
  },
  Users: {
    screen: Users
  }
}, {initialRouteName: 'Login'});


//Styles
