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
import styles from './styles.js'

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
        <Text style={[styles.textBig, {color: '#53E0CF'}]}>boop the snoot</Text>
        <TouchableOpacity onPress={ () => {this.press()} } style={[styles.button, styles.buttonGreen]}>
          <Text style={[styles.buttonLabel, {color: '#FFF9F9'}]}>login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.register()} }>
          <Text style={[styles.buttonLabel, {color: '#FFF9F9'}]}>register</Text>
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
        <Text style={[styles.textBig, {color: '#53E0CF'}]}>register</Text>
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
          <Text style={[styles.buttonLabel, {color: '#FFF9F9'}]}>register</Text>
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

  static navigationOptions = {
    title: 'Login'
  };

  componentDidMount() {
    AsyncStorage.getItem('user')
    .then((result) => {
      var parsedResult = JSON.parse(result)
      var username = parsedResult.username
      var password = parsedResult.password
      if (username && password) {
        return this.login(username, password)
        .then(resp => resp.json())
        .then((respJson) => this.checkResponseAndGoToMainScreen(respJson))
      }
    })
    .catch(err => console.log(err))
  }

  login(username, password) {
    return fetch('https://hohoho-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username || username,
        password: this.state.password || password
      })
    })
    .then((response) => response)
  }

  checkResponseAndGoToMainScreen(respJson) {
    if (respJson.success) {
      this.props.navigation.navigate('Swiper')
    }
    else {
      <Text>{responseJson.error}</Text>
    }
  }

  press() {
    fetch('https://hohoho-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username || username,
        password: this.state.password || password
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        AsyncStorage.setItem('user', JSON.stringify({
          username: this.state.username,
          password: this.state.password
        }))
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
        <Text style={[styles.textBig, {color: '#53E0CF'}]}>login</Text>
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
        <TouchableOpacity style={[styles.button, styles.buttonGreen]} onPress={this.press.bind(this)}>
          <View><Text style={[styles.buttonLabel, {color: '#FFF9F9'}]}>login</Text></View>
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

  // touchUser(user) {
  //   fetch('https://hohoho-backend.herokuapp.com/messages', {
  //     method: 'POST',
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify ({
  //       to: user._id
  //     })
  //   })
  //   .then((response) => response.json())
  //   .then((responseJson) => {
  //     if (responseJson.success) {
  //       Alert.alert(
  //         'HoHoHo!',
  //         'Your Ho Ho Ho! to ' + user.username + ' has been sent!',
  //         [{text: 'Dismiss'}] // Button
  //       )
  //     }
  //   })
  //   .catch((err) => console.log('error', err));
  // }

  touchUser(user, location) {
    if (location) {
      var param = {
        to: user._id,
        location: {
          longitude: location.coords.longitude,
          latitude: location.coords.latitude
        }
      }
    }
    else {
      var param = {
        to: user._id
      }
    }
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify (param)
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        Alert.alert(
          'boop this snoot',
          'you booped ' + user.username +
          (location? ' at coords: ' + location.coords.longitude + ', ' + location.coords.latitude: ''),
          [{text: 'Dismiss'}] // Button
        )
      }
    })
    .catch((err) => console.log('error', err));
  }

  sendLocation = async(user) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      console.log('Permission denied');
    }
    else {
      let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
      console.log(location);
      this.touchUser(user, location)
    }
  }

  render() {
    return (
      <View>
        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={(rowData) => {
            return (
              <TouchableOpacity
                style={styles.userWrapper}
                onPress={() => this.touchUser(rowData)}
                onLongPress={this.sendLocation.bind(this, rowData)}
                delayLongPress={1000}>
                <View style={styles.userWrapper}><Text style={[styles.user, {color: '#F7F7F2'}]}>user: {rowData.username}</Text></View>
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
              <Text style={{color: '#F7F7F2'}}>booper: {rowData.from.username}</Text>
              <Text style={{color: '#F7F7F2'}}>snoot: {rowData.to.username}</Text>
              <Text style={{color: '#F7F7F2'}}>booped at: {new Date(rowData.timestamp).toLocaleString()}</Text>
              {(rowData.location && rowData.location.longitude && rowData.location.latitude) ?
                (<MapView
                  style={{height: 200}}
                  showsUserLocation={true}
                  scrollEnabled={false}
                  region={{
                    latitude: rowData.location.latitude,
                    longitude: rowData.location.longitude,
                    latitudeDelta: 0.00625,
                    longitudeDelta: 0.00625
                  }} >
                  <MapView.Marker
                    coordinate={{
                      latitude: rowData.location.latitude,
                      longitude: rowData.location.longitude
                    }} />
                </MapView>) : null }
            </View>
          }/>
      </View>
    )
  }
}

class SwiperScreen extends React.Component {
  static navigationOptions = {
    title: 'begin booping!'
  };

  render() {
    return (
      <Swiper>
        <UserListScreen />
        <Messages />
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
