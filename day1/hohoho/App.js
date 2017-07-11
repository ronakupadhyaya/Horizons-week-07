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

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home'
  };

  login() {
    this.props.navigation.navigate('Login')
  }

  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>HoHoHo!</Text>
        <TouchableOpacity onPress={ () => {this.login()} } style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Tap to Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.register()} }>
          <Text style={styles.buttonLabel}>Tap to Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

//Screens
class LoginScreen extends React.Component {
  constructor(){
    super()
    this.state={
      username: '',
      password: ''
    }
  }

  static navigationOptions = {
    title: 'Login'
  };

  login(){
    if(this.state.username.trim() === ''){
      alert('enter a username!')
    }
    if(this.state.password.trim() === ''){
      alert('enter a password!')
    }

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
      if(responseJson.success){

        this.props.navigation.navigate('Users')
        console.log('here');
      } else {
        alert(responseJson.error)
      }
    })
    .catch((err) => {
      console.log('Error', err);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <TextInput
          style={{height: 40, paddingLeft: 100, paddingRight: 80}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{height: 40, paddingLeft: 100, paddingRight: 80}}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
          secureTextEntry={true}
        />
        <TouchableOpacity onPress={this.login.bind(this)} style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Tap to Login</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class RegisterScreen extends React.Component {
  constructor(){
    super()
    this.state={
      username: '',
      password: ''
    }
  }

  static navigationOptions = {
    title: 'Register'
  };

  register() {
    if(this.state.username.trim() === ''){
      alert('enter a username!')
    }
    if(this.state.password.trim() === ''){
      alert('enter a password!')
    }

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
      this.props.navigation.navigate('Login')
    })
    .catch((err) => {
      console.log('Error', err);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register to HoHoHo!</Text>
        <TextInput
          style={{height: 40, paddingLeft: 100, paddingRight: 80}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{height: 40, paddingLeft: 100, paddingRight: 80}}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
          secureTextEntry={true}
        />
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.register.bind(this)} }>
          <Text style={styles.buttonLabel}>Tap to Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class UsersScreen extends React.Component {
  constructor(){
    super();
    this.state = {
      users: []
    }
  }

  static navigationOptions = {
    title: 'Users'
  }

  componentDidMount() {
    fetch('https://hohoho-backend.herokuapp.com/users')
    .then((resp) => resp.json())
    .then((respJson) => {
      if(respJson.success){
        this.setState({
          users: respJson.users
        })
      } else {
        alert(respJson.error)
      }
    })
    .catch((err) => {
      console.log('Error', err);
    })

  }

  render() {
    var dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => (r1._id !== r2._id)
    })
    return (
      <View style={styles.container}>
        <ListView
          renderRow={(user) => (
            <View style={[styles.center, styles.box]}>
              <Text>{user.username}</Text>
            </View>
          )}
          dataSource={dataSource.cloneWithRows(this.state.users)}
        />
      </View>
    );
  }
}

//Navigator
export default StackNavigator({
  Home: {
    screen: HomeScreen,
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
}, {initialRouteName: 'Home'});


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
  center: {
    textAlign: 'center',
    justifyContent: 'center'
  },
  box: {
    borderStyle: 'solid'
  }

});
