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

class RegisterScreen extends React.Component {
  static navigationOptions = {
    title: 'Register'
  };

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    }
  }

  onSubmit() {
    if (this.state.username && this.state.password) {
      // username and password exist
      fetch('https://hohoho-backend.herokuapp.com/register', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({username: this.state.username, password: this.state.password})
      }).then((response) => response.json()).then((responseJson) => {
        if (responseJson.success) {
          console.log("success registering!");
          this.props.navigation.navigate('Login');
        } else {
          alert(responseJson.error);
        }
      }).catch((err) => {
        console.log(err);
      });
    } else {
      console.log("error, username and password")
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput style={{
          height: 40
        }} placeholder="Username" onChangeText={(text) => this.setState({username: text})}/>
        <TextInput style={{
          height: 40
        }} secureTextEntry={true} placeholder="Password" onChangeText={(text) => this.setState({password: text})}/>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={() => {
          this.onSubmit()
        }}>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default RegisterScreen;
