import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ListView,
  Alert,
  Button
} from 'react-native';
import {StackNavigator} from 'react-navigation';

//Screens
class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
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
      body: JSON.stringify({username: this.state.username, password: this.state.password})
    }).then((response) => response.json()).then((responseJson) => {
      if (responseJson.success) {
        console.log("login successful!");
        this.props.navigation.navigate('Users');
      } else {
        console.log(responseJson.error);
      }
    })
  }

  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <TextInput style={{
          height: 40
        }} placeholder="Username" onChangeText={(text) => this.setState({username: text})}/>
        <TextInput style={{
          height: 40
        }} secureTextEntry={true} placeholder="Password" onChangeText={(text) => this.setState({password: text})}/>
        <TouchableOpacity onPress={() => {
          this.press()
        }} style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={() => {
          this.register()
        }}>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class RegisterScreen extends React.Component {
  static navigationOptions = {
    title: 'Register'
  };

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    }
  }

  onSubmit() {
    if (this.state.username && this.state.password) {
      // username and password exist
      fetch('https://hohoho-backend.herokuapp.com/register', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({username: this.state.username, password: this.state.password})
      }).then((response) => response.json()).then((responseJson) => {
        if (responseJson.success) {
          console.log("success registering!");
          this.props.navigation.navigate('Login');
        } else {
          alert(responseJson.error);
        }
      }).catch((err) => {
        console.log(err);
      });
    } else {
      console.log("error, username and password")
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput style={{
          height: 40
        }} placeholder="Username" onChangeText={(text) => this.setState({username: text})}/>
        <TextInput style={{
          height: 40
        }} secureTextEntry={true} placeholder="Password" onChangeText={(text) => this.setState({password: text})}/>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={() => {
          this.onSubmit()
        }}>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class UserScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({title: 'Users', headerRight: <Button title='Messages' onPress={() => {
    navigation.state.params.onRightPress()
  }}/>});

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.state = {
      dataSource: ds.cloneWithRows([])
    };
    // get users from backend
    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    }).then((response) => response.json()).then((responseJson) => {
      if (responseJson.success) {
        this.setState({
          dataSource: ds.cloneWithRows(responseJson.users)
        });
      } else {
        console.log("error", responseJson.error);
      }
    })
  }

  componentDidMount() {
    this.props.navigation.setParams({
      onRightPress: () => this.messages()
    })
  }

  touchUser(user) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({to: user._id})
    }).then((response) => response.json()).then((responseJson) => {
      const alert = {
        title: '',
        contents: ''
      }
      if (responseJson.success) {
        alert.title = "Sweet!"
        alert.contents = `Your Ho Ho Ho! to ${user.username} has been sent!`;
      } else {
        alert.title = "Oh no!"
        alert.contents = `Your Ho Ho Ho! to ${user.username} could not be sent!`;
      }
      Alert.alert(alert.title, alert.contents, [
        {
          text: 'Dismiss Button'
        }
      ])
    })
  }

  messages() {
    this.props.navigation.navigate('Messages');
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView dataSource={this.state.dataSource} renderRow={rowData => <TouchableOpacity onPress={this.touchUser.bind(this, rowData)}>
          <Text>{rowData.username}</Text>
        </TouchableOpacity>}/>
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
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.state = {
      dataSource: ds.cloneWithRows([])
    };

    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    }).then((response) => response.json()).then((responseJson) => {
      if (responseJson.success) {
        this.setState({
          dataSource: ds.cloneWithRows(responseJson.messages)
        });
      } else {
        console.log("error", responseJson.error);
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView dataSource={this.state.dataSource} renderRow={message => <View style={styles.messages}>
          <Text>From: {message.from.username}</Text>
          <Text>To: {message.to.username}</Text>
          <Text>When: {message.timestamp}</Text>
        </View>}/>
      </View>
    )
  }
}

//Navigator
export default StackNavigator({
  Login: {
    screen: LoginScreen
  },
  Register: {
    screen: RegisterScreen
  },
  Users: {
    screen: UserScreen
  },
  Messages: {
    screen: MessageScreen
  }
}, {initialRouteName: 'Login'});

//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
    color: '#333333',
    marginBottom: 5
  },
  textBig: {
    fontSize: 36,
    textAlign: 'center',
    margin: 10
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
    backgroundColor: '#FF585B'
  },
  buttonBlue: {
    backgroundColor: '#0074D9'
  },
  buttonGreen: {
    backgroundColor: '#2ECC40'
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  },
  messages: {
    flex: 1,
    borderWidth: 1
  }
});
