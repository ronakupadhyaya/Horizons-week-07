import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ListView,
  Alert,
  Button,
  Image,
  AsyncStorage,
} from 'react-native';
import {
  Location,
  Permissions,
  MapView,
} from 'expo'
import { StackNavigator } from 'react-navigation';
import styles from './styles.js'
import Swiper from 'react-native-swiper'

//Screens
class SplashScreen extends React.Component {
  static navigationOptions = {
    title: 'Login'
  };
  press() {
    this.props.navigation.navigate('Login');
  }
  register() {
    this.props.navigation.navigate('Register');
  }
  login(username, password) {
        fetch('https://hohoho-backend.herokuapp.com/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: username,
            password: password,
          })
        })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson)
          if (responseJson.success) {
            AsyncStorage.setItem('user', JSON.stringify({
              username: username,
              password: password,
            }));
            this.props.navigation.navigate('Swiper')
          }
          else {
            console.log('hello')
            this.setState({message:responseJson.error})
          }
        })
          .catch((err) => {
            console.log('error', err)
        })
  }
  componentDidMount() { // All async data loading
    AsyncStorage.getItem('user')
      .then(result => {
          var parsedResult = JSON.parse(result);
          var username = parsedResult.username;
          var password = parsedResult.password;
          if (username && password) {
            return this.login(username, password)
          }
      })
  }
  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('./assets/icons/BRO.png')}
          style={styles.image}
        ></Image>
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
  constructor() {
    super();
      this.state={
        username: '',
        password: ''
      };
  }
  render() {
    return (
      <View style={styles.container}>
        {/* <Image
          source={require('./assets/icons/BRO.png')}
          style={styles.image}
        ></Image> */}
        <TextInput
          style={styles.inputField}
          placeholder=' username'
          onChangeText={(text) => this.setState({username: text})}
          value={this.state.username}
          >
        </TextInput>
        <TextInput
          style={styles.inputField}
          placeholder=' password'
          onChangeText={(text) => this.setState({password: text})}
          value={this.state.password}
          secureTextEntry={true}
          >
        </TextInput>
        <TouchableOpacity
          style={[styles.button, styles.buttonBlue]}
          onPress={() => {
              fetch('https://hohoho-backend.herokuapp.com/register', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  username: this.state.username,
                  password: this.state.password,
                })
              })
              .then((response) => response.json())
              .then((responseJson) => {
                if (responseJson.success) {
                this.props.navigation.navigate('Splash')
                }
                else {
                  console.log(responseJson)
                }
              })
                .catch((err) => {
                  console.log('error', err)
              })
          }}
          >
          <Text style={styles.buttonLabel} >Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login'
  };
  constructor() {
    super();
      this.state={
        username: '',
        password: ''
      };
  }
  login(username, password) {
        fetch('https://hohoho-backend.herokuapp.com/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: username,
            password: password,
          })
        })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson)
          if (responseJson.success) {
            AsyncStorage.setItem('user', JSON.stringify({
              username: username,
              password: password,
            }));
            this.props.navigation.navigate('Swiper')
          }
          else {
            console.log('hello')
            this.setState({message:responseJson.error})
          }
        })
          .catch((err) => {
            console.log('error', err)
        })
  }
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.inputField}
          placeholder=' username'
          onChangeText={(text) => this.setState({username: text})}
          value={this.state.username}
          >
        </TextInput>
        <TextInput
          style={styles.inputField}
          placeholder=' password'
          onChangeText={(text) => this.setState({password: text})}
          value={this.state.password}
          secureTextEntry={true}
          message=''
          >
        </TextInput>
        <TouchableOpacity
          style={[styles.button, styles.buttonGreen]}
          onPress={() => this.login(this.state.username, this.state.password)}
          >
          <Text style={styles.buttonLabel} >Login</Text>
        </TouchableOpacity>
        <Text style={styles.textSmall} >{this.state.message}</Text>
      </View>
    )
  }
}

