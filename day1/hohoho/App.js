import HomeScreen from './components/HomeScreen';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import UserScreen from './components/UserScreen';
import MessageScreen from './components/MessageScreen';
import { StackNavigator } from 'react-navigation';

//Navigator
export default StackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Login: {
    screen: LoginScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  Users: {
    screen: UserScreen,
  },
  Messages: {
    screen: MessageScreen,
  }
}, {initialRouteName: 'Home'});
