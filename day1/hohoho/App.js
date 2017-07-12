import React from 'react';
import {
  AsyncStorage,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ListView,
  Alert
  Button
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Location, Permissions } from 'expo';

//Screens
class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login',
  };

  constructor(props) {
    super(props);
    this.state = {
      error: '',
    };
    this.loginSave = this.loginSave.bind(this);
  }

  componentDidMount() {
    AsyncStorage.getItem('user')
      .then(result => {
        console.log('result', result);
        var parsedResult = JSON.parse(result);
        var username = parsedResult.username;
        var password = parsedResult.password;
        if (username && password) {
          fetch('https://hohoho-backend.herokuapp.com/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: username,
              password: password,
            }),
          })
            .then(response => response.json())
            .then(responseJson => {
              if (responseJson.success) {
                this.props.navigation.navigate('UsersList');
              } else {
                this.setState({ error: 'Failed to login' });
              }
            })
            .catch(err => {
              console.log('error: ', err);
            });
        }
      })
      .catch(err => console.log('error', err));
  }

  loginSave() {
    AsyncStorage.setItem(
      'user',
      JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    );
  }

  press() {
    fetch('https://hohoho-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          this.loginSave();
          this.props.navigation.navigate('UsersList');
        } else {
          this.setState({ error: 'Failed to login' });
        }
      })
      .catch(err => {
        console.log('error: ', err);
      });
  }
  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>

        <Text>{this.state.error}</Text>

        <TextInput
          style={{ width: 200, height: 40 }}
          placeholder="Enter your username"
          onChangeText={text => this.setState({ username: text })}
        />

        <TextInput
          style={{ width: 200, height: 40 }}
          placeholder="Enter your password"
          onChangeText={text => this.setState({ password: text })}
        />

        <TouchableOpacity
          onPress={() => {
            this.press();
          }}
          style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Tap to Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonBlue]}
          onPress={() => {
            this.register();
          }}>
          <Text style={styles.buttonLabel}>Tap to Register</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

class RegisterScreen extends React.Component {
  static navigationOptions = {
    title: 'Register',
  };

  press() {
    fetch('https://hohoho-backend.herokuapp.com/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('result', responseJson);
        this.props.navigation.goBack();
      })
      .catch(err => {
        console.log('error: ', err);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>

        <TextInput
          style={{ width: 200, height: 40 }}
          placeholder="Enter your username"
          onChangeText={text => this.setState({ username: text })}
        />

        <TextInput
          style={{ width: 200, height: 40 }}
          placeholder="Enter your password"
          onChangeText={text => this.setState({ password: text })}
        />

        <TouchableOpacity
          style={[styles.button, styles.buttonBlue]}
          onPress={() => this.press()}>
          <Text>Tap to register!</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

class UsersScreen extends React.Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };

    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log('result', responseJson);
      this.setState({
        dataSource: ds.cloneWithRows(responseJson.users)
      })
    })
    .catch((err) => {
      console.log('error: ', err);
    });

  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Users List',
    headerRight: <Button title='Messages' onPress={() => {navigation.state.params.onRightPress()} }>
  });

  componentDidMount() {
    this.props.navigation.setParams({
      onRightPress: this.messages.bind(this)
    })
  }

  touchUser(user) {
     fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: user._id
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          Alert.alert(
            'Success',
            'Your Ho Ho Ho! to' + user.username + 'has been sent!',
            [{text: 'Dismiss Button'}])
        } else {
          Alert.alert(
            'Error',
            'Your Ho Ho Ho! to' + user.username + 'could not be sent!',
            [{text: 'Dismiss Button'}])
        }
        })
      .catch(err => {
        console.log('error:', err);
      })
  }

  messages() {
    this.props.navigation.navigate('Messages')
  }

  sendLocation = async(user) => {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status !== 'granted') {
  Alert.alert(
    'User Status Issue',
    'User does not have access',
    [{text: 'Dismiss Button'}]
    )
  } else {
  let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
  console.log(location.coords);
   fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: user._id,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          Alert.alert(
            'Success',
            user.username + 'has been sent your location!',
            [{text: 'Dismiss Button'}])
        } else {
          Alert.alert(
            'Error',
            user.username + 'could not be sent your location.',
            [{text: 'Dismiss Button'}])
        }
        })
      .catch(err => {
        console.log('error:', err);
      })
  }
  }

  render() {
    return(
      <View style={styles.container}>
      <ListView
        dataSource={this.state.dataSource}
        renderRow = {(rowData) => (
          <TouchableOpacity
          onPress={this.touchUser.bind(this, rowData)}
          onLongPress={this.sendLocation.bind(this, rowData)}>
       <Text>{rowData.username}</Text>
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
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {
      dataSource: ds.cloneWithRows([]),
    };

    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          dataSource: ds.cloneWithRows(responseJson.messages),
        });
      })
      .catch(err => {
        console.log('error: ', err);
      });
  }

  render() {
    return (
      <View styles={styles.container}>
      <ListView
        dataSource={this.state.dataSource}
        renderRow = {(rowData) => (
          <TouchableOpacity
          onPress={this.touchUser.bind(this, rowData)}>
       <Text>Sender: {rowData.from.username}</Text>
       <Text>Recipient:{rowData.to.username}</Text>
       <Text>Message: {rowData.body}</Text>
       <Text>Time sent:{rowData.timestamp}</Text>
       </TouchableOpacity>
       )}
      />
      </View>
    );
  }
}

//Navigator
export default StackNavigator(
  {
    Login: {
      screen: LoginScreen,
    },
    Register: {
      screen: RegisterScreen,
    },
    UsersList: {
      screen: UsersScreen,
    },
    Messages: {
      screen: MessagesScreen,
    },
  },
  { initialRouteName: 'Login' }
);

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
    borderRadius: 5,
  },
  buttonRed: {
    backgroundColor: '#FF585B',
  },
  buttonBlue: {
    backgroundColor: '#0074D9',
  },
  buttonGreen: {
    backgroundColor: '#2ECC40',
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
  },
});
