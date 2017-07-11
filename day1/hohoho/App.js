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
import { StackNavigator } from 'react-navigation';


//Screens
class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Home'
  };

  press() {
    this.props.navigation.navigate('Login')
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

class RegisterScreen extends React.Component {
  constructor(){
    super();
    this.state={
      username: "",
      password: "",
    }
  }
  static navigationOptions = {
    title: 'Register'
  };

  registerUser(){
    fetch('https://hohoho-backend.herokuapp.com/register', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        'username': this.state.username,
        'password': this.state.password,
      })
    })
    .then((res) => res.json())
    .then((resJson) => {
      console.log(this.state.username);
      console.log(this.state.password);
      if(resJson.success){
        this.props.navigation.goBack();
        console.log(resJson);
      }
      else{
        console.log(resJson);
      }
    })
    .catch(err => {
      console.log(err);
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          required={true}
          placeholder={'Username'}
          value={this.state.username}
          onChangeText={(text) => {this.setState({username: text})}}
        />
        <TextInput
          style={styles.input}
          required={true}
          placeholder={'Password'}
          secureTextEntry={true}
          value={this.state.password}
          onChangeText={(text) => {this.setState({password: text})}}
        />
        <TouchableOpacity style={[styles.buttonRed, styles.button]} onPress={() => {this.registerUser()}}>
          <Text style={styles.buttonLabel}> Register </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class Login extends React.Component {
  constructor(){
    super();
    this.state={
      username: "",
      password: "",
      message: "",
    }
  }

  static navigationOptions = {
    title: 'Login'
  };

  login() {
    fetch('https://hohoho-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        'username': this.state.username,
        'password': this.state.password,
      })
    })
    .then((res) => {
      console.log(res);
      return res.json()
    })
    .then((resJson) => {
      console.log(this.state.username);
      console.log(this.state.password);
      if(resJson.success){
        console.log(resJson);
        this.props.navigation.navigate('Users');
      }
      else {
        console.log(resJson);
        this.setState({ message: "Invalid Login"});
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.message}</Text>
        <TextInput
          style={styles.input}
          required={true}
          placeholder={'Username'}
          value={this.state.username}
          onChangeText={(text) => {this.setState({username: text})}}
        />
        <TextInput
          style={styles.input}
          required={true}
          placeholder={'Password'}
          secureTextEntry={true}
          value={this.state.password}
          onChangeText={(text) => {this.setState({password: text})}}
        />
        <TouchableOpacity style={[styles.buttonRed, styles.button]} onPress={this.login.bind(this)}>
          <Text style={styles.buttonLabel}> Login </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class Users extends React.Component {
  constructor(){
    super();

    this.state = {
      arr: []
   };
  }

  componentDidMount() {
    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((resJson) => {
        console.log(resJson.users);
        this.setState({
          arr: resJson.users,
        })
      })
      .catch((err) => console.log(err));
  }


  static navigationOptions = {
    title: 'Users'
  };

  render(){
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => (r1 !== r2)
    })
    return(
      <View style={styles.container}>
        <ListView
          dataSource={ds.cloneWithRows(this.state.arr)}
          renderRow={(rowData) => <Text>{rowData.username}</Text>}
        />
      </View>
    )
  }

}


//Navigator
export default StackNavigator({
  Home: {
    screen: LoginScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  Login: {
    screen: Login,
  },
  Users: {
    screen: Users,
  }
}, {initialRouteName: 'Home'});


//Styles
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
  },
  input: {
    height: 40,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 1,
  }
});
