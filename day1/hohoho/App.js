import React from 'react';
import Swiper from 'react-native-swiper';
import { StackNavigator } from 'react-navigation';
import styles from './Components/styles';
import HomeScreen from './Components/HomeScreen';
import RegisterScreen from './Components/RegisterScreen';
import LoginScreen from './Components/LoginScreen';
import UsersScreen from './Components/UsersScreen';
import MessagesScreen from './Components/MessagesScreen';
const baseUrl = 'https://hohoho-backend.herokuapp.com/'

class SwiperScreen extends React.Component {
  static navigationOptions = {
    title: 'HoHoHo!'
  };
  render() {
    return (
      <Swiper>
        <UsersScreen/>
        <MessagesScreen/>
      </Swiper>
    );
  }
}

//Navigator
export default StackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  Login: {
    screen: LoginScreen,
  },
  Swiper: {
    screen: SwiperScreen,
  },
  Users: {
    screen: UsersScreen,
  },
  Messages: {
    screen: MessagesScreen,
  },
}, {initialRouteName: 'Home'});
