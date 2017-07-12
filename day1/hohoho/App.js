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

import Swiper from 'react-native-swiper';
import { MapView, Location, Permissions } from 'expo';

import { StackNavigator } from 'react-navigation';
const url = 'https://hohoho-backend.herokuapp.com/'


//Screens
class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Home'
  });

  press() {
    this.props.navigation.navigate('Login');
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

class RegisterScreen extends React.Component {

  static navigationOptions = {
    title: 'Register'
  };

  constructor() {
    super();
    this.state = {
      username: "",
      password: ""
    }
  }

  register() {
    fetch(url + 'register', {
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
        this.props.navigation.goBack();
      }
    })
    .catch((err) => {
      console.log('Error: ' + err);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({username: text})}
          value={this.state.username}
          placeholder='Username'
        />
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({password: text})}
          value={this.state.password}
          placeholder='Password'
          secureTextEntry={true}
        />
        <TouchableOpacity style={[styles.button, styles.buttonRed]} onPress={ () => {this.register()} }>
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

  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      message: ""
    }
  }

  componentDidMount() {
    const realThis = this;
    AsyncStorage.getItem('user')
    .then(result => {
      var parsedResult = JSON.parse(result);
      var username = parsedResult.username;
      var password = parsedResult.password;
      if (username && password) {
        return realThis.login(username, password)
        .then(resp => resp.json())
        .then(realThis.usersPage.bind(realThis));
      }
    })
    .catch(err => {console.log(err)})
  }

  usersPage() {
    this.props.navigation.navigate('Swiper')
  }

  login(username, password) {
    fetch(url + 'login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        AsyncStorage.setItem('user', JSON.stringify({
          username: username,
          password: password
        }));
        this.usersPage();
      } else {
        this.setState({message: "Failed Login Authentication"});
      }
    })
    .catch((err) => {
      console.log('Error: ' + err);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.message}</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({username: text})}
          value={this.state.username}
          placeholder='Username'
        />
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({password: text})}
          value={this.state.password}
          placeholder='Password'
          secureTextEntry={true}
        />
        <TouchableOpacity style={[styles.button, styles.buttonRed]} onPress={ () => {this.login(this.state.username, this.state.password)} }>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class UsersScreen extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Users'
  });

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([])
    };
    fetch(url + 'users', {method: 'GET'})
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        this.setState({dataSource: ds.cloneWithRows(responseJson.users)});
      }
    })
  }


  touchUser(user, loc) {
    let message = 'Your HoHoHo to ' + user.username + ' has been sent';
    let completeData = {
      to: user._id
    }

    if (loc) {
      completeData.location = loc;
      message = 'Your HoHoHo with LOCATION to ' + user.username + ' has been sent';
    }

    fetch(url + 'messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(completeData)
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        Alert.alert(
          'Success',
          message,
          [{text: 'Dismiss'}] // Button
        )
      }
    })
  }

  messages() {
    this.props.navigation.navigate('Messages');
  }

  sendLocation = async(user) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.touchUser(user);
    } else {
      let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
      const loc = {
        "latitude": location.coords.latitude,
        "longitude": location.coords.longitude
      }
      this.touchUser(user, loc);
    }
  }

  render() {
    return(
      <View style={{flex:1}}>
        {this.state.dataSource.rowIdentities[0].length === 0 ?
          <Text style={styles.loadText}> Users are loading...</Text> :
          <ListView
            dataSource={this.state.dataSource}
            renderRow={(rowData) =>
              <TouchableOpacity
                onPress={this.touchUser.bind(this, rowData)}
                onLongPress={this.sendLocation.bind(this, rowData)}
                delayLongPress={1000}>
                <Text style={styles.users}>{rowData.username}
                </Text>
              </TouchableOpacity>}
            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.seperator} />}
            />
          }
        </View>
      );
    }
  }

  class MessagesScreen extends React.Component {

    static navigationOptions = {
      title: 'Messages'
    };

    constructor(props) {
      super(props);
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = {
        dataSource: ds.cloneWithRows([])
      };
      fetch(url + 'messages', {method: 'GET'})
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          this.setState({dataSource: ds.cloneWithRows(responseJson.messages)});
        }
      })
    }

    render() {
      return(
        <View style={{flex:1}}>
          {this.state.dataSource.rowIdentities[0].length === 0 ?
            <Text style={styles.loadText}> Messages are loading...</Text> :
            <ListView
              dataSource={this.state.dataSource}
              renderRow={(rowData) =>
                <View style={styles.messageContainer}>
                  <Text style={styles.messageText}>From: {rowData.from.username}
                  </Text>
                  <Text style={styles.messageText}>To: {rowData.to.username}
                  </Text>
                  <Text style={styles.messageText}>To: {rowData.body}
                  </Text>
                  <Text style={styles.messageText}>When: {rowData.timestamp}
                  </Text>
                  {
                    rowData.location && rowData.location.latitude ?
                    <MapView
                      style={{flex: 7, height: 150, alignSelf: 'stretch'}}
                      showsUserLocation={true}
                      scrollEnabled={false}
                      region={{
                        longitude: rowData.location.longitude,
                        latitude: rowData.location.latitude,
                        longitudeDelta: 0.5,
                        latitudeDelta: 0.25
                      }}
                    /> : <Text style={styles.messageText}>NOPE</Text>
                  }
                </View>}
                renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.seperator} />}
              />
            }
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
            <UsersScreen/>
            <MessagesScreen/>
          </Swiper>
        );
      }
    }


    //Navigator
    export default StackNavigator({
      Home: {
        screen: HomeScreen,
      },
      Register: {
        screen: RegisterScreen,
      },
      Login: {
        screen: LoginScreen
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
      },
      textInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 10,
        marginLeft: 5,
        marginRight: 5,
        paddingLeft: 5
      },
      users: {
        alignSelf: 'center',
        fontSize: 20,
        marginTop: 5,
        marginBottom: 5
      },
      seperator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: 'black'
      },
      loadText: {
        fontSize: 20,
        alignSelf: 'center',
        marginTop: 20
      },
      messageContainer: {
        padding: 10
      },
      messageText: {
        fontSize: 15,
        margin: 5
      }
    });
