import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ListView,
  Button,
  RefreshControl
} from 'react-native';
import { StackNavigator } from 'react-navigation';


//Screens
class MessagesScreen extends React.Component {
  static navigationOptions = (props) => ({
    title: 'Messages',
  });

  constructor() {
    super();
    this.state = {
      messages: [{
        from: {username: 'Loading...'},
        to: {username: ''},
        body: '',
        timestamp: '',
      }],
      refreshing: false,
    };
    fetch('https://hohoho-backend.herokuapp.com/messages')
      .then( res => res.json() )
      .then( json => {
        if(!json.success) {
          Alert.alert(
            'Failed to load messages',
            json.error,
            [
              {text: 'Uh oh'}
            ]
          );
        } else {
          this.setState({
            messages: json.messages,
          })
        }
      } )
      .catch( err => {
        Alert.alert(
          'Failed to load messages',
          err.message,
          [
            {text: 'Oh... ok'}
          ]
        );
      } );
  }

  onRefresh() {
    this.setState({refreshing: true});
    fetch('https://hohoho-backend.herokuapp.com/messages')
      .then( res => res.json() )
      .then( json => {
        if(!json.success) {
          Alert.alert(
            'Failed to load messages',
            json.error,
            [
              {text: 'Uh oh'}
            ]
          );
        } else {
          this.setState({
            messages: json.messages,
            refreshing: false,
          });
        }
      } )
      .catch( err => {
        Alert.alert(
          'Failed to load messages',
          err.message,
          [
            {text: 'Oh... ok'}
          ]
        );
      } );
  }

  render() {
    let user;
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => (r1 !== r2),
    });
    return (
      <View style={styles.container}>
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}/>
          }
          dataSource={ds.cloneWithRows(this.state.messages)}
          renderRow={ (row) => {
            user = user || row.from.username;
            return (
              <View style={ [user === row.from.username ?
                styles.fromMe :
                styles.toMe, styles.message] }>
                <Text style={styles.buttonLabel}>
                  From: {row.from.username}
                </Text>
                <Text style={styles.buttonLabel}>
                  To: {row.to.username}
                </Text>
                <Text style={styles.buttonLabel}>
                  {row.body} - sent at {row.timestamp}
                </Text>
              </View>
            );
          } }/>
      </View>
    )
  }
}

class UsersScreen extends React.Component {
  static navigationOptions = (props) => ({
    title: 'HoHoHo Users',
    headerRight: <Button
      title="Messages"
      onPress={ () => {
        props.navigation.state.params.onRightPress()
      } }/>
  });

  componentDidMount() {
    this.props.navigation.setParams({
      onRightPress: () => this.props.navigation.navigate('Messages'),
    });
  }

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      dataSource: ds.cloneWithRows([
        'Loading users...'
      ]),
    }
    fetch('https://hohoho-backend.herokuapp.com/users')
      .then(res => res.json())
      .then(json => {
        if(!json.success) {
          Alert.alert(
            'Failed to get users',
            json.error,
            [
              {text: 'I have no friends :()'}
            ]
          );
        } else {
          this.setState({
            dataSource: ds.cloneWithRows(json.users),
          });
        }
      })
      .catch(err => {
        Alert.alert(
          'Failed to get users',
          err.message,
          [
            {text: 'FeelsBadMan'}
          ]
        );
      });
  }

  messages() {
    this.props.navigation.navigate('Messages');
  }

  send(id) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: id,
      }),
    })
      .then(res => res.json())
      .then(json => {
        if(!json.success) {
          Alert.alert(
            'Failed to Ho',
            json.error,
            [
              {text: "Why can't I ho?"}
            ]
          );
        } else {
          Alert.alert(
            `Successfully Ho'd`,
            'Sent at ' + json.message.timestamp,
            [
              {text: 'Yay!'}
            ]
          );
        }
      })
      .catch(err => {
        Alert.alert(
          `Backend error`,
          err.message,
          [
            {text: 'OK'}
          ]
        );
      });
  }

  render() {
    return (
      <View style={styles.containerFull}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(row) => {
            return(
              <TouchableOpacity onPress={
                () => {
                  this.send(row._id);
                }
              }>
                <View style={styles.user}>
                  <Text style={
                    {
                      textAlign: 'center',
                      color: 'white'
                    }
                  }> {row.username} </Text>
                </View>
              </TouchableOpacity>
            );
          }}/>
      </View>
    );
  }
}

class ActualLogin extends React.Component {
  static navigationOptions = {
    title: 'Sign Into HoHoHo'
  };

