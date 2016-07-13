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

var Register = React.createClass({
  getInitialState() {
    return({
      username: null,
      password: null
    })
  },
  press() {
    fetch('https://hohoho-backend.herokuapp.com/register', {
      headers: {
         "Content-Type": "application/json"
      },
      method: 'POST',
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
    /* do something with responseJson and go back to the Login view but
    * make sure to check for responseJson.success! */
      if(responseJson.success) {
        this.props.navigator.pop();
      } else {
        console.log(responseJson.error);
      }
    })
    .catch((err) => {
    /* do something if there was an error with fetching */
      console.log(err);
    });
  },  
  render() {
    return (
      <View style={styles.container}>
        <TextInput style={{height: 40}} placeholder="Enter your username"
         onChangeText={(text) => this.setState({username: text})}/>
        <TextInput secureTextEntry={true} style={{height: 40}}      
         placeholder="Password" onChangeText={(text) => this.setState({password: text})}/>
        <TouchableOpacity onPress={this.press} style={[styles.button,        
         styles.buttonRed]}>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
      </View>
    );
  }
});

var Login2 = React.createClass({
  getInitialState() {
    return({
      username: null,
      password: null,
      message: null
    });
  },
  messages() {
    this.props.navigator.push({
      component: Messages,
      title: "Messages"
    })
  },
  press() {
    fetch('https://hohoho-backend.herokuapp.com/login', {
      headers: {
         "Content-Type": "application/json"
      },
      method: 'POST',
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
    /* do something with responseJson and go back to the Login view but
    * make sure to check for responseJson.success! */
      if(responseJson.success) {
        this.props.navigator.push({
          component: Users,
          title: "Users",
          rightButtonTitle: 'Messages',
          onRightButtonPress: this.messages
        });
      } else {
        this.setState({message: responseJson.error});
      }
    })
    .catch((err) => {
    /* do something if there was an error with fetching */
      console.log(err);
    });
  },
  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.message}</Text>
        <TextInput style={{height: 40}} placeholder="Enter your username"
         onChangeText={(text) => this.setState({username: text})}/>
        <TextInput secureTextEntry={true} style={{height: 40}}      
         placeholder="Password" onChangeText={(text) => this.setState({password: text})}/>
        <TouchableOpacity onPress={this.press} style={[styles.button,        
         styles.buttonRed]}>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }
});

var Users = React.createClass({
  getInitialState() {
  const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    fetch('https://hohoho-backend.herokuapp.com/users')
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        this.setState({
          dataSource: ds.cloneWithRows(responseJson.users)
        })
      }
    })
    return {
      dataSource: ds.cloneWithRows([])
    };
  },
  touchUser(user) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      headers: {
         "Content-Type": "application/json"
      },
      method: 'POST',
      body: JSON.stringify({
        to: user._id,
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        Alert.alert(
          'Success',
          'Your HoHoHo to ' + user.username + ' has been sent',
          [{text: 'Cool'}] // Button
        )
      } else {
        Alert.alert(
          'Failure',
          'Your HoHoHo to ' + user.username + ' could not be sent',
          [{text: 'Fuck'}]
        )
      }
    })
    .catch((err) => {
    /* do something if there was an error with fetching */
      console.log(err);
    });
  },
  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) => 
        <TouchableOpacity onPress={this.touchUser.bind(this, rowData)}>
          <Text>{rowData.username}</Text>
        </TouchableOpacity> } />
    )
  }
})

var Messages = React.createClass({
  getInitialState() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    fetch('https://hohoho-backend.herokuapp.com/messages')
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        this.setState({
          dataSource: ds.cloneWithRows(responseJson.messages)
        })
      }
    })
    return {
      dataSource: ds.cloneWithRows([])
    };
  },
  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) => <View><Text>From: {rowData.from.username}</Text>
                                <Text>To: {rowData.to.username}</Text>
                                <Text>Message: "Ho Ho Ho"</Text>
                                <Text>When: {rowData.timestamp}</Text></View>}/>
    )
  }
})

var Login = React.createClass({
  press() {
    this.props.navigator.push({
      component: Login2,
      title: 'Login'
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