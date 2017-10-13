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
const baseUrl = 'https://hohoho-backend.herokuapp.com/'

//Screens
class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home'
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
        <TouchableOpacity style={[styles.button, styles.buttonGreen]} onPress={ () => {this.press()} }>
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
  postRegister() {
    fetch(baseUrl + 'register', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);
      this.props.navigation.goBack();
    })
    .catch(err => {
      console.log('400:', err);
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.inputBox}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={styles.inputBox}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.postRegister()} }>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
          /*secureTextEntry={true}*/

class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login'
  };
  postLogin() {
    fetch(baseUrl + 'login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);
      if (responseJson.success) {
        this.props.navigation.navigate('Users');
      } else {
        this.props.navigation.navigate('Home');
        alert('401: Incorrect credentials');
      }
    })
    .catch(err => {
      alert('400: Bad user input');
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.inputBox}
          placeholder="Username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={styles.inputBox}
          placeholder="Password"
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonGreen]} onPress={ () => {this.postLogin()} }>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class UsersScreen extends React.Component {
  static navigationOptions = (props) => ({
    title: 'Users',
    headerRight: <TouchableOpacity onPress={() => props.navigation.navigate('Messages') }><Text>Messages</Text></TouchableOpacity>
  });

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([
        'Moose', 'Corey', 'Allie', 'Jay', 'Graham', 'Darwish', 'Abhi Fitness'
      ])
    };
    fetch(baseUrl + 'users', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then(response => response.json())
    .then(responseJson => {
      this.setState({
        dataSource: ds.cloneWithRows(responseJson.users)
      });
    })
    .catch(err => {
      alert('Error: ' + err);
      console.log('Error: ' + err);
    });
  }

  touchUser(user) {
    fetch(baseUrl + 'messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: user._id
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);
      Alert.alert(
        'Success',
        `Your HoHoHo to ${user.username} has been sent!`,
        [{text: 'Dismiss'}] // Button
      );
    })
    .catch(err => {
      Alert.alert(
        'Failure',
        `Your HoHoHo to ${user.username} was not sent`,
        [{text: 'Dismiss'}] // Button
      );
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <ListView
          renderRow={item => {
            return (
              <View key={item._id}><TouchableOpacity onPress={this.touchUser.bind(this, item)}><Text>{item.username}</Text></TouchableOpacity></View>
            );
          }}
          dataSource={this.state.dataSource}
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
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([
        {
          _id: 0,
          from: {username: 'mason'},
          to: {username: 'jeff'},
          timestamp: 'right now',
        }
      ]),
      refreshing: false,
      ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    };

    fetch(baseUrl + 'messages', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then(response => response.json())
    .then(responseJson => {
      this.setState({
        dataSource: this.state.ds.cloneWithRows(responseJson.messages),
      });
    })
    .catch(err => {
      alert('Error: ' + err);
    });

  }

  _onRefresh() {
    fetch(baseUrl + 'messages', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then(response => response.json())
    .then(responseJson => {
      this.setState({
        dataSource: this.state.ds.cloneWithRows(responseJson.messages),
      });
    })
    .catch(err => {
      alert('Error: ' + err);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          renderRow={aMessage => {
            return (
              <View key={aMessage._id}>
                <TouchableOpacity>
                  <View style={{padding: 5, borderColor: 'grey', borderWidth: 1}}>
                    <Text>From: {aMessage.from.username}</Text>
                    <Text>To: {aMessage.to.username}</Text>
                    <Text>Message: {aMessage.body}</Text>
                    <Text>Timestamp: {aMessage.timestamp}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
          dataSource={this.state.dataSource}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        />
      </View>
    );
  }
}

//Navigator
export default StackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  Login: {
    screen: LoginScreen,
  },
  Users: {
    screen: UsersScreen,
  },
  Messages: {
    screen: MessagesScreen,
  },
}, {initialRouteName: 'Home'});


//Styles
const styles = StyleSheet.create({
  inputBox: {
    height: 40,
    borderWidth: 1,
    borderColor: 'grey',
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5,
  },
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
