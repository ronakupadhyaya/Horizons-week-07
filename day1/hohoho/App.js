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
import Swiper from 'react-native-swiper';

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



  componentDidMount() {
    AsyncStorage.getItem('info')
      .then(result => {
        if (result) {
          console.log(result);
          var parsedResult = JSON.parse(result);
          var username = parsedResult.username;
          var password = parsedResult.password;
          if (username && password) {
            return fetch('https://hohoho-backend.herokuapp.com/login', {
              method: 'POST',
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                username: username,
                password: password
              })
            })
            .then((response) => response.json())
            .then((responseJson) => {
              if (responseJson.success){
                this.props.navigation.navigate('Swiper');
              } else {
                this.props.navigation.navigate('Home');
              }
            })
          }
        }
      })
      .catch((err) => {
        alert('failed');
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Welcome to HoHoHo!</Text>
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


class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      username: '',
      password: ''
    }
  }
  static navigationOptions = {
    title: 'Login'
  };

  press() {
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
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success){
        AsyncStorage.setItem('info', JSON.stringify({username: this.state.username, password: this.state.password}))
        this.props.navigation.navigate('Swiper');
      } else {
        this.setState({
          error: responseJson.error
        })
      }
    })
    .catch((err) => {
      alert('fetch failed');
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={{height: 40, margin: 5, borderWidth: 1, padding: 5}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{height: 40, margin: 5, borderWidth: 1, padding: 5}}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
          secureTextEntry={true}
        />
        <TouchableOpacity onPress={ () => {this.press()} } style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
        <Text>{this.state.error}</Text>
      </View>
    )
  }
}

class RegisterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
  }
  static navigationOptions = {
    title: 'Register'
  };

  onSubmit() {
    if (this.state.username !== '' && this.state.password !== '') {
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
      .then((response) => response.json())
      .then((responseJson) => {
        this.props.navigation.goBack()
      })
      .catch((err) => {
        alert('username or password was not valid');
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={{height: 40, margin: 5, borderWidth: 1, padding: 5}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{height: 40, margin: 5, borderWidth: 1, padding: 5}}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
          secureTextEntry={true}
        />
        <TouchableOpacity onPress={() => this.onSubmit()} style={[styles.button, styles.buttonBlue]}>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class UsersScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    }
  }
  static navigationOptions = ({ navigation }) => ({
    title: 'Users',
    headerRight: <Button title='Messages' onPress={() => navigation.navigate('Messages')} />
  });

  sendHoHoHo(userId) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: userId
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        alert('Your HOHOHO was sent! :)')
      } else {
        alert(responseJson.error)
      }
    })
    .catch((err) => {
      alert(err);
    });
  }

  sendLocation = async(userId) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      return;
    }
    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: userId,
        location: {
          longitude: location.coords.longitude,
          latitude: location.coords.latitude
        }
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        alert('Your HOHOHO was sent with location! :)')
      } else {
        alert(responseJson.error)
      }
    })
    .catch((err) => {
      alert(err);
    });
  }



  componentDidMount() {
    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        this.setState({
          users: responseJson.users
        })
      } else {
        alert(responseJson.error)
      }
    })
    .catch((err) => {
      alert(err);
    });
  }

  render() {
    var dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => (r1 !== r2)
    });
    return (
      <View>
        <ListView renderRow={(item) => (<View style={{alignItems: 'center', borderWidth: 1, padding: 3}}
          // delayLongPress={/* num of millseconds here */}
          >
          <TouchableOpacity onPress={() => this.sendHoHoHo(item._id)}
            onLongPress={this.sendLocation.bind(this, item._id)}>
            <Text>{item.username}</Text>
          </TouchableOpacity>
        </View>)} dataSource={dataSource.cloneWithRows(this.state.users)}/>
      </View>
    )
  }
}

class MessagesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      refreshing: false
    }
  }
  static navigationOptions = {
    title: 'Messages'
  };

  fetchData() {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        this.setState({
          messages: responseJson.messages,
          refreshing: false
        })
      } else {
        alert(responseJson.error)
      }
    })
    .catch((err) => {
      alert(err);
    });
  }

  componentDidMount() {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        this.setState({
          messages: responseJson.messages
        })
      } else {
        alert(responseJson.error)
      }
    })
    .catch((err) => {
      alert(err);
    });
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.fetchData();
  }

  render() {
    var dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => (r1 !== r2)
    });
    return (
      <ListView renderRow={(item) => (<View style={{alignItems: 'center', borderWidth: 1, padding: 3}}>
        <TouchableOpacity>
          <Text>From: {item.from.username}</Text>
          <Text>To: {item.to.username}</Text>
          <Text>Message: {item.body}</Text>
          <Text>When: {item.timestamp}</Text>
        </TouchableOpacity>
        {(item.location)?(<MapView
          style={{width: 300, marginTop: 10, height: 300}}
          showsUserLocation={true}
          scrollEnabled={false}
          region={{
            longitude: item.location.longitude,
            latitude: item.location.latitude,
            longitudeDelta: 1,
            latitudeDelta: 1
          }}
        />): <Text>Location is not being shared.</Text>}
      </View>)} dataSource={dataSource.cloneWithRows(this.state.messages)}
      refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh.bind(this)}
        />
      }
    />
    )
  }
}

class SwiperScreen extends React.Component {
  static navigationOptions = {
    title: 'HoHoHo!'
  };

  render() {
    return (
      <Swiper>
        <UsersScreen />
        <MessagesScreen />
      </Swiper>
    );
  }
}



//Navigator
export default StackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Login: {
    screen: LoginScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  Users: {
    screen: UsersScreen
  },
  Messages: {
    screen: MessagesScreen
  },
  Swiper: {
    screen: SwiperScreen
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
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  }
});
