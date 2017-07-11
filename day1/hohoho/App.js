import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ListView,
  Alert,
  Button,
  RefreshControl,
  AsyncStorage
} from 'react-native';
import { StackNavigator } from 'react-navigation';



//Screens
class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login'
  };
  constructor() {
    super();
    this.state= {
      username:'',
      password:'',
      message:''
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('user')
    .then(result => {
      var parsedResult = JSON.parse(result);
      var username = parsedResult.username;
      var password = parsedResult.password;
      if (username && password) {
        this.setState({
          username: username,
          password: password
        });
        return this.press();
      }
    })
    .catch(err => {console.log(err)}

  )}

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
      /* do something with responseJson and go back to the Login view but
      * make sure to check for responseJson.success! */
      //  console.log(responseJson.success)
      if (responseJson.success) {
        this.props.navigation.navigate('Users');
        AsyncStorage.setItem('user', JSON.stringify({
          username: this.state.username,
          password: this.state.password
        }));
      } else {
        this.setState({message: "Login Error"})
      }
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log('Error', err)
    });
  }

  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <Text>{this.state.message}</Text>
        <TextInput style={{padding: 10, height: 40}}
          placeholder="Enter your username"
          onChangeText={(text)=> this.setState({username: text})}
        />
        <TextInput style={{padding: 10, height: 40}}
          placeholder="Enter password"
          secureTextEntry={true} onChangeText={(text)=> this.setState({password: text})}
        />
        <TouchableOpacity onPress={ () => {this.press()} } style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Tap to Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={() => {this.register()}}>
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
  constructor() {
    super();
    this.state= {};
  }
  registerSubmit() {
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
      //  console.log(responseJson.success)
      if (responseJson.success) {
        this.props.navigation.navigate('Login');
      }
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log('Error', err)
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>
        <TextInput style={{padding: 10, height: 40}}
          placeholder="Enter your username"
          onChangeText={(text)=> this.setState({username: text})}
        />
        <TextInput style={{padding: 10, height: 40}}
          placeholder="Enter password"
          secureTextEntry={true} onChangeText={(text)=> this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={()=> {this.registerSubmit()}}>
          <Text style={styles.buttonLabel}>Submit</Text>
        </TouchableOpacity>
      </View>
    )
  }
}






class UsersScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Users',
    headerRight: <Button
      title='Messages'
      onPress={ () => {navigation.state.params.onRightPress()}}
    />
  });
  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      onRightPress: this.messages.bind(this)
    })

    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET'
    })
    .then((response) => response.json())
    .then((responseJson) => {
      /* do something with responseJson and go back to the Login view but
      * make sure to check for responseJson.success! */
      if (responseJson.success) {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({dataSource: ds.cloneWithRows(responseJson.users)})
      }
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log('Error', err)
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
      //  console.log(responseJson.success)
      if (responseJson.success) {
        Alert.alert("Alert", "Your HoHoHo! to " + user.username + " has been sent!", [{text: 'Dismiss Button'}])
      } else {
        Alert.alert("Alert", "XXX Your HoHoHo! to " + user.username + " could not be sent. XXX", [{text: 'Dismiss Button'}])
      }
    })
    .catch((err) => {
      console.log('Error', err)
    });
  }

  messages() {
    this.props.navigation.navigate('Messages');
  }

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
  static navigationOptions = {
    title: 'Messages'
  };
  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([{to: {username: "loading messages..."}, body: "loading messages...", from: {username: "loading messages..."}}]),
      refreshing: false
    };
  }

  componentDidMount() {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET'
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({dataSource: ds.cloneWithRows(responseJson.messages)});
      }
    })
    .catch((err) => {
      console.log('Error', err)
    });
  }

  _onRefresh() {
    this.setState({refreshing: true});
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET'
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        console.log("getting the deets");
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        console.log(ds);
        this.setState({dataSource: ds.cloneWithRows(responseJson.messages)});
        console.log("data source has been set");
        this.setState({refreshing: false})
      }
    })
    .catch((err) => {
      console.log('Error', err)
    });
  }

  render() {
    return (
      <View>
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <TouchableOpacity><Text>To: {rowData.to.username} Message: {rowData.body} From: {rowData.from.username} time: {rowData.timestamp}</Text></TouchableOpacity>}
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
