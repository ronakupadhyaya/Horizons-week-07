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
} from 'react-native';
import { StackNavigator } from 'react-navigation';


class TapToLogin extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      message: ''
    }
  }

  static navigationOptions = (props) => {
    title: 'TapToLogin'
  };

  login() {
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
        /* do something with responseJson and go back to the Login view but
         * make sure to check for responseJson.success! */
         console.log('responseJson', responseJson);
         if (responseJson.success) {
           // modify navigate
           this.props.navigation.navigate('Users');
         } else {
           this.setState({message: responseJson.error + '..'})
         }
      })
      .catch((err) => {
        /* do something if there was an error with fetching */
        console.log('error', err);
      });
  }

  render() {
    return (
      <View style={styles.container}>
          <View>
          <Text>{this.state.message}</Text>
          </View>
          <TextInput
            style={{height: 40, textAlign:'center'}}
            placeholder="Enter your username"
            onChangeText={(text) => this.setState({username: text})}
          />

          <TextInput
            style={{height: 40, textAlign:'center'}}
            placeholder="Password.."
            secureTextEntry={true}
            onChangeText={(text) => this.setState({password: text})}
          />

          <TouchableOpacity style={[styles.button, styles.buttonGreen]} onPress={() => this.login()}>
            <Text style={styles.buttonLabel}>Log In</Text>
          </TouchableOpacity>
      </View>
    )
  }
}

export default TapToLogin;
