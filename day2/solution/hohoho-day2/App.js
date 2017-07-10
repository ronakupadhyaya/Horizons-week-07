import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ListView,
  Alert,
  Button,
  AsyncStorage
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Location, Permissions, MapView } from 'expo';
import Swiper from 'react-native-swiper'


//Screens
class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login'
  };

  constructor(props) {
    super(props);
    this.state = {
      message: ''
    }
  }

  componentDidMount() {
    console.log('checking')
    AsyncStorage.getItem('user')
      .then(result => {
        var parsedResult = JSON.parse(result);
        console.log('local parsed', parsedResult)
        if(!parsedResult) {
          return;
        }
        var username = parsedResult.username;
        var password = parsedResult.password;
        if (username && password) {
          return this.login(username, password)
            .then(resp => resp.json())
            .then( (respJson) => {this.checkAndGo(respJson)} );
        }
      })
      .catch(err => {
        console.log('err', err);
      })
  }

  login(username, password) {
    console.log('hi from login()')
    return fetch('https://hohoho-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password,
      })
    })
  }

  checkAndGo(responseJson) {
    console.log('yo from checkAndGo', responseJson)
    if(responseJson.success) {
      this.props.navigation.navigate('Swiper');
    }
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
       console.log('suc', responseJson);
       if(responseJson.success) {
         AsyncStorage.setItem('user', JSON.stringify({
             username: this.state.username,
             password: this.state.password
         }));
         this.props.navigation.navigate('Swiper');
       } else {
         console.log('couldn\'t log in');
         this.setState({message: 'failed to log in'});
       }
    })
    .catch((err) => {
      console.log('err', err)
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
        <TextInput
          style={{width: 200, height: 40}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{width: 200, height: 40}}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity onPress={() => {this.press()}} style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Tap to Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={() => {this.register()} }>
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
       console.log('suc', responseJson);
       this.props.navigation.goBack();
    })
    .catch((err) => {
      console.log('err', err)
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>
        <TextInput
          style={{width: 200, height: 40}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{width: 200, height: 40}}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={() => {this.press()} }>
          <Text style={styles.buttonLabel}>Register Now!</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class UsersScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Users',
    headerRight: <Button title='Messages' onPress={ () => {navigation.state.params.onRightPress()} } />
  });

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
      this.setState({
        dataSource: ds.cloneWithRows(responseJson.users)
      });
    })
  }

  /*componentDidMount() {
    this.props.navigation.setParams({
      onRightPress: this.messages.bind(this)
    })
  }*/

  messages() {
    console.log('kjjjj')
    this.props.navigation.navigate('Messages');
  }

  touchUser(user) {
    console.log(user._id);
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
      if(responseJson.success) {
        Alert.alert(
          'Success',
          `Your Ho Ho Ho! to ${user.username} has been sent!`,
          [{text: 'Dismiss Button'}] // Button
        );
      } else {
        Alert.alert(
          'Success',
          `Your Ho Ho Ho! to ${user.username} could not be sent!`,
          [{text: 'Dismiss Button'}] // Button
        );
      }
    })
    .catch((err) => {
      console.log('err', err)
    });
  }

  longTouchUser(user, long, lat) {
    console.log(user._id);
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: user._id,
        location: {
          longitude: long,
          latitude: lat
        }
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.success) {
        Alert.alert(
          'Success',
          `Your Ho Ho Ho! to ${user.username} has been sent!`,
          [{text: 'Dismiss Button'}] // Button
        );
      } else {
        Alert.alert(
          'Success',
          `Your Ho Ho Ho! to ${user.username} could not be sent!`,
          [{text: 'Dismiss Button'}] // Button
        );
      }
    })
    .catch((err) => {
      console.log('err', err)
    });
  }


  sendLocation = async(user) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      console.log('fail loc perm');
      return;
    }

    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
    console.log(location);
    this.longTouchUser(user, location.coords.longitude, location.coords.latitude)
  };

  render() {
    return (
      <View style={styles.containerFull}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => (
            <TouchableOpacity
              onPress={ this.touchUser.bind(this, rowData) }
              onLongPress={ this.sendLocation.bind(this, rowData) }
              //delayLongPress={/* num of millseconds here */}>
              >
              <Text style={{textAlign: 'center'}}>{rowData.username}</Text>
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

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };

    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        dataSource: ds.cloneWithRows(responseJson.messages)
      });
    })
  }

  render() {
    //console.log(this.state.dataSource)
    return (
      <View style={styles.containerFull}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => (
            <TouchableOpacity>
              <Text style={{textAlign: 'center'}}>From {rowData.from.username}</Text>
              <Text style={{textAlign: 'center'}}>To {rowData.to.username}</Text>
              <Text style={{textAlign: 'center'}}>At {rowData.timestamp}</Text>
              {(rowData.location && rowData.location.longitude)
                ? <MapView
                    style={{alignSelf: 'stretch', height: 100 }}
                    showsUserLocation={true}
                    scrollEnabled={false}
                    region={{
                      longitude: rowData.location.longitude,
                      latitude: rowData.location.latitude,
                      longitudeDelta: 1,
                      latitudeDelta: 1
                    }}
                  />
                : <View/>
              }
            </TouchableOpacity>
          )}
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
        <UsersScreen></UsersScreen>
        <MessagesScreen></MessagesScreen>
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
    screen: MessagesScreen,
  },
  Swiper: {
    screen: SwiperScreen,
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
