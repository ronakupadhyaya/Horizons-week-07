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
    title: 'Login'
  };

  press() {
    this.props.navigation.navigate('LoginInput');
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

class Login extends React.Component {
  constructor() {
    super()
    this.state = {
      username: '',
      password: '',
      message: 'Sorry, was not able to login'
    }
  }
  login() {
    console.log("Login Method Active", this.state.username, this.state.password);
    fetch('https://hohoho-backend.herokuapp.com/login', {
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
      console.log('SUCCESS', responseJson.success);
      if (responseJson.success) {
        this.props.navigation.navigate('Users');
      } else {
        <Text>{this.state.message}</Text>
      }
    })
    .catch((err) => {
      console.log('Error on trying to register', err)
    });
  }
  render() {
    return(
      <View style={styles.container}>
        <Text style={styles.textBig}>Login</Text>
        <Text>Username</Text>
        <TextInput style={styles.input} placeholdler="Username" onChangeText={(text) => this.setState({username: text})}/>
        <Text>Password</Text>
        <TextInput style={styles.input} placeholdler="Password" secureTextEntry={true} onChangeText={(text) => this.setState({password: text})}/>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={this.login.bind(this)}>
          <Text style={styles.buttonLabel}>Submit</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class Users extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Users',
    headerRight: <Button title='Messages' onPress={ () =>
      {navigation.state.params.onRightPress()} }/>
  })
  constructor() {
    super()
    this.state = {
      users: []
    }

    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET'
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log('GOT USERS', responseJson.success);
      if (responseJson.success) {
        console.log(responseJson.users)
        this.setState({users: responseJson.users})
      } else {
        <Text>Error getting users</Text>
      }
    })
    .catch((err) => {
      console.log('Error on trying to register', err)
    });
  }
  componentDidMount() {
    this.props.navigation.setParams({
      onRightPress: () => (this.props.navigation.navigate('Messages'))
    })
  }
  sendHo(item) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: item._id,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log('SENT A HO', responseJson.success);
      if (responseJson.success) {
        Alert.alert(
          'Sent a Ho!',
          `Your Ho Ho Ho! to ${item.username} has been sent!`,
          [{text: 'Dismiss Button'}] // Button
        )
      } else {
        Alert.alert(
          'Booooooo!',
          `Your Ho Ho Ho! to ${item.username} was not sent!`,
          [{text: 'Dismiss Button'}] // Button
        )}
      })
    .catch((err) => {
      console.log('Error on trying to register', err)
    });
  }
  render() {
    var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => (r1 !== r2)})
    return(
      <View style={styles.container}>
        <ListView renderRow={(item) => (
          <TouchableOpacity onPress={this.sendHo.bind(this, item)}>
            <Text style={styles.names}>{item.username}</Text>
          </TouchableOpacity>
        )}
        dataSource={dataSource.cloneWithRows(this.state.users)} />
      </View>
    )
  }
}

class Messages extends React.Component {
  static navigationOptions = {
    title: 'Messages'
  };
  constructor() {
    super()
    this.state = {
      messages: 'hey'
    }
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET'
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log('GOT MESSAGES');
      if (responseJson.success) {
        this.setState({messages: responseJson.messages})
      } else {
        <Text>Couldn't get messages</Text>
      }
    })
    .catch((err) => {
      console.log('Error on trying to register', err)
    });
  }

  render() {
    var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => (r1 !== r2)})
    return(
      <View style={styles.container}>
        <ListView renderRow={(item) => (
          <TouchableOpacity>
            <Text style={styles.names}>From: {item.from.username}</Text>
            <Text style={styles.names}>To: {item.to.username}</Text>
            <Text>{item.body}</Text>
          </TouchableOpacity>
        )}
        dataSource={dataSource.cloneWithRows(this.state.messages)} />
      </View>
    )
  }
}

class RegisterScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      username: "name",
      password: "password"
    }
  }
  static navigationOptions = {
    title: 'Register'
  };
  registerUser() {
    console.log('hello')
    fetch('https://hohoho-backend.herokuapp.com/register', {
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
      if (responseJson.success) {
        this.props.navigation.goBack();
      } else {
        console.log(responseJson.error)
      }
    })
    .catch((err) => {
      console.log('Error on trying to register', err)
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>
        <Text>Username</Text>
        <TextInput style={styles.input} placeholdler="Username" onChangeText={(text) => this.setState({username: text})}/>
        <Text>Password</Text>
        <TextInput style={styles.input} placeholdler="Password" secureTextEntry={true} onChangeText={(text) => this.setState({password: text})}/>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={this.registerUser.bind(this)}>
          <Text style={styles.buttonLabel}>Submit</Text>
        </TouchableOpacity>
      </View>
    )
  }
}


//Navigator
export default StackNavigator({
  Login: {
    screen: LoginScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  LoginInput: {
    screen: Login
  },
  Users: {
    screen: Users
  },
  Messages: {
    screen: Messages
  }
}, {initialRouteName: 'Login'});


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
  names: {
    flex: 1,
    fontSize: 30,
    margin: 5,
    borderStyle: 'solid',
    borderColor: '#b2b2b2'
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
    height: 30,
    borderColor: 'gray',
    borderStyle: 'solid',
    backgroundColor: '#f2f2f2',
    margin: 20
  }
});
