import Swiper from 'react-native-swiper';
import React from 'react';
import { StackNavigator } from 'react-navigation';
import styles from '../assets/styles'
import {
  MapView
} from 'expo';

import LoginScreen from './components/LoginScreen'
import RegisterScreen from './components/RegisterScreen'
import Users from './components/Users'
import LoginPage from './components/LoginPage'
import Messages from './components/Messages'

class SwiperScreen extends React.Component {
  static navigationOptions = {
    title: 'HoHoHo!'
  };

  render() {
    return (
      <Swiper>
        <Users />
        <Messages />
      </Swiper>
    );
  }
}
