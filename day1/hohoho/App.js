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
class LoginRegisterScreen extends React.Component {
  static navigationOptions = {
    title: 'LoginRegister'
  };

  login() {
    this.props.navigation.navigate('Login');

  }
  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <TouchableOpacity onPress={ () => {this.login()} } style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Tap to Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.register()} }>
          <Text style={styles.buttonLabel}>Tap to Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class UsersScreen extends React.Component {
  constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    const userArray = [];
    this.state = {
      dataSource: ds.cloneWithRows([])
    }

    };

  touchUser(user){
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        to: user._id
      }
    })
  }

  componentDidMount(){
    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
     if(responseJson.success){
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
          dataSource: ds.cloneWithRows(responseJson.users)
        })
    } else{
      this.setState({errorMessage: responseJson.error})
    }
  }) 
  }

  static navigationOptions = {
    title: 'Users'
  };

  render(){
    return(
      <ListView dataSource={this.state.dataSource} renderRow={(rowData) => <Text>{rowData.username}</Text>} />
    )
  }

}



class LoginScreen extends React.Component {
  constructor(){
    super(); 
    this.state = {
      loginUsername: "",
      loginPassword: "",
      errorMessage: ""
    };
  }
  static navigationOptions = {
    title: 'Login'
  };

  user() {
    this.props.navigation.navigate('Users');
  }

  render(){
    return(
      <View style={styles.container}>
        <TextInput
          style={{height: 40, textAlign: 'center'}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({loginUsername: text})}
        />

        <TextInput
          style={{height: 40, textAlign: 'center'}}
          placeholder="Enter your Password"
          onChangeText={(text) => this.setState({loginPassword: text})}
        />

        <TouchableOpacity style={[styles.button, styles.buttonRed]} onPress={ () => {fetch('https://hohoho-backend.herokuapp.com/login', {
                method: 'POST',
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  username: this.state.loginUsername,
                  password: this.state.loginPassword,
                })
              })
              .then((response) => response.json())
              .then((responseJson) => {
                 console.log("HI")
                 console.log(responseJson)

                 if(responseJson.success){
                  console.log("Success");
                  this.user()


                 } else{
                  this.setState({errorMessage: responseJson.error})
                 }
                 

              })
              .catch((err) => {
                /* do something if there was an error with fetching */
                console.log(err)
                console.log("Y u do dis!?")
              })} }>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
        <Text> {this.state.errorMessage} </Text>
      </View>
      )
  }
}


class RegisterScreen extends React.Component {
  constructor(){
    super(); 
    this.state = {
      username: "",
      password: ""
    };
  }

  static navigationOptions = {
    title: 'Register'
  };

  toLogin(){
    this.props.navigation.navigate('LoginRegister')
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={{height: 40, textAlign: 'center'}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />

        <TextInput
          style={{height: 40, textAlign: 'center'}}
          placeholder="Enter your Password"
          onChangeText={(text) => this.setState({password: text})}
        />

        <TouchableOpacity style={[styles.button, styles.buttonRed]} onPress={ () => {fetch('https://hohoho-backend.herokuapp.com/register', {
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
                 console.log("HI")
                 console.log(responseJson)

                 if(responseJson.success===true){
                  console.log("Success");
                  this.toLogin();


                 } else{
                  console.log("No good")
                  console.log(responseJson.error)
                 }
                 

              })
              .catch((err) => {
                /* do something if there was an error with fetching */
                console.log(err)
                console.log("Y u do dis!?")
              })} }>
          <Text style={styles.buttonLabel}>Submit</Text>
        </TouchableOpacity>
      </View>
    )
  }
}


//Navigator
export default StackNavigator({
  LoginRegister: {
    screen: LoginRegisterScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  Login: {
    screen: LoginScreen
  },
  Users: {
    screen: UsersScreen
  }
}, {initialRouteName: 'LoginRegister'});


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
  }
});
