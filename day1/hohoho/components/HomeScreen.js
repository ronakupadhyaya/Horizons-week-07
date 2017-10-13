import React from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import styles from '../style/styles';

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home'
  };

  press() {
    this.props.navigation.navigate('Login');
  }
  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <TouchableOpacity onPress={ () => {this.press()} } style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Tap to Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.register()} }>
          <Text style={styles.buttonLabel}>Tap to Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default HomeScreen;
