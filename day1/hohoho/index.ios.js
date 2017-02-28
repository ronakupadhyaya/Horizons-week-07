import React, {Component} from 'react'
import Swiper from 'react-native-swiper'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  NavigatorIOS,
  ListView,
  Alert,
  RefreshControl,
  AsyncStorage,
  MapView
} from 'react-native'

// This is the root view
var hohoho = React.createClass({
  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          component: Login,
          title: "Login"
        }}
        style={{flex: 1}}
      />
    );
  }
});

var SwiperView = React.createClass({
  render() {
    return (
      <Swiper style={{marginTop: 30}}>
        <Users/>
        <Messages/>
      </Swiper>
    );
  }
});

var Login = React.createClass({
  getInitialState() {
    return {
      responseJsonError: '',
      loginmessage: ''
    }
  },
  login(username, password) {
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
      if (responseJson.success === true) {
        AsyncStorage.setItem('user', JSON.stringify({
          username: username,
          password: password
        }));
        this.props.navigator.push({
          component: SwiperView,
          title: "Users",
          rightButtonTitle: 'Messages',
          onRightButtonPress: this.messages
        })
      } else {
        this.setState({
          responseJsonError: responseJson.error,
        });
      }
      console.log('responsejosn', responseJson)
    })
    .catch((err) => {
      console.log('error', err)
    });
  },
  componentDidMount() {
    AsyncStorage.getItem('user')
    .then(result => {
      var parsedResult = JSON.parse(result);
      var username = parsedResult.username;
      var password = parsedResult.password;
      if (username && password) {
        this.setState({
          loginmessage: ('Logged in as ' + username + '.')
        })
        return this.login(username, password)
      }
    })
  .catch(err => {console.log('error', err)})
  },
  press() {
    this.login(this.state.username, this.state.password)
  },
  register() {
    this.props.navigator.push({
      component: Register,
      title: "Register"
    });
  },
  messages() {
    this.props.navigator.push({
      component: Messages,
      title: "Messages"
    });
  },
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <Text style={styles.textBig}>
          {this.state.responseJsonError}
        </Text>
        <Text>
          {this.state.loginmessage}
        </Text>
        <TextInput
          style={[styles.buttoninput, {height: 40, borderWidth: 1}]}
          placeholder="Username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={[styles.buttoninput, {height: 40, borderWidth: 1}]}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.buttoninput, styles.buttonRed]} onPress={this.press}>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={this.register}>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={this.messages}>
          <Text style={styles.buttonLabel}>View Messages</Text>
        </TouchableOpacity>
      </View>
    );
  }
});

var Register = React.createClass({
  getInitialState() {
    return {
      responseJsonError: ''
    }
  },
  register() {
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
      if (responseJson.success === true) {
        this.props.navigator.pop()
      } else {
        this.setState({
          responseJsonError: responseJson.error,
        });
      }
      console.log('responsejosn', responseJson)
    })
    .catch((err) => {
      console.log('error', err)
    });
  },

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>
          {this.state.responseJsonError}
        </Text>
        <TextInput
          style={[styles.buttoninput, {height: 40, borderWidth: 1}]}
          placeholder="Username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={[styles.buttoninput, {height: 40, borderWidth: 1}]}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.buttoninput, styles.buttonRed]} onPress={this.register}>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
      </View>
    );
  }
});

var Users = React.createClass({
  getInitialState() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    fetch('https://hohoho-backend.herokuapp.com/users', {
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        dataSource: ds.cloneWithRows(responseJson.users)
      });
    })
    .catch((err) => {
      console.log('error', err)
    });

    return {
      dataSource: ds.cloneWithRows([ ]),
      refreshing: false
    };
  },

  _onRefresh() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setState({refreshing: true});
    fetch('https://hohoho-backend.herokuapp.com/users', {
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        dataSource: ds.cloneWithRows(responseJson.users),
        refreshing: false
      });
    })
    .catch((err) => {
      console.log('error', err)
    });
  },

  touchUser(user, longitude, latitude) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: user._id,
        location: {
          longitude: longitude,
          latitude: latitude
        }
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log('response', responseJson)
      if (responseJson.success === true) {
        Alert.alert(
          'Alert Title',
          'Your Ho Ho Ho! to ' + user.username + ' has been sent!',
          [{text: 'Dismiss Button'}] // Button
        )
      } else {
        Alert.alert(
          'Alert Title',
          'Your Ho Ho Ho! to ' + user.username + ' could not be sent.',
          [{text: 'Dismiss Button'}] // Button
        )
      }
      console.log('responsejosn', responseJson)
    })
    .catch((err) => {
      console.log('error', err)
    });
  },
  sendLocation(user) {
    navigator.geolocation.getCurrentPosition(
      position => {
        console.log("Got position:", position);
        this.touchUser(user, position.coords.longitude, position.coords.latitude)
      },
      error => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  },
  render() {
    return (
      <View style={styles.container}>
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
          dataSource={this.state.dataSource}
          style={{alignSelf: 'stretch'}}
          renderRow={(rowData) => (
            <View style={styles.userList}>
              <TouchableOpacity
                onPress={this.touchUser.bind(this, rowData, '', '')}
                onLongPress={this.sendLocation.bind(this, rowData)}
                delayLongPress={1000}>
                <Text style={styles.userListInner}>{rowData.username}</Text>
              </TouchableOpacity>
              <View style={{alignSelf: 'stretch', borderWidth: 1}}/>
            </View>
          )}
        />
      </View>
    );
  }
})

var Messages = React.createClass({
  getInitialState() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.fetchMessage();
    return {
      dataSource: ds.cloneWithRows([]),
      refreshing: false
    };
  },

  fetchMessage() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        dataSource: ds.cloneWithRows(responseJson.messages)
      });
    })
    .catch((err) => {
      console.log('error', err)
    });
  },

  _onRefresh() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setState({refreshing: true});
    this.fetchMessage()
    this.setState({refreshing: false})
  },

  render() {
    return (
      <View style={styles.container}>
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
          dataSource={this.state.dataSource}
          style={{alignSelf: 'stretch'}}
          renderRow={(rowData) => (
            <View>
              <View style={{padding: 10}}>
                <Text>From: {rowData.from.username}</Text>
                <Text>To: {rowData.to.username}</Text>
                <Text>Message: Yo</Text>
                <Text>When: {rowData.timestamp}</Text>
                {(rowData.location && rowData.location.longitude) ? (
                    <MapView
                      style={{height: 120, margin: 0}}
                      showsUserLocation={true}
                      scrollEnabled={false}
                      region={{
                        longitude: rowData.location.longitude,
                        latitude: rowData.location.latitude,
                        longitudeDelta: 1,
                        latitudeDelta: 1
                      }}
                      annotations={[{
                        latitude: rowData.location.latitude,
                        longitude: rowData.location.longitude,
                      }]}
                    />
                  ) : null}
              </View>


              <View style={{alignSelf: 'stretch', borderWidth: 1}}/>
            </View>
          )}
        />
      </View>
    );
  }
})

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
  userList: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  userListInner: {
    paddingTop: 10,
    paddingBottom: 10,
    color: 'grey'
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
  buttoninput: {
    alignSelf: 'stretch',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 0,
    paddingLeft: 10,
    paddingRight: 10
  }
});

AppRegistry.registerComponent('hohoho', () => hohoho );
