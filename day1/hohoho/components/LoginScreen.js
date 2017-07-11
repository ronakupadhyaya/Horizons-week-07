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
import styles from '../styles/styles.js';

class LoginScreen extends React.Component {
  constructor(){
    super();
    this.state = {username: "", password: ""};
  }

  static navigationOptions = {
    title: 'Login'
  };

  componentDidMount(){
    AsyncStorage.getItem('user')
    .then((result) => {
      const parsedResult = JSON.parse(result);
      const username = parsedResult.username;
      const password = parsedResult.password;
      if (username && password) {
        this.setState({username: username, password: password});
        this.press();
      }
    })
    .catch(err => { console.log(err) });
  }

  press() {
    fetch('https://hohoho-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.success){
        return AsyncStorage.setItem('user', JSON.stringify({
          username: this.state.username,
          password: this.state.password
        }))
        .then(() => this.props.navigation.navigate('Users'));
      }else{
        alert("Database error!");
      }
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log(err);
    });
  }

  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <TextInput
          style={{height: 40}}
          placeholder="username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{height: 40}}
          placeholder="password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({password: text})}
        />
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

export default LoginScreen;
