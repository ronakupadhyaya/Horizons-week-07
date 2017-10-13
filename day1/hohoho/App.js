import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ListView,
  Alert
} from 'react-native';
import Button from 'apsl-react-native-button';
import { StackNavigator } from 'react-navigation';
const SERVER_URL = "https://hohoho-backend.herokuapp.com";

//Screens
class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Login'
  };

  press() {
    this.props.navigation.navigate('Login');
  }
  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
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

  handleLogin(){
    fetch(`${SERVER_URL}/login`,{
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
      alert('Success! ' + respJson.user.username + ' successfully logged in.');
      this.props.navigation.navigate('Home');
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

//Navigator
export default StackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Login: {
    screen: LoginScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
}, {initialRouteName: 'Home'});


//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  },
  button: {
    alignSelf: 'stretch',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center'
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
