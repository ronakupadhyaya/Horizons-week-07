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
  Dimensions,
  AsyncStorage
} from 'react-native';
import { StackNavigator } from 'react-navigation';

import { Location, Permissions, MapView } from 'expo';

import Swiper from 'react-native-swiper';

const win = Dimensions.get('window');

//Screens
class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Users',
    headerRight: <Button title='Messages' onPress={ () => {navigation.state.params.onRightPress()} } />
  });

  messages() {
    this.props.navigation.navigate('Messages')
  }

  componentDidMount() {
    this.props.navigation.setParams({
      onRightPress: this.messages.bind(this)
    })
  }

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
        <TouchableOpacity onPress={ () => {this.press()} } style={[styles.button, styles.buttonGreen]}>
          <Text style={[styles.buttonLabel, {color: '#fff'}]}>Tap to Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.register()} }>
          <Text style={[styles.buttonLabel, {color: '#fff'}]}>Tap to Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class RegisterScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: ''
    }
  }

  static navigationOptions = {
    title: 'Register'
  };

  login() {
    this.props.navigation.navigate('Login')
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
      // console.log('json', responseJson);
    })
    .catch((err) => {
      console.log('error', err);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>
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
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={this.login.bind(this)}>
          <Text style={[styles.buttonLabel, {color: '#fff'}]}>Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class LoginScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      errorMessage: 'An error occurred'
    }
  }

  componentDidMount(){
    AsyncStorage.getItem('user')
      .then(result => {
        var parsedResult = JSON.parse(result);
        var username = parsedResult.username;
        var password = parsedResult.password;
        if (username && password) {
          return this.checkLogin(username, password)
            .then(resp => resp.json())
            .then(respJson => this.checkRespAndGo(respJson));
        }
      })
      .catch(err => { console.log(err) })

  }

  checkRespAndGo(respJson){
    console.log(respJson)
    if(respJson.success){
      console.log('HERE')
      this.props.navigation.navigate('Swiper')
    }
  }

  checkLogin(user, pass){
    return fetch('https://hohoho-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: user,
        password: pass
      })
    })
    .then((response) => response)
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
      // console.log(responseJson);
      if (responseJson.success) {
        AsyncStorage.setItem('user', JSON.stringify({
          username: this.state.username,
          password: this.state.password
        }));
        this.props.navigation.navigate('Swiper')
      }
      else {
        <Text>{responseJson.error}</Text>
      }
    })
    .catch((err) => {
      console.log('error', err);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login</Text>
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
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={this.press.bind(this)}>
          <View><Text style={[styles.buttonLabel, {color: '#fff'}]}>Login</Text></View>
        </TouchableOpacity>
      </View>
    )
  }
}

class UserListScreen extends React.Component {
  static navigationOptions = {
    title: 'UserList' //you put the title you want to be displayed here
  };

  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
    this.touchUser = this.touchUser.bind(this)
  }

  componentDidMount() {
    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET'
    })
    .then((response) => response.json())
    .then((responseJson) => {
      // console.log('usernames', responseJson.users);
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
      this.setState({dataSource: ds.cloneWithRows(responseJson.users)})
    })
    .catch((err) => {
      console.log('error', err);
    });
  }

  touchUser(user) {
    console.log('user', user._id);
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify ({
        to: user._id
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        Alert.alert(
          'HoHoHo!',
          'Your Ho Ho Ho! to ' + user.username + ' has been sent!',
          [{text: 'Dismiss'}] // Button
        )
      }
    })
    .catch((err) => console.log('error', err));
  }

  longTouchUser(user, location){
    //could wrap this in a function
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify ({
        to: user._id,
        location: {
          longitude: location.coords.longitude,
          latitude: location.coords.latitude
        }
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        Alert.alert(
          'Location!',
          'Your location (' + location.coords.latitude + ', ' + location.coords.longitude + ') has been sent to ' + user.username,
          [{text: 'Dismiss'}] // Button
        )
      }
    })
    .catch((err) => console.log('error', err));
    // ====================
  }

  sendLocation = async(user) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
          console.log("Permission not granted")
      }

    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});

    // console.log(location);

    this.longTouchUser(user, location)

  }

  render() {
    return (
      <View>
        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={(rowData) => {
            return (<TouchableOpacity onPress={() => this.touchUser(rowData)}
              onLongPress={this.sendLocation.bind(this, rowData)}
              delayLongPress={100}>
              <Text style={styles.user}>User: {rowData.username}</Text>
            </TouchableOpacity>)
          }}/>
      </View>
    )
  }
}

class Messages extends React.Component {
  static navigationOptions = {
    title: 'Messages' //you put the title you want to be displayed here
  };

  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds.cloneWithRows([])
    }
  }

  componentDidMount() {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET'
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log('json', responseJson);
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
      this.setState({dataSource: ds.cloneWithRows(responseJson.messages)})
    })
    .catch((err) => {
      console.log('error', err);
    });
  }

  render() {
    return(
      <View>
        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={(rowData) =>
            <View style={styles.message}>
              <Text>Sender: {rowData.from.username}</Text>
              <Text>Recipient: {rowData.to.username}</Text>
              <Text>Time: {rowData.timestamp}</Text>
              {(rowData.location && rowData.location.longitude) ? <MapView

                style={{
                  height: 300
                }}
                showsUserLocation={true}
                scrollEnabled={false}
                region={{
                  longitude: rowData.location.longitude,
                  latitude: rowData.location.latitude,
                  longitudeDelta: 1,
                  latitudeDelta: 1
                }}
              >
                  <MapView.Marker
                      coordinate={{
                        latitude: rowData.location.latitude,
                        longitude: rowData.location.longitude
                      }}
                  />
              </MapView> : null }
            </View>
          }/>
      </View>
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
        <UserListScreen/>
        <Messages/>
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
    screen: LoginScreen
  },
  UserList: {
    screen: UserListScreen
  },
  Messages: {
    screen: Messages
  },
  Swiper: {
    screen: SwiperScreen
  }
}, {initialRouteName: 'Home'});


//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  containerFull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    // color: '#333333',
    marginBottom: 5
  },
  textBig: {
    fontSize: 36,
    textAlign: 'center',
    margin: 10
  },
  button: {
    // alignSelf: 'stretch',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5,
    width: win.width
  },
  buttonRed: {
    backgroundColor: '#FF585B'
  },
  buttonBlue: {
    backgroundColor: '#0074D9',
    width: win.width,
    borderRadius: 3
    // color: '#ffffff'
  },
  buttonGreen: {
    backgroundColor: '#2ECC40'
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  },
  inputBox: {
    borderColor: 'gray',
    height: 40,
    width: win.width
  },
  user: {
    marginLeft: 20,
    marginTop: 5,
    marginBottom: 5
  },
  message: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20
  }
});
