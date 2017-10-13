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
  RefreshControl,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Location, Permissions, MapView } from 'expo';
import Swiper from 'react-native-swiper';

console.disableYellowBox = true;

//Screens
class LoginScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      username: '',
      password: '',
    }
  }

  static navigationOptions = {
    title: 'Login',
    headerStyle: { marginTop: 25 },
  };

  componentWillMount() {
    Promise.all([
      AsyncStorage.getItem('username'),
      AsyncStorage.getItem('password')
    ])
    .then(result => {
      this.setState({
        username: JSON.parse(result[0]),
        password: JSON.parse(result[1])
      }, () => {
        if (result[0]) {
          this.press();
        }
      })
    })
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
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        this.props.navigation.navigate('Main');
        AsyncStorage.setItem('username', JSON.stringify(this.state.username));
        AsyncStorage.setItem('password', JSON.stringify(this.state.password));
      } else {
        alert(responseJson.error);
      }
    })
    .catch((err) => {
      alert('There seems to have been a problem. Pls contact the devs... bro.')
      console.log('ERROR', err);
    });
  }
  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        {/* Login Fields */}
        <TextInput style={styles.input} placeholder="Enter your username" onChangeText={text => this.setState({username: text})} />
        <TextInput style={styles.input} secureTextEntry={true} placeholder="Enter your password" onChangeText={text => this.setState({password: text})} />
        <TouchableOpacity onPress={ () => {this.press()} } style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
        {/* Registration Button */}
        <Text style={{marginTop: 20}}>Don't have an account?</Text>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.register()} }>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class RegisterScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      username: '',
      password: '',
    }
  }

  static navigationOptions = {
    title: 'Register',
    headerStyle: { marginTop: 25 },
  };

  press() {
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
        this.props.navigation.navigate('Main');
      } else {
        alert(responseJson.error);
      }
    })
    .catch((err) => {
      alert('There seems to have been a problem. Pls contact the devs... bro.')
      console.log('ERROR', err);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput style={styles.input} placeholder="Enter your username" onChangeText={text => this.setState({username: text})} />
        <TextInput style={styles.input} secureTextEntry={true} placeholder="Enter your password" onChangeText={text => this.setState({password: text})} />
        <Button title="register" onPress={() => this.press()} />
      </View>
    )
  }
}

class UsersScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      dataSource: [],
      refreshing: false,
    }
  }

  static navigationOptions = props => ({
    title: 'Users',
    // headerRight: <TouchableOpacity onPress={() => props.navigation.navigate('Messages')}><Text>Messages >   </Text></TouchableOpacity>,
    headerStyle: { marginTop: 25 },
  })

  componentWillMount() {
    return fetch('https://hohoho-backend.herokuapp.com/users', {
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then(resp => resp.json())
    .then(respJson => {
      if (respJson.success) {
        this.setState({dataSource: respJson.users})
      } else {
        alert('There was an error loading users. Close this window and we will make another atempt.');
        this.props.navigation.navigate('Main');
      }
    })
    .catch(err => {
      alert('There seems to have been a problem. Pls contact the devs... bro.')
      console.log('ERROR', err);
    })
  }

  touchUser(user) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      body: JSON.stringify({
        to: user._id,
      }),
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then(resp => resp.json())
    .then(respJson => {
      if (respJson.success) {
        alert(`Successfully messaged ${user.username}!`)
      } else {
        alert(`There was an error messaging ${user.username}`)
      }
    })
    .catch(err => {
      alert('There seems to have been a problem. Pls contact the devs... bro.')
      console.log('ERROR', err);
    })
  }

  sendLocation(user) {
    let test = navigator.geolocation.getCurrentPosition(
      success => {
        const location = {
          latitude: success.coords.latitude,
          longitude: success.coords.longitude
        }
        fetch('https://hohoho-backend.herokuapp.com/messages', {
          method: 'POST',
          body: JSON.stringify({
            to: user._id,
            location,
          }),
          headers: {
            "Content-Type": "application/json"
          },
        })
        .then(resp => resp.json())
        .then(respJson => {
          if (respJson.success) {
            alert(`Successfully messaged ${user.username} with your location!`)
          } else {
            alert(`There was an error messaging ${user.username}`)
          }
        })
        .catch(err => {
          alert('There seems to have been a problem. Pls contact the devs... bro.')
          console.log('ERROR', err);
        })
      }
    )
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.componentWillMount().then(() => {
      this.setState({refreshing: false});
    });
  }

  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return (
      <View style={styles.container}>
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          dataSource={ds.cloneWithRows(this.state.dataSource)}
          renderRow={(rowData) => (
            <TouchableOpacity
              onPress={() => this.touchUser(rowData)}
              onLongPress={() => this.sendLocation(rowData)}
              delayLongPress={1000}>
              <Text style={styles.textBig}>
                {rowData.username}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    )
  }
}

class MessagesScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      dataSource: [],
      refreshing: false,
    }
  }

  static navigationOptions = {
    title: 'Messages',
    headerStyle: { marginTop: 25 },
  }

  componentWillMount() {
    return fetch('https://hohoho-backend.herokuapp.com/messages', {
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then(resp => resp.json())
    .then(respJson => {
      if (respJson.success) {
        this.setState({dataSource: respJson.messages})
      } else {
        alert('There was an error loading messages. Close this window and we will make another atempt.');
        this.props.navigation.navigate('Mein');
      }
    })
    .catch(err => {
      alert('There seems to have been a problem. Pls contact the devs... bro.')
      console.log('ERROR', err);
    })
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.componentWillMount().then(() => {
      this.setState({refreshing: false});
    });
  }

  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return (
      <View style={styles.container}>
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          dataSource={ds.cloneWithRows(this.state.dataSource)}
          renderRow={rowData => (
            <View style={styles.message}>
              <Text>From: {rowData.from.username}</Text>
              <Text>To: {rowData.to.username}</Text>
              <Text>Message: {rowData.body}</Text>
              <Text>When: {(new Date(rowData.timestamp)).toString()}</Text>
              {rowData.location ? <MapView
                scrollEnabled={false}
                style={{height: 200, marginTop: 10}}
                region={{
                  latitude: rowData.location.latitude,
                  longitude: rowData.location.longitude,
                  latitudeDelta: 0.5,
                  longitudeDelta: 0.25
                }}
                >
                  <MapView.Marker coordinate={{
                    latitude: rowData.location.latitude,
                    longitude: rowData.location.longitude
                  }} />
                </MapView> : null}
            </View>
          )}
        />
      </View>
    )
  }
}

class SwiperScreen extends React.Component {
  static navigationOptions = {
    title: 'HoHoHo!',
    headerStyle: { marginTop: 25 },
  };

  render() {
    return (
      <Swiper style={styles.containerFull} showsPagination={false} >
        <UsersScreen />
        <MessagesScreen />
      </Swiper>
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
    screen: UsersScreen,
  },
  Messages: {
    screen: MessagesScreen,
  },
  Main: {
    screen: SwiperScreen,
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
  message: {
    padding: 10,
    borderBottomWidth: 1,
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
  },
  input: {
    height: 40,
    width: 300,
    paddingLeft: 5,
  }
});
