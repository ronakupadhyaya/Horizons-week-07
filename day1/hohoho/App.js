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
  Button, 
  Navigation
} from 'react-native';
import { 
  StackNavigator, navigation 
} from 'react-navigation';
import {
  MapView,
  Location, 
  Permissions
} from 'expo'; 
import Swiper from 'react-native-swiper'

class SwiperScreen extends React.Component {
  static navigationOptions = {
    title: 'HoHoHo!'
  }; 
  render () {
    return (
      <Swiper>
        UsersScreen 
        MessagesScreen
      </Swiper>  
    )
  }
}

//Screens
class LoginScreen extends React.Component {
  constructor() {
    super(); 
    this.state = {
      username: '', 
      password: '', 
      message: ''
    }
  }
  
  static navigationOptions = {
    title: 'Login'
  };

  login(username, password) {
    fetch('https://hohoho-backend.herokuapp.com/login', {
          method: 'POST', 
          headers: {
              'Content-Type': 'application/json'
          }, 
          body: JSON.stringify({
            username: username, 
            password: password
          })
          })
      .then((response) => response.json())
      .then((resp) => {
        console.log('resp = ', resp)
        if (resp.success === true) {
           return AsyncStorage.setItem('user', JSON.stringify({
            username: username, 
            password: password
          }))
          .then((response) => {
            this.props.navigation.navigate('Swiper')
          })
          .catch((err) => {
            console.log('Error = ', err)
          })
        } 
      })   
      .catch((err) => {
        this.setState({message: err})
      })   
  }

  componentDidMount() {
    AsyncStorage.getItem('user')
    .then((result) => {
      const parsedResult = JSON.parse(result); 
      const username = parsedResult.username; 
      const password = parsedResult.password; 
      if (username && password) {
        this.login(username, password) 
      }
    })
    .catch((err) => {
      console.log('Error = ', err)
    })
  }

  press() {
    if(!this.state.username || !this.state.password) {
      alert('Please enter a username and password.')
    } else {
      this.login(this.state.username, this.state.password)
    }
  }  

  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <Text>{this.state.message}</Text>
        <TextInput 
          style={{height: 40}}
          placeholder="Username" 
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput 
            style={{height: 40}}
            placeholder="Password"
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
  constructor() {
    super(); 
    this.state = {
      username: '', 
      password: ''
    }
  }
  static navigationOptions = {
    title: 'Register'
  };

  register() {
    if (!this.state.username || !this.state.password) {
      alert('Please enter a username and password.')
    } else {
      fetch('https://hohoho-backend.herokuapp.com/register', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({
          username: this.state.username, 
          password: this.state.password
        })
      })
      .then((response) => response.json())
      .then((resp) => {
        console.log('resp = ', resp)
        if (resp.success === true) {
          this.props.navigation.goBack()
        }
      })
      .catch((err) => {
        console.log('Error = ', err)
      })
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>
        <TextInput 
          style={{height: 40}}
          placeholder="Enter your username" 
          onChangeText={(text) => this.setState({username: text})}
        />  
        <TextInput 
          style={{height: 40}}
          placeholder="Enter your password" 
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity style={styles.buttonBlue} onPress={() => this.register()}>
          <Text>Register your account</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class UsersScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Users', 
    headerRight: <Button title='Messages' onPress={ () => { navigation.state.params.onRightPress()} } />
  })    
      

  constructor(props) {
    super(props); 
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}); 
    this.state = {
      dataSource: ds.cloneWithRows([]) 
    }  
  }

   componentDidMount() {
    this.props.navigation.setParams({
      onRightPress: this.messages.bind(this)
    })

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    console.log('flag')
    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((resp) => {
      console.log('Line 169 resp = ', resp); 
      this.setState({
        dataSource: ds.cloneWithRows(resp.users)
      })
    })
    .catch((err) => {
      console.log('Error = ', err)
    })
  }

  touchUser (user, location) {
    console.log('user = ', user)
    if (location) {
      var messageBody = JSON.stringify({
        to: user._id,
        location: location
      })
    } else {
      var messageBody = JSON.stringify({
        to: user._id
      })
    }
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: messageBody
    })
    .then((response) => response.json())
    .then((resp) => {
      if (resp.success === true) {
        console.log('resp = ', resp)
        Alert.alert (
          'Message status:', 
          'Your message was sent to ' + user.username, 
          [{text: 'Sweeeeet'}]
        )
      }
    })
    .catch((err) => {
      Alert.alert(
        'Message status:', 
        'Your Ho Ho Ho! to ' + user.username + ' could not be sent.', 
        [{text: 'Got it'}]
      )
    })
  }

  sendLocation = async(user) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION); 
    if(status !== 'granted') {
      console.log('Failure! : ', status )
    }
    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true}); 
    console.log('location = ', location); 
    const coords = {
      latitude: location.coords.latitude, 
      longitude: location.coords.longitude
    }
    this.touchUser(user, coords); 
  }

  messages() {
    this.props.navigation.navigate('Messages'); 
  }

  render () {
    console.log('this.state = ', this.state)
    return (
      <View>
      <ListView 
        dataSource = {this.state.dataSource} 
        renderRow={(rowData) => 
        <View>
          <TouchableOpacity 
            onPress={this.touchUser.bind(this, rowData, null)}
            onLongPress={this.sendLocation.bind(this, rowData)}
            delayLongPress={750}
          > 
            <Text>{rowData.username}</Text>
          </TouchableOpacity>  
        </View> 
        }
      />
      </View>    
    )
  }
  
}

class MessagesScreen extends React.Component {
  constructor(props) {
    super(props); 
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}); 
    this.state = {
      dataSource: ds.cloneWithRows([])
    }
  }
  
  static navigationOptions = {
    title: 'Messages'
  }

  componentDidMount() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}); 
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((resp) => {
      if (resp.success === true) {
        this.setState({
          dataSource: ds.cloneWithRows(resp.messages)
        })
      }
    })
    .catch((err) => {
      console.log('Error = ', err)
    })
  }

  render() {
    console.log('this.state.dataSource = ', this.state.dataSource)
    return (
      <ListView 
        dataSource = {this.state.dataSource} 
        renderRow={(rowData) => {
        if(rowData.location && rowData.location.longitude) {
         return <View> 
            <Text>{rowData.from.username}</Text> 
            <Text>{rowData.to.username}</Text>
            <Text>{rowData.timestamp}</Text>
            <MapView 
              style={styles.map}
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
        } else {
            return <View>
              <Text>{rowData.from.username}</Text> 
              <Text>{rowData.to.username}</Text>
              <Text>{rowData.timestamp}</Text>
            </View>
        } 
      }} 
    />  
  )}
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
    screen: UsersScreen
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
  map: {
    flex: 1,
    justifyContent: 'center', 
    height: 120
  }
});
