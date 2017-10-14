import React from 'react';
import { TextInput, View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';
const baseUrl = 'https://hohoho-backend.herokuapp.com/'

class RegisterScreen extends React.Component {
  static navigationOptions = {
    title: 'Register'
  };
  postRegister() {
    fetch(baseUrl + 'register', {
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
      console.log(responseJson);
      this.props.navigation.goBack();
    })
    .catch(err => {
      console.log('400:', err);
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.inputBox}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={styles.inputBox}
          placeholder="Enter your password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.postRegister()} }>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default RegisterScreen;
