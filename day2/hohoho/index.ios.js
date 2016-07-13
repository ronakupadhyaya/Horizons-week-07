import React, {Component} from 'react'
import {
  AppRegistry,
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  NavigatorIOS,
  ListView
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

var Register = React.createClass({
  register(){
    fetch('https://hohoho-backend.herokuapp.com/register', {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      if(responseJson.success){
        this.props.navigator.push({
          component: Login,
          title: 'Logged In'
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
  },
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
          secureTextEntry={true}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={this.register}>
          <Text style={styles.buttonLabel}>Tap to Register</Text>
        </TouchableOpacity>
      </View>
    );
  }
});

var Messages = React.createClass({
  getInitialState() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var state = {dataStore:ds.cloneWithRows([])};
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET',
      headers: {
        "Accept": 'application/json',
        "Content-Type": "application/json"
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({ dataStore: ds.cloneWithRows(responseJson.messages) })
    })
    .catch((err) => {
      console.log(err);
    });
    return state;
  },
  render() {
    return(
      <View style={styles.container}>
      <ListView
        dataSource={this.state.dataStore}
        renderRow={(rowData) => <View style={styles.messageContainer}>
          <Text>From {rowData.from.username}</Text>
          <Text>To {rowData.to.username}</Text>
          <Text>at {rowData.timestamp}</Text>
          </View>
        }
      />
      </View>
    )
  }
});

var Users = React.createClass({
  getInitialState() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var state = { dataStore:ds.cloneWithRows([]) };
    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {
        "Accept": 'application/json',
        "Content-Type": "application/json"
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({ dataStore: ds.cloneWithRows(responseJson.users) })
    })
    .catch((err) => {
      console.log(err);
    });
    return state;
  },
  touchUser(user) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: user._id
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      if(responseJson.success){
        Alert.alert(
          'Success',
          'Your HOHOHO! to ' + user.username + ' has been sent',
          [{text: 'Dismiss Button'}] // Button
        )
      }else{
        Alert.alert(
          'Errorr',
          'Your HOHOHO! to ' + user.username + ' could not be sent',
          [{text: 'Dismiss Button'}] // Button
        )
      }
    })
    .catch((err) => {
      console.log(err);
    });
  },
  press(){
    this.props.navigator.push({
      component: Messages,
      title: "Messages"
    });
  },
  render() {
    return(
      <View style={styles.container}>
      <ListView
        dataSource={this.state.dataStore}
        renderRow={(rowData) => <TouchableOpacity onPress={this.touchUser.bind(this, rowData)}>
          <Text>{rowData.username}</Text>
            </TouchableOpacity>
        }
      />
      </View>
    )
  }
});

var Home = React.createClass({
  press() {
    this.props.navigator.push({
      component: Messages,
      title: "Messages"
    });
  },
  users() {
    this.props.navigator.push({
      component: Users,
      title: "Users"
    });
  },
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Pick Your Page!</Text>
        <TouchableOpacity onPress={this.press} style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={this.users}>
          <Text style={styles.buttonLabel}>Users</Text>
        </TouchableOpacity>
      </View>
    );
  }
})

var Login = React.createClass({
  press() {
    fetch('https://hohoho-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      if(responseJson.success){
        this.props.navigator.push({
          component: Home,
          title: 'Home',
          rightButtonTitle: 'Messages',
          onRightButtonPress: this.messages
        });
      }else{
        this.setState({message: responseJson.error})
      }
    })
    .catch((err) => {
      console.log(err);
    });
  },
  messages() {
    this.props.navigator.push({
      component: Messages,
      title: 'Messages'
    });
  },
  register() {
    this.props.navigator.push({
      component: Register,
      title: "Register"
    });
  },
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <Text></Text>
        <TextInput
          style={{height: 40}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{height: 40}}
          secureTextEntry={true}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity onPress={this.press} style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Tap to Login</Text>
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
  messageContainer: {
    flex: 1,
    textAlign: 'left',
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
