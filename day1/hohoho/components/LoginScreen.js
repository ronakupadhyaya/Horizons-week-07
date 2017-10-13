import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  AsyncStorage
} from 'react-native';
import styles from '../style/styles';
const SERVER_URL = "https://hohoho-backend.herokuapp.com";

class LoginScreen extends React.Component {
  constructor(props){
    super(props);
    this.state={
      username: '',
      password: ''
    }
  }

  static navigationOptions = {
    title: 'Login'
  };

  componentDidMount(){
    AsyncStorage.getItem('user')
    .then((credentials)=>{
      credentials = JSON.parse(credentials);
      var username = credentials.username;
      var password = credentials.password;
      if(username && password){
         this.setState({username,password})
         this.handleLogin();
      }
    })
    .catch((error)=>{
      alert('Error loading login credentials');
    });
  }


  handleLogin(){
    fetch(`${SERVER_URL}/login`,{
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username || false,
        password: this.state.password || false
      })
    })
    .then((resp)=>
      resp.json()
    ).then((respJson)=>{
      if(!respJson.success){
        throw('Error!');
      }
      return AsyncStorage.setItem('user', JSON.stringify({
        username: this.state.username,
        password: this.state.password
      }));
    }).then(()=>{
      this.props.navigation.navigate('Users');
    }).catch((err)=>{
      alert('Error: login failed.');
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
        <TouchableOpacity onPress={()=>this.handleLogin()} style={styles.button}>
          <Text style={{fontSize: 20, color: 'white'}}>
            Login
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default LoginScreen;
