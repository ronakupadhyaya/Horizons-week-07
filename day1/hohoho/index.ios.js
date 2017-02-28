import React, {Component} from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  NavigatorIOS,
  ListView,
  Alert
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

var Users = React.createClass({
  getInitialState(){
    const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
    fetch('https://hohoho-backend.herokuapp.com/users')
    .then((responseJson) => (responseJson.json()))
    .then((response) => {
      console.log(response)
      if(response.success){
        console.log(response,'helllllo')
        this.setState({
          dataSource: ds.cloneWithRows(response.users)
        })
      } else {
        console.log('error')
      }
    })
    return {
      dataSource: ds.cloneWithRows([])
    }
  },
  render(){
    return (
      <View style={styles.container}>
      <ListView
      dataSource={this.state.dataSource}
      renderRow={(rowData) => <View style={styles.container}>
      <TouchableOpacity onPress={this.touchUser.bind(this, rowData)}>
      <Text>{rowData.username}</Text></TouchableOpacity>
      </View>} />
      </View>
    )
  },
  touchUser(user){
    fetch('https://hohoho-backend.herokuapp.com/messages',{
      method:'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: user._id
      })
    })
    .then((response) => response.json())
    .then((respJson) => {
      if(respJson.success){
        Alert.alert(
          'WOW!',`Your Ho Ho Ho! to ${user.username} has been sent!`,
          [{text:'Cool'}]
        )
      } else {
        Alert.alert(
          'LOL!',`You're a Ho Ho Ho!`,
          [{text:'Thanks!'}])
      }
    })
  }
});

var Messages = React.createClass({
  getInitialState(){
    const ds = new ListView.DataSource({rowHasChanged: (r1,r2) => r1 !== r2});
    fetch('https://hohoho-backend.herokuapp.com/messages')
    .then((responseJson) => (responseJson.json()))
    .then((response) => {
      console.log(response)
      if(response.success){
        console.log(response,'helllllo')
        this.setState({
          dataSource: ds.cloneWithRows(response.messages)
        })
      } else {
        console.log('error')
      }
    })
    return {
      dataSource: ds.cloneWithRows([])
    }
  },
  render(){
    return(
      <View>
      <ListView
      dataSource={this.state.dataSource}
      renderRow={(rowData) => <View style={styles.container}>
      <Text>From: {rowData.from.username}</Text>
      <Text>To: {rowData.to.username}</Text>
      <Text>Time: {rowData.timestamp}</Text>
      </View> } />
      </View>
    )
  }
})

var Register = React.createClass({
  getInitialState(){
    return {
      username: '',
      password: ''
    }
  },
  register(){
    fetch('https://hohoho-backend.herokuapp.com/register', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.success){
        console.log(responseJson)
        this.props.navigator.pop()
      }
    })
    .catch((err) => {
      console.log('ERROR', err);
    });
  },
  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.press}>Register</Text>

      <TextInput
      style={{height: 40}}
      placeholder="Enter your username"
      onChangeText={(text) => this.setState({username: text})}
      />
      <TextInput
      style={{height: 40}}
      placeholder="Enter a password"
      secureTextEntry={true}
      onChangeText={(text) => this.setState({password: text})}
      />
      <View>
      <TouchableOpacity style={styles.buttonRed} onPress={this.register}>
      <Text>Submit</Text>
      </TouchableOpacity>
      </View>

      </View>
    );
  }
});

var Login = React.createClass({
  getInitialState(){
    return {
      username: '',
      password: '',
    }
  },
  press() {
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
      if(responseJson.success) {
        self.props.navigator.push({
          component: Users,
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
      title: "Register"
    });
  },
  messages(){
    this.props.navigator.push({
      component: Messages,
      title: "Messages"
    })
  },
  render() {
    return (
      <View style={styles.container}>
      <Text>{this.state.message}</Text>
      <Text style={styles.textBig}>Login to HoHoHo!</Text>
      <TextInput
      style={{height: 40}}
      placeholder="Enter your username"
      onChangeText={(text) => this.setState({username: text})}
      />
      <TextInput
      style={{height: 40}}
      placeholder="Enter a password"
      secureTextEntry={true}
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
