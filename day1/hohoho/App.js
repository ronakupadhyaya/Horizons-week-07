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
  Image,
} from 'react-native';
import { StackNavigator } from 'react-navigation';


//Screens
class SplashScreen extends React.Component {
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
        <Image
          source={require('./assets/icons/BRO.png')}
          style={styles.image}
        ></Image>
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
  static navigationOptions = {
    title: 'Register'
  };
  constructor() {
    super();
      this.state={
        username: '',
        password: ''
      };
  }
  render() {
    return (
      <View style={styles.container}>
        {/* <Image
          source={require('./assets/icons/BRO.png')}
          style={styles.image}
        ></Image> */}
        <TextInput
          style={styles.inputField}
          placeholder=' username'
          onChangeText={(text) => this.setState({username: text})}
          value={this.state.username}
          >
        </TextInput>
        <TextInput
          style={styles.inputField}
          placeholder=' password'
          onChangeText={(text) => this.setState({password: text})}
          value={this.state.password}
          secureTextEntry={true}
          >
        </TextInput>
        <TouchableOpacity
          style={[styles.button, styles.buttonBlue]}
          onPress={() => {
              fetch('https://hohoho-backend.herokuapp.com/register', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  username: this.state.username,
                  password: this.state.password,
                })
              })
              .then((response) => response.json())
              .then((responseJson) => {
                if (responseJson.success) {
                this.props.navigation.navigate('Splash')
                }
                else {
                  console.log(responseJson)
                }
              })
                .catch((err) => {
                  console.log('error', err)
              })
          }}
          >
          <Text style={styles.buttonLabel} >Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login'
  };
  constructor() {
    super();
      this.state={
        username: '',
        password: ''
      };
  }
  render() {
    return (
      <View style={styles.container}>
        {/* <Image
          source={require('./assets/icons/BRO.png')}
          style={styles.image}
        ></Image> */}
        <TextInput
          style={styles.inputField}
          placeholder=' username'
          onChangeText={(text) => this.setState({username: text})}
          value={this.state.username}
          >
        </TextInput>
        <TextInput
          style={styles.inputField}
          placeholder=' password'
          onChangeText={(text) => this.setState({password: text})}
          value={this.state.password}
          secureTextEntry={true}
          message=''
          >
        </TextInput>
        <TouchableOpacity
          style={[styles.button, styles.buttonGreen]}
          onPress={() => {
              fetch('https://hohoho-backend.herokuapp.com/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  username: this.state.username,
                  password: this.state.password,
                })
              })
              .then((response) => response.json())
              .then((responseJson) => {
                if (responseJson.success) {
                this.props.navigation.navigate('Home')
                }
                else {
                  this.setState({message:responseJson.error})
                }
              })
                .catch((err) => {
                  console.log('error', err)
              })
          }}
          >
          <Text style={styles.buttonLabel} >Login</Text>
        </TouchableOpacity>
        <Text style={styles.textSmall} >{this.state.message}</Text>
      </View>
    )
  }
}

class HomePage extends React.Component {
  static navigationOptions = (props) => ({
    title: 'BRO',
    headerRight:
    <TouchableOpacity onPress={() => (props.navigation.navigate('Messages'))}>
      <Text>Messages</Text>
    </TouchableOpacity>
  });
  constructor() {
    super();
  this.state = {
    users: [],
    message: ''
    };
    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
      this.setState({ users: responseJson.users})
        }
      else {
        this.setState({message:responseJson.error})
      }
    })
      .catch((err) => {
        console.log('error', err)
    })
  }
  sendABro(user) {
      fetch('https://hohoho-backend.herokuapp.com/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: user._id,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          alert("you have bro'ed " + user.username)
          }
        else {
          this.setState({message:responseJson.error})
        }
      })
        .catch((err) => {
          console.log('error', err)
      })
  }
  render() {
    var dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => (r1 !== r2)
    });
    return (
      <View style={styles.container}>
        <ListView
          renderRow={(user) => (
          <TouchableOpacity
            style={[styles.button, styles.buttonBlue]}
            onPress={() => this.sendABro(user)}
            >
            <Text style={styles.textSmall}>{user.username}</Text>
          </TouchableOpacity>
          )}
          dataSource={dataSource.cloneWithRows(this.state.users)}
       />
      </View>
    )
  }
}

class Messages extends React.Component {
  constructor() {
    super();
  this.state = {
    messages: [],
    error: ''
    };
    //get message data
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
      this.setState({ messages: responseJson.messages})
        console.log("state", this.state.messages)
        }
      else {
        this.setState({error:responseJson.error})
      }
    })
      .catch((err) => {
        console.log('error', err)
    })
  }
  render() {
    var dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => (r1 !== r2)
    });
    return (
      <View style={styles.container}>
        <ListView
          renderRow={(message) => (
          <TouchableOpacity
            style={[styles.button, styles.buttonBlue]}
            >
            <Text style={styles.textSmall}>From: {message.from.username} To: {message.to.username} Message: {message.body} When: {message.timestamp}</Text>
          </TouchableOpacity>
          )}
          dataSource={dataSource.cloneWithRows(this.state.messages)}
       />
      </View>
    )
  }
}


//Navigator
export default StackNavigator({
  Splash: {screen: SplashScreen},
  Register: {screen: RegisterScreen},
  Login: {screen: LoginScreen},
  Home: {screen: HomePage},
  Messages: {screen: Messages},
}, {initialRouteName: 'Splash'});


//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8e4df',
  },
  containerFull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#e8e4df',
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
    color: '#463628',
  },
  textSmall: {
    fontSize: 12,
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
    borderRadius: 20,
    borderColor: '#bbae7a',
    borderWidth: 5,
  },
  buttonRed: {
    backgroundColor: '#e8e4df',
  },
  buttonBlue: {
    backgroundColor: '#e8e4df',
  },
  buttonGreen: {
    backgroundColor: '#e8e4df'
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: '#463628'
  },
  inputField: {
    height: 40,
    borderColor: '#bbae7a',
    borderWidth: 3,
    margin: 5,
    borderRadius: 20,
  },
  image: {
    display: 'block',
    height: 100,
    width: 250,
    resizeMode: 'stretch',
    marginBottom: 50
  }
});
