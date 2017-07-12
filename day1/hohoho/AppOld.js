/**
 * Created by ebadgio on 7/11/17.
 */
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
  RefreshControl

} from 'react-native';
import Hr from 'react-native-hr'
import { StackNavigator } from 'react-navigation';
import { Location, Permissions, MapView } from 'expo';
import Swiper from 'react-native-swiper';

//Screens
class WelcomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Login'
  };

  press() {
    this.props.navigation.navigate('EnterLogin')
  }
  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
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

class LoginScreen extends React.Component {
  constructor(){
    super();
    this.state = {
      username:'',
      password:'',
      errorMessage:'',
    }
  }
  static navigationOptions = {
    title: 'Login'
  };

  componentDidMount(){
    AsyncStorage.getItem('user')
      .then(result => {
        const parsedResult = JSON.parse(result);
        const username = parsedResult.username;
        const password = parsedResult.password;
        if (username && password) {
          this.props.navigation.navigate('Users', {username: username, password: password})
        }
      })
      .catch((err) => {

      })
  }

  press(){
    AsyncStorage.setItem('user', JSON.stringify({
      username:this.state.username,
      password:this.state.password
    }))
      .then(() => {
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
            if (responseJson.success) {
              this.props.navigation.navigate('Users', {username: this.state.username, password: this.state.password})
            }
            else {
              this.setState({errorMessage: responseJson.error})
            }
          })
          .catch((err) => {
            Alert.alert(err)
          });
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{color:'red',fontWeight:'bold'}}>{this.state.errorMessage}</Text>
        <Text>Login Below!</Text>
        <TextInput
          style={{height: 40}}
          placeholder="Enter your Username here..."
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          secureTextEntry={true}
          style={{height: 40}}
          placeholder="Enter your Password here..."
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity onPress={ () => {this.press()} } style={[styles.button, styles.buttonSteel]}>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>

      </View>
    )
  }
}

class RegisterScreen extends React.Component {
  constructor(){
    super();
    this.state = {
      username:'',
      password:'',
      errorMessage:'',
    }
  }
  static navigationOptions = {
    title: 'Register'
  };

  press(){
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
        if (responseJson.success) {
          this.props.navigation.goBack()
        }
        else {
          this.setState({errorMessage:responseJson.error})
        }
      })
      .catch((err) => {
        Alert.alert(err)
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{color:'red',fontWeight:'bold'}}>{this.state.errorMessage}</Text>
        <Text>Register Below!</Text>
        <TextInput
          style={{height: 40}}
          placeholder="Enter your Username here..."
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          secureTextEntry={true}
          style={{height: 40}}
          placeholder="Enter your Password here..."
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity onPress={ () => {this.press()} } style={[styles.button, styles.buttonSky]}>
          <Text style={styles.buttonLabel}>Tap to Submit</Text>
        </TouchableOpacity>

      </View>
    )
  }
}

