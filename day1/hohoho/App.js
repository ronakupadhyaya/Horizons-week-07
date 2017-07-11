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
  RefreshControl
} from 'react-native';
import { StackNavigator } from 'react-navigation';


//Screens
class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login'
  };

  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
    };
    this.press = this.press.bind(this);
    this.register = this.register.bind(this);
  }

  press() {
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
    .then(resp => resp.json())
    .then(respjson => {
      respjson.success ?
      this.props.navigation.navigate('UserList') :
      Alert.alert('Unsuccessful Login')
    })
    .catch(err => Alert.alert('Error', err));
  }

  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>

        <TextInput
          style={styles.button}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />

        <TextInput
          style={styles.button}
          placeholder="Enter your password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({password: text})}
        />

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
    this.state = {
      username: '',
      password: '',
    };
    this.press = this.press.bind(this);
  }

  press() {
    if (this.state.username.length == 0 || this.state.password.length == 0) {
      Alert.alert('Empty fields!', 'empty username/password');
    } else {
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
      .then(resp => resp.json())
      .then(respjson => {
        respjson.success ?
        this.props.navigation.navigate('Login') :
        Alert.alert('Error', 'unsuccessful registration')
      })
      .catch(err => Alert.alert('Error', err));
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>

        <TextInput
          style={styles.button}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />

        <TextInput
          style={styles.button}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
        />

        <TouchableOpacity onPress={ () => {this.press()} } style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>

      </View>
    )
  }
}

class UserList extends React.Component {
  static navigationOptions = props => ({
    title: 'Users',
    headerRight: (
      <TouchableOpacity onPress={() => props.navigation.navigate('MessageList')}>
        <Text>Messages</Text>
      </TouchableOpacity>
    ),
  })

  constructor() {
    super();
    this.state = {
      userList: [],
    };
    this.touchUser = this.touchUser.bind(this);
  }

  componentDidMount() {
    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then(resp => resp.json())
    .then(respjson => {
      respjson.success ?
      this.setState({userList: respjson.users}) :
      Alert.alert('Error', 'cannot retrieve users');
    })
    .catch(err => Alert.alert('Error', err));
  }

  touchUser(user) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: user._id
      })
    })
    .then(resp => resp.json())
    .then(respjson => {
      respjson.success ?
      Alert.alert('Success', 'Hohoho '+ user.username) :
      Alert.alert('Success', 'No ho ' + user.username)
    })
    .catch(err => Alert.alert('Error', err))
  }

  render() {
    let dataSource = new ListView.DataSource({
    	rowHasChanged: (r1, r2) => (r1 !== r2),
    });
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>User List</Text>
        <ListView
          renderRow={user =>
            <View>
              <View style={{borderWidth: 0.5, borderColor: 'black'}}/>
              <TouchableOpacity onPress={() => this.touchUser(user)}>
                <View style={{alignItems: 'center'}}>
                  <Text style={{fontSize: 25}}>{user.username}</Text>
                </View>
              </TouchableOpacity>
            </View>
          }
          dataSource={dataSource.cloneWithRows(this.state.userList)}
        />
      </View>
    )
  }
}

class MessageList extends React.Component {
  static navigationOptions = {
    title: 'Messages',
  };

  constructor() {
    super();
    this.state = {
      messageList: [],
      refreshing: false,
    };
  }

  componentDidMount() {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then(resp => resp.json())
    .then(respjson => {
      respjson.success ?
      this.setState({messageList: respjson.messages}) :
      Alert.alert('Error', 'cannot retrieve messages');
    })
    .catch(err => Alert.alert('Error', err));
  }

  _onRefresh() {
    this.setState({refreshing: true});
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then(resp => resp.json())
    .then(respjson => {
      respjson.success ?
      this.setState({messageList: respjson.messages}) :
      Alert.alert('Error', 'cannot retrieve messages');
    })
    .then(() => {
      this.setState({refreshing: false});
    })
    .catch(err => Alert.alert('Error', err));
  }

  render() {
    let dataSource = new ListView.DataSource({
    	rowHasChanged: (r1, r2) => (r1 !== r2),
    });
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Message List</Text>
        <ListView
          renderRow={message =>
            <View>
              <View style={{borderWidth: 0.5, borderColor: 'black'}}/>
              <Text>From: {message.from.username}</Text>
              <Text>To: {message.to.username}</Text>
              <Text>Message: {message.body}</Text>
              <Text>When: {message.timestamp}</Text>
            </View>
          }
          dataSource={dataSource.cloneWithRows(this.state.messageList)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        />
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
  UserList: {
    screen: UserList,
  },
  MessageList: {
    screen: MessageList,
  },
}, {initialRouteName: 'Login'});


//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
