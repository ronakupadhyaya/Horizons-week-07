import React, {Component} from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  NavigatorIOS,
  ListView
} from 'react-native'

class Messages extends Component{
  constructor() {
    super();
    var ds = new ListView.DataSource({
      rowHasChanged: (r1,r2) => (r1 !== r2)
    });

    this.state = {
      dataSource: ds.cloneWithRows([])
    };

    fetch('https://hohoho-backend.herokuapp.com/messages')
    .then((response) => {
      return response.json();
    })
    .then((responseJson) => {
      console.log('########');
      console.log(responseJson);
      this.setState({
        dataSource: ds.cloneWithRows(responseJson.messages)
      });
    })
    .catch(error => {
      console.log('error', error);
    });
  }

  render(){
    return(
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) =>
          <View style={{backgroundColor: '#b6cbed', borderColor: '#527FE4', borderWidth: 5, padding: 10}}>
            <Text>From: {rowData.from.username}</Text>
            <Text>To: {rowData.to.username}</Text>
            <Text>Message: {rowData.body}</Text>
            <Text>When: {rowData.timestamp}</Text>
          </View>}
      />
    );
  }
}


class Users extends Component{

  constructor() {
    super();
    var ds = new ListView.DataSource({
      rowHasChanged: (r1,r2) => (r1 !== r2)
    });

    this.state = {
      dataSource: ds.cloneWithRows([])
    };


    fetch('https://hohoho-backend.herokuapp.com/users')
    .then((response) => {
      return response.json();
    })
    .then((responseJson) => {
      this.setState({
        dataSource: ds.cloneWithRows(responseJson.users)
      });
    })
    .catch(error => {
      console.log('error', error);
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
      /* do something with responseJson and go back to the Login view but
      * make sure to check for responseJson.success! */
      if(responseJson.success){
        var username = user.username;
        Alert.alert(
          'Success',
          'Your HoHoHo to ' + username + 'has been sent.',
          [{text: 'Cool'}] // Button
        );
      }else{
        Alert.alert(
          'Failure',
          'Your HoHoHo to ' + username + 'DID NOT send.',
          [{text: 'Shit'}] // Button
        );
      }
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log("error: ", err);
    });

  }

  render(){
    return(
      <ListView
      dataSource={this.state.dataSource}
      renderRow={(rowData) =>
        <TouchableOpacity onPress={this.touchUser.bind(this, rowData)}>
          <View style={{backgroundColor: '#2ecc71', borderColor: '#9b59b6', borderWidth: 2.5, padding: 10}}>
            <Text>{rowData.username}</Text>
          </View>
        </TouchableOpacity>}
      />
    );
  }
}

// This is the root view
class hohoho extends Component{
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
}


class Register extends Component{

  constructor(){
    super();
    this.state = {
      username: '',
      password: ''
    };
  }


  submitReg(){
    console.log(this.state.username);
    // console.log(this.state.username);
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
      this.props.navigator.pop();
    })
    .catch((err) => {
      console.log("error: ", err);
    });

  }

  render() {
    return (
      <View style={{flex:1,alignItems: 'center', justifyContent:'center'}}>
      <TextInput
      style={{height: 40, paddingLeft: 100}}
      placeholder="Enter your username"
      onChangeText={(text) => this.setState({username: text})}
      />
      <TextInput
      style={{height: 40, paddingLeft: 100}}
      secureTextEntry={true}
      placeholder="Enter your password"
      onChangeText={(text) => this.setState({password: text})}
      />
      <TouchableOpacity onPress={this.submitReg.bind(this)}>
      <View style={{height:35, width:200, backgroundColor: '#FF585B'}}>
      <Text style={{paddingLeft: 70, paddingTop: 8, color:'white'}}>
      Register
      </Text>
      </View>
      </TouchableOpacity>
      </View>
    );
  }
}

class LoginPage extends Component{

  constructor(){
    super();
    console.log('this.props', this.props);
    this.state = {
      username: '',
      password: '',
      error: ''
    };
  }

  login(){
    console.log('Login function');

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
      /* do something with responseJson and go back to the Login view but
      * make sure to check for responseJson.success! */
      console.log(responseJson);

      if(responseJson.success){
        console.log(this.props);
        this.props.navigator.push({
          component: Users,
          title: "Users",
          rightButtonTitle: 'Messages',
          onRightButtonPress: this.props.messages.bind(this)
        });
      } else{
        console.log('Hello world');
        this.setState({
          error: responseJson.error
        });
      }

    })
    .catch((err) => {
      /* do something if there was an error with fetching */
      console.log('error', err);
    });
  }

  render() {
    return (
      <View style={{flex:1,alignItems: 'center', justifyContent:'center'}}>
      <TextInput
      style={{height: 40, paddingLeft: 100}}
      placeholder="Enter your username"
      onChangeText={(text) => this.setState({username: text})}
      />
      <TextInput
      style={{height: 40, paddingLeft: 100}}
      secureTextEntry={true}
      placeholder="Enter your password"
      onChangeText={(text) => this.setState({password: text})}
      />
      <TouchableOpacity onPress={this.login.bind(this)}>
      <View style={{height:35, width:200, backgroundColor: '#FF585B'}}>
      <Text style={{paddingLeft: 80, paddingTop: 8, color:'white'}}>
      Login
      </Text>
      </View>
      </TouchableOpacity>
      <Text>{this.state.error}</Text>
      </View>
    );
  }
}

class Login extends Component{
  press() {
    console.log('this.props.navigator', this.props.navigator);
    this.props.navigator.push({
      component: LoginPage,
      title: "Login User",
      passProps: { messages: this.messages }
    });
  }

  messages(){
    this.props.navigator.push({
      component: Messages,
      title: "Messages"
    });
  }

  register() {
    this.props.navigator.push({
      component: Register,
      title: "Register"
    });
  }
  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.textBig}>Login to HoHoHo!</Text>
      <TouchableOpacity onPress={this.press.bind(this)} style={[styles.button, styles.buttonGreen]}>
      <Text style={styles.buttonLabel}>Tap to Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={this.register.bind(this)}>
      <Text style={styles.buttonLabel}>Tap to Register</Text>
      </TouchableOpacity>
      </View>
    );
  }
}

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
