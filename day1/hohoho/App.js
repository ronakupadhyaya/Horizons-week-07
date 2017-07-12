import React from 'react';
import {
  AsyncStorage,
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
import { Location, Permissions,MapView } from 'expo';
import Swiper from 'react-native-swiper'


//Screens
class HomeScreen extends React.Component{
  static navigationOptions = {
    title: 'Home'
  };

  register() {
    this.props.navigation.navigate('Register');
  }

  login() {
    this.props.navigation.navigate('Login');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
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

class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login'
  };

  constructor(){
    super();
    this.state={
      username: '',
      password: '',
      message:''
    }
    this.press = this.press.bind(this);
  }

  componentDidMount(){
    AsyncStorage.getItem('user')
    .then((result)=>{
      this.setState({username:JSON.parse(result).username,password:JSON.parse(result).password});
      this.press()
    })
  }

  press(){
    var user = {
      username: this.state.username,
      password: this.state.password,
    }
    fetch('https://hohoho-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    })
    .then((response) => response.json())
    .then((responseJson) => {
      /* do something with responseJson and go back to the Login view but
      * make sure to check for responseJson.success! */
      console.log(responseJson);
      if (responseJson.success){
        AsyncStorage.setItem('user',JSON.stringify(user));
        this.props.navigation.navigate('Swipe')
      }
      else{
        this.setState({message:'failed to login'})
      }
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log('error', err);
    });

}


  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={{height: 40,padding:10}}
          placeholder="Username"
          onChangeText={(text) => this.setState({username: text})}
          value={this.state.username}
        />
        <TextInput
          style={{height: 40,padding:10}}
          placeholder="Password"
          onChangeText={(text) => this.setState({password: text})}
          value={this.state.password}
          secureTextEntry={true}
        />
        <Text>{this.state.message}</Text>

        <TouchableOpacity onPress={this.press} style={[styles.button, styles.buttonRed]}>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>

      </View>

    )
  }
}




class RegisterScreen extends React.Component {
  static navigationOptions = {
    title: 'Register'
  }

  constructor() {
    super();
    this.state={
      username:'',
      password:''
    }
  }

  press() {
    if (this.state.username.trim().length>0 && this.state.password.trim().length>0){
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
        if(responseJson.success) {
          this.props.navigation.navigate('Login')
        } else {
          console.log(responseJson);
        }
        /* do something with responseJson and go back to the Login view but
        * make sure to check for responseJson.success! */

      })
      .catch((err) => {
        /* do something if there was an error with fetching */
        console.log('error', err);
      });
    }
    }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={{height: 40, padding:10}}
          placeholder="Username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{height: 40,padding:10}}
          placeholder="Password"
          onChangeText={(text) => this.setState({password: text})}
        />

        <TouchableOpacity onPress={this.press.bind(this)} style={[styles.button, styles.buttonRed]}>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>

      </View>
    )
  }
}


class UsersScreen extends React.Component {
  //navigationOptions code
  static navigationOptions = ({navigation}) => ({
    title: 'Users', //you put the title you want to be displayed here
    // headerRight: <TouchableOpacity onPress={()=>navigation.navigate('Messages')}><Text>Messages</Text></TouchableOpacity>
  });
  constructor(props) {
    super(props);
    this.state = {
      arr:[],
      location:{
        latitude:0,
        longitude:0
      }
    };
    this.touchUser = this.touchUser.bind(this);
  }

  componentDidMount(){
    fetch("https://hohoho-backend.herokuapp.com/users",{
      method:'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then((response) => response.json())
    .then((responseJson)=>{
      if (responseJson.success){
        this.setState({arr: responseJson.users})
      }
    })
    .catch((err)=>{
      console.log('error',err);
    })
  }

  touchUser(user){
    fetch("https://hohoho-backend.herokuapp.com/messages",{
      method:'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: user._id,
      })
    })
    .then((response) => response.json())
    .then((responseJson)=>{
      if (responseJson.success){
        Alert.alert(
        'Alert successful',
        'Your message to '+user.username+ ' has been sent',
        [{text: 'Dismiss Button'}] // Button
      )}
      else{
        Alert.alert(
        'Alert failed',
        'Your message to '+user.username+ ' could not be sent',
        [{text: 'Dismiss Button'}] // Button
      )
      }
    })
    .catch((err)=>{
      console.log('error',err);
    })
  }

  sendLocation = async(user) =>{
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      //handle failure
    }
    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
    this.longTouchUser(user,location)

  }

  longTouchUser(user,location){
    fetch("https://hohoho-backend.herokuapp.com/messages",{
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
    .then((responseJson)=>{
      console.log(responseJson);
      if (responseJson.success){
        Alert.alert(
        'Location shared successful',
        'Your location to '+user.username+ ' has been sent',
        [{text: 'Dismiss Button'}] // Button
      )
      console.log(responseJson);
    }
      else{
        Alert.alert(
        'Failed to share location',
        'Your location to '+user.username+ ' could not be sent',
        [{text: 'Dismiss Button'}] // Button
      )
      }
    })
    .catch((err)=>{
      console.log('error',err);
    })
  }

  render(){
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return(
      <ListView
        dataSource={ds.cloneWithRows(this.state.arr)}
        renderRow={(user) =>
          <View>
            <TouchableOpacity onPress={() => this.touchUser(user)}
                onLongPress={()=>this.sendLocation(user)}
                delayLongPress={1000}>
                <Text style={{textAlign:'center',borderWidth:0.5,borderColor:'lightgrey',fontSize:20,padding:5}}>
                  {user.username}
                </Text>
            </TouchableOpacity>
          </View>
        }
      />
    )
  }
}

class MessagesScreen extends React.Component {
  static navigationOptions = {
  title: 'Messages' //you put the title you want to be displayed here
  };
  constructor(props) {
    super(props);
    this.state = {
      messages:[]
    };
  }

  componentDidMount(){
    fetch("https://hohoho-backend.herokuapp.com/messages",{
      method:'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then((response) => response.json())
    .then((responseJson)=>{
      if (responseJson.success){
        console.log(responseJson);
        this.setState({messages: responseJson.messages})
      }
    })
    .catch((err)=>{
      console.log('error',err);
    })
  }


  render(){
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return(
      <ListView
        dataSource={ds.cloneWithRows(this.state.messages)}
        renderRow={(message)=>
          <View>
            <Text>From {message.from.username}</Text>
            <Text>To {message.to.username}</Text>
            <Text>Message: Yo</Text>
            <Text>When {message.timestamp}</Text>
            <MapView
              style={{height:100, width:400}}
              showsUserLocation={true}
              scrollEnabled={false}
              region={{
                longitude: message.location.longitude,
                latitude: message.location.latitude,
                longitudeDelta: 1,
                latitudeDelta: 1
              }}
            />
          </View>
        }
      />

    )
  }
}


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

//Navigator
export default StackNavigator({
  Home:{
    screen: HomeScreen,
  },
  Login: {
    screen: LoginScreen,
  },
  Swipe:{
    screen: SwiperScreen,
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
}, {initialRouteName: 'Home'});


//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding:5
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
