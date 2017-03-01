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
  Button
} from 'react-native'

// This is the root view
var hohoho = React.createClass({
  render() {
    return (<NavigatorIOS initialRoute={{
      component: Login,
      title: "Login"
    }} style={{
      flex: 1
    }}/>);
  }
});

var Register = React.createClass({

  submit(){
    console.log(this);
    //post request this.state.password, this.state.username
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
      console.log(responseJson);
      /* do something with responseJson and go back to the Login view but
       * make sure to check for responseJson.success! */
       if (responseJson.success === true){
         // redirect to Login view
         this.props.navigator.pop();

       } else {
         alert("Registration failed. Error: " + responseJson.error);
       }
    })
    .catch((err) => {
      alert(err)/* do something if there was an error with fetching */
    });
  },

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>
        <TextInput style={{
          height: 40
        }} placeholder="Enter your username" onChangeText={(text) => this.setState({username: text})}/>
        <TextInput style={{
          height: 40
        }} placeholder="Enter your password" secureTextEntry={true} onChangeText={(text) => this.setState({password: text})}/>
        <Button title="Submit" style={{
          fontSize: 20
        }} onPress={this.submit}></Button>
      </View>

    );
  }


});

var Log = React.createClass({

  submit(){
    console.log(this);
    //post request this.state.password, this.state.username
    fetch('https://hohoho-backend.herokuapp.com/login', {
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
      console.log(responseJson);
      /* do something with responseJson and go back to the Login view but
       * make sure to check for responseJson.success! */
       if (responseJson.success === true){
         // redirect to Login view
         this.props.navigator.push({
           component: Register,
           title: "Register"
         })
       } else {
         alert("Login failed. Error: " + responseJson.error);
       }
    })
    .catch((err) => {
      alert(err)/* do something if there was an error with fetching */
    });
  },

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login</Text>
        <TextInput style={{
          height: 40
        }} placeholder="Enter your username" onChangeText={(text) => this.setState({username: text})}/>
        <TextInput style={{
          height: 40
        }} placeholder="Enter your password" secureTextEntry={true} onChangeText={(text) => this.setState({password: text})}/>
        <Button title="Submit" style={{
          fontSize: 20
        }} onPress={this.submit}></Button>
      </View>

    );
  }


});

var Login = React.createClass({
  press() {
    this.props.navigator.push({component: Log, title: "Login"});
  },
  register() {
    this.props.navigator.push({component: Register, title: "Register"});
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
    backgroundColor: '#F5FCFF'
  },
  containerFull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  textBig: {
    fontSize: 36,
    textAlign: 'center',
    margin: 10
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
    backgroundColor: '#FF585B'
  },
  buttonBlue: {
    backgroundColor: '#0074D9'
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
