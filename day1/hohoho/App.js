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

import { Location, Permissions, MapView } from 'expo';

import Swiper from 'react-native-swiper';


//Screens
class LoginScreen extends React.Component {
    constructor(){
        super()
        this.state = {
            username: '',
            password: '',
            message: ''
        }
    }

    componentDidMount(){
        AsyncStorage.getItem('user')
            .then((res) => {
                const r = JSON.parse(res);
                this.setState({username: r.username, password: r.password});
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
                    if(!responseJson.success){
                        this.setState({message: responseJson.error})
                    }else{
                        this.props.navigation.navigate('Swiper')
                    }
                })
                .catch((err) => {
                    console.log(err)
                });
            })
    }

    static navigationOptions = {
        title: 'Login'
    };


    register() {
        this.props.navigation.navigate('Register');
    }

    press(){
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
            if(!responseJson.success){
                this.setState({message: responseJson.error})
            }else{
                const user = {username: this.state.username, password: this.state.password};
                AsyncStorage.setItem('user', JSON.stringify(user))
                this.props.navigation.navigate('Swiper')
            }
        })
        .catch((err) => {
            console.log(err)
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.textBig}>Login to HoHoHo!</Text>
                <Text style={{color: 'red', fontSize: 50, textAlign: 'center'}}>{this.state.message}</Text>
                <TextInput
                    style={{height: 40, width: 300}}
                    placeholder="Enter your username"
                    onChangeText={(text) => this.setState({username: text})}
                />
                <TextInput
                    style={{height: 40, width: 300}}
                    placeholder="Enter your password"
                    onChangeText={(text) => this.setState({password: text})}
                    secureTextEntry={true}
                />
                <TouchableOpacity style={[styles.button, styles.buttonRed]} onPress={ () => {this.press()} }>
                    <Text style={styles.buttonLabel}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.register()} }>
                    <Text style={styles.buttonLabel}>Tap to Register</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

class RegisterScreen extends React.Component {
    constructor(){
        super()
        this.state = {
            username: '',
            password: ''
        }
    }
    static navigationOptions = {
        title: 'Register'
    };


    registerUser(){
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
            console.log(responseJson)
            if(!responseJson.success){
                alert('Registration failed')
            }else{
                this.props.navigation.goBack()
            }
        })
        .catch((err) => {
            console.log(err)
        });
    }

    render() {
        return (
            <View style={styles.container}>

                <TextInput
                    style={{height: 40, width: 300}}
                    placeholder="Enter your username"
                    onChangeText={(text) => this.setState({username: text})}
                />
                <TextInput
                    style={{height: 40, width: 300}}
                    placeholder="Enter your password"
                    onChangeText={(text) => this.setState({password: text})}
                    secureTextEntry={true}
                />
                <TouchableOpacity style={[styles.button, styles.buttonRed]} onPress={ () => {this.registerUser()} }>
                    <Text style={styles.textBig}>Register</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

class UsersScreen extends React.Component {
  //navigationOptions code
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      to: '',
    };
  }

  messages(){
      this.props.navigation.navigate('Messages');
  }

  static navigationOptions = (props) => ({
      title: 'User',
      headerRight: <TouchableOpacity onPress={ () => {props.navigation.navigate('Messages')} }>
          <Text>Messages</Text>
      </TouchableOpacity>
  });

  componentDidMount(){
      fetch('https://hohoho-backend.herokuapp.com/users', {
          method: 'GET',
          headers: {
              "Content-Type": "application/json"
          }
      })
      .then((response) => response.json())
      .then((responseJson) => {

          console.log(responseJson)
          if(!responseJson.success){
              alert('Registration failed')
          }else{
              const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
              this.setState({
                  dataSource: ds.cloneWithRows(responseJson.users)
              })
          }
      })
      .catch((err) => {
          console.log(err)
      });
  }

  touchUser(rowData){
      fetch('https://hohoho-backend.herokuapp.com/messages', {
          method: 'POST',
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              to: rowData._id
          })
      })
      .then((response) => response.json())
      .then((responseJson) => {
          if(!responseJson.success){
              Alert.alert(
                  'FAILURE',
                  "'Your Ho Ho Ho! to '+ rowData.username + ' could not be sent'",
                  [{text: 'Oh no, try again'}]
              )
          }else{
              Alert.alert(
                  'SUCCESS',
                  'Your Ho Ho Ho! to '+ rowData.username + ' was sent',
                  [{text: 'yay'}]
              )
          }
      })
      .catch((err) => {
          console.log(err)
      });
  }

  sendLoc = async(rowData) => {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
          alert('cant send location');
          return;
      }
        let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
        const coords = location.coords;
        fetch('https://hohoho-backend.herokuapp.com/messages', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                to: rowData._id,
                location: {
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                }
            })
        })
        .then((response) => {
            return response.json()})
        .then((responseJson) => {
            if(!responseJson.success){
                Alert.alert(
                    'FAILURE',
                    "'Your Ho Ho Ho! to '+ rowData.username + ' could not be sent'",
                    [{text: 'Oh no, try again'}]
                )
            }else{
                Alert.alert(
                    'SUCCESS',
                    'Your Ho Ho Ho! to '+ rowData.username + ' with location was sent',
                    [{text: 'yay'}]
                )
            }
        })
        .catch((err) => {
            console.log("error",err)
        });
  }




  render(){
      return(
          <ListView
              dataSource={this.state.dataSource}
              renderRow={(rowData) =>
                  <TouchableOpacity
                     onPress={this.touchUser.bind(this,rowData)}
                     onLongPress={this.sendLoc.bind(this, rowData)}
                     delayLongPress={500}>
                      <Text style={styles.Users}>{rowData.username}</Text>
                  </TouchableOpacity>
              }
          />
      )
  }
}

