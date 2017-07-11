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

class MessagesScreen extends React.Component {
  static navigationOptions = {
    title: 'Messages'
  };
  constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
    fetch('https://hohoho-backend.herokuapp.com/messages')
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.success === true) {
        console.log(responseJson.users);
        console.log("DS" , ds);
        this.setState({
        dataSource: ds.cloneWithRows(responseJson.messages)
      });
    } else {
      console.log('error')
    }

   })
   .catch((err) => {
     console.log('error', err)
   });
  }

  render() {
    return (
      <View style={styles.container}>

      <ListView
        dataSource={this.state.dataSource}
        renderRow={(aMessage) =>
          <TouchableOpacity>
            <Text>Sender: {aMessage.from.username}</Text>
            <Text>Receiver: {aMessage.to.username}</Text>
            <Text>TimeStamp: {aMessage.timestamp}</Text>
          </TouchableOpacity>}
      />

    </View>


    )
  }
}

class UsersScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
  title: 'Users', //you put the title you want to be displayed here
  headerRight: <Button title='Messages' onPress={ () => {navigation.state.params.onRightPress()} } />
});

  constructor(props) {
   super(props);
   const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
   this.state = {
     dataSource: ds.cloneWithRows([])
   };
   fetch('https://hohoho-backend.herokuapp.com/users')
   .then((response) => response.json())
   .then((responseJson) => {
     if(responseJson.success === true) {
       console.log(responseJson.users);
       console.log("DS" , ds);
       this.setState({
       dataSource: ds.cloneWithRows(responseJson.users)
     });
   } else {
     console.log('error')
   }

  })
  .catch((err) => {
    console.log('error', err)
  });
  }
  componentDidMount() {
  this.props.navigation.setParams({
    onRightPress: this.messages.bind(this)
  })

  };
  messages() {
    this.props.navigation.navigate('Messages')
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
      console.log(responseJson);
      if(responseJson.success === true) {
        Alert.alert(
          'Successful message',
          `Ho Ho Ho Merry Christmas to ${user.username} sent`,
          [{text: 'Dismiss Button'}] // Button
        )

      } else {
        Alert.alert(
          'Fail ',
          `Oops! Ho Ho Ho Merry Christmas to ${user.username} can't be sent`,
          [{text: 'Dismiss Button'}] // Button
        )
      }
      /* do something with responseJson and go back to the Login view but
      * make sure to check for responseJson.success! */
    })
    .catch((err) => {
      console.log('error', err)
    });
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) => <TouchableOpacity onPress={this.touchUser.bind(this, rowData)}><Text>{rowData.username}</Text></TouchableOpacity>}
      />
    )
  }
}
//Screens
class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login'
  };

  press() {
    this.props.navigation.navigate("LoginPage");
  }
  register() {
    this.props.navigation.navigate('Register');
  }


  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
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

class LoginPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password:'',
      message:''
    }
  }
  static navigationOptions = {
    title: 'Login'
  };

  loginSubmit() {
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
      console.log(responseJson);
      if(responseJson.success === true) {
        console.log('login successful');
        this.props.navigation.navigate('Users')

      } else {
        console.log('login faled', responseJson.error);
        this.setState({
          message: <Text>{responseJson.error}</Text>
        })
      }
      /* do something with responseJson and go back to the Login view but
      * make sure to check for responseJson.success! */
    })
    .catch((err) => {
      console.log('error', err)
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login...</Text>
          <TextInput
            style={{height: 40, paddingTop: 10, justifyContent: "center", alignItems: "center"}}
            placeholder="Enter your username"
            onChangeText={(text) => this.setState({username: text})}
          />
          <TextInput
            style={{height: 40, paddingTop: 10, justifyContent: "center", alignItems: "center"}}
            placeholder="Enter your password"
            secureTextEntry={true}
            onChangeText={(text) => this.setState({password: text})}
          />
            <Button style={styles.buttonRed}
              onPress={ () => this.loginSubmit()}
              title="Login"
            />

      </View>
    )
  }
}


class RegisterScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: ''
    }
  }
  static navigationOptions = {
    title: 'Register',
  };

  registerSubmit() {
    console.log("HIHIHI")
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
      console.log(responseJson);
      if(responseJson.success === true) {
        console.log('registration successful', responseJson);
        this.props.navigation.navigate("Login");

      } else {
        console.log('registration faled', responseJson.error)
      }
      /* do something with responseJson and go back to the Login view but
      * make sure to check for responseJson.success! */
    })
    .catch((err) => {
      console.log('error', err)
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>
          <TextInput
            style={{height: 40, paddingTop: 10, justifyContent: "center", alignItems: "center"}}
            placeholder="Enter your username"
            onChangeText={(text) => this.setState({username: text})}
          />
          <TextInput
            style={{height: 40, paddingTop: 10, justifyContent: "center", alignItems: "center"}}
            placeholder="Enter your password"
            secureTextEntry={true}
            onChangeText={(text) => this.setState({password: text})}
          />
            <Button style={styles.buttonRed}
              onPress={ () => this.registerSubmit()}
              title="Submit"
            />

      </View>
    )
  }
}


//Navigator
export default StackNavigator({
  LoginPage: {
    screen: LoginPage,
  },
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
