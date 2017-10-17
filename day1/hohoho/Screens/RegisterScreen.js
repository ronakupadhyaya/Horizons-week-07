import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Button,
  AsyncStorage,
} from 'react-native';
import styles from '../Styles/styles'

class RegisterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    }
  }

  static navigationOptions = {
    title: 'Register'
  };

  register() {
    fetch('https://hohoho-backend.herokuapp.com/register', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    })
    .then( response => response.json() )
    .then( responseJson => {
      responseJson.success ?
      this.props.navigation.goBack() :
      alert('Error: failed to register');
    })
    .catch( error => {console.log('error in registration: ', error)})
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={[styles.inputText]}
          placeholder=" Username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={[styles.inputText]}
          placeholder=" Password"
          onChangeText={(text) => this.setState({password: text})}
          secureTextEntry={true}
        />
        <TouchableOpacity
          style={[styles.button, styles.buttonRed]}
          onPress={ () => this.register() }>
          <Text
            style={[styles.buttonLabel]}>
            Register
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default RegisterScreen;
