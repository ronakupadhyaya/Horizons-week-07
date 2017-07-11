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

var _ = require('underscore');

//Screens
class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home'
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
  registerUser() {
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
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);
      this.props.navigation.navigate('Home');
    })
    .catch(err => console.log('ERROR: ', err));
  }
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={[styles.textInput]}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={[styles.textInput]}
          secureTextEntry={true}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonPink]} onPress={this.registerUser.bind(this)}>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login'
  };
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    }
  }
  loginUser() {
    fetch('https://hohoho-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);
      this.props.navigation.navigate('UserList');
    })
    .catch(err => console.log('ERROR: ', err));
  }
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={[styles.textInput]}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={[styles.textInput]}
          secureTextEntry={true}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonGreen]} onPress={this.loginUser.bind(this)}>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class UserListScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
      title: 'Users',
      headerRight: <Button title='Messages' onPress={ () => {navigation.state.params.onRightPress()} } />
    });

    constructor(props) {
      super(props);
      const ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2
        });
      this.state = {
        dataSource: ds.cloneWithRows([])
      };
    }
    componentDidMount() {
      this.props.navigation.setParams({
        onRightPress: this.viewMessages.bind(this)
      })
      fetch('https://hohoho-backend.herokuapp.com/users', {
        method: 'GET'
      })
      .then(response => response.json())
      .then(responseJson => {
        console.log("Users: ", responseJson.users.map(userObj => userObj.username));
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseJson.users)
        });
      })
      .catch(err => console.log('ERROR: ', err));
    }
    viewMessages() {
      this.props.navigation.navigate('Messages');
    }
    touchUser(userId) {
      console.log(userId);
      fetch('https://hohoho-backend.herokuapp.com/messages', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: userId
        })
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          Alert.alert(
          'Message Sent!',
          'Your Ho Ho Ho! was sent to the user',
          [{text: 'Dismiss Button'}] // Button
          )
        }
        else {
          Alert.alert(
          'Error!',
          'Message could not send',
          [{text: 'Dismiss Button'}] // Button
          )
        }
        
      })
      .catch(err => console.log('ERROR: Your message could not be sent! ', err));
    }
    render() {
      return (
        <View style={styles.container}>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={rowData => (
              <TouchableOpacity onPress={() => this.touchUser(rowData._id)}>
                <Text style={styles.list}>{rowData.username}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      );
    }
}

class MessagesScreen extends React.Component {
  static navigationOptions = {
    title: 'Messages',
  };
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
  }
  componentDidMount() {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET'
    })
    .then(response => response.json())
    .then(responseJson => {
      console.log("Messages: ", responseJson.messages.map(messagesObj => messagesObj.messages));
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(responseJson.messages)
      });
    })
    .catch(err => console.log('ERROR: ', err));
  }
  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={rowData => (
            <View style={styles.list}>
              <Text>To: {rowData.to.username}</Text>
              <Text>From: {rowData.from.username}</Text>
              <Text>Message: {rowData.body}</Text>
              <Text>Time: {rowData.timestamp}</Text>
            </View>
          )}
        />
      </View>
    )
  }
}

//Navigator
export default StackNavigator({
  Home: {
    screen: HomeScreen
  },
  Register: {
    screen: RegisterScreen
  },
  Login: {
    screen: LoginScreen
  },
  UserList: {
    screen: UserListScreen
  },
  Messages: {
    screen: MessagesScreen
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
  buttonPink: {
    backgroundColor: '#FD595F'
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    margin: 5,
    padding: 5
  },
  list: {
    padding: 10
  }
});
