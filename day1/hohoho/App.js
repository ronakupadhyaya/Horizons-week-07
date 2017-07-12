import React from 'react';
import { Location, Permissions, MapView } from 'expo';
import Swiper from 'react-native-swiper';
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
//Screens
class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Hohoho'
  };
  login() {
      this.props.navigation.navigate('Login');
  }
  register() {
    this.props.navigation.navigate('Register');
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <TouchableOpacity onPress={() => {this.login()} } style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Tap to Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={() => {this.register()} }>
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
  constructor(props) {
      super(props);
      this.state = {
          username: '',
          password: ''
      }
  }
  addUser(){
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
           if (responseJson.success){
               this.props.navigation.navigate('Home');
           }
        })
        .catch((err) => {
          alert('db error');
});
  }
  render() {
    return (
        <View style={{padding: 10}}>
            <TextInput
            style={{height: 40}}
            placeholder="Enter your username"
            onChangeText={(text) => this.setState({username: text})}
      />
          <TextInput
            style={{height: 40}}
            placeholder="Enter your password"
            onChangeText={(text) => this.setState({password: text})}
            secureTextEntry={true}
        />
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.addUser()} }>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
        </View>
    )
  }
}
class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login'
  };
  constructor(props) {
      super(props);
      this.state = {
          username: '',
          password: '',
          message: '',
      }
  }
  componentDidMount(){
    AsyncStorage.getItem('user')
      .then(result => {
        var parsedResult = JSON.parse(result);
        var username = parsedResult.username;
        var password = parsedResult.password;
        console.log('username',username)
        console.log('password',password)
        if (username && password) {
          this.setState({username:username,password:password})
          this.enter()
        }
      })
  }
  enter(){
      console.log('djdjdjjdjd')
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
            console.log(responseJson)
           if (responseJson.success){
               AsyncStorage.setItem('user', JSON.stringify({
                   username: this.state.username,
                   password: this.state.password
               }));
               this.props.navigation.navigate('Swipers');
           }else{
               this.setState({
                   message: responseJson.error
               })
           }
        })
        .catch((err) => {
            this.setState({
                message: err.error
            })
          alert('Database error');
});
  }
  render() {
    return (
        <View style={{padding: 10}}>
            <Text>{this.state.message}</Text>
            <TextInput
            style={{height: 40}}
            placeholder="Enter your username"
            onChangeText={(text) => this.setState({username: text})}
            />
          <TextInput
            style={{height: 40}}
            placeholder="Enter your password"
            onChangeText={(text) => this.setState({password: text})}
            secureTextEntry={true}
            />
            <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={() => {this.enter()} }>
              <Text style={styles.buttonLabel}>Login</Text>
            </TouchableOpacity>
        </View>
    )
  }
}
class UserScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Users',
        headerRight: <Button title='Messages' onPress={ () => {navigation.state.params.onRightPress()} } />
    })
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
  }
  viewMessages(){
      this.props.navigation.navigate('Messages');
  }
  sendLocation = async(user) => {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            alert('no permission');
        }
        let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
        console.log(location);
        fetch('https://hohoho-backend.herokuapp.com/messages', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              to: user._id,
              location:{
                  longitude:location.coords.longitude,
                  latitude:location.coords.latitude
              }
            })
        })
          .then((response) => response.json())
          .then((responseJson) => {
              Alert.alert(
                  'Success',
                  'Your Location has been sent to' + user.username,
                  [{text: 'Cool!'}] // Button
                )
          })
          .catch((err) => {
              Alert.alert(
                  'Failure',
                  'Your Location has not been sent to' + user.username,
                  [{text: 'Ok!'}] // Button
                )
            })
    }
  componentDidMount(){
    //   this.props.navigation.setParams({
    //   onRightPress: this.viewMessages.bind(this)
    // })
      fetch('https://hohoho-backend.herokuapp.com/users', {
          method: 'GET',
          headers: {
            "Content-Type": "application/json"
          }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                this.setState({
                    dataSource: ds.cloneWithRows(responseJson.users)
                })
            })
            .catch((err) => {
              alert('Database error');
          })
        }
    touchUser(user){
        fetch('https://hohoho-backend.herokuapp.com/messages', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              to: user._id,
            })
        })
          .then((response) => response.json())
          .then((responseJson) => {
              Alert.alert(
                  'Success',
                  'Your Ho Ho Ho! to' + user.username + 'has been sent!',
                  [{text: 'Cool!'}] // Button
                )
          })
          .catch((err) => {
              Alert.alert(
                  'Failure',
                  'Your Ho Ho Ho! to' + user.username + 'has not been sent!',
                  [{text: 'Ok!'}] // Button
                )
            })
    }
  render() {
      return (
          <View>
                <ListView
                      dataSource={this.state.dataSource}
                      renderRow={(rowData) => (
                      <TouchableOpacity
                            onPress={this.touchUser.bind(this, rowData)}
                            onLongPress={this.sendLocation.bind(this, rowData)}
                            delayLongPress={2000}>
                            <Text>{rowData.username}</Text>
                        </TouchableOpacity>
                            )}
                        />
          </View>
      )
  }
}
class MessageScreen extends React.Component {
    static navigationOptions = {
        title: 'Messages'
    };
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            messages: ds.cloneWithRows([])
        };
    }
    componentDidMount(){
        fetch('https://hohoho-backend.herokuapp.com/messages')
        .then((response) => response.json())
        .then((responseJson) => {
            const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            this.setState({
                messages: ds.cloneWithRows(responseJson.messages)
            });
        })
        .catch((err) => {
            console.log(err);
            alert('Database error');
        })
    }

    render() {
        return (
            <ListView
                dataSource={this.state.messages}
                renderRow={(rowData) => {
                    return(<View >
                        <Text>From: {rowData.to.username} {"\n"} To: {rowData.from.username} {"\n"} Message: {rowData.body} {"\n"} When: {rowData.timestamp} {"\n"}</Text>
                        {rowData.location && rowData.location.longitude?
                            <MapView
                                style={{width:200, height:200}}
                                showsUserLocation={true}
                                //scrollEnabled={false}
                                region={{
                                    longitude: rowData.location.longitude,
                                    latitude: rowData.location.latitude,
                                    longitudeDelta: 1,
                                    latitudeDelta: 1,
                                }}
                            /> : null
                        }
                        <Text> -------------------------------- </Text>
                        </View>
                    )
                }}
            />
        )
    }
}
class SwiperScreen extends React.Component {
  static navigationOptions = {
    title: 'Hohoho'
  };
  render() {

    return (
      <Swiper>
        <UserScreen/>
        <MessageScreen/>
      </Swiper>
    );
  }
}
export default StackNavigator({
  Home:{
    screen: HomeScreen,
  },
  Register:{
    screen: RegisterScreen,
  },
  Login:{
      screen: LoginScreen
  },
  Users:{
      screen: UserScreen
  },
  Messages:{
      screen: MessageScreen
  },
  Swipers:{
      screen: SwiperScreen
  },
}, {initialRouteName: 'Home'});
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
