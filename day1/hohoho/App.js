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
    super()
    this.state = {
      username: '',
      password: '',
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
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        // alert(`Welcome ${responseJson.user.username}!`);
        this.props.navigation.navigate('Users');
      } else {
        alert(responseJson.error);
      }
    })
    .catch((err) => {
      alert('There seems to have been a problem. Pls contact the devs... bro.')
      console.log('ERROR', err);
    });
  }
  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        {/* Login Fields */}
        <TextInput style={styles.input} placeholder="Enter your username" onChangeText={text => this.setState({username: text})} />
        <TextInput style={styles.input} secureTextEntry={true} placeholder="Enter your password" onChangeText={text => this.setState({password: text})} />
        <TouchableOpacity onPress={ () => {this.press()} } style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
        {/* Registration Button */}
        <Text style={{marginTop: 20}}>Don't have an account?</Text>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.register()} }>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class RegisterScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      username: '',
      password: '',
    }
  }

  static navigationOptions = {
    title: 'Register'
  };

  press() {
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
      if (responseJson.success) {
        this.props.navigation.navigate('Login');
      } else {
        alert(responseJson.error);
      }
    })
    .catch((err) => {
      alert('There seems to have been a problem. Pls contact the devs... bro.')
      console.log('ERROR', err);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput style={styles.input} placeholder="Enter your username" onChangeText={text => this.setState({username: text})} />
        <TextInput style={styles.input} secureTextEntry={true} placeholder="Enter your password" onChangeText={text => this.setState({password: text})} />
        <Button title="register" onPress={() => this.press()} />
      </View>
    )
  }
}

class UsersScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      dataSource: [],
    }
  }

  static navigationOptions = {
    title: 'Users'
  }

  componentWillMount() {
    fetch('https://hohoho-backend.herokuapp.com/users')
    .then(resp => resp.json())
    .then(respJson => {
      if (respJson.success) {
        this.setState({dataSource: respJson.users})
      }
    })
    .catch(err => {
      alert('There seems to have been a problem. Pls contact the devs... bro.')
      console.log('ERROR', err);
    })
  }

  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return (
      <View>
        <ListView
          dataSource={ds.cloneWithRows(this.state.dataSource)}
          renderRow={(rowData) => <Text style={styles.textBig}>{rowData.username}</Text>}
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
  input: {
    height: 40,
    width: 300,
    paddingLeft: 5,
  }
});
