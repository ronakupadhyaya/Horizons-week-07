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
  AsyncStorage
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Location, Permissions, MapView } from 'expo';


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

  componentDidMount() {
    AsyncStorage.getItem('user')
    .then(result => {
      console.log('Result is' + result);
      var parsedResult = JSON.parse(result);
      var username = parsedResult.username;
      var password = parsedResult.password;
      console.log("Username is " + username, "Password is " + password);
      if (username && password) {
        return this.login(username, password)
      }
    })
    .catch(err => (console.log("Error was: ", err)))
  }

  login(username, password) {
    fetch('https://hohoho-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
    .then(resp => resp.json())
    .then((response) => {
      if(response.success) {
        this.setState({username:username, password:password})
        this.props.navigation.navigate('UsersList')
      } else{
        console.log("NOPE");
      }
    })
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
        AsyncStorage.setItem('user', JSON.stringify({
          username: this.state.username,
          password: this.state.password
        }))
        .then(() => (this.props.navigation.navigate('UsersList',
        {username: this.state.username, password: this.state.password})))
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
  static navigationOptions = ({ navigation }) => ({
    title: 'Users List',

    headerRight: <Button title='Messages' onPress={ () => {navigation.navigate('Messages')} } />
  });

  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
  }

  componentDidMount() {
    // this.props.navigation.setParams({
    //   onRightPress: this.props.navigation.navigate('Messages')
    // })
    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      // console.log('result', responseJson);

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
        Alert.alert(
          'Success',
          `3 Ho's have been sent to ${user.username}.`,
          [{text: 'Awesome Sauce'}]
        )
        this.props.navigation.navigate('Messages')
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

  longtouchUser(user,location) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: user._id,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      /* do something with responseJson and go back to the Login view but
      * make sure to check for responseJson.success! */
      console.log(responseJson);
      if(responseJson.success){

        Alert.alert(
          'Success',
          `3 Ho's and location have been sent to ${user.username}.`,
          [{text: 'Awesome Sauce'}]
        )
        this.props.navigation.navigate('Messages');
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

  sendLocation = async(user) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      //handle failure
      console.log('Permission was: ' + status);
    } else{
      let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
      console.log("Location is ", location);
      this.longtouchUser(user,location);
    }
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) => (
          <TouchableOpacity
            onPress={this.touchUser.bind(this,rowData)}
            onLongPress={this.sendLocation.bind(this,rowData)}
            delayLongPress= {3000}
            >
              <Text>{rowData.username}</Text>
            </TouchableOpacity>
          )}
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
            renderRow={(rowData) =>
              <View>
                <Text> From: {rowData.from.username}</Text>
                <Text> To: {rowData.to.username}</Text>
                <Text> Body: {rowData.body}</Text>
                <Text> Time: {rowData.timestamp}</Text>
                {(rowData.location && rowData.location.longitude) ?
                  <View>
                    <Text>Location found</Text>
                    <MapView
                      style={{height: 300, width: 300}}
                      showsUserLocation={true}
                      scrollEnabled={false}
                      region={{
                        longitude: rowData.location.longitude,
                        latitude: rowData.location.latitude,
                        longitudeDelta: 1,
                        latitudeDelta: 1
                      }}
                    />
                  </View>
                  : <Text>Location not found</Text>
                }
              </View>
            }
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
