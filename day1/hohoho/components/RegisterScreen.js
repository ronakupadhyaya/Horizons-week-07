import React from 'react';
import {
  View,
  TextInput,
  Button
} from 'react-native';
import styles from '../styles/styles.js';

class RegisterScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      username: '',
      password: '',
    }
  }

  static navigationOptions = {
    title: 'Register',
    headerStyle: { marginTop: 25 },
  };

  press() {
    fetch('https://hohoho-backend.herokuapp.com/register', {
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
      } else {
        alert(responseJson.error);
      }
    })
    .catch((err) => {
      alert('There seems to have been a problem. Pls contact the devs... bro.')
      console.log('ERROR', err);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput style={styles.input} placeholder="Enter your username" onChangeText={text => this.setState({username: text})} />
        <TextInput style={styles.input} secureTextEntry={true} placeholder="Enter your password" onChangeText={text => this.setState({password: text})} />
        <Button title="register" onPress={() => this.press()} />
      </View>
    )
  }
}

export default RegisterScreen;
