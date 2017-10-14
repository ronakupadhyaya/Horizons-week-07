import React from 'react';
import { AsyncStorage, TextInput, View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';
const baseUrl = 'https://hohoho-backend.herokuapp.com/';

class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login'
  };
  postLogin() {
    fetch(baseUrl + 'login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.success) {
        console.log('async above', this.state);
        AsyncStorage.setItem('user', JSON.stringify({
          username: this.state.username,
          password: this.state.password
        }));
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
        <TextInput
          style={styles.inputBox}
          placeholder="Username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={styles.inputBox}
          placeholder="Password"
          onChangeText={(text) => this.setState({password: text})}
          secureTextEntry={true}
        />
        <TouchableOpacity style={[styles.button, styles.buttonGreen]} onPress={ () => {this.postLogin()} }>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default LoginScreen;
