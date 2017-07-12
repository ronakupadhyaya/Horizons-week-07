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
import { Location, Permissions } from 'expo';
import {
  MapView
} from 'expo';

//Screens
class LoginScreen extends React.Component {
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
      /* do something with responseJson and go back to the Login view but
       * make sure to check for responseJson.success! */
       if (responseJson.success) {
         AsyncStorage.setItem('user', JSON.stringify({
            username: this.state.username,
            password: this.state.password
          }));
        this.props.navigation.navigate('Users')
      } else {
        alert(responseJson.error)
      }
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log("error", err)
    });
  }
  register() {
    this.props.navigation.navigate('Register');
  }

login(username,password) {
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

componentDidMount() {
  AsyncStorage.getItem('user')
  .then(result => {
    var parsedResult = JSON.parse(result);
    var username = parsedResult.username;
    var password = parsedResult.password;
    if (username && password) {
      return this.login(username, password)
        .then(resp => resp.json())
        .then(responseJson => {
          /* do something with responseJson and go back to the Login view but
           * make sure to check for responseJson.success! */
           if (responseJson.success) {
             this.props.navigation.navigate('Users')
          }
        });
    }
    // Don't really need an else clause, we don't do anything in this case.
  })
  .catch(err => { /* handle the error */ })
}



  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonGreen]} onPress={this.press.bind(this)}>
          <Text style={styles.buttonLabel}>Login</Text>
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

  register() {
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
       alert("registered!")
       this.props.navigation.goBack()
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log(err)
      alert("unable to register")
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonRed]} onPress={this.register.bind(this)}>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class UserScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Users',
    headerRight: <Button title='Messages' onPress={ () => {navigation.state.params.onRightPress()} } />
  });

  componentDidMount() {
  this.props.navigation.setParams({
    onRightPress: this.messages.bind(this)
  })
}

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    }
    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        dataSource: ds.cloneWithRows(responseJson.users)
      });
    });
  }

  messages() {
    this.props.navigation.navigate('Messages')
  }

  longTouchUser(user,location) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: user._id,
        location: {
          longitude: location.coords.longitude,
          latitude: location.coords.latitude,
        }
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
       if (responseJson.success) {
         alert("location sent to " + user.username)
      } else {
        alert("location failed to send to " + user.username)
      }
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log("error", err)
    });
  }

  sendLocation = async(user) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      alert("location failure")
    }
    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
    this.longTouchUser(user,location)
  }

  touchUser(user) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: user._id,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
       if (responseJson.success) {
         Alert.alert(
           'Alert',
           'Your Ho Ho Ho! to ' + user.username + ' has been sent!',
           [{text: 'Dismiss Button'}] // Button
         )
      } else {
        Alert.alert(
          'Alert',
          'Your Ho Ho Ho! to ' + user.username + ' could not be sent.',
          [{text: 'Dismiss Button'}] // Button
        )
      }
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log("error", err)
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <TouchableOpacity
          onPress={this.touchUser.bind(this, rowData)}
          onLongPress={this.sendLocation.bind(this, rowData)}
          delayLongPress={2000}><Text>{rowData.username}</Text></TouchableOpacity>}
        />
      </View>
    )
  }
}

class MessageScreen extends React.Component {
  static navigationOptions = {
    title: 'Messages'
  };

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      refreshing: false
    }
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        dataSource: ds.cloneWithRows(responseJson.messages)
      });
    });
  }

  fetchData() {
    return new Promise((res,rej)=>{
      fetch('https://hohoho-backend.herokuapp.com/messages', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        },
      })
      .then((response) => response.json())
      .then((responseJson) => {
        res(responseJson)
        this.setState({
          dataSource: ds.cloneWithRows(responseJson.messages)
        });
      })
      .catch((err)=>{
        rej(err)
      })
    })

  }

  _onRefresh() {
  this.setState({refreshing: true});
  this.fetchData().then((stuff) => {
    this.setState({refreshing: false});
  });
}

  render() {
    return (
      <View style={styles.container}>
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <View><Text>From: {rowData.from.username}</Text>
          <Text>To: {rowData.to.username}</Text>
          <Text>Message: {rowData.body}</Text>
          <Text>When: {rowData.timestamp}</Text>{(rowData.location && rowData.location.longitude)? <MapView
            style={{width: 400, height: 200}}
            showsUserLocation={true}
            scrollEnabled={false}
            region={{
              longitude: rowData.location.longitude,
              latitude: rowData.location.latitude,
              longitudeDelta: 1,
              latitudeDelta: 1
            }}
          ><MapView.Marker
      coordinate={{latitude: rowData.location.latitude, longitude: rowData.location.longitude}}
    /></MapView> : <View></View>}</View>}
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
  input: {
    textAlign: 'center',
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
