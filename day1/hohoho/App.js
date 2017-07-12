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
import Swiper from 'react-native-swiper';


//Screens
class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login'
  };

  constructor() {
    super();
  this.state= {
    username:'',
    password:'',
    message:''
  };
  }

  componentDidMount() {
    AsyncStorage.getItem('user')
    .then(result => {
      var parsedResult = JSON.parse(result);
      var username = parsedResult.username;
      var password = parsedResult.password;
      if (username && password) {
        this.setState({
          username: username,
          password: password
        })
        return this.press()
      }
    })
    .catch((err)=> {console.log('Error', err)})
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
    /* do something with responseJson and go back to the Login view but
     * make sure to check for responseJson.success! */
     console.log(responseJson.success)
     if (responseJson.success) {
       this.props.navigation.navigate('SwiperScreen');
       AsyncStorage.setItem('user', JSON.stringify ({
         username: this.state.username,
         password: this.state.password
       })
     )
     } else {
       this.setState({message: "Login Error"})
     }
  })
  .catch((err) => {
    /* do something if there was an error with fetching */
    console.log('Error', err)
  });
  }
  register() {
    this.props.navigation.navigate('Register');
  }


  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <Text>{this.state.message}</Text>
        <TextInput style={{padding: 10, height: 40}}
          placeholder="Enter your username"
          onChangeText={(text)=> this.setState({username: text})}
        />
        <TextInput style={{padding: 10, height: 40}}
          placeholder="Enter password"
          secureTextEntry={true} onChangeText={(text)=> this.setState({password: text})}
        />

        <TouchableOpacity onPress={ () => {this.press()} } style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Tap to Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={() => {this.register()}}>
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
    this.state= {};
    }

  registerSubmit() {
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
    /* do something with responseJson and go back to the Login view but
     * make sure to check for responseJson.success! */
     console.log(responseJson.success)
     if (responseJson.success) {
       this.props.navigation.navigate('Login');
     }
  })
  .catch((err) => {
    /* do something if there was an error with fetching */
    console.log('Error', err)
  });
    }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>
        <TextInput style={{padding: 10, height: 40}}
          placeholder="Enter your username"
          onChangeText={(text)=> this.setState({username: text})}
        />
        <TextInput style={{padding: 10, height: 40}}
          placeholder="Enter password"
          secureTextEntry={true} onChangeText={(text)=> this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={()=> {this.registerSubmit()}}>
          <Text style={styles.buttonLabel}>Submit</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class UsersScreen extends React.Component {
  static navigationOptions = ({ navigation}) => ({
    title: 'Users',
    headerRight: <Button title='Messages' onPress={()=> {navigation.state.params.onRightPress()}}/>
  });

  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
  }

  componentDidMount() {

    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET'
  })
  .then((response) => response.json())
  .then((responseJson) => {
    /* do something with responseJson and go back to the Login view but
     * make sure to check for responseJson.success! */
     if (responseJson.success) {
       const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
       this.setState({dataSource: ds.cloneWithRows(responseJson.users)})
     }
  })
  .catch((err) => {
    /* do something if there was an error with fetching */
    console.log('Error', err)
  });
  }

  touchUser(user) {
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
     console.log(responseJson.success)
     if (responseJson.success) {
       Alert.alert("Alert", "Your HoHoHo! to " + user.username + " has been sent!", [{text: 'Dismiss Button'}])
     } else {
       Alert.alert("Alert", "XXX Your HoHoHo! to " + user.username + " could not be sent. XXX", [{text: 'Dismiss Button'}])
     }
  })
  .catch((err) => {
    console.log('Error', err)
  });
  }

  messages() {
    this.props.navigation.navigate('Messages')
  }


  sendLocation = async(user) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      Alert.alert("Location permission not granted", [{text: 'Dismiss Button'}])
    }
    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
    console.log(location)
    this.longTouchUser(user, location)
  }

  longTouchUser(user ,location) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
      to: user._id,
      location: {
        longitude: location.coords.longitude,
        latitude:  location.coords.latitude
      }
    })
  })
  .then((response) => response.json())
  .then((responseJson) => {
     console.log(responseJson.success)
     if (responseJson.success) {
       Alert.alert("Alert", "Your location to " + user.username + " has been sent!", [{text: 'Dismiss Button'}])
     } else {
       Alert.alert("Alert", "Your location to " + user.username + " could not be sent.", [{text: 'Dismiss Button'}])
     }
  })
  .catch((err) => {
    console.log('Error', err)
  });
  }

  render() {
    return (
      <View style={{justifyContent: 'center'}}>
      <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 10, marginBottom: 10}}>
          <TouchableOpacity onPress={this.touchUser.bind(this, rowData)} onLongPress={this.sendLocation.bind(this, rowData)} delayLongPress={2000}>
          <Text style={{fontSize:20}}>{rowData.username}</Text>
          </TouchableOpacity>
          </View>}
          />
      </View>
    )
  }
}


class Messages extends React.Component {
  static navigationOptions = {
    title: 'Messages'
  };
  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
  }

  componentDidMount() {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET'
  })
  .then((response) => response.json())
  .then((responseJson) => {
    /* do something with responseJson and go back to the Login view but
     * make sure to check for responseJson.success! */
     if (responseJson.success) {
       const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
       this.setState({dataSource: ds.cloneWithRows(responseJson.messages)})
     }
  })
  .catch((err) => {
    /* do something if there was an error with fetching */
    console.log('Error', err)
  });
  }

  buildMap(location) {
    return (
      <MapView
      style={{flex:0.3, height:120, width:500}}
      showsUserLocation={true}
      scrollEnabled={false}
      region={{
        longitude: location.longitude,
        latitude: location.latitude,
        longitudeDelta: 1,
        latitudeDelta: 1
      }}
    />
    )
  }

  render() {
    return (
      <View style={{justifyContent: 'center'}}>
      <ListView
          dataSource={this.state.dataSource}
          renderRow={(aMessage) =>
            <View>
          <Text style={{fontSize:20}}>{'From: ' +aMessage.from.username}</Text>
          <Text style={{fontSize:20}}>{'To: ' +aMessage.to.username}</Text>
          <Text style={{fontSize:10}}>{aMessage.timestamp}</Text>
          {aMessage.location && aMessage.location.longitude ? this.buildMap(aMessage.location) : <View></View>}
          </View>
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
        <UsersScreen/>
        <Messages/>
      </Swiper>
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
  Users: {
    screen: UsersScreen,
  },
  Messages: {
    screen: Messages
  },
  SwiperScreen: {
    screen: SwiperScreen
  },
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
