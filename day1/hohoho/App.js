import React from 'react';
import 'expo';
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
import { Location, Permissions } from 'expo';
import { MapView } from 'expo';
import Swiper from 'react-native-swiper';

//Screens
class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login',
  };

  constructor(props){
      super(props)
      this.state={
          error: ""
      }
  }

  componentDidMount() {
    AsyncStorage.getItem('user')
      .then((result) => {
        var parsedResult = JSON.parse(result);
        var username = parsedResult.username;
        var password = parsedResult.password;
        if (username && password) {
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
          .then((response) => response.json())
          .then((responseJson) => {
              console.log('result', responseJson)
              if(responseJson.success){
                  this.props.navigation.navigate('UsersList')
              } else {
                  this.setState({error: "Failed at Login!"})
              }
            /* do something with responseJson and go back to the Login view but
             * make sure to check for responseJson.success! */
          })
          .catch((err) => {
              console.log('error', err)
            /* do something if there was an error with fetching */
            });
       }
     // Don't really need an else clause, we don't do anything in this case.
   })
      // .catch(err => {this.setState({user:JSON.parse(result)})})

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
          console.log('result', responseJson)
          if(responseJson.success){
            AsyncStorage.setItem('user', JSON.stringify({
              username: this.state.username,
              password: this.state.password
            }));
              this.props.navigation.navigate('UsersList')
          } else {
              this.setState({error: "Failed at Login!"})
          }
        /* do something with responseJson and go back to the Login view but
         * make sure to check for responseJson.success! */
      })
      .catch((err) => {
          console.log('error', err)
        /* do something if there was an error with fetching */
      });
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
          style={{width:200, height: 40}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{width:200, height: 40}}
          placeholder="Enter your password"
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
          password: this.state.password,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
          console.log('result', responseJson)
          this.props.navigation.goBack();
        /* do something with responseJson and go back to the Login view but
         * make sure to check for responseJson.success! */
      })
      .catch((err) => {
          console.log('error', err)
        /* do something if there was an error with fetching */
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>
        <TextInput
          style={{width:200, height: 40}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{width:200, height: 40}}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={() => this.press()}>
            <Text>Tap to Register!</Text>
        </TouchableOpacity>
      </View>
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
        {class UsersScreen extends React.Component {
            static navigationOptions = ({navigation}) => ({
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

          sendLocation = async(user) => {
            let { status } = await Permissions.askAsync(Permissions.LOCATION);
            if (status !== 'granted') {
              alert("no! you shall not pass! Permission granted, you are not.")
            } //is this correct?
            let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
            console.log(location);

            this.longTouchUser(user,location);
            }
          longTouchUser(user,location){
                fetch('https://hohoho-backend.herokuapp.com/messages', {
                method: 'POST',
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
                  if(responseJson.success){
                      Alert.alert(
                      'Success',
                      'Your HO HO HO and location to' + user.username +  ' has been sent ',
                      [{text: 'Cool'}] // Button
                    )
                  } else {
                      Alert.alert(
                      'Failed',
                      'Your HO HO HO! and location to' + user.username + ' could not be sent ',
                      [{text: 'Try again'}] // Button
                    )
                  }
              })
              .catch((err) => {
                  console.log('error', err)
              });
            }

          messages(){
                this.props.navigation.navigate('Messages')
          }

          componentDidMount(){
             const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

             this.props.navigation.setParams({
                onRightPress: this.messages.bind(this)
            })
              fetch('https://hohoho-backend.herokuapp.com/users', {
                method: 'GET',
                headers: {
                  "Content-Type": "application/json"
                },
              })
              .then((response) => response.json())
              .then((responseJson) => {
                  console.log('result', responseJson)
                  this.setState({
                      dataSource: ds.cloneWithRows(responseJson.users)
                  })
              })
              .catch((err) => {
                  console.log('error', err)
                /* do something if there was an error with fetching */
              });
          }
              touchUser(user){
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
                      if(responseJson.success){
                          Alert.alert(
                          'Success',
                          'Your HO HO HO! to' + user.username + ' has been sent ',
                          [{text: 'Cool'}] // Button
                        )
                      } else {
                          Alert.alert(
                          'Failed',
                          'Your HO HO HO!`` to' + user.username + ' could not be sent ',
                          [{text: 'Try again'}] // Button
                        )
                      }
                  })
                  .catch((err) => {
                      console.log('error', err)
                  });
              }

            render (){
                return(
                    <ListView
                      dataSource={this.state.dataSource}
                      renderRow={(rowData) => (
                        <TouchableOpacity
                          onPress={() => {this.touchUser(rowData)}}
                          onLongPress={this.sendLocation.bind(this, rowData)}
                          delayLongPress={1000}
                          ><Text>{rowData.username}</Text>
                        </TouchableOpacity>
                      )}
                    />
                )
            }
        }
        }
        {class MessagesScreen extends React.Component {
            static navigationOptions = {
                title: 'Messages'
            };
            constructor(props) {
                super(props);

                const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                this.state = {
                    dataSource: ds.cloneWithRows([])
                };
            }
            componentDidMount(){
                fetch('https://hohoho-backend.herokuapp.com/messages', {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json"
                    },
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log('result', responseJson)
                    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                    console.log('heree', responseJson.messages)
                    this.setState({
                        dataSource: ds.cloneWithRows(responseJson.messages)
                    })
                })
                .catch((err) => {
                    console.log('error', err)
                    /* do something if there was an error with fetching */
                });
            }

            render (){
                console.log(this.state.dataSource)
                return(
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={(messages) =>
                          <View>
                            <View>
                                <Text>{messages.from.username} </Text>
                                <Text>{messages.to.username} </Text>
                                <Text>{messages.timestamp} </Text>
                            </View>
                            {(messages.location && messages.location.latitude && messages.location.longitude) ?
                              <MapView
                                style={{height: 200}}
                                showsUserLocation={true}
                                scrollEnabled={true}
                                region={{
                                  longitude: messages.location.longitude,
                                  latitude: messages.location.latitude,
                                  longitudeDelta: 1,
                                  latitudeDelta: 1
                                }}>
                                <MapView.Marker
                                  coordinate ={{
                                    latitude: messages.location.latitude,
                                    longitude: messages.location.longitude
                                  }} />
                                </MapView>
                              : null
                              }
                          </View>
                        }
                      />
                    )
                }
          }
        }
      </Swiper>
    );
  }
}

//Navigator
export default StackNavigator({
  Swiper: {
    screen: SwiperScreen,
  }
  // Login: {
  //   screen: LoginScreen,
  // },
  // Register: {
  //   screen: RegisterScreen,
  // },
  // UsersList: {
  //     screen: UsersScreen,
  // },
  // Messages: {
  //     screen: MessagesScreen
  // }
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
