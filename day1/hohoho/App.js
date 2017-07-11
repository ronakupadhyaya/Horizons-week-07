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
import { StackNavigator } from 'react-navigation';


//Screens
class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'Username',
      password: 'Password',
      repeatPassword: 'Repeat Password'

    };
  }
  static navigationOptions = {
    title: 'Login'
  };

  press() {

  }
  registerNav() {
    this.props.navigation.navigate('Register');
  }
  login() {
    // console.log("before fetch")
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
      // console.log("after fetch")
      .then((response) => response.json())
      // console.log("after json")

      .then((responseJson) => {
        /* do something with responseJson and go back to the Login view but
         * make sure to check for responseJson.success! */
        // if(responseJson.success) {
        this.props.navigation.navigate('User');
      })
      // console.log("after response")


      .catch((err) => {
        <Text>{err}</Text>
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <TextInput
          style={styles.container}
          onChangeText={(username) => this.setState({ username })}
          placeholder={this.state.username}
        />
        <TextInput
          style={styles.container}
          onChangeText={(password) => this.setState({ password })}
          placeholder={this.state.password}
        />
        <TouchableOpacity onPress={() => { this.login() }} style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={() => { this.registerNav() }}>
          <Text style={styles.buttonLabel}>Tap to Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class RegisterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'Username',
      password: 'Password',
      repeatPassword: 'Repeat Password'

    };
  }
  static navigationOptions = {
    title: 'Register'
  };
  loginNav() {
    this.props.navigation.navigate('Login');
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
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        /* do something with responseJson and go back to the Login view but
         * make sure to check for responseJson.success! */
        if (this.state.password !== this.state.repeatPassword) {
          alert('Passwords must match!')
        } else if (responseJson.success) {
          this.loginNav()
        }
        // else{
        //   console.log("Try again", responseJson.error)
        // }
      })
      .catch((err) => {
        console.log("Error", err)
      });
  }
  render() {
    return (
      <View style={styles.containerFull}>
        <Text style={styles.textBig}>Register</Text>
        <TextInput
          style={styles.container}
          onChangeText={(username) => this.setState({ username })}
          placeholder={this.state.username}
        />
        <TextInput
          style={styles.container}
          onChangeText={(password) => this.setState({ password })}
          placeholder={this.state.password}
        />
        <TextInput
          style={styles.container}
          onChangeText={(repeatPassword) => this.setState({ repeatPassword })}
          placeholder={this.state.repeatPassword}
        />
        <TouchableOpacity
          style={[styles.button, styles.buttonBlue]} onPress={() => { this.register() }}>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
      </View>

    )
  }
}

class UsersScreen extends React.Component {
  constructor(props) {
    console.log('')
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      dataSource: ds.cloneWithRows([
      ])
    };
  }
  static navigationOptions = ({ navigation }) => ({
    title: 'Users',
    headerRight: <Button title='Messages' onPress={() => { navigation.state.params.onRightPress() }} />
  });

  messagesNav() {
    this.props.navigation.navigate('Messages');
  }
  componentDidMount() {
    this.props.navigation.setParams({
      onRightPress: this.messagesNav.bind(this)
    })
      console.log('mounted')
    fetch('https://hohoho-backend.herokuapp.com/users', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        },

      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)

        if (responseJson.success) {
          console.log('json success')
          const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
          this.setState({

            dataSource: ds.cloneWithRows(responseJson.users)
          })
        }
      })

      .catch((err) => {
        <Text>{err}</Text>
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
        console.log(responseJson)

        if (responseJson.success) {
          alert(
            'Your Ho Ho Ho! To ' + user.username + 'has been sent'

          )
        } else {
          alert('Your Ho Ho Ho! could not be sent')
        }
      })

  }
  render() {
    console.log(this.state.dataSource)
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) =>
          <TouchableOpacity onPress={this.touchUser.bind(this, rowData)}>
            {/*bind is the thing binding to then the parameter passing in*/}
            <Text>{rowData.username}</Text>
          </TouchableOpacity>} />

    )
  }
}

class MessagesScreen extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      dataSource: ds.cloneWithRows([
      ])
    };
  }
  static navigationOptions = {
    title: 'Messages',
  };
  componentDidMount() {
    console.log('mounted')
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },

    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)

        if (responseJson.success) {
          console.log('json success')
          const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
          this.setState({

            dataSource: ds.cloneWithRows(responseJson.messages)
          })
        }
      })

      .catch((err) => {
        <Text>{err}</Text>
      });
  }

  render() {
    console.log(this.state.dataSource)
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) =>
          <View>
            <Text>{rowData.from.username}</Text>
            <Text>{rowData.to.username}</Text>
            <Text>{rowData.timestamp}</Text>
          </View>
        }
      />

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
  User: {
    screen: UsersScreen
  },
  Messages: {
    screen: MessagesScreen
  },
}, { initialRouteName: 'Login' });


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
