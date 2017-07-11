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
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.success) {
        console.log(responseJson)
        console.log("I guess it worked?")
      this.props.navigation.navigate('Users', {username: this.state.username, password:this.state.password})
      } else {
        console.log("THIS DOES NOT WORK!")
        alert("FIX IT!!!")
      }
      /* do something with responseJson and go back to the Login view but
      * make sure to check for responseJson.success! */
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log("This is your error: ", err)
    })
  }
  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
         <TextInput
          style={{height: 40, textAlign: 'center'}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{height: 40, textAlign: 'center'}}
          placeholder="Enter your password"
          secureTextEntry = {true}
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
  constructor (props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    }
  }
  static navigationOptions = {
    title: 'Register'
  };

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
          style={{height: 40, textAlign: 'center'}}
          placeholder="Enter your password"
          secureTextEntry = {true}
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity onPress={() => {
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
            if(responseJson.success) {
              console.log("I guess it worked?")
            this.props.navigation.goBack()
            } else {
              console.log("THIS DOES NOT WORK!")
            }
            /* do something with responseJson and go back to the Login view but
            * make sure to check for responseJson.success! */
          })
          .catch((err) => {
            /* do something if there was an error with fetching */
            console.log("This is your error: ", err)
          })
          }}>
            <Text> Register </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class UserScreen extends React.Component {
  constructor (props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    }
  }

  componentDidMount() {
    fetch('https://hohoho-backend.herokuapp.com/users')
    .then((resp) => (resp.json()))
    .then((json) => {
      console.log("THIS IS THE JSON: ", json);
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.setState({
        dataSource: ds.cloneWithRows(json.users)
      })
    }
    )
    .catch((err) => {
      console.log("THIS IS THE ERROR: ", err)
    }
    )
  }

  touchUser (user) {
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
        console.log("I guess it worked?")
        // Alert.alert(
        // 'Alert Title',
        // 'Alert Contents',
        // [{text: 'Dismiss Button'}] // Button
        // )
        this.props.navigation.navigate('Messages',{username: this.props.navigation.state.params.username ,
          password: this.props.navigation.state.params.password})
      } else {
        console.log("THIS DOES NOT WORK!")
      }
      /* do something with responseJson and go back to the Login view but
      * make sure to check for responseJson.success! */
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log("This is your error: ", err)
    })
  }

  static navigationOptions = {
    title: 'Users'
  };

  render() {
    return (
      <View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <TouchableOpacity onPress={this.touchUser.bind(this, rowData)}><Text>{rowData.username}</Text></TouchableOpacity>}
        />
      </View>
    )
  }
}

class MessagesScreen extends React.Component {
  constructor (props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    }
  }

  componentDidMount() {
    fetch('https://hohoho-backend.herokuapp.com/messages?username'+this.props.navigation.state.params.username
    +'&password='+this.props.navigation.state.params.password)
    .then((resp) => (resp.json()))
    .then((json) => {
      console.log("THIS IS THE JSON: ", json);
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.setState({
        dataSource: ds.cloneWithRows(json.messages)
      })
    }
    )
    .catch((err) => {
      console.log("THIS IS THE ERROR: ", err)
    }
    )
  }

  static navigationOptions = {
    title: 'Messages'
  };

  render() {
    return (
      <View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <Text>{rowData.body}</Text>}
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
