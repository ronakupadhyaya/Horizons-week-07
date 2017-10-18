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
import { Location, Permissions } from 'expo';



//Screens
//LOGIN
class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login'
  };

  constructor() {
    super();
    this.state = {
      username: '',
      password: ''
    }
  }

componentDidMount() {
  AsyncStorage.getItem('user')
  .then(result => {
    var parsedResult = JSON.parse(result);
    var username = parsedResult.username;
    var password = parsedResult.password;
    if (username && password) {
        this.press(username, password);
    }
  })
  .catch(err => {
    {'Error', err}
  })
}


  press(username, password) {
    // console.log(username,password);
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
  console.log('this worked too lol', responseJson)
  if (responseJson.success === true){
      console.log('yay login successful')
    this.props.navigation.navigate('Users')
    AsyncStorage.setItem('user', JSON.stringify({
      username: this.state.username,
      password: this.state.password
    }));
  } else {
    console.log('oops login unsuccessful')
    this.setState({message: 'Boo login unsuccessful'})
  }
})
.catch((err) => {
  {'Error', err}
});
  }

  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HopHopHop!</Text>
        <TouchableOpacity onPress={ () => {this.press()} } style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Tap to Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.register()} }>
          <Text style={styles.buttonLabel}>Tap to Register</Text>
        </TouchableOpacity>

        <TextInput style={{height: 40, borderColor: 'gray', borderRadius: 4.5, borderWidth: 0.5, margin: 10, padding: 9}} placeholder="Enter your username"
          onChangeText={(text) =>
            this.setState({username: text})} />
        <TextInput style={{height: 40, borderColor: 'gray', borderRadius: 4.5, borderWidth: 0.5, margin: 10, padding: 9}} placeholder="Enter your password"
          secureTextEntry={true} onChangeText={(text) =>
            this.setState({password: text})} />
        <TouchableOpacity style={[styles.button, styles.buttonRed]}
          onPress={this.press.bind(this)}>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
          <Text>{this.state.message}</Text>
      </View>
    )
  }
}

//REGISTER
class RegisterScreen extends React.Component {
  static navigationOptions = {
    title: 'Register'
  };

constructor() {
  super();
  this.state = {
    username: '',
    password: '',
    message: ''
  }
}

register() {
  fetch('https://hohoho-backend.herokuapp.com/register', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: this.state.username,
      password: this.state.password,
      message: this.state.message
    })
  })
  .then((response) => response.json())
  .then((responseJson) => {
    /* do something with responseJson and go back to the Login view but
    * make sure to check for responseJson.success! */
    console.log('this worked lol')
    this.props.navigation.goBack()
  })
  .catch((err) => {
    this.setState({message: "Error"})
  });
}

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>
        <TextInput style={{height: 40, borderColor: 'gray', borderRadius: 4.5, borderWidth: 0.5, margin: 10, padding: 9}} placeholder="Enter your username"
          onChangeText={(text) =>
            this.setState({username: text})} />
        <TextInput style={{height: 40, borderColor: 'gray', borderRadius: 4.5, borderWidth: 0.5, margin: 10, padding: 9}} placeholder="Enter your password"
          secureTextEntry={true} onChangeText={(text) =>
            this.setState({password: text})} />
        <TouchableOpacity style={[styles.button, styles.buttonRed]} onPress={this.register.bind(this)}>
            <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
          {/* <Button title="Register" onPress={this.register.bind(this)} ></Button> */}
      </View>
    )
  }
}

class UserScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Users',
    headerRight:
    <Button title='Messages' onPress={ () => {navigation.state.params.onRightPress()} } />
  });

  constructor(props) {
    console.log('hey')
    super(props);
      this.state = {
        users: [],
        errorMessage: '',
      }
    };

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
    if (responseJson.success) {
      Alert.alert('Yay!', 'Your HoHoHo! to ' + user._id + ' has been sent!', [{text: 'Dismiss'}])
    }
  }
)
  .catch((err) => {
    Alert.alert('Boooo', 'Your HoHoHo! to ' + user._id + ' has not been sent.', [{text: 'Dismiss'}])
  });
}

messages() {
  this.props.navigation.navigate('Messages')
}

componentDidMount() {
  this.props.navigation.setParams({
    onRightPress: () => {this.messages()}
  })

  console.log('sup j');
  fetch('https://hohoho-backend.herokuapp.com/users')
  .then((response) => response.json())
  .then((responseJson) => {
    console.log('this worked!!!!! lol')
    console.log('hello', responseJson.users)
    this.setState({users: responseJson.users})
  })
  .catch((err) => {
    this.setState({message: "Error"})
  });
}

sendLocation = async(user) => {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status !== 'granted') {
    this.setState({
      errorMessage: "Booo, permission to access location was denied"
    })
  }
  let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
  console.log('this is great', location)
}

  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    console.log(this.state.users)
    return (
      <View style={styles.container}>
        <ListView
          dataSource={ds.cloneWithRows(this.state.users)}
          renderRow={(rowData) =>
            <TouchableOpacity
              onPress={this.touchUser.bind(this, rowData)}
              onLongPress={this.sendLocation.bind(this, rowData)}
              delayLongPress={2000}>
              <Text>{rowData.username}</Text>
            </TouchableOpacity>}
          />
      </View>
    )}
  }

class MessagesScreen extends React.Component {
  static navigationOptions = {
    title: 'Messages'
    };

  constructor(props) {
    super(props);
      this.state = {
        messages: [],
      }
  };

  componentDidMount() {
    console.log('messages worked');
    fetch('https://hohoho-backend.herokuapp.com/messages')
    .then((response) => response.json())
    .then((responseJson) => {
      console.log('message!')
      this.setState(
        {messages: responseJson.messages}
        // {ds.cloneWithRows(this.state.messages)}
      )
    })
    .catch((err) => {
      this.setState({message: "Error"})
    });
  }

  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2})

    return (
      <View style={styles.container}>
        {/* <Text>'messages'</Text> */}
        <ListView dataSource={ds.cloneWithRows(this.state.messages)}
          renderRow={(rowData) =>
            <View>
              <Text>{rowData.from.username}</Text>
              <Text>{rowData.to.username}</Text>
              <Text>{rowData.timestamp}</Text>
            </View>
          }/>
      </View>
    )
  }
}

// class RefreshableList extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       refreshing: false,
//     };
//   }
//
//   _onRefresh() {
//     this.setState({refreshing: true});
//     fetchData().then(() => {
//       this.setState({refreshing: false});
//     });
//   }
//
//   render() {
//     return(
//       <ListView refreshControl={
//         <RefreshControl refreshing={this.state.refreshing}
//           onRefresh={this._onRefresh.bind(this)}
//         />}
//       ></ListView>
//     )
//   }
// }

//Navigator
export default StackNavigator({
  Login: {
    screen: LoginScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  Users: {
    screen: UserScreen
  },
  Messages: {
    screen: MessagesScreen
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
