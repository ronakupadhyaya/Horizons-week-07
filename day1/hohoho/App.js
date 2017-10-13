import React from 'react';
import {
  AsyncStorage,
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
import { MapView, Location, Permissions } from 'expo';
import Swiper from 'react-native-swiper';
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

  componentDidMount() {
    AsyncStorage.getItem('user')
    .then(result => {
      const parsed = JSON.parse(result);
      if (parsed) {
        this.asyncStorageLogin(parsed);
      }
    })
  }

  asyncStorageLogin(parsed) {
    fetch(baseUrl + 'login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: parsed.username,
        password: parsed.password,
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.success) {
        this.props.navigation.navigate('Swiper');
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
          secureTextEntry={true}
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.postRegister()} }>
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
      if (responseJson.success) {
        console.log('async above', this.state);
        AsyncStorage.setItem('user', JSON.stringify({
          username: this.state.username,
          password: this.state.password
        }));
        this.props.navigation.navigate('Swiper');
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
          secureTextEntry={true}
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
    this.getUsers()
  }

  getUsers() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
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

  longTouchUser(user, location) {
    fetch(baseUrl + 'messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: user._id,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      Alert.alert(
        'Success',
        `Your location to ${user.username} has been sent!`,
        [{text: 'Dismiss'}] // Button
      );
    })
    .catch(err => {
      Alert.alert(
        'Failure',
        `Your location to ${user.username} was not sent`,
        [{text: 'Dismiss'}] // Button
      );
    });
  }

  sendLocation = async(user) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      alert('Location permissions not granted :(');
    } else {
      let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
      this.longTouchUser(user, location);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          renderRow={item => {
            return (
              <View key={item._id}>
                <TouchableOpacity
                  onLongPress={this.sendLocation.bind(this, item)}
                  delayLongPress={1000}>
                  <Text>{item.username}</Text>
                </TouchableOpacity>
              </View>
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
          location: {
            latitude: 30.2672,
            longitude: -97.7431,
          },
        }
      ]),
      refreshing: false,
      ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    };
    this.getMessages();
  }

  getMessages() {
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
      console.log('getMessages', this.state.dataSource);
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
              <View style={{flex: 1}} key={aMessage._id}>
                <TouchableOpacity>
                  <View style={{padding: 5, borderColor: 'grey', borderWidth: 1}}>
                    <Text>From: {aMessage.from.username}</Text>
                    <Text>To: {aMessage.to.username}</Text>
                    <Text>Message: {aMessage.body}</Text>
                    <Text>Timestamp: {aMessage.timestamp}</Text>
                    {aMessage.location ?
                       <MapView
                        style={{height: 70}}
                        region={{
                          latitude: aMessage.location.latitude,
                          longitude: aMessage.location.longitude,
                          latitudeDelta: 0.3,
                          longitudeDelta: 0.2,
                        }}>
                          <MapView.Marker
                            coordinate={aMessage.location}
                          />
                       </MapView>
                       :
                       <View></View>
                    }
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

class SwiperScreen extends React.Component {
  static navigationOptions = {
    title: 'HoHoHo!'
  };
  render() {
    return (
      <Swiper>
        <UsersScreen/>
        <MessagesScreen/>
      </Swiper>
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
  Swiper: {
    screen: SwiperScreen,
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
