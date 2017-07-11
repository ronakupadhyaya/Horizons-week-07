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
import {
  Location,
  Permissions,
  MapView
} from 'expo';
import Swiper from 'react-native-swiper';

class SwiperScreen extends React.Component {
  static navigationOptions = {
    title: 'HoHoHo!'
  };

  render() {
    return (
      <Swiper>
        <UsersScreen/>
        <MessagesScreen/>
      </Swiper>
    );
  }
}

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

  componentDidMount() {
    AsyncStorage.getItem('user')
    .then(result => {
      const parsedResult = JSON.parse(result);
      this.setState({
        username: parsedResult.username,
        password: parsedResult.password
      });
      this.checkCredential()
      .then((responseJson) => {
          if(responseJson.success) {
            this.props.navigation.navigate('Swiper');
          }
          })
      })
    .catch(err => {console.log("Error in Persistent Login!",err);})
  };

  toUserScreen() {
      this.checkCredential()
      .then((responseJson) => {
          if(responseJson.success) {
            AsyncStorage.setItem('user',JSON.stringify({
              username: this.state.username,
              password: this.state.password,
            }))
            .then(()=>{this.props.navigation.navigate('Swiper');})
          } else {
            alert("Login failed!")
          }
      })
      .catch((e)=>{
          console.log("Login Error: ", e)
      })
  }

  checkCredential() {
    return fetch('https://hohoho-backend.herokuapp.com/login',{
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
    .catch((e)=>{console.log("Error Check Credential! ", e);});
  };

  toRegister() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <TextInput
        style={{height: 40, margin:10}}
        placeholder="Username"
        onChangeText={(username) => this.setState({username})}
        />
        <TextInput
          secureTextEntry={true}
          style={{height: 40, margin:10}}
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
           if(responseJson.success) {
               this.toLogin().bind(this);
           } else {
               alert("Registration failed!")
           }
        })
        .catch((err) => {
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
  };

  sendLocation = async(user) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      console.log("permission to send location not granted!");
    }
    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
    fetch('https://hohoho-backend.herokuapp.com/messages',{
        method:'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: user._id,
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude
          }
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
         if(responseJson.success) {
             Alert.alert("Success","Your Hohoho & Location to "+user.username+" has been sent!", [{text: 'Got it'}])
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
      <View style={styles.containerFull}>
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          renderRow={(item)=>(
            <View style={{padding:4, borderWidth:1, borderColor:"lightgrey"}}>
              <TouchableOpacity
                onPress={this.hohohoTo.bind(this,item)}
                onLongPress={this.sendLocation.bind(this,item)}
                delayLongPress={400}>
                  <Text style={{fontSize:20}}>{item.username}</Text>
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
        <View style={styles.containerFull}>
          <ListView
            renderRow={(item)=>(
            <View style={{flex: 1,flexDirection:'column', borderBottomWidth: 1, borderColor: "lightgrey"}}>
              <View style={{flex:1, padding: 3, flexDirection:'column', justifyContent:'flex-start', alignItems:'flex-start'}}>
                <Text style={{fontSize:10}}>From: {item.from.username}</Text>
                <Text style={{fontSize:10}}>To: {item.to.username}</Text>
                <Text style={{fontSize:10}}>Message: {item.body}</Text>
                <Text style={{fontSize:10}}>When: {item.timestamp}</Text>
              </View>
              <MapView
                style={{height:50}}
                showsUserLocation={true}
                scrollEnabled={false}
                region={
                  {
                  longitude: (item.location)?item.location.longitude:-122.409604,
                  latitude: (item.location)?item.location.latitude:37.771631,
                  longitudeDelta: 0.05,
                  latitudeDelta: 0.05
                }
              }
              />
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
  },
  Swiper: {
    screen: SwiperScreen
  }
}, {initialRouteName: 'Login'});


//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
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