class MessagesScreen extends React.Component {
  //navigationOptions code
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
  }

  static navigationOptions = {
      title: 'Messages'
  };

  componentDidMount(){
      fetch('https://hohoho-backend.herokuapp.com/messages', {
          method: 'GET',
          headers: {
              "Content-Type": "application/json"
          }
      })
      .then((response) => response.json())
      .then((responseJson) => {
          if(!responseJson.success){
              alert('You failed')
          }else{
              const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            //   responseJson.messages.filter((msg) => {msg.to.username === user})
              this.setState({
                  dataSource: ds.cloneWithRows(responseJson.messages)
              })
          }
      })
      .catch((err) => {
          console.log(err)
      });
  }

  // genMap(rd) {
  //
  // }

  render(){
      return(
          <ListView
              dataSource={this.state.dataSource}
              renderRow={(rowData) =>
                  <TouchableOpacity style={styles.messages}>
                      <Text style={{textAlign: 'center', fontSize: 16, flex: 1}}>From: {rowData.from.username}</Text>
                      <Text style={{textAlign: 'center', fontSize: 16, flex: 1}}>To: {rowData.to.username}</Text>
                      <Text style={{textAlign: 'center', fontSize: 16, flex: 1}}>Message: {rowData.body}</Text>
                      <Text style={{textAlign: 'center', fontSize: 16, flex: 1}}>When {rowData.timestamp}</Text>
                      {console.log("THI IS STHE KLASJHD",rowData)}
                      {rowData.location?
                            <MapView
                            style={{height: 100, flex: 1}}
                            showsUserLocation={true}
                            scrollEnabled={false}
                            region={{
                                longitude: rowData.location.longitude,
                                latitude: rowData.location.latitude,
                                longitudeDelta: 0.05,
                                latitudeDelta: 0.05
                            }}
                        /> : undefined

                     }
                  </TouchableOpacity>
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
    },
    Users: {
        borderBottomWidth: 3,
        width: '100%',
        padding: 10,
        textAlign: 'center',
        fontSize: 16
    },
    messages: {
        borderBottomWidth: 3,
        width: '100%',
        padding: 10,
        flex: 1
    }
});