class HomePage extends React.Component {
  static navigationOptions = (props) => ({
    title: 'BRO',
    headerRight:
    <TouchableOpacity onPress={() => (props.navigation.navigate('Messages'))}>
      <Text>Messages </Text>
    </TouchableOpacity>
  });
  constructor() {
    super();
  this.state = {
    users: [],
    message: ''
    };
    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
      this.setState({ users: responseJson.users})
        }
      else {
        this.setState({message:responseJson.error})
      }
    })
      .catch((err) => {
        console.log('error', err)
    })
  }
  sendABro(user) {
      fetch('https://hohoho-backend.herokuapp.com/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: user._id,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          Alert.alert(
            "BRO!",
            "you have bro'ed " + user.username,
            [{text: "Got it Bro"}]
            )
          }
        else {
          this.setState({message:responseJson.error})
        }
      })
        .catch((err) => {
          console.log('error', err)
      })
  }
  sendBrocation = async(user) => {
    let {status} = await Permissions.askAsync(Permissions.LOCATION);
    console.log(status)
        if (status !== 'granted') {
          alert('but BRO...')
        }
    let brocation = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: user._id,
        location: {
          longitude: brocation.coords.longitude,
          latitude: brocation.coords.latitude
        }
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        Alert.alert(
          "BRO!",
          "you have sent your brocation to " + user.username,
          [{text: "Got it Bro"}]
          )
        }
      else {
        this.setState({message:responseJson.error})
      }
    })
      .catch((err) => {
        console.log('error', err)
    })
  }
  render() {
    var dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => (r1 !== r2)
    });
    return (
      <View style={styles.container}>
        <Image
          source={require('./assets/icons/BRO.png')}
          style={styles.image}
        ></Image>
        <Text style={styles.textInstruct}>Tap to Send a Bro</Text>
        <Text style={styles.textInstruct}>Hold to Send your Brocation</Text>
        <ListView
          renderRow={(user) => (
          <TouchableOpacity
            style={[styles.button, styles.buttonBlue]}
            onPress={() => this.sendABro(user)}
            onLongPress={this.sendBrocation.bind(this, user)}
            delayLongPress={500}
            >
            <Text style={styles.textBig}>{user.username}</Text>
          </TouchableOpacity>
          )}
          dataSource={dataSource.cloneWithRows(this.state.users)}
       />
      </View>
    )
  }
}

class Messages extends React.Component {
  constructor() {
    super();
  this.state = {
    messages: [],
    error: ''
    };
    //get message data
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
      this.setState({ messages: responseJson.messages})
        console.log("state", this.state.messages)
        }
      else {
        this.setState({error:responseJson.error})
      }
    })
      .catch((err) => {
        console.log('error', err)
    })
  }
  render() {
    var dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => (r1 !== r2)
    });
    return (
      <View style={styles.container}>
        <ListView
          renderRow={(message) => (
          <View
            style={[styles.button, styles.buttonBlue]}
            >
              <Image
                source={require('./assets/icons/BRO.png')}
                style={styles.imageSmall}
              ></Image>
            <Text style={styles.textBig}>Sent from {message.from.username} to {message.to.username} </Text>
            <Text style={styles.textSmall}>On {message.timestamp}</Text>
            {(message.location && message.location.latitude && message.location.longitude) ?
            <MapView
              style={{height: 200}}
              showsUserLocation={true}
              scrollEnabled={false}
              initialRegion={{
                latitude: message.location.latitude,
                longitude: message.location.longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.125
              }}
            /> : null
          }
        </View>
          )}
          dataSource={dataSource.cloneWithRows(this.state.messages)}
       />
      </View>
    )
  }
}

class SwiperScreen extends React.Component {
  static navigationOptions = {
    title: 'Bro!'
  };

  render() {
    return (
      <Swiper>
        <HomePage/>
        <Messages/>
      </Swiper>
    );
  }
}

//Navigator
export default StackNavigator({
  Splash: {screen: SplashScreen},
  Register: {screen: RegisterScreen},
  Login: {screen: LoginScreen},
  Home: {screen: HomePage},
  Messages: {screen: Messages},
  Swiper: {screen: SwiperScreen},
}, {initialRouteName: 'Splash'});
