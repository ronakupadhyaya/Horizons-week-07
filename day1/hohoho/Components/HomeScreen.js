import React from 'react';
import { AsyncStorage, View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';
const baseUrl = 'https://hohoho-backend.herokuapp.com/'

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
  componentDidMount() {
    AsyncStorage.getItem('user')
    .then(result => {
      const parsed = JSON.parse(result);
      console.log(parsed)
      if (parsed) {
        this.asyncStorageLogin(parsed);
      }
    })
  }
  asyncStorageLogin(parsed) {
    fetch(baseUrl + 'login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: parsed.username,
        password: parsed.password,
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);
      if (responseJson.success) {
        this.props.navigation.navigate('Swiper');
      } else {
        this.props.navigation.navigate('Home');
        alert('401: Incorrect credentials');
      }
    })
    .catch(err => {
      alert('400: Bad user input');
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <TouchableOpacity style={[styles.button, styles.buttonGreen]} onPress={ () => {this.press()} }>
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
