import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ListView,
  Alert,
  Button
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import styles from '../assets/styles'

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      wrongPassword: false
    }
  }

  static navigationOptions = {
    title: 'Login'
  };

  login() {
    const self = this;
    fetch('https://hohoho-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: self.state.username,
        password: self.state.password,
      })
    })
    .then((response) => {
      console.log('response in login', response);
      console.log('type res', typeof response);
      if (response.status === 200) {
        self.props.navigation.navigate('Users');
      } else {
        self.setState({wrongPassword: true})
      }
    })
    // .then((responseJson) => {
    //   if (responseJson.status) {
    //     self.props.navigation.navigate('Login');
    //   } else {
    //     self.setState({wrongPassword: true})
    //   }
    // })
    .catch((err) => {
      console.log('error', err);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.wrongPassword && <Text>Wrong Password</Text>}
        <TextInput
          style={{height: 40}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{height: 40}}
          secureTextEntry={true}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.login()} }>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
