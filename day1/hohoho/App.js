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
      password: '',
      errorMsg: ''
    }
  }

  static navigationOptions = {
    title: 'Login'
  };

  press() {
    if (this.state.username.trim() && this.state.password.trim()) {
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
          this.props.navigation.navigate('Users');
        }
        this.setState({errorMsg: responseJson.error});
      })
      .catch((err) => {
        /* do something if there was an error with fetching */
        console.log('error', err.error);
        alert('Error: ' + err.error);
      });
    }
  }

  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(username) => this.setState({username})}
          value={this.state.username}
          placeholder='username'
        />
        <TextInput
          style={styles.textInput}
          onChangeText={(password) => this.setState({password})}
          value={this.state.password}
          placeholder='password'
          secureTextEntry={true}
        />
        <Text style={{color: 'red'}}>{this.state.errorMsg}</Text>
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
  static navigationOptions = {
    title: 'Register'
  };

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
  }

  register() {
    if (this.state.username.trim() && this.state.password.trim()) {
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
        if (responseJson.success) {
          this.props.navigation.goBack();
        }
      })
      .catch((err) => {
        /* do something if there was an error with fetching */
        console.log('error:', err);
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          onChangeText={(username) => this.setState({username})}
          value={this.state.username}
          placeholder='username'
        />
        <TextInput
          style={styles.textInput}
          onChangeText={(password) => this.setState({password})}
          value={this.state.password}
          placeholder='password'
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.registerButton} onPress={this.register.bind(this)}>
          <Text style={styles.textBig}>Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class UsersScreen extends React.Component {
  static navigationOptions = (props) => ({
    title: 'Users',
    headerRight: <Button
              title='Messages'
              onPress={() => props.navigation.navigate('Messages')}
            />
  });

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let arr = ['No Friends Added :('];
    this.state = {
      dataSource: ds.cloneWithRows(arr)
    }
    fetch('https://hohoho-backend.herokuapp.com/users')
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        this.setState({dataSource: ds.cloneWithRows(responseJson.users)});
      }
    })
    .catch((err) => {
      console.log('error:', err);
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
      if (responseJson.success) {
        Alert.alert(
          'Success!',
          'Your HoHoHo to ' + user.username + ' has been sent ',
          [{text: 'Cool'}] // Button
        )
      } else {
        Alert.alert(
          'Error!',
          'Your HoHoHo to' + user.username + 'could not be sent ',
          [{text: 'Darn'}] // Button
        )
      }
    })
    .catch((err) => {
      console.log('error:', err);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <TouchableOpacity onPress={this.touchUser.bind(this, rowData)}><Text>{rowData.username}</Text></TouchableOpacity>}
        />
      </View>
    )
  }
}

class MessagesScreen extends React.Component {
  static navigationOptions = {
    title: 'Messages'
  };

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let arr = [{from: {username: 'No Messages :('}, to: {username: 'hi'}, timeStamp: 'hello'}];
    this.state = {
      dataSource: ds.cloneWithRows(arr)
    }
  }

 componentDidMount(){
      fetch('https://hohoho-backend.herokuapp.com/messages', {
          method: 'GET',
          headers: {
              "Content-Type": "application/json"
          }
      })
      .then((response) => response.json())
      .then((responseJson) => {
          if(!responseJson.success){
              alert("You failed")
          }else{
              const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            //   responseJson.messages.filter((msg) => {msg.to.username === user})
              this.setState({
                  dataSource: ds.cloneWithRows(responseJson.messages)
              })
          }
      })
      .catch((err) => {
          console.log(err)
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(message) => 
            <TouchableOpacity>
              <Text> From: {message.from.username} </Text>
              <Text> To: {message.to.username} </Text>
              <Text> When: {message.timestamp} </Text>
            </TouchableOpacity>}
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
    screen: UsersScreen,
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
  },
  textInput: {
    height: 40, 
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    marginLeft: 87
  },
  registerButton: {
    fontSize: 36,
    textAlign: 'center',
    margin: 10,
    backgroundColor: '#9e42f4',
    borderRadius: 5,
    borderColor: '#9e42f4',
    borderWidth: 1,
    paddingLeft: 30,
    paddingRight: 30
  }
});
