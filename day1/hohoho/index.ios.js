import React, {Component} from 'react'
import Swiper from 'react-native-swiper'
import {
  AppRegistry,
  Alert,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  NavigatorIOS,
  AsyncStorage,
  ListView,
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

//// SWIPING FUNCTIONALITY
var SwiperView = React.createClass({
  render() {
    return (
      <Swiper>
        <Users/>
        <Messages/>
      </Swiper>
    );
  }
});

///// REGISTER
var Register = React.createClass({
  registerFunction(){
    var self = this;
    fetch('https://hohoho-backend.herokuapp.com/register', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: self.state.username,
        password: self.state.password,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.success) {
        this.props.navigator.pop()
      } else {
        alert('Register failed')
      }
      /* do something with responseJson and go back to the Login view but
      * make sure to check for responseJson.success! */
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      alert(err);
    });
  },
  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.textBig}>Register</Text>
      <TextInput
      style={{height: 40, marginLeft: 20, marginRight: 20}}
      placeholder="Enter your username"
      onChangeText={(text) => this.setState({username: text})}
      />
      <TextInput
      secureTextEntry={true}
      style={{height: 40, marginLeft: 20, marginRight: 20}}
      placeholder="Enter your password"
      onChangeText={(text) => this.setState({password: text})}
      />
      <TouchableOpacity onPress={this.registerFunction}>
      <Text>Register</Text>
      </TouchableOpacity>
      </View>
    );
  }
});

//////// USERS
var Users = React.createClass({
  getInitialState(){
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows([])
    }
  },
  componentDidMount() {
    var self = this;
    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.success) {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        self.setState({
          dataSource: ds.cloneWithRows(responseJson.users)
        })
      } else {
        alert('something wrong in users')
      }
      /* do something with responseJson and go back to the Login view but
      * make sure to check for responseJson.success! */
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      alert(err);
    });
  },
  touchUser(user){
    var self = this;
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
      if(responseJson.success) {
        Alert.alert(
          'You sent a message to:',
          user.username,
          [{text: 'Ayyy'}] // Button
        )
      } else {
        Alert.alert(
          'Dang it',
          'Failed to send a message :/',
          [{text: 'Shiiieznitz!'}] // Button
        )
      }
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      alert(err);
    });
  },
  sendLocation(user){
    navigator.geolocation.getCurrentPosition(
      position => {
        var self = this;
        fetch('https://hohoho-backend.herokuapp.com/messages', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            to: user._id,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          })
        })
        .then((response) => response.json())
        .then((responseJson) => {
          if(responseJson.success) {
            Alert.alert(
              'You sent your location to:',
              user.username,
              [{text: 'Ayyy'}] // Button
            )
          } else {
            Alert.alert(
              'Dang it',
              'Failed to send location :/',
              [{text: 'Shiiieznitz!'}] // Button
            )
          }
        })
        .catch((err) => {
          /* do something if there was an error with fetching */
          alert(err);
        });
      },
      error => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  },
  render() {
    return(
      <View style={{marginLeft: 10, marginRight: 10, marginTop: 30, marginBottom: 10, alignItems: 'center'}}>
      <ListView
        dataSource={this.state.dataSource}
        style={{height: 1000, margin: 10, padding: 10}}
        renderRow={(rowData) => <TouchableOpacity>
          <Text onPress={this.touchUser.bind(this, rowData)}
          onLongPress={this.sendLocation.bind(this, rowData)}
          delayLongPress={500} // number milliseconds
          style={{borderBottomColor: 'black', borderWidth: 1, justifyContent: 'center', padding: 10, margin: 10}}>
          {rowData.username}
          </Text>
          </TouchableOpacity>}
      />
      </View>
    )
  }
});

