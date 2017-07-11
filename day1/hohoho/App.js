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

constructor() {
  super()
  this.state = {
    error: ""
  }
}

  press() {
    fetch('https://hohoho-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: 'theValueOfTheUsernameState',
        password: 'theValueOfThePasswordState',
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.success) {
        this.props.navigation.navigate('UsersList');
      } else {
        this.setState({error: 'Failed to login'})
      }
    })
    .catch((err) => {
      console.log('error: ', err)
    });
  }
  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>

        <Text>{this.state.error}</Text>

        <TextInput
          style={{width: 200, height: 40}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />

        <TextInput
          style={{width: 200, height: 40}}
          placeholder="Enter your password"
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
        username: 'theValueOfTheUsernameState',
        password: 'theValueOfThePasswordState',
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log('result', responseJson);
      this.props.navigation.goBack();
    })
    .catch((err) => {
      console.log('error: ', err)
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>

        <TextInput
          style={{width: 200, height: 40}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />

        <TextInput
          style={{width: 200, height: 40}}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
        />

        <TouchableOpacity style={styles.button, styles.buttonBlue} onPress={() => this.press()}>
          <Text>Tap to register!</Text>
        </TouchableOpacity>

      </View>

    )
  }
}

class UsersScreen extends React.Component {
  static navigationOptions = {
    title: "Users"
  };

  constructor(props) {
  super(props);

  const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
    dataSource: ds.cloneWithRows([])
    };

  fetch('https://hohoho-backend.herokuapp.com/users', {
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    },
  })
  .then((response) => response.json())
  .then((responseJson) => {
    console.log('result', responseJson);
    this.setState({
      dataSource: ds.cloneWithRows(responseJson.users)
    })
  })
  .catch((err) => {
    console.log('error: ', err)
  });

}



  render() {
    return (
      <ListView
      dataSource={this.state.dataSource}
      renderRow={(rowData) => <Text>{rowData.username}</Text>}
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
  UsersList: {
    screen: UsersScreen,
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
