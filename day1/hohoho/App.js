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
  RefreshControl
} from 'react-native';
import { StackNavigator } from 'react-navigation';


//Screens
class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }

  static navigationOptions = {
    title: 'Login'
  };

  toUserScreen() {
      fetch('https://hohoho-backend.herokuapp.com/login',{
          method:'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: this.state.username,
            password: this.state.password,
          })
        })
      .then((response) => {
        return response.json()})
      .then((responseJson) => {
          if(responseJson.success) {
            this.props.navigation.navigate('Users');
          } else {
            alert("Login failed!")
          }
      })
      .catch((e)=>{
          console.log("Login Error: ", e)
      })
  }

  toRegister() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <TextInput
        style={{height: 40}}
        placeholder="Username"
        onChangeText={(username) => this.setState({username})}
        />
        <TextInput
          secureTextEntry={true}
          style={{height: 40}}
          placeholder="Password"
          onChangeText={(password) => this.setState({password})}
        />
        <TouchableOpacity onPress={ () => {this.toUserScreen()} } style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.toRegister()} }>
          <Text style={styles.buttonLabel}>Register New Account</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class RegisterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        username: '',
        password: ''
    };
  };

  static navigationOptions = {
    title: 'Register'
  };

  toLogin () {
      this.props.navigation.navigate('Login');
  }

  register () {
      fetch('https://hohoho-backend.herokuapp.com/register',{
          method:'POST',
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
           if(responseJson.success) {
               this.toLogin().bind(this);
           } else {
               alert("Registration failed!")
           }
        })
        .catch((err) => {
          /* do something if there was an error with fetching */
          console.log("Registration Error: ", err)
        });
  }

  render() {
    return (
      <View style={styles.container}>
          <TextInput
          style={{height: 40}}
          placeholder="Username"
          onChangeText={(username) => this.setState({username})}
        />
        <TextInput
        secureTextEntry={true}
        style={{height: 40}}
        placeholder="Password"
        onChangeText={(password) => this.setState({password})}
      />
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={() => {this.register();}}>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class UsersScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      refreshing: false
      };
  };

  static navigationOptions = (props) => ({
    title: 'Users',
    headerRight: <TouchableOpacity onPress={()=>{props.navigation.navigate('Messages')}}><Text>Messages</Text></TouchableOpacity>
  });

  fetchData () {
    return fetch('https://hohoho-backend.herokuapp.com/users')
      .then((response) => response.json())
      .then((responseJson) => {
         if(responseJson.success) {
             this.setState({userList: responseJson.users})
         } else {
            console.log("responseJson: ",responseJson)
             alert("Failed to get users!")
         }
      })
      .catch((err) => {
        console.log("Users List Error: ", err)
      });
  };

  _onRefresh() {
   this.setState({refreshing: true});
   this.fetchData().then(() => {
     this.setState({refreshing: false});
   });
 };

  componentDidMount () {
    this.fetchData();
  };

  hohohoTo(user) {
    fetch('https://hohoho-backend.herokuapp.com/messages',{
        method:'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: user._id
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
         if(responseJson.success) {
             Alert.alert("Success","Your Hohoho to "+user.username+" has been sent!", [{text: 'Got it'}])
         } else {
             alert("Failed to Hohoho!")
         }
      })
      .catch((err) => {
        console.log("Hohoho Error: ", err)
      });
  }

  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return (
      <View style={styles.container}>
        <Text style={{fontSize:20}}>Users List</Text>
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          renderRow={(item)=>(
            <View style={{flex:1, alignItems:'center'}}>
              <TouchableOpacity onPress={this.hohohoTo.bind(this,item)} style={styles.button}>
                  <Text style={{fontSize:15}}>{item.username}</Text>
              </TouchableOpacity>
          </View>
        )}
          dataSource={ds.cloneWithRows(this.state.userList)}>
        </ListView>
      </View>
    )
  }
};

class MessagesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messageList: []
      };
  };

  static navigationOptions = {
    title: 'Messages',
  };

  componentDidMount () {
    fetch('https://hohoho-backend.herokuapp.com/messages')
      .then((response) => response.json())
      .then((responseJson) => {
         if(responseJson.success) {
             this.setState({messageList: responseJson.messages})
         } else {
            console.log("responseJson: ",responseJson)
             alert("Failed to get messages!")
         }
      })
      .catch((err) => {
        console.log("Messages Error: ", err)
      });
    };

    render() {
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      return (
        <View style={styles.container}>
          <Text style={{fontSize:20}}>Messages List</Text>
          <ListView
            renderRow={(item)=>(
            <View style={{flex:1, flexDirection:'column', alignItems:'center', borderBottomWidth: 1, borderBottomWidth: 1, borderColor: "grey"}}>
              <Text style={{fontSize:10}}>From: {item.from.username}</Text>
              <Text style={{fontSize:10}}>To: {item.to.username}</Text>
              <Text style={{fontSize:10}}>Message: {item.body}</Text>
              <Text style={{fontSize:10}}>When: {item.timestamp}</Text>
            </View>
          )}
            dataSource={ds.cloneWithRows(this.state.messageList)}>
          </ListView>
        </View>
      );
    };
  };


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
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    margin: 20
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
