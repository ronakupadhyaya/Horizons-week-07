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
  AsyncStorage,

} from 'react-native';
import {
  Location,
  Permissions,
  MapView

} from 'expo';

import { StackNavigator } from 'react-navigation';

//Screens
class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };
  register() {
    this.props.navigation.navigate('Register');
  }
  login() {
    this.props.navigation.navigate('Login');
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <TouchableOpacity
          onPress={() => {
            this.login();
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
////login page
class Login extends React.Component {
  static navigationOptions = {
    title: 'Login Page',
  };
  constructor(props) {
    super(props);
    this.state = {
      msg: '',
    };
  }
  componentDidMount() {
    AsyncStorage.getItem('user')
      .then(result => {
        var parsedResult = JSON.parse(result);
        var username = parsedResult.username;
        var password = parsedResult.password;
        if (username && password) {
          return this.props.navigation.navigate('Users');
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  login() {
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
          alert('you have logged in!');
          AsyncStorage.setItem(
            'user',
            JSON.stringify({
              username: this.state.username,
              password: this.state.password,
            })
          );
        } else {
          this.setState({
            msg: 'Invalid password and username combination',
          });
        }
      })
      .then(() => this.props.navigation.navigate('Users'))
      .catch(err => {
        console.log(err);
      });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login</Text>
        <Text>{this.state.msg}</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          onChangeText={text => this.setState({ username: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          onChangeText={text => this.setState({ password: text })}
        />
        <TouchableOpacity
          style={[styles.button, styles.buttonBlue]}
          onPress={() => this.login()}>
          <Text style={styles.buttonLabel}>Submit</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
// registrationScreen
class RegisterScreen extends React.Component {
  static navigationOptions = {
    title: 'Register',
  };
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }
  registration() {
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
        alert('you have registered');
        this.props.navigation.navigate('Home');
      })
      .catch(err => {
        console.log(err);
      });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          onChangeText={text => this.setState({ username: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          onChangeText={text => this.setState({ password: text })}
        />
        <TouchableOpacity
          style={[styles.button, styles.buttonBlue]}
          onPress={() => this.registration()}>
          <Text style={styles.buttonLabel}>Confirm</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
//users page
class Users extends React.Component {
  static navigationOptions = ({ navigation }) => {
    console.log(navigation);
    return {
      title: 'Users',
      headerRight: (
        <Button
          title="Messages"
          onPress={() => {
            navigation.state.params.onRightPress();
          }}
        />
      ),
    };
  };
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {
      dataSource: ds.cloneWithRows([]),
    };
  }
  componentDidMount() {
    this.props.navigation.setParams({
      onRightPress: this.messages.bind(this),
    });
    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(obj => {
        const ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2,
        });
        this.setState({
          dataSource: ds.cloneWithRows(obj.users),
        });
      });
  }
  touchUser(user) {
    // console.log(123123123123123);
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: user._id,
      }),
    })
      .then(respo => respo.json())
      .then(response => {
        // console.log('helo',response.json());
        if (response.success) {
          // console.log(123123123123);
          Alert.alert(
            'Messages',
            'Alert Contents',
            [{ text: 'OK' }] // Button
          );
        } else {
          Alert.alert(
            'Alert Title',
            'Alert Contents',
            [{ text: 'Dismiss Button' }] // Button
          );
        }
      });
  }
  messages() {
    this.props.navigation.navigate('Messages');
  }

  sendLocation = async (user) => {

    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      alert('there is an error');
    } else { alert("sucess")}
   console.log(1);
    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });

    console.log("loc:",location);
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: user._id,
        location: {
          longitude: location.coords.longitude,
          latitude: location.coords.latitude,
        },
      }),
    })
      .then(respo => respo.json())
      .then(response => {

        if (response.success) {
          console.log(11111);
          Alert.alert(
            'Location sent',
            'Alert Contents',
            [{ text: 'OK' }] // Button
          );
        } else {
          Alert.alert(
            'some error',
            'Alert Contents',
            [{ text: 'Dismiss Button' }] // Button
          );
        }
      });
  };
  render() {
    return (
      <View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={rowData => (
            <TouchableOpacity
              onPress={this.touchUser.bind(this, rowData)}
              onLongPress={this.sendLocation.bind(this, rowData)}
              delayLongPress={50}
              style={styles.containerFull}>
              <Text>{rowData.username}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}
/// msg class
class Messages extends React.Component {
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
  }
  componentDidMount() {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(obj => {
        const ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2,
        });
        console.log(obj.messages);
        this.setState({
          dataSource: ds.cloneWithRows(obj.messages),

        });
      });
  }

  render() {
    return (
      <View>

        <ListView
          dataSource={this.state.dataSource}
          renderRow={rowData => (

            <View style={{flex: 1}}>
              <View style={{flex: 1}}>
              <Text>to:{rowData.to.username}</Text>
              <Text>from:{rowData.from.username}</Text>
              <Text>{rowData.timestamp}</Text>

               </View>
               {rowData.location ?  <MapView style={{height:200, width:160}}
                  showsUserLocation={true}
                  scrollEnabled={false}
                  region={{
                  longitude:rowData.location.longitude,
                  latitude: rowData.location.latitude,
                  longitudeDelta: 1,
                  latitudeDelta: 1
                }}
                /> : false }

            </View>
          )}
        />

      </View>
    );
  }
}

//Navigator
export default StackNavigator(
  {
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
    },
    Messages: {
      screen: Messages,
    },
  },
  { initialRouteName: 'Home' }
);

//Styles
const styles = StyleSheet.create({
  input: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    fontSize: 25,
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
