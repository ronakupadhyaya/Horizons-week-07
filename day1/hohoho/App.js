import { StackNavigator } from 'react-navigation';
import LoginScreen from './components/LoginScreen.js';
import RegisterScreen from './components/RegisterScreen.js';
import SwiperScreen from './components/SwiperScreen.js';

console.disableYellowBox = true;

//Navigator
export default StackNavigator({
  Login: {
    screen: LoginScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  Main: {
    screen: SwiperScreen,
  }
}, {initialRouteName: 'Login'});
