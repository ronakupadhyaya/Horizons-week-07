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
import {styles} from '../style';

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
  }

  static navigationOptions = {
    title: 'Login'
  };

  componentDidMount() {
    AsyncStorage.getItem('user').then(result => {
      var parsedResult = JSON.parse(result);
      var username = parsedResult.username;
      var password = parsedResult.password;
      console.log(username, password);
      if (username && password) {
        return fetch('https://hohoho-backend.herokuapp.com/login', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({username: username, password: password})
        }).then(response => response.json()).then(responseJson => {
          console.log(responseJson);
          if (responseJson.success) {
            this.props.navigation.navigate('Users');
          } else {
            console.log(responseJson.error);
          }
        })
      }
    })
  }

  press() {
    fetch('https://hohoho-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({username: this.state.username, password: this.state.password})
    }).then((response) => response.json()).then((responseJson) => {
      if (responseJson.success) {
        AsyncStorage.setItem('user', JSON.stringify({username: this.state.username, password: this.state.password})).then(() => {
          console.log("login successful!");
          this.props.navigation.navigate('Users')
        })
      } else {
        console.log(responseJson.error);
      }
    })
  }

  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <TextInput style={{
          height: 40
        }} placeholder="Username" onChangeText={(text) => this.setState({username: text})}/>
        <TextInput style={{
          height: 40
        }} secureTextEntry={true} placeholder="Password" onChangeText={(text) => this.setState({password: text})}/>
        <TouchableOpacity onPress={() => {
          this.press()
        }} style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={() => {
          this.register()
        }}>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default LoginScreen;
