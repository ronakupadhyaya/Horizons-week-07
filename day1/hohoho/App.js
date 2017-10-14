import React from 'react';
import { View, Text } from 'react-native';
import Swiper from 'react-native-swiper';
import { StackNavigator } from 'react-navigation';
import HomeScreen from './Components/HomeScreen';
import RegisterScreen from './Components/RegisterScreen';
import LoginScreen from './Components/LoginScreen';
import UsersScreen from './Components/UsersScreen';
import MessagesScreen from './Components/MessagesScreen';
import TransactionsScreen from './Components/TransactionsScreen';
/* const baseUrl = 'https://hohoho-backend.herokuapp.com/' */

        /* dot=<View style={{backgroundColor:'rgba(0,0,0,.2)', width: 8, height: 8,borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} /> */
class SwiperScreen extends React.Component {
  /* static navigationOptions = { */
  /*   title: 'HoHoHo!' */
  /* }; */
  render() {

    const dotElem = <View style={{backgroundColor:'rgba(0,0,0,.2)', width: 8, height: 8,borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />

    return (
      <Swiper
        dot={dotElem}
        loop={false}>
        <UsersScreen/>
        <MessagesScreen/>
        <TransactionsScreen/>
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
  Transactions: {
    screen: TransactionsScreen,
  },
}, {initialRouteName: 'Transactions'});
