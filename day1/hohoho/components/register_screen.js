import React from 'react';
import {
  AsyncStorage,     
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ListView,
  Alert,
  Button
} from 'react-native';
import styles from '../assets/stylesheets/style';
import { StackNavigator } from 'react-navigation';
class RegisterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'Username',
      password: 'Password',
      repeatPassword: 'Repeat Password'

    };
  }
  static navigationOptions = {
    title: 'Register'
  };
  loginNav() {
    this.props.navigation.navigate('Login');
  }
  register() {
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
        /* do something with responseJson and go back to the Login view but
         * make sure to check for responseJson.success! */
        if (this.state.password !== this.state.repeatPassword) {
          alert('Passwords must match!')
        } else if (responseJson.success) {
          this.loginNav()
        }
        // else{
        //   console.log("Try again", responseJson.error)
        // }
      })
      .catch((err) => {
        console.log("Error", err)
      });
  }
  render() {
    return (
      <View style={styles.containerFull}>
        <Text style={styles.textBig}>Register</Text>
        <TextInput
          style={styles.container}
          onChangeText={(username) => this.setState({ username })}
          placeholder={this.state.username}
        />
        <TextInput
          secureTextEntry={true}
          style={styles.container}
          onChangeText={(password) => this.setState({ password })}
          placeholder={this.state.password}
        />
        <TextInput
          secureTextEntry={true}
          style={styles.container}
          onChangeText={(repeatPassword) => this.setState({ repeatPassword })}
          placeholder={this.state.repeatPassword}
        />
        <TouchableOpacity
          style={[styles.button, styles.buttonBlue]} onPress={() => { this.register() }}>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
      </View>

    )
  }
}

export default RegisterScreen