  constructor() {
    super();
    this.state = {
      usernameInput: '',
      passwordInput: '',
    }
  }
  login() {
    if(!( this.state.usernameInput && this.state.passwordInput )) {
      Alert.alert(
        'Invalid Credentials',
        'Both the username and password fields must be nonempty.',
        [
          {text: 'Sorry, I will try to do better.'}
        ]
      );
    } else {
      fetch('https://hohoho-backend.herokuapp.com/login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: this.state.usernameInput,
          password: this.state.passwordInput,
        }),
      })
        .then(res => res.json())
        .then(json => {
          if(!json.success) {
            Alert.alert(
              'Login failed',
              json.error,
              [
                {text: 'Please save my soul'}
              ]
            );
          } else {
            this.props.navigation.setParams({
              user: this.state.usernameInput,
            });
            this.props.navigation.navigate('Users');
          }
        })
        .catch(err => {
          Alert.alert(
            'Failed to login',
            err.message,
            [
              {text: 'Databases suck'}
            ]
          );
        });
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.form, styles.buttonBlue]}>
          <View style={{width: 200, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <TextInput
              style={{textAlign: 'center', height: 40, backgroundColor: 'white'}}
              placeholder="Username"
              onChangeText={ (text) => {
                this.setState({
                  usernameInput: text,
                });
              }}/>
            <TextInput
              style={{textAlign: 'center', height: 40, backgroundColor: 'white', marginTop: 20, marginBottom: 20}}
              placeholder="Password"
              onChangeText={ (text) => {
                this.setState({
                  passwordInput: text,
                });
              }}
              secureTextEntry/>
            <TouchableOpacity onPress={ () => {this.login()} }
              style={[styles.button, styles.buttonGreen]}>
              <Text style={styles.buttonLabel}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}


class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login'
  };

  componentDidMount() {
    fetch('https://hohoho-backend.herokuapp.com/login/success')
      .then(res => {
        if(res.status === 200) {
          this.props.navigation.navigate('Users');
        }
      });
  }

  press() {
    this.props.navigation.navigate('ActualLogin');
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
  static navigationOptions = {
    title: 'Register'
  };

  constructor() {
    super();
    this.state = {
      usernameInput: '',
      passwordInput: '',
    }
  }

  createLogin() {
    if(!( this.state.usernameInput && this.state.passwordInput )) {
      Alert.alert(
        'Invalid Credentials',
        'Both the username and password fields must be nonempty.',
        [
          {text: 'Sorry, I will try to do better.'}
        ]
      );
    } else {
      fetch('https://hohoho-backend.herokuapp.com/register', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: this.state.usernameInput,
          password: this.state.passwordInput,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if(!responseJson.success) {
            Alert.alert(
              'Account creation failed',
              responseJson.error,
              [
                {text: 'My bad'}
              ]
            );
          } else {
            this.props.navigation.navigate('ActualLogin');
          }
        })
        .catch((err) => {
          Alert.alert(
            'Account creation failed due to backend error',
            err.message,
            [
              {text: 'Oh, that sucks.'}
            ]
          );
        });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.form}>
          <View style={{width: 200, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <TextInput
              style={{textAlign: 'center', height: 40, backgroundColor: 'white'}}
              placeholder="Username"
              onChangeText={ (text) => {
                this.setState({
                  usernameInput: text,
                });
              }}/>
            <TextInput
              style={{textAlign: 'center', height: 40, backgroundColor: 'white', marginTop: 20, marginBottom: 20}}
              placeholder="Password"
              onChangeText={ (text) => {
                this.setState({
                  passwordInput: text,
                });
              }}
              secureTextEntry/>
            <TouchableOpacity onPress={ () => {this.createLogin()} }
              style={[styles.button, styles.buttonBlue]}>
              <Text style={styles.buttonLabel}>
                Create account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
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
  ActualLogin: {
    screen: ActualLogin,
  },
  Users: {
    screen: UsersScreen,
  },
  Messages: {
    screen: MessagesScreen,
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
  form: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    height: 250,
    borderRadius: 10,
    backgroundColor: '#2ECC40',
  },
  user: {
    flex: 1,
    marginTop: 10,
    alignSelf: 'stretch',
    backgroundColor: 'dodgerblue',
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
  },
  textBig: {
    fontSize: 36,
    textAlign: 'center',
    margin: 10,
  },
  toMe: {
    alignSelf: 'flex-start',
    backgroundColor: 'gray',
  },
  fromMe: {
    alignSelf: 'flex-end',
    backgroundColor: '#0074D9',
  },
  message: {
    marginTop: 5,
    paddingTop: 5,
    paddingBottom: 5,
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
