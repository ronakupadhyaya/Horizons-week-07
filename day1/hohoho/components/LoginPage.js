import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ListView,
  Alert,
  Button,
  AsyncStorage
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import styles from '../assets/styles'
import SwiperScreen from './components/SwiperScreen'

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

  // componentDidMount() {
  //   const self = this;
  //   AsyncStorage.getItem('user')
  //   .then(result => {
  //     if (result) {
  //       var parsedResult = JSON.parse(result);
  //       var username = parsedResult.username;
  //       var password = parsedResult.password;
  //       if (username && password) {
  //         return fetch('https://hohoho-backend.herokuapp.com/login', {
  //               method: 'POST',
  //               headers: {
  //                 "Content-Type": "application/json"
  //               },
  //               body: JSON.stringify({
  //                 username: username,
  //                 password: password
  //               })
  //             })
  //         .then(resp => {
  //           if (resp.status === 200) {
  //             self.props.navigation.navigate('Users');
  //           } else {
  //             self.setState({wrongPassword: true})
  //           }
  //         });
  //       }
  //     }
  //   })
  //   .catch(err => {
  //     console.log('err in didMount login page', err )
  //   });
  // }


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
      if (response.status === 200) {
        AsyncStorage.setItem('user', JSON.stringify({
          username: this.state.username,
          password: this.state.password
        }));
        self.props.navigation.navigate('Users');
      } else {
        self.setState({wrongPassword: true})
      }
    })
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
