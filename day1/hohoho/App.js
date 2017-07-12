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
  AsyncStorage
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Location, Permissions, MapView } from 'expo';


//Screens
class LoginScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      username: 'string',
      password: 'string'
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
        password: this.state.password,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        AsyncStorage.setItem(
          'user',
          JSON.stringify({
            username: this.state.username,
            password: this.state.password
          })
        );
        this.props.navigation.navigate('Users');
      } else {
        alert("Couldn't log in");
      }
    })
    .catch((err) => {
      console.log('Error:', err);
    })
  }

  register() {
    this.props.navigation.navigate('Register');
  }

  login(username, password) {
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

  check(attempt) {
    if (attempt.success) {
      this.props.navigation.navigate('Users');
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('user')
    .then(result => {
      var parsedResult = JSON.parse(result);
      console.log('RESULT', parsedResult)
      var username = parsedResult.username;
      var password = parsedResult.password;
      if (username && password) {
        this.login(username, password)
          .then(resp => resp.json())
          .then(respJson => {this.check(respJson)});
      }
      // Don't really need an else clause, we don't do anything in this case.
    })
    .catch(err => {console.log(err)})
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <TextInput
          style={styles.textBox}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={styles.textBox}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
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
  constructor() {
    super();
    this.state = {
      username: 'string',
      password: 'string'
    };
  }
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
      if (responseJson.success) {
        this.props.navigation.navigate('Login');
      } else {
        alert("Couldn't register");
      }
    })
    .catch((err) => {
      console.log('Error:', err);
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>
        <TextInput
          style={styles.textBox}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={styles.textBox}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
          secureTextEntry={true}
        />
        <TouchableOpacity onPress={ () => {this.press()} } style={[styles.button, styles.buttonBlue]}>
          <Text style={styles.buttonLabel}>Register</Text>
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
  }


  message() {
    this.props.navigation.navigate('Messages');
  }

  sendLocation = async(user) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      Alert.alert(
        'Location services required!',
        'Please',
        [{text: 'Okay'}]
      )
    }
    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
    this.touchUser(user, location);
  }

  touchUser(user, location) {
    let goFetch;
    if (location.coords) {
      goFetch = fetch('https://hohoho-backend.herokuapp.com/messages', {
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
    } else {
      goFetch = fetch('https://hohoho-backend.herokuapp.com/messages', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: user._id,
        })
      })
    }
    goFetch.then(response => response.json())
    .then(responseJson => {
      if (responseJson.success) {
        Alert.alert(
          'SENT',
          'Congrats',
          [{text: 'Okay'}] // Button
        )
      } else {
        Alert.alert(
          "Couldn't send",
          'Sorry',
          [{text: 'Okay'}] // Button
        )
      }
    })
    .catch((err) => {
      console.log('Error:', err);
    })
  }

  componentDidMount() {
    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
    })
    .then(response => response.json()) //make it readable to machine
    .then(responseJson => {
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.setState({
        dataSource: ds.cloneWithRows(responseJson.users)
      })
    })
    this.props.navigation.setParams({
      onRightPress: this.message.bind(this)
    })
  }
  render() {
    return (
      <View style={styles.flexContainer}>
        <View style={styles.user1}>
          <Text>Nick</Text>
        </View>
        <View style={styles.user2}>
          <Text>Jillian</Text>
        </View>
        <View style={styles.user3}>
          <Text>Lizzie</Text>
        </View>
        <ListView
          style={styles.flexContainer}
          dataSource={this.state.dataSource}
          renderRow={(rowData) =>
            <TouchableOpacity
              onPress={this.touchUser.bind(this, rowData)}
              onLongPress={this.sendLocation.bind(this, rowData)}
              delayLongPress={1000}
            >
              <Text
                style={styles.users}
                >{rowData.username}</Text>
            </TouchableOpacity>
          }
        />
      </View>
    )
  }
}

class MessagesScreen extends React.Component {
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

  showMap(location) {
    if (location && location.longitude) {
      return (
        <MapView
          style={{
            width: 400,
            height: 100
          }}
          showsUserLocation={true}
          scrollEnabled={false}
          region={{
            longitude: location.longitude,
            latitude: location.latitude,
            longitudeDelta: .05,
            latitudeDelta: .025
          }}
        />
      )
    }
  }

  componentDidMount() {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET',
    })
    .then(response => response.json()) //make it readable to machine
    .then(responseJson => {
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.setState({
        dataSource: ds.cloneWithRows(responseJson.messages)
      });
    })
  }
  render() {
    return (
      <View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) =>
            <View>
              <Text>
                From {rowData.from.username} to {rowData.to.username} at {rowData.timestamp}: {rowData.body}
              </Text>
              {this.showMap(rowData.location)}
            </View>
          }
        />
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
    screen: UsersScreen
  },
  Messages: {
    screen: MessagesScreen
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
  },
  textBox: {
    height: 40,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5,
    borderStyle: 'solid',
    borderColor: 'grey'
  },
  flexContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  user1: {
    width: 200,
    height: 200,
    backgroundColor: 'powderblue'
  },
  user2: {
    width: 200,
    height: 200,
    backgroundColor: 'skyblue'
  },
  user3: {
    width: 200,
    height: 200,
    backgroundColor: 'steelblue'
  }
});
