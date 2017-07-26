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
  RefreshControl,
  AsyncStorage
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Location, Permissions, MapView } from 'expo';

class Messages extends React.Component {
  static navigationOptions = {
    title: 'Messages' //you put the title you want to be displayed here
  };

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
  }

  componentDidMount() {
    fetch('https://hohoho-backend.herokuapp.com/messages')
      .then((response) => response.json())
      .then((responseJson) => {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
          dataSource: ds.cloneWithRows(responseJson.messages),
          refreshing: false
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  _onRefresh() {
    this.setState({refreshing: true});
    fetch('https://hohoho-backend.herokuapp.com/messages')
      .then((response) => response.json())
      .then((responseJson) => {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
          dataSource: ds.cloneWithRows(responseJson.messages),
        });
      })
      .then(() => {
        this.setState({refreshing: false});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          renderRow={(aMessage) =>
            <View>
              <Text>From: {aMessage.from.username}</Text>
              <Text>To: {aMessage.to.username}</Text>
              <Text>Message: Yo</Text>
              <Text>When: {aMessage.timestamp}</Text>
              {aMessage.location && aMessage.location.longitude ?
                <MapView
                  style={{
                    height: 200,
                  }}
                  showsUserLocation={true}
                  scrollEnabled={false}
                  region={{
                    longitude: aMessage.location.longitude,
                    latitude: aMessage.location.latitude,
                    longitudeDelta: 1,
                    latitudeDelta: 1
                }}
              /> : <Text></Text>}
              <Text>{"\n"}</Text>
            </View>
            }
        />
      </View>
    );
  }
}

class Users extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Users',
    headerRight: <Button title='Messages' onPress={ () => {navigation.state.params.onRightPress()} } />
  });

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      refreshing: false
    };
  }

  _onRefresh() {
    this.setState({refreshing: true});
    fetch('https://hohoho-backend.herokuapp.com/users')
      .then((response) => response.json())
      .then((responseJson) => {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
          dataSource: ds.cloneWithRows(responseJson.users),
        });
      })
      .then(() => {
        this.setState({refreshing: false});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentDidMount() {
    this.props.navigation.setParams({
      onRightPress: this.messages.bind(this),
    })
    fetch('https://hohoho-backend.herokuapp.com/users')
      .then((response) => response.json())
      .then((responseJson) => {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
          dataSource: ds.cloneWithRows(responseJson.users),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  messages() {
    this.props.navigation.navigate('Messages');
  }

  /*longTouchUser(user, latitude, longitude) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: user._id,
        location: {
          longitude: longitude,
          latitude: latitude
        }
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        Alert.alert(
          'Success',
          'Your Ho Ho Ho! to ' + user.username + ' has been sent!', // Button
        )
      } else {
        Alert.alert(
          'Error',
          'Your Ho Ho Ho! to ' + user.username + ' could not be sent!', // Button
        )
      }
    })
    .catch((err) => {
      console.log('error:', err);
    });
  }*/

  touchUser(user, latitude, longitude) {
    let body = null;
    if (!latitude && !longitude) {
      body = JSON.stringify({
        to: user._id,
      })
    } else {
      body = JSON.stringify({
        to: user._id,
        location: {
          longitude: longitude,
          latitude: latitude
        }
      })
    }
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        Alert.alert(
          'Success',
          'Your Ho Ho Ho! to ' + user.username + ' has been sent!', // Button
        )
      } else {
        Alert.alert(
          'Error',
          'Your Ho Ho Ho! to ' + user.username + ' could not be sent!', // Button
        )
      }
    })
    .catch((err) => {
      console.log('error:', err);
    });
  }

  sendLocation = async(user) => {
  //  console.log('inside send location function!');
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
    //  console.log('not granted, you little bastard!');
      // handle failure
      Alert.alert(
        'Location Permissions',
        'You did not grant permission for location sharing!', // Button
      )
    } else {
    //  console.log('yeah gimmme dat location do!');
      let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
      alert('location: ' + JSON.stringify(location));
      this.touchUser(user, location.coords.latitude, location.coords.longitude);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          renderRow={(rowData) =>
            <TouchableOpacity
            onPress={ () => this.touchUser(rowData) }
            onLongPress={() => this.sendLocation.bind(this, rowData)()}
            delayLongPress={1000}
            style={[styles.button, styles.buttonGreen]}>
            <Text style={styles.buttonLabel}>{rowData.username}</Text>
          </TouchableOpacity>}
        />
      </View>
    );
  }
}

//Screens
class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login'
  };

  constructor(props) {
    super(props);
    this.state = {
      username: 'Username',
      password: 'Password'
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('user')
    .then(result => {
      var parsedResult = JSON.parse(result);
      var username = parsedResult.username;
      var password = parsedResult.password;
      if (username && password) {
        this.login(username, password)
      }
    // Don't really need an else clause, we don't do anything in this case.
    })
    .catch(err => {
      Alert.alert(
        'Error',
        'Automatic login insuccessful',
      )
      console.log(err);
    })
  }

  login(username, password) {
    fetch('https://hohoho-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        AsyncStorage.setItem('user', JSON.stringify({
          username: username,
          password: password
        }))
        .then((resp) => {
          Alert.alert(
            'Success',
            responseJson.user.username + ' successfully logged in!',
          )

          this.setState({
            username: 'Username',
            password: 'Password'
          });
        });
        // navigate to next view
        this.props.navigation.navigate('Users');
      } else {
        Alert.alert(
          'Error',
          responseJson.err,
        )
      }
     })
    .catch((err) => {
      Alert.alert(
        'Error',
        'Error logging in user',
      )
    });
  }

  press() {
    this.login(this.state.username, this.state.password);
  }

  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <TextInput
          style={{margin: 5, height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(username) => this.setState({username})}
          value={this.state.username}
        />
        <TextInput
          style={{margin: 5, height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(password) => this.setState({password})}
          value={this.state.password}
          secureTextEntry={true}
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

  constructor(props) {
    super(props);
    this.state = {
      username: 'Username',
      password: 'Password'
    }
    this.register = this.register.bind(this);
  }

  register() {
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
        Alert.alert(
          'Success',
          responseJson.user.username + ' successfully registered!',
        )
      } else {
        Alert.alert(
          'Error',
          'User was not successfully registered',
        )
      }
      this.setState({
        username: 'Username',
        password: 'Password'
      });
      this.props.navigation.goBack();
     })
    .catch((err) => {
      Alert.alert(
        'Error',
        'Error registering user',
      )
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={{margin: 5, height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(username) => this.setState({username})}
          value={this.state.username}
        />
        <TextInput
          style={{margin: 5, height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(password) => this.setState({password})}
          value={this.state.password}
          secureTextEntry={true}
        />
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={() => this.register()}>
          <Text style={styles.buttonLabel}>Register</Text>
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
  Users: {
    screen: Users,
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
