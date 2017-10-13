import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ListView,
  FlatList,
  Alert,
  Button,
  AsyncStorage
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Prompt from 'react-native-prompt'


//Screens
class LoginScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      username: '',
      password: ''
    }
  }
  static navigationOptions = {
    title: 'Login'
  };

  press(un, pw) {
    fetch('https://hohoho-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({username: un, password: pw})
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success === true) {
        this.props.navigation.navigate('Users')
      } else {
        alert(responseJson.error)
      }
    }).catch((err) => {
      alert(err.message)
    });
  }
  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <TextInput style={styles.textEntry} placeholder="Username" onChangeText={(text) => this.setState({username: text})}/>
        <TextInput style={styles.textEntry} secureTextEntry={true} placeholder="Password" onChangeText={(text) => this.setState({password: text})}/>
        <TouchableOpacity onPress={ () => {this.press(this.state.username,this.state.password)} } style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Tap to Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.register()} }>
          <Text style={styles.buttonLabel}>Tap to Register</Text>
        </TouchableOpacity>
        <View style={{
          height: 200
        }}></View>
      </View>
    )
  }
}

class RegisterScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      username: '',
      password: ''
    }
  }
  static navigationOptions = {
    title: 'Register'
  };
  submit(un, pw) {
    fetch('https://hohoho-backend.herokuapp.com/register', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({username: un, password: pw})
    })
    .then((response) => response.json())
    .then((responseJson) => {
      // console.log(responseJson);
      if (responseJson.success === true) {
        this.props.navigation.goBack()
      } else {
        alert(responseJson.error)
      }
    }).catch((err) => {
      alert(err.message)
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>
        <TextInput style={styles.textEntry} placeholder="Enter your username" onChangeText={(text) => this.setState({username: text})}/>
        <TextInput style={styles.textEntry} secureTextEntry={true} placeholder="Enter your password" onChangeText={(text) => this.setState({password: text})}/>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={() => {this.submit(this.state.username,this.state.password)}}>
          <Text style={styles.buttonLabel}>Tap to Register</Text>
        </TouchableOpacity>
        <View style={{
          height: 200
        }}></View>
      </View>
    )
  }
}

class Users extends React.Component {
  static navigationOptions = (props) => ({
    title: 'Users',
    headerRight: <TouchableOpacity onPress={() => {props.navigation.navigate('Messages')}} style={{margin: 10}}><Text>MSG</Text></TouchableOpacity>
  });

  constructor(props) {
    super(props)
    this.state = {
      users: [],
      promptVisible: true,
      message: ''
    }
    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    }).then((response) => response.json()).then((responseJson) => {
      if (responseJson.success === true) {
        this.setState({users: responseJson.users})
      } else {
        alert(responseJson.error)
      }
    }).catch((err) => {
      alert(err.message)
    });
  }


  touchUser(user, msg) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({to: user._id, body: msg})
    }).then((response) => response.json()).then((responseJson) => {
      if (responseJson.success === true) {
        Alert.alert('Success!', 'Your Ho Ho Ho! to '+ user.username +' has been sent!', [{text: 'Dismiss Button'}])
      } else {
        alert(responseJson.message)
        Alert.alert('Fuck!', 'Your Ho Ho Ho! to '+ user.username +' could not be sent!', [{text: 'Dismiss Button'}])
      }
    }).catch((err) => {
      alert(err.message)
    });
    }
    
  render() {
    return (
      <View style={styles.container}>
        <FlatList renderItem={({item}) =>
          <TouchableOpacity onPress={() => this.touchUser(item)} >
          <View style={styles.itemBox}>
            <Text style={styles.item}>{item.username}</Text>
          </View>
        </TouchableOpacity>} data={this.state.users}/>
      </View>
    )
  }
}

class Messages extends React.Component {
  static navigationOptions = {
    title: 'Messages'
  };
  constructor() {
    super()
    this.state = {
      msgs: []
    }
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    }).then((response) => response.json()).then((responseJson) => {
      console.log(responseJson);
      if (responseJson.success === true) {
        const msgs = responseJson.messages.map(msgObj => {
          let base = {};
          base.from = msgObj.from.username;
          base.to = msgObj.to.username;
          base.msg = msgObj.body;
          base.timestamp = msgObj.timestamp;
          return base
        })
        console.log(msgs);
        this.setState({msgs: msgs})
      } else {
        alert(responseJson.error)
      }
    }).catch((err) => {
      alert(err.message)
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <FlatList renderItem={({item}) =>
          <View style={styles.itemBox}>
            <Text style={styles.item}>{item.from} -> {item.to}</Text>
            <Text style={styles.item}>{item.timestamp}</Text>
            <Text style={styles.item}>{item.msg}</Text>
          </View>} data={this.state.msgs}/>
      </View>
    )
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
    screen: Users,
  },
  Messages: {
    screen: Messages,
  },
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
  textEntry: {
    height: 40,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    alignSelf: 'stretch',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5
  },
  item: {
    alignSelf: 'stretch',
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  itemBox: {
    height: 'auto',
    width: 300,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    alignSelf: 'stretch',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
