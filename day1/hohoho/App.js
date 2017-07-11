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
  static navigationOptions = {
    title: 'Home',
  };
  register() {
    this.props.navigation.navigate('Register');
  }
  login () {
      this.props.navigation.navigate('Login');
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <TouchableOpacity onPress={ () => {this.login()} } style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Tap to Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.register()}}>
          <Text style={styles.buttonLabel}>Tap to Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
////login page
class Login extends React.Component {

  static navigationOptions = {
    title: 'Login Page'
  };
  constructor (props) {
    super(props);
    this.state = {
      msg:''
    };
  }
  login() {
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
          if(responseJson.success) {
            alert('you have logged in!');
          }
          else {
            this.setState({
              msg: 'Invalid password and username combination'
            })
          }
        })
        .then(()=>this.props.navigation.navigate('Users'))
        .catch((err) => {
          console.log(err);
        });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login</Text>
        <Text>{this.state.msg}</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={()=>this.login()}><Text style={styles.buttonLabel}>Submit</Text></TouchableOpacity>
      </View>
    )
  }
}
// registrationScreen
class RegisterScreen extends React.Component {
  static navigationOptions = {
    title: 'Register'
  };
  constructor (props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }
  registration() {
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
          alert('you have registered');
            this.props.navigation.navigate('Home');

  /* do something with responseJson and go back to the Login view but
   * make sure to check for responseJson.success! */
    })
    .catch((err) => {
      console.log(err);
  /* do something if there was an error with fetching */
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
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={()=> this.registration()}><Text style={styles.buttonLabel}>Confirm</Text></TouchableOpacity>
      </View>
    )
  }
}
//users page
class Users extends React.Component {
  static navigationOptions = ({ navigation }) => {
    console.log(navigation);
    return {
  title: 'Users',
  headerRight: <Button title='Messages' onPress={ () => {navigation.state.params.onRightPress()} } />
}
};


  constructor (props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
  }
  componentDidMount () {
    this.props.navigation.setParams({
    onRightPress: this.messages.bind(this)
  })
    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
      })
      .then((response) =>response.json())
      .then((obj)=>{

      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
          dataSource: ds.cloneWithRows(obj.users)
        })
      })
  }
  touchUser (user) {
    // console.log(123123123123123);
      fetch('https://hohoho-backend.herokuapp.com/messages', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: user._id
        })
      })
      .then((respo)=>respo.json())
      .then((response) =>{
        // console.log('helo',response.json());
        if(response.success){
          Alert.alert(
            'your YOYOYO has sent',
            [{text: 'Dismiss Button'}] // Button
          )
        }
        else {
          Alert('not successful');
        }
      })
  }
  messages() {
    this.props.navigation.navigate('Messages')
  }
  render () {
    return (
      <View>

        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) =>(
            <TouchableOpacity onPress = {this.touchUser.bind(this, rowData)}>
              <Text>{rowData.username}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    )
  }

}
/// msg class
class Messages extends React.Component {
  static navigationOptions = {
    title: 'Messages'
  };
  constructor (props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
  }
  componentDidMount () {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
      })
      .then((response) =>response.json())
      .then((obj)=>{
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
          dataSource: ds.cloneWithRows(obj.messages)
        })
      })
  }
  render () {
    return (
      <View>

        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) =>(
            <TouchableOpacity>
              <Text>{rowData.to.username}</Text>
              <Text>{rowData.from.username}</Text>
              <Text>{rowData.timeStamp}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    )
  }
}

//Navigator
export default StackNavigator({
  Home: {
    screen: LoginScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  Login: {
    screen: Login
  },
  Users: {
    screen: Users
  },
  Messages: {
    screen: Messages
  }

}, {initialRouteName: 'Home'});


//Styles
const styles = StyleSheet.create({
  input: {

    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    fontSize: 25
  },
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
