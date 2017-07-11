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
    title: 'Login'
  };

  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
      message: ''
    }
  }

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
      /* do something with responseJson and go back to the Login view but
      * make sure to check for responseJson.success! */
      if(responseJson.success){
        this.props.navigation.navigate('Users');
      }else{
        this.setState({message: 'Wrong Password!!!'});
      }
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log(err)
    });
  }
  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <TextInput
          style={styles.registerInput}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          secureTextEntry={true}
          style={styles.registerInput}
          placeholder="Enter your Password"
          onChangeText={(text) => this.setState({password: text})}
        />
        <Text>{this.state.message}</Text>
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

  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: ''
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
        password: this.state.password
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      /* do something with responseJson and go back to the Login view but
      * make sure to check for responseJson.success! */
      if(responseJson.success){
        this.props.navigation.goBack();
      }
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log(err)
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.registerInput}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          secureTextEntry={true}
          style={styles.registerInput}
          placeholder="Enter your Password"
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonOrange]} onPress={this.register.bind(this) }>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}











class UsersScreen extends React.Component {
  static navigationOptions = {
    title: 'Users'
  };

  touchUser(user) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: user.id
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      Alert.alert(
        'Success',
        'Your HoHoHo to ' + user.username + ' has been sent.',
        [{text: 'Dismiss Button'}] // Button
      )
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log(err)
    });

  }

  messages(){
    this.props.navigation.navigate('Messages');
  }

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([
        'Moose', 'Corey', 'Allie', 'Jay', 'Graham', 'Darwish', 'Abhi Fitness'
      ])
    };
    fetch('https://hohoho-backend.herokuapp.com/users')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        dataSource: ds.cloneWithRows(responseJson.users)
        });
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log(err)
    });
  }


  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) =>
            <TouchableOpacity onPress={this.touchUser.bind(this, rowData) }>
                <Text>{rowData.username}</Text>
            </TouchableOpacity>
        }/>
        <TouchableOpacity style={[styles.button, styles.buttonOrange]} onPress={this.messages.bind(this) }>
          <Text style={styles.buttonLabel}>Messages</Text>
        </TouchableOpacity>
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
    this.state = {
      dataSource: ds.cloneWithRows([
        'Moose', 'Corey', 'Allie', 'Jay', 'Graham', 'Darwish', 'Abhi Fitness'
      ])
    };
    fetch('https://hohoho-backend.herokuapp.com/messages')
    .then((response) => response.json())
    .then((responseJson) => {
      console.log('lmaoooooooooooooooo')
      console.log(responseJson)
      this.setState({
        dataSource: ds.cloneWithRows(responseJson.users)
        });
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log(err)
    });
  }


  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(aMessage) =>
                <View>
                <Text>{aMessage.from.username}</Text>
                <Text>{aMessage.to.username}</Text>
                <Text>{aMessage.timestamp}</Text>
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
    screen: UsersScreen,
  },
  Messages: {
    screen: MessagesScreen,
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
    marginLeft: 85,
    marginRight: 5,
    borderRadius: 5,
    width: 200
  },
  buttonRed: {
    backgroundColor: '#FF585B',
  },
  buttonBlue: {
    backgroundColor: '#0074D9',
  },
  buttonOrange: {
    backgroundColor: '#FF5733',
  },
  buttonGreen: {
    backgroundColor: '#2ECC40'
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  },
  registerInput: {
    height: 40,
    borderWidth: 1,
    marginBottom: 10,
    borderColor: 'gray',
    marginLeft: 85,
    width: 200
  }
});
