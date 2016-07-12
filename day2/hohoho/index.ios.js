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
    return {
      username: '',
      password: '',
    }
  },
  reg() {
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
      if (responseJson.success)
        this.props.navigator.pop()
      else this.render()
      /* do something with responseJson and go back to the Login view but
       * make sure to check for responseJson.success! */
    })
    .catch((err) => {
      console.log('ERROR: ',err)
      this.render()
      /* do something if there was an error with fetching */
    });
  },
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>
        <TextInput
          style={styles.logreg}
          placeholder="Enter your username"
          autoFocus={true}
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={styles.logreg}
          placeholder="Enter your password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={this.reg}>
          <Text style={styles.buttonLabel}>Submit</Text>
        </TouchableOpacity>
      </View>
    );
  }
});

var Messages = React.createClass({
  getInitialState() {
    return {
      dataStore: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      me: ''
    }
  },
  componentWillMount() {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET',
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log('got json')
      console.log(responseJson)
      if (responseJson.success) 
        this.setState({dataStore: responseJson.messages})
    })
    .catch((err) => {
      console.log('ERROR: ',err)
    });
    fetch('https://hohoho-backend.herokuapp.com/login/success', {
      method: 'GET'
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({me:responseJson.user.username})
    })
  },
  render() {
    return (
      <View style={styles.container}>
        <ListView style={{alignSelf:'stretch'}}
          dataSource={this.state.dataStore}
          renderRow={(rowData) => (
            <View>
            <Text style={this.state.me === rowData.to.username ? styles.from : styles.to}>{rowData.from.username}</Text>
            <TouchableOpacity style={[styles.friendButton, styles.buttonBlue]}>
            <Text style={styles.friend}>{rowData.body}</Text>
            </TouchableOpacity>
            </View>
            )}
        />
      </View>
    )
  }
})

var Users = React.createClass({
  getInitialState() {
    return {
      dataStore: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    }
  },
  messages() {
    this.props.navigator.push({
      component: Messages,
      title: 'Messages'
    });

  },
  poke(data) {
    console.log('poke hit')
    console.log(data._id)
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
         "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: data._id
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log('got json')
      console.log(responseJson)
      if (responseJson.success) 
        Alert.alert(
          'Success',
          'Your HoHoHo to '+data.username+' has been sent!',
          [{text: 'neat'}] // Button
        )
    })
    .catch((err) => {
      console.log('ERROR: ',err)
    });
  },
  componentWillMount() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    
    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({dataStore: ds.cloneWithRows(responseJson.users)})
    })
    .catch((err) => {
      console.log('ERROR: ',err)
    });
  },
  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={this.messages}>
            <Text style={styles.buttonLabel}>All Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonBlue]}>
            <Text style={styles.buttonLabel}>Other</Text>
          </TouchableOpacity>
        </View>
        <ListView style={{alignSelf:'stretch'}}
          dataSource={this.state.dataStore}
          renderRow={(rowData) => (<TouchableOpacity style={[styles.friendButton, styles.buttonBlue]} onPress={this.poke.bind(this,rowData)}>
            <Text style={styles.friend}>{rowData.username}</Text>
            </TouchableOpacity>)}
        />
      </View>
    )
  }
})

var Enter = React.createClass({
  getInitialState() {
    return {
      username: '',
      password: '',
      incorrectPass: '',
    }
  },
  login() {
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
      console.log(responseJson.success)
      if (responseJson.success) {
        this.setState({incorrectPass:''})
        this.props.navigator.push({
          component: Users,
          title: 'HOHOHO'
        })
        this.props.navigator.pop()
      }
      else this.setState({incorrectPass: 'incorrect username or password'})
      /* do something with responseJson and go back to the Login view but
       * make sure to check for responseJson.success! */
    })
    .catch((err) => {
      console.log('ERROR: ',err)
      this.render()
      /* do something if there was an error with fetching */
    });
  },
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.logreg}
          placeholder="username"
          autoFocus={true}
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={styles.logreg}
          placeholder="password"
          secureTextEntry={true}
          onChangeText={(text) => this.setState({password: text})}
        />
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={this.login}>
          <Text style={styles.buttonLabel}>Enter HoHoHo</Text>
        </TouchableOpacity>
        <Text style={styles.error}>{this.state.incorrectPass}</Text>
      </View>
    );
  }
});

var Login = React.createClass({
  press() {
    this.props.navigator.push({
      component: Enter,
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
  error: {
    color: '#ff2100',
    fontSize: 16,
    margin: 10,
    alignSelf: 'center'
  },
  logreg: {
    alignItems: 'center',
    alignSelf: 'stretch', 
    paddingTop: 5,
    paddingLeft: 5,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    height: 21,
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
  friend: {
    color: '#fff',
    textAlign: 'center'
  },
  from: {
    fontSize : 14,
    color: '#2e2e2e',
    textAlign: 'left',
  },
  message: {
    textAlign: 'left',
    color: '#fff',
    fontSize: 24,
  },
  to: {
    fontSize : 14,
    color: '#2e2e2e',
    textAlign: 'right',
  },
  friendButton: {
    alignSelf: 'stretch',
    paddingTop: 10,
    paddingBottom: 10,
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

AppRegistry.registerComponent('hohoho', () => hohoho);