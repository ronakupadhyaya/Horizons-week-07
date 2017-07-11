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
// class Login extends React.Component {
//
// }

class LoginScreen extends React.Component {
  // constructor (props) {
  //   super(props);
  //   this.state = {
  //     username: "",
  //     password: ""
  //   }
  // }

  static navigationOptions = {
    title: 'Login'
  };

  constructor(props) {
    super(props);
    this.state = {
      error: ""
    };
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
      /* do something with responseJson and go back to the Login view but
      * make sure to check for responseJson.success! */
      if(responseJson.success){
        this.props.navigation.navigate('UsersList', {username: this.state.username, password: this.state.password});
      } else{
        this.setState({error: 'Failed to login'})
      }
      console.log("Success was " + responseJson.success);
    })
    .catch((err) => {
      console.log("The error was: ", err);
    })
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
          style={{height: 40, color:'black', textAlign:'center'}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{height: 40, color:'black', textAlign:'center'}}
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

  press() {
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
      console.log("Success was " + responseJson.success);

    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log("Error: ", err);
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>
        <TextInput
          style={{width: 200, height: 40, color:'black', textAlign:'center'}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{width: 200, height: 40, color:'black', textAlign:'center'}}
          placeholder="Enter your password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({password: text})}
        />
      <TouchableOpacity onPress = {() => {this.press()}} style = {[styles.button, styles.buttonBlue]}>


        <Text style={styles.buttonBlue}>Register</Text>
      </TouchableOpacity>
    </View>
    );
  }
}


class UsersScreen extends React.Component {
  static navigationOptions = {
    title: 'Users List'
  };

  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
  }

  componentDidMount() {
    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log('result', responseJson);

      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.setState({
        dataSource: ds.cloneWithRows(responseJson.users)
      })
    })
    .catch((err) => {
      console.log('error: ', err);
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
      /* do something with responseJson and go back to the Login view but
      * make sure to check for responseJson.success! */
      if(responseJson.success){
        // Alert.alert(
        //   'Success',
        //   `3 Ho's have been sent to ${user.username}.`,
        //   [{text: 'Awesome Sauce'}]
        // )
        this.props.navigation.navigate('Messages',{username: this.props.navigation.state.params.username ,
          password: this.props.navigation.state.params.password})
      } else{
        Alert.alert(
          'Fail',
          `Your Ho's failed to be delivered to ${user.username}.`,
          [{text: 'Okay'}]
        )
      }
      console.log("Success was " + responseJson.success);

    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log("Error: ", err);
    })
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) =>
                  <TouchableOpacity onPress={this.touchUser.bind(this,rowData)}>
                    <Text>{rowData.username}</Text>
                  </TouchableOpacity>
                  }
      />
    )
  }
}

class Messages extends React.Component {
  static navigationOptions = {
    title: "Them DM's"
  };

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
  }

  componentDidMount() {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET'
    })
    .then((resp) => (resp.json()))
    .then((json) => {
      console.log('Json is ', json);
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.setState({
        dataSource: ds.cloneWithRows(json.messages)
      })
    })
    .catch((err) => {
      console.log("Error: ", err);
    })
  }

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
  // LoginContainer: {
  //   screen: LoginContainer,
  // },
  UsersList: {
    screen: UsersScreen,
  },
  Messages: {
    screen: Messages,
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
