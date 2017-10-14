import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  AsyncStorage
} from 'react-native';
import styles from '../styles/styles.js';

class LoginScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      username: '',
      password: '',
    }
  }

  static navigationOptions = {
    title: 'Login',
    headerStyle: { marginTop: 25 },
  };

  componentWillMount() {
    Promise.all([
      AsyncStorage.getItem('username'),
      AsyncStorage.getItem('password')
    ])
    .then(result => {
      this.setState({
        username: JSON.parse(result[0]),
        password: JSON.parse(result[1])
      }, () => {
        if (result[0]) {
          this.press();
        }
      })
    })
  }

  press() {
    fetch('https://hohoho-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        this.props.navigation.navigate('Main');
        AsyncStorage.setItem('username', JSON.stringify(this.state.username));
        AsyncStorage.setItem('password', JSON.stringify(this.state.password));
      } else {
        alert(responseJson.error);
      }
    })
    .catch((err) => {
      alert('There seems to have been a problem. Pls contact the devs... bro.')
      console.log('ERROR', err);
    });
  }
  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        {/* Login Fields */}
        <TextInput style={styles.input} placeholder="Enter your username" onChangeText={text => this.setState({username: text})} />
        <TextInput style={styles.input} secureTextEntry={true} placeholder="Enter your password" onChangeText={text => this.setState({password: text})} />
        <TouchableOpacity onPress={ () => {this.press()} } style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
        {/* Registration Button */}
        <Text style={{marginTop: 20}}>Don't have an account?</Text>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.register()} }>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default LoginScreen;
