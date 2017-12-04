import React from 'react';
import {
  View,
  Text,
  AsyncStorage,
} from 'react-native';
import styles from '../Styles/styles'

class SplashScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      message: '',
    }
  }

  componentWillMount() {
    AsyncStorage.getItem('user')
    .then(result => {
      const parsedResult = JSON.parse(result);
      if (parsedResult.username && parsedResult.password) {
        return this.login(parsedResult.username, parsedResult.password)
        .then( (responseJson) => {this.props.navigation.navigate('Users')} )
      }
      else {
        console.log('not logging in');
        this.props.navigation.navigate('Login')
      }
    })
    .catch(error => {console.log('error in mount: ', error);})
  }

  login(username, password) {
    return fetch('https://hohoho-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
    .then( response => response.json() )
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Welcome to HoHoHo!</Text>
      </View>
    )
  }
}

export default SplashScreen;