class UserScreen extends React.Component {
  constructor(){
    super();
    let ds = new ListView.DataSource({
      rowHasChanged: (r1,r2) => (r1._id !== r2._id)
    });
    this.state = {
      users: ds.cloneWithRows([]),
      errorMessage:'',
    }
  }
  componentWillMount() {
    fetch('https://hohoho-backend.herokuapp.com/users')
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          let ds = new ListView.DataSource({
            rowHasChanged: (r1,r2) => (r1._id !== r2._id)
          });
          this.setState({users: ds.cloneWithRows(responseJson.users)})
        }
        else {
          this.setState({errorMessage:responseJson.error})
        }
      })
      .catch((err) => {
        Alert.alert(err)
      });
  }

  touchUser(toUser,id) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: id,
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          Alert.alert('Success', `Your HoHoHo to ${toUser} has been sent!`,[{text:'Cool'}])
        }
        else{
          Alert.alert('Unable to send message')
        }
      })
      .catch((err) => {
        Alert.alert(err)
      });
  }

  longTouchUser(toUser, location) {
    console.log('location',location);
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: toUser._id,
        location: {
          longitude: location.longitude/* the received longitude from Expo */,
          latitude: location.latitude/* the received latitude from Expo */
        }
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          Alert.alert('Success', `Your location has been sent to ${toUser.username}!`,[{text:'Cool'}])
        }
        else{
          Alert.alert('Sending location failed')
        }
      })
      .catch((err) => {
        Alert.alert(err)
      });
  }

  static navigationOptions = (props) => ({
    title: 'Users',
    headerRight: <Button title='Messages'
                         onPress={ () =>
                           (props.navigation.navigate('Message', {username:props.navigation.state.params.username,
                             password:props.navigation.state.params.password}))} />
  });

  sendLocation = async(user) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      Alert.alert('Unable to send location without your permission...')
    }
    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
    this.longTouchUser(user,location.coords)
  };

  render(){
    return (
      <View style={styles.container}>
        <Text>{this.state.errorMessage}</Text>
        <ListView
          renderRow={ (item) => (
            <View style={{alignItems:'center'}}>
              <TouchableOpacity
                onPress={() => this.touchUser(item.username, item._id)}
                onLongPress={() => this.sendLocation(item)}
                delayLongPress={1000}>
                <Text>{item.username}</Text>
              </TouchableOpacity>
            </View>
          )}
          dataSource={this.state.users}
          enableEmptySections={true}
        />
      </View>
    )
  }
}

class MessageScreen extends React.Component {
  constructor(){
    super();
    let ds = new ListView.DataSource({
      rowHasChanged: (r1,r2) => (r1._id !== r2._id)
    });
    this.state = {
      messages: ds.cloneWithRows([]),
      errorMessage:'',
      refreshing:false,
    }
  }

  static navigationOptions = {
    title: 'Messages',
  };

  fetchData() {
    return fetch('https://hohoho-backend.herokuapp.com/messages?username=' +
      this.props.navigation.state.params.username + '&password=' +
      this.props.navigation.state.params.password)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          let ds = new ListView.DataSource({
            rowHasChanged: (r1,r2) => (r1._id !== r2._id)
          });
          this.setState({messages: ds.cloneWithRows(responseJson.messages)})
        }
        else {
          this.setState({errorMessage:responseJson.error})
        }
      })
      .catch((err) => {
        Alert.alert(err)
      });
  }

  componentWillMount() {
    this.fetchData()
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.fetchData().then(() => {
      this.setState({refreshing: false});
    })
  }

  render(){
    return (
      <View style={styles.container}>
        <Text>{this.state.errorMessage}</Text>
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {this._onRefresh()}}
            />
          }
          renderRow={ (item) => (
            <View style={{alignItems:'flex-start', margin:10}}>
              <Text>
                From:{' '}{item.from.username}
              </Text>
              <Text>
                To:{' '}{item.to.username}
              </Text>
              <Text>
                Message:{' '}{item.body}
              </Text>
              <Text>
                When:{' '}{item.timestamp}
              </Text>
              {(item.location && item.location.latitude && item.location.longitude) ? <MapView
                style={{height: 100, width:250, margin: 10, borderWidth: 1,
                  alignItems: 'center',
                  justifyContent: 'center'}}
                showsUserLocation={true}
                scrollEnabled={false}
                region={{
                  longitude: item.location.longitude,
                  latitude: item.location.latitude,
                  longitudeDelta: .25,
                  latitudeDelta: .125
                }}
              /> : null}
              <Hr lineColor='#b3b3b3' />
            </View>
          )}
          dataSource={this.state.messages}
          enableEmptySections={true}
        />
      </View>
    );
  }
}

class SwiperScreen extends React.Component {
  static navigationOptions = {
    title: 'HoHoHo!'
  };

  render() {
    return (
      <Swiper>
        // First component
        // Second component
        // Third component
      </Swiper>
    );
  }
}



//Navigator
export default StackNavigator({
  Login: {
    screen: WelcomeScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  EnterLogin: {
    screen: LoginScreen,
  },
  Users: {
    screen: UserScreen,
  },
  Message: {
    screen: MessageScreen,
  }
}, {initialRouteName: 'Login'});


//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding:10
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
  buttonSteel: {
    backgroundColor: 'steelblue'
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  }
});
