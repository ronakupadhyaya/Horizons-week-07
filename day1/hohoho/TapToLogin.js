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
         if (responseJson.success) {
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  containerFull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  textBig: {
    fontSize: 36,
    textAlign: 'center',
    margin: 10,
  },
  button: {
    alignSelf: 'stretch',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5
  },
  buttonRed: {
    backgroundColor: '#FF585B',
  },
  buttonBlue: {
    backgroundColor: '#0074D9',
  },
  buttonGreen: {
    backgroundColor: '#2ECC40'
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  }
});

export default TapToLogin;
