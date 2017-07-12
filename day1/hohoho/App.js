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
import {
  MapView,
  Location,
  Permissions
} from 'expo';

class MessageScreen extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
    fetch('https://hohoho-backend.herokuapp.com/messages')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        dataSource: ds.cloneWithRows(responseJson.messages)
      });
    })
    .catch((err) => {
      this.setState({
        message: err
      })
    })
  }
  static navigationOptions = {
    title: 'Messages'
  };
  render(){
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) =>
          <View>
          <Text>{rowData.from.username} sent {rowData.to.username} a message at {rowData.timestamp}</Text>
          {rowData.location && rowData.location.longitude ? <MapView
            longitude={rowData.location.longitude}
            latitude={rowData.location.latitude}
            style={{height: 100}}
            showsUserLocation={true}
            scrollEnabled={false}
            annotations={true}
            region={{
              longitude: this.props.longitude,
              latitude: this.props.latitude,
              longitudeDelta: 1,
              latitudeDelta: 1
            }}
          /> : <View></View>}
        </View>
        }
      />
    )
  }
}

class UserScreen extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
    fetch('https://hohoho-backend.herokuapp.com/users')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        dataSource: ds.cloneWithRows(responseJson.users)
      });
    })
    .catch((err) => {
      this.setState({
        message: err
      })
    })
  }
  sendLocation = async(user) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        alert("Permission not granted")
      } else {
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
          if (responseJson.success) {
            Alert.alert(
              'Success',
              'Location to ' + user.username + ' sent successfully!',
              [{text: 'Dismiss'}]
            )
          } else {
            Alert.alert(
              'Failure',
              'Location not sent to ' + user.username,
              [{text: 'Dismiss'}]
            )
          }
        })
        .catch((err) => {
          console.log("errrrrr")
        });
      }
  }
  messages(){
    this.props.navigation.navigate('Messages')
  }
  touchUser(user){
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
      console.log("hmmmmm",responseJson.success)
      console.log("respjson", responseJson)
      console.log('id', user._id)
      if (responseJson.success) {
        Alert.alert(
          'Success',
          'Message to ' + user.username + ' sent successfully!',
          [{text: 'Dismiss'}]
        )
      } else {
        Alert.alert(
          'Failure',
          'Message not sent to ' + user.username,
          [{text: 'Dismiss'}]
        )
      }
    })
    .catch((err) => {
      console.log("errrrrr")
    });
  }
  static navigationOptions = ({ navigation }) => ({
    title: 'Users',
    headerRight: <Button title='Messages' onPress={ () => {navigation.state.params.onRightPress()} } />
  });
  componentDidMount() {
    this.props.navigation.setParams({
      onRightPress: this.messages.bind(this)
    })
  }
  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) =>
          <TouchableOpacity
           onPress={this.touchUser.bind(this, rowData)}
           onLongPress={this.sendLocation.bind(this, rowData)}
           delayLongPress={1000}>
           <Text>{rowData.username}</Text>
         </TouchableOpacity>}
      />
    )
  }
}

//Screens
class LoginScreen extends React.Component {
  constructor(){
    super();
    this.state = {
      username: "",
      password: "",
      message: ""
    }
  }
  static navigationOptions = {
    title: 'Login'
  };
  componentDidMount(){
    AsyncStorage.getItem('user')
    .then(result => {
      var parsedResult = JSON.parse(result);
      var username = parsedResult.username;
      var password = parsedResult.password;
      if (username && password) {
        this.login(username, password)
      }
    })
    .catch(err => { console.log("ERR", err) })
  }
  login(u, p) {
    fetch('https://hohoho-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: u || this.state.username,
        password: p || this.state.password,
      })
    })
    .then(AsyncStorage.setItem('user', JSON.stringify({
      username: u || this.state.username,
      password: p || this.state.password
    })))
    .then((response) => response.json())
    .then((responseJson) => {
      this.props.navigation.navigate('Users')
    })
    .catch((err) => {
      this.setState({
        message: err
      })
    });
  }
  press() {
    if (!this.state.username || !this.state.password) {
      alert("CANT BE BLANK!!")
    } else {
    this.login();
  }
  }

  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to Yo!</Text>

        <TextInput
          style={{height: 40, textAlign: 'center'}}
          placeholder="Username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          secureTextEntry={true}
          style={{height: 40, textAlign: 'center'}}
          placeholder="Password"
          onChangeText={(text) => this.setState({password: text})}
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
  constructor(){
    super();
    this.state = {
      username: "",
      password: ""
    }
  }
  static navigationOptions = {
    title: 'Register'
  };
  press(){
    if (!this.state.username || !this.state.password) {
      alert("CANT BE BLANK!!")
    } else {
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
        this.props.navigation.goBack();
      })
      .catch((err) => {
        console.log("there was an err", err)
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>
        <TextInput
          style={{height: 40, textAlign: 'center'}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          secureTextEntry={true}
          style={{height: 40, textAlign: 'center'}}
          placeholder="Enter a password"
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonRed]} onPress={ () => {this.press()} }>
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
    screen: UserScreen,
  },
  Messages: {
    screen: MessageScreen,
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
