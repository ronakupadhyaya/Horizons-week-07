import React, {Component} from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  NavigatorIOS,
  Button,
  ListView
} from 'react-native'

// This is the root view
var hohoho = React.createClass({
  getInitialState(){
    return {
      username: "",
      password: ""
    }
  },
  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          component: Login,
          title: "Login",
          passProps: {parent: this}
        }}
        style={{flex: 1}}
      />
    );
  }
});

var Register = React.createClass({
  press(){
    if(this.props.parent.state.username && this.props.parent.state.password){
      fetch('https://hohoho-backend.herokuapp.com/register', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: this.props.parent.state.username,
          password: this.props.parent.state.password
        })
      })
      .then((response)=> response.json())
      .then((responseJson)=> {
        console.log(responseJson);
        if(!responseJson.success){
          alert("This is wrong")
        }else {
          this.props.navigator.pop();
        }
      })
      .catch((err)=> {
        console.log("error", err);
      });
    }
  },
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>
        <TextInput
          style={{height: 40}}
          placeholder="Enter your username"
          onChangeText={(text) => this.props.parent.setState({username: text})}
        />
        <TextInput
          style={{height: 40}}
          placeholder="Enter your password"
          secureTextEntry={true}
          onChangeText={(text) => this.props.parent.setState({password: text})}
        />
        <TouchableOpacity>
          <Button
          title="register"
          style={styles.buttonRed}
          onPress={this.press}
          />
        </TouchableOpacity>
      </View>
    );
  }
});

var Login = React.createClass({
  press() {
    fetch('https://hohoho-backend.herokuapp.com/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.props.parent.state.username,
        password: this.props.parent.state.password
      })
    })
  },
  register() {
    this.props.navigator.push({
      component: Register,
      title: "Register",
      passProps: {parent: this.props.parent}
    });
  },
  render() {
    return (
      <View style={styles.container}>
      <TextInput
        style={{height: 40}}
        placeholder="username"
        value={this.props.parent.state.username}
        onChangeText={(text) => this.props.parent.setState({username: text})}
      />
      <TextInput
        style={{height: 40}}
        placeholder="password"
        secureTextEntry={true}
        value={this.props.parent.state.password}
        onChangeText={(text) => this.props.parent.setState({password: text})}
      />
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