///////// MESSAGES
var Messages = React.createClass({
  getInitialState(){
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows([]),
      refreshing: false
    }
  },
  refresh(){
    this.setState({
      refreshing: true
    });
    var self = this;
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.success) {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        self.setState({
          dataSource: ds.cloneWithRows(responseJson.messages),
          refreshing: false
        })
      } else {
        Alert.alert(
          'Dang it',
          'Failed to send a message :/',
          [{text: 'Shiiieznitz!'}] // Button
        )
      }
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      alert(err);
    });
  },
  componentDidMount(){
    var self = this;
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.success) {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        self.setState({
          dataSource: ds.cloneWithRows(responseJson.messages)
        })
      } else {
        Alert.alert(
          'Dang it',
          'Failed to send a message :/',
          [{text: 'Shiiieznitz!'}] // Button
        )
      }
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      alert(err);
    });
  },
  render() {
    return(
      <View style={{marginLeft: 10, marginRight: 10, marginTop: 30, marginBottom: 10, alignItems: 'center'}}>
      <ListView
      refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this.refresh.bind(this)}
      />}
      dataSource={this.state.dataSource}
      style={{height: 1000}}
      renderRow={(rowData) => <TouchableOpacity>
          <Text style={{borderBottomColor: 'black', borderWidth: 1, justifyContent: 'center', padding: 10}}>
          From: {rowData.from.username} || To: {rowData.to.username} {rowData.timestamp}


          {(rowData.location && rowData.location.longitude) ?
            <View style={{width: 400, height: 200, alignItems: 'center'}}>
            <MapView
              style={{width: 400, height: 150, margin: 40, alignItems: 'center'}}

              scrollEnabled={false}
              region={{
                latitude: rowData.location.latitude,
                longitude: rowData.location.longitude,
                longitudeDelta: 1,
                latitudeDelta: 1
              }}
              annotations={[{
                latitude: rowData.location.latitude,
                longitude: rowData.location.longitude,
                title: "Pinged Location"
              }]}
            /></View> : null }
            </Text>

          </TouchableOpacity>}
      />
      </View>
    )
  }
})

////// LOGIN
var Login = React.createClass({
  getInitialState(){
    return {
        username: '',
        password: '',
        message: '',
        users: []
    }
  },
  componentDidMount() {
    var self = this;
    AsyncStorage.getItem('user')
    .then(result => {
      var parsedResult = JSON.parse(result);
      var parsedUsername = parsedResult.username;
      var parsedPassword = parsedResult.password;
      if (parsedUsername && parsedPassword) {
        return fetch('https://hohoho-backend.herokuapp.com/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: parsedUsername,
            password: parsedPassword
          })
        })
        .then(response => response.json())
        .then((responseJson) => {
          if(responseJson.success) {
            self.props.navigator.push({
              component: Users,
              title: "Users",
              rightButtonTitle: 'Messages',
              onRightButtonPress: this.messages
            })
          } // otherwise do nothing
        });
      }
      // Don't really need an else clause, we don't do anything in this case.
    })
    .catch(err => {})
  },
  messages() {
    this.props.navigator.push({
      component: Messages,
      title: 'Messages'
    })
  },
  pressLogin() {
    var self = this;
    fetch('https://hohoho-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: self.state.username,
        password: self.state.password
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.success) { // need to change this later !!!!
        AsyncStorage.setItem('user', JSON.stringify({
          username: self.state.username,
          password: self.state.password
        }));
        self.props.navigator.push({
          component: SwiperView,
          title: "Users",
          rightButtonTitle: 'Messages',
          onRightButtonPress: this.messages
        })
      } else {
        this.setState({
          message: responseJson.error
        })
      }
      /* do something with responseJson and go back to the Login view but
      * make sure to check for responseJson.success! */
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      alert(err);
    });
  },
  register() {
    this.props.navigator.push({
      component: Register,
      title: "Register",
    });
  },
  render() {
    return (
      <View style={styles.container}>

      {this.state.message.length > 0 && <Text>{this.state.message}</Text>}

      <Text style={styles.textBig}>Login</Text>
      <TextInput
      style={{height: 40, marginLeft: 20, marginRight: 20}}
      placeholder="Enter your username"
      onChangeText={(text) => this.setState({username: text})}
      />
      <TextInput
      secureTextEntry={true}
      style={{height: 40, marginLeft: 20, marginRight: 20}}
      placeholder="Enter your password"
      onChangeText={(text) => this.setState({password: text})}
      />

      <TouchableOpacity style={[styles.button, styles.buttonGreen]} onPress={this.pressLogin}>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={this.register}>
          <Text style={styles.buttonLabel}>Tap to Register</Text>
        </TouchableOpacity>
      </View>
    );
  }
});

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

AppRegistry.registerComponent('hohoho', () => hohoho );
