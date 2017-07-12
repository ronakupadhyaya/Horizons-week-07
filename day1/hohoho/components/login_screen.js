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
class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'Username',
      password: 'Password',
      repeatPassword: 'Repeat Password'

    };
  }
  static navigationOptions = {
    title: 'Login'
  };

  registerNav() {
    this.props.navigation.navigate('Register');
  }

  componentDidMount() {
    AsyncStorage.getItem('user')
      .then(result => {
        var parsedResult = JSON.parse(result);
        var username = parsedResult.username;
        var password = parsedResult.password;
        if (username && password) {
          return this.login(username, password, true)
            .then(resp => resp.json())
            .then(resp => {
              this.props.navigation.navigate('User');
            });
        }
        // Don't really need an else clause, we don't do anything in this case.
      })
      .catch(err => { console.log(err) })
  }
  login(username, password, automated) {
    // console.log("before fetch")
    fetch('https://hohoho-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username || this.state.username,
        password: password || this.state.password,
      })
    })
      // console.log("after fetch")
      .then((response) => response.json())
      // console.log("after json")

      .then((responseJson) => {
        if (responseJson.success) {
          /* do something with responseJson and go back to the Login view but
           * make sure to check for responseJson.success! */
          // if(responseJson.success) {
          AsyncStorage.setItem('user', JSON.stringify({
            username: this.state.username,
            password: this.state.password
          }));
          this.props.navigation.navigate('User');
        } else if (!automated) {
          alert(responseJson.error)
        }
      })
      // console.log("after response")


      .catch((err) => {
        <Text>{err}</Text>
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
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
        <TouchableOpacity onPress={() => { this.login() }} style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={() => { this.registerNav() }}>
          <Text style={styles.buttonLabel}>Tap to Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
export default LoginScreen
