import { StackNavigator } from 'react-navigation';

import Messages from './components/Messages.js';
import LoginScreen from './components/LoginScreen.js';
import RegisterScreen from './components/RegisterScreen.js';
import Users from './components/Users.js';

export default StackNavigator({
  Login: {
    screen: LoginScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  Users: {
    screen: Users,
  },
  Messages: {
    screen: Messages,
  },
}, {initialRouteName: 'Login'});
