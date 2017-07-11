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
import styles from '../styles/styles.js';

class RegisterScreen extends React.Component {
  constructor(){
    super();
    this.state = {username: "", password: ""};
  }

  static navigationOptions = {
    title: 'Register'
  };

  onSubmit(){
    fetch('https://hohoho-backend.herokuapp.com/register', {
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
        this.props.navigation.goBack();
      }else{
        alert("Database error!");
      }
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log(err);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>
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
        <TouchableOpacity onPress={() => this.onSubmit()}>
          <Text style={[styles.button, styles.buttonBlue]}>Submit</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default RegisterScreen;
