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
  Button
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Location, Permissions, MapView } from 'expo';
import Swiper from 'react-native-swiper'

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

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
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

class RegisterScreen extends React.Component {
  static navigationOptions = {
    title: 'Register'
  };
  constructor() {
    super();
    this.state = {
      username: "",
      password: ""
    }
  }
  loginPage() {
    this.props.navigation.navigate('Login');
  }
  userRegister() {
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
      console.log(responseJson);
      this.loginPage();
    })
    .catch((err) => {
      console.log("Error occurred during registration", err);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Enter your password"
          secureTextEntry={true}
          onChangeText={(password) => this.setState({password: password})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={() => this.userRegister()}>
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
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      message: ""
    }
  }
  users() {
    this.props.navigation.navigate('Users');
  }
  userLogin() {
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
      console.log(responseJson);
      if(responseJson.success) {
        AsyncStorage.setItem('user', JSON.stringify({
          username: this.state.username,
          password: this.state.password
        }))
        .then(() => this.users())
      } else {
        this.setState({
          message: responseJson.error
        })
      }
    })
    .catch((err) => {
      console.log("Error occurred during Login", err);
    });
  }

  autoLogin(username, password) {
    fetch('https://hohoho-backend.herokuapp.com/login', {
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
      if(responseJson.success) {
        this.users()
      }
    });
  }

  componentDidMount() {
    AsyncStorage.getItem('user')
    .then(result => {
      var parsedResult = JSON.parse(result);
      var username = parsedResult.username;
      var password = parsedResult.password;
      if (username && password) {
        return this.autoLogin(username, password)
      }
    })
    .catch(err => { console.log("Error retrieving login info ", err) })
    // AsyncStorage.multiGet(['username', 'password'])
    //   .then((results) => {
    //     this.setState({
    //       username: JSON.parse(results[0][1]),
    //       password: JSON.parse(results[1][1])
    //   })});
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Enter your password"
          secureTextEntry={true}
          onChangeText={(password) => this.setState({password: password})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonGreen]}
          onPress={() => this.userLogin()}>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
        <Text>{this.state.message}</Text>
      </View>
    )
  }
}

class UsersScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Users',
    headerRight: <Button title='Messages' onPress={ () => {navigation.state.params.onRightPress()} } />
  });
  //navigationOptions code
  constructor(props) {
    super(props);
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
    })
    .then((response) => (response.json()))
    // .then((responseJson) => (console.log(responseJson)))
    .then((responseJson) => {
      this.setState({
        dataSource: ds.cloneWithRows(responseJson.users)
      })
    })
    .catch((err) => {
      console.log("Error getting users", err);
    })
  }

  componentDidMount() {
    this.props.navigation.setParams({
      onRightPress: this.messages.bind(this)
    })
  }

  touchUser(user) {
    console.log('sent HoHoHo to', user);
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: user._id
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log('status of msg', responseJson);
      if(responseJson.success) {
        Alert.alert(
          'Success',
          'Your HoHoHo to '+user.username+' has been sent.',
          [{text: 'Cool'}]
        )
      } else {
        Alert.alert(
          'Error',
          'Your HoHoHo to '+user.username+' could not be sent.',
          [{text: 'Cry'}]
        )
      }
    })
    .catch((err) => {
      console.log("Error sending message", err);
    })
  }

  messages() {
    this.props.navigation.navigate('Messages');
  }

  sendLocation = async(user) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      alert('Permission to get current location is denied!')
    }
    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: user._id,
        location: {
          longitude: location.coords.longitude,
          latitude: location.coords.latitude
        }
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log('status of msg', responseJson);
      if(responseJson.success) {
        Alert.alert(
          'Success',
          'Your HoHoHo and location to '+user.username+' has been sent.',
          [{text: 'Cool'}]
        )
      } else {
        Alert.alert(
          'Error',
          'Your HoHoHo and location to '+user.username+' could not be sent.',
          [{text: 'Cry'}]
        )
      }
    })
    .catch((err) => {
      console.log("Error sending message", err);
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => (
            <TouchableOpacity
              onPress={() => this.touchUser(rowData)}
              // onPress={this.touchUser.bind(this, rowData)}
              onLongPress={() => this.sendLocation(rowData)}
              delayLongPress={500}>
              <Text style={styles.user}>{rowData.username}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    )
  }
}

class MessagesScreen extends React.Component {
  static navigationOptions = {
    title: 'Messages'
  };
  //navigationOptions code
  constructor(props) {
    super(props);
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      messages: ds.cloneWithRows([])
    };
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET',
    })
    .then((response) => response.json())
    // .then((responseJson) => (console.log(responseJson)))
    .then((responseJson) => {
      this.setState({
        messages: ds.cloneWithRows(responseJson.messages)
      })
    })
    .catch((err) => {
      console.log("Error getting users", err);
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.messages}
          renderRow={(rowData) =>
            (<View style={styles.msgItem}>
              <Text>From: {rowData.from.username}</Text>
              <Text>To: {rowData.to.username}</Text>
              <Text>Message: {rowData.body}</Text>
              <Text>When: {rowData.timestamp}</Text>
              {(rowData.location && rowData.location.longitude && rowData.location.latitude) ?
                <MapView
                  style={styles.mapInMsg}
                  showsUserLocation={true}
                  scrollEnabled={false}
                  region={{
                    longitude: rowData.location.longitude,
                    latitude: rowData.location.latitude,
                    longitudeDelta: 0.05,
                    latitudeDelta: 0.025
                  }}
                /> : <Text>No location shared</Text>}
            </View>)
          }
        />
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
        UsersScreen
        MessagesScreen
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
    screen: UsersScreen,
  },
  Messages: {
    screen: MessagesScreen,
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
  },
  textInput: {
    height: 40,
    textAlign: 'center',
    borderColor: '#0074D9',
    borderRadius: 5,
    borderWidth: 1,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  user: {
    alignSelf: 'stretch',
    height: 40,
    textAlign: 'center',
    borderColor: '#000000',
    borderWidth: 1,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  msgItem: {
    display: 'block',
    alignSelf: 'stretch',
    borderWidth: 2,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    flex: 1
  },
  mapInMsg: {
    height: 80,
    width: 220
  }
});
