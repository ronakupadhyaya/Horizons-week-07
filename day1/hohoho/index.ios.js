import React, {Component} from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  NavigatorIOS,
  Alert,
  ListView
} from 'react-native'

// This is the root view
var hohoho = React.createClass({
  getInitialState() {
    return {
      username: '',
      password: '',
      typedUser: '',
      typedPwd: ''
    }
  },
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
  registering() {
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
    .then((resp) => resp.json())
    .then((json) => {
      this.props.navigator.pop();
    })
  },
  render() {
    return (
      <View style={styles.container}>
      <TextInput
      style={styles.inputField}
      placeholder='Enter your username'
      onChangeText={(text) => this.setState({
        username: text
      })}/>
      <TextInput
      style={styles.inputField}
      secureTextEntry={true}
      placeholder='Enter your password'
      onChangeText={(pwd) => this.setState({
        password: pwd
      })}/>
      <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={this.registering}>
      <Text style={styles.buttonLabel}>Register</Text>
      </TouchableOpacity>

      </View>
    );
  }
});

var LoggingIn = React.createClass({
  loggingIn() {

    fetch('https://hohoho-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.typedUser,
        password: this.state.typedPwd
      })
    })
    .then((resp) => resp.json())
    .then((json) => {
      console.log('Login success');
      this.props.navigator.push({
        component: Users,
        title: 'All Users',
        rightButtonTitle: 'Messages',
        onRightButtonPress: this.messages
      })
    })
    .catch((err) => console.log('Error: ', err))

  },
  messages() {
    this.props.navigator.push({
      component: Messages,
      title: 'Messages'
    })
  },
  render() {
    return (
      <View style={styles.container}>
      <TextInput
      style={styles.inputField}
      placeholder='Enter your username'
      onChangeText={(text) => this.setState({
        typedUser: text
      })}/>
      <TextInput
      style={styles.inputField}
      secureTextEntry={true}
      placeholder='Enter your password'
      onChangeText={(pwd) => this.setState({
        typedPwd: pwd
      })}/>
      <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={this.loggingIn}>
      <Text style={styles.buttonLabel}>Login</Text>
      </TouchableOpacity>

      </View>
    )
  }
})

var Messages = React.createClass({
  getInitialState() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method:'GET',
      headers: {
        "Content-Type": "application/json"
      }})
      .then((resp) => resp.json())
      .then((json) => {
        this.setState({
          dataSource: ds.cloneWithRows(json.messages)
        })
      })
      .catch((err) => console.log('Error', err))

    return {
      dataSource: ds.cloneWithRows([])
    }
  },
  render() {
    console.log('users: ', this.state.dataSource);
    return (

      <View>
      <ListView dataSource={this.state.dataSource}
      renderRow={(rowData) =>
        <View>

        <Text style={styles.msg}>TO: {rowData.to.username}</Text>
      <Text style={styles.msg}>FROM: {rowData.from.username}</Text>
    <Text style={styles.msg}>MSG: {rowData.body}</Text></View>}
      />

      </View>
    )
  }
});

var Users = React.createClass({
  getInitialState() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    fetch('https://hohoho-backend.herokuapp.com/users', {
      method:'GET',
      headers: {
        "Content-Type": "application/json"
      }})
      .then((resp) => resp.json())
      .then((json) => {
        this.setState({
          dataSource: ds.cloneWithRows(json.users)
        })
      })
      .catch((err) => console.log('Error', err))

    return {
      dataSource: ds.cloneWithRows([])
    }
  },
  touchUser(item) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: item._id
      })
    })
    .then((resp) => resp.json())
    .then((json) => {
      console.log('suhhhh', json);
      Alert.alert(
      'Success',
      'Your message to ' + item.username + ' has been sent.',
      [{text: 'Cool'}]
    )})
    .catch((err) => console.log('Error: ', err))
  },
  render() {
    console.log('users: ', this.state.dataSource);
    return (

      <View style={styles.container}>
      <ListView dataSource={this.state.dataSource}
      renderRow={(rowData) =>
        <TouchableOpacity onPress={this.touchUser.bind(this, rowData)}>
        <Text style={styles.names}>{rowData.username}</Text>
        </TouchableOpacity>}
      />
      </View>
    )
  }
});

var Login = React.createClass({
  press() {
    this.props.navigator.push({
      component: LoggingIn,
      title: 'Login'
    })

  },
  register() {
    this.props.navigator.push({
      component: Register,
      title: "Register"
    });
  },
  messges() {
    this.props.navigator.push({
      component: Messages,
      title: 'View messages'
    })
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
  names: {
    alignSelf:'center',
    borderBottomWidth: 2,
    borderColor: 'pink',
    marginTop: 5
  },
  msg: {
    alignSelf:'flex-start',
    borderBottomWidth: 2,
    borderColor: 'pink',
    marginTop: 5
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
  inputField: {
    alignSelf: 'stretch',
    paddingTop: 10,
    height: 40,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray'
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
