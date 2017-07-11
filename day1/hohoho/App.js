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
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      message: ''
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
      .then((resp) => resp.json())
      .then((respJson) => {
        console.log(respJson);
        if (respJson.success) {
          console.log('login success!')
          this.props.navigation.navigate('Users')
        }
        else {
          this.setState({
            message: respJson.error
          })
          console.log(this.state.message)
        }
      })
      .catch((err) => {
        console.log('error', err);
      })
  }

  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <Text>{this.state.message}</Text>
        <TextInput
          style={{height: 40, margin: 10}}
          placeholder="Enter your username"
          onChangeText={(text) => {this.setState({username: text})}}
        />
        <TextInput
          style={{height: 40, margin: 10}}
          placeholder="Enter your password"
          secureTextEntry={true}
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
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      message: ''
    }
  }
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
      .then((resp) => resp.json())
      .then((respJson) => {
        console.log(respJson);
        if (respJson.success) {
          console.log('register success!')
          this.props.navigation.goBack();
        } else {
          this.setState({
            message: respJson.error
          })
        }
      })
      .catch((err) => {
        console.log('error', err);

      })
    }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>
        <Text>{this.state.message}</Text>
        <TextInput
          style={{height: 40, margin: 10}}
          placeholder="Enter your username"
          onChangeText={(text) => {this.setState({username: text})}}
        />
        <TextInput
          style={{height: 40, margin: 10}}
          placeholder="Enter your password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={() => this.register()}>
          <Text style={styles.buttonLabel}>Submit</Text>
        </TouchableOpacity>
      </View>
    )
  }
};

class UsersScreen extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
    }
    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {"Content-Type": "application/json"}
    })
      .then((resp) => resp.json())
      .then((responseJson) => {
        console.log(responseJson)
        this.setState({
          dataSource: ds.cloneWithRows(responseJson.users)
        })
      })
    };


  goToMessages() {
    this.props.navigation.navigate('Messages');
  }


  static navigationOptions = ({ navigation }) => ({
    title: 'Users',
    headerRight: <Button title='Messages' onPress={ () => {navigation.state.params.onRightPress()} } />
  });

  componentDidMount() {
    this.props.navigation.setParams({
      onRightPress: this.goToMessages.bind(this)
    })
  }

  touchUser(user) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        to: user._id
      })
    })
      .then((resp) => resp.json())
      .then((responseJson) => {
        if (responseJson.success) {
          Alert.alert(
          'Success',
          'Your hohoho to ' + user.username + ' was sent!',
          [{text: 'Dismiss Button'}] // Button
          )
        } else {
          Alert.alert(
          'Error',
          'Your hohoho to ' + user.username + ' was not sent!',
          [{text: 'Dismiss Button'}] // Button
          )
        }
      })
      .catch((error) => {
        console.log('error', error)
      })


  }

  render() {
    return (
      <View style={{display:'flex', flexDirection: 'column', justifyContent:'center'}}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <View style={{alignItems: 'center', justifyContent: 'center', margin: 10 }}>
            <TouchableOpacity onPress={this.touchUser.bind(this, rowData)}>
              <Text>{rowData.username}</Text></TouchableOpacity>
          </View>}/>
      </View>
    )
  }
}

class MessagesScreen extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
    }
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET',
      headers: {"Content-Type": "application/json"}
    })
      .then((resp) => resp.json())
      .then((responseJson) => {
        console.log(responseJson)
        this.setState({
          dataSource: ds.cloneWithRows(responseJson.messages)
        })
      })
  };

  static navigationOptions = {
    title: 'Messages'
  };


  render() {
    return (
      <View style={{display:'flex', flexDirection: 'row', justifyContent:'center'}}>
        <ListView style={{flex: 1}}
          dataSource={this.state.dataSource}
          renderRow={(rowData) =>
            <View style={{margin: 10}}>
              <Text>From: {rowData.from.username}</Text>
              <Text>To: {rowData.to.username}</Text>
              <Text>Message: {rowData.body}</Text>
              <Text>Time: {rowData.timestamp}</Text>
            </View>
          }/>
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
