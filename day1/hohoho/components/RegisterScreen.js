import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput
} from 'react-native';
import styles from '../style/styles';
const SERVER_URL = "https://hohoho-backend.herokuapp.com";

class RegisterScreen extends React.Component {
  constructor(props){
    super(props);
    this.state={
      username: '',
      password: ''
    }
  }

  static navigationOptions = {
    title: 'Register'
  };

  handleRegister(){
    fetch(`${SERVER_URL}/register`,{
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
    .then((resp)=>
      resp.json()
    ).then((respJson)=>{
      alert('Success! Account created for ' + respJson.user.username + '.');
      this.props.navigation.navigate('Home');
    }).catch((err)=>{
      alert('Error: account not registerd.');
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          onChangeText={(username) => this.setState({username})}
          value={this.state.username}
          placeholder="Username"
        ></TextInput>
        <TextInput
          secureTextEntry={true}
          style={styles.textInput}
          onChangeText={(password) => this.setState({password})}
          value={this.state.password}
          placeholder="Password"
        ></TextInput>
        <TouchableOpacity onPress={()=>this.handleRegister()} style={styles.button}>
          <Text style={{fontSize: 20, color: 'white'}}>
            Register
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default RegisterScreen;
