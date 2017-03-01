import React, {Component} from 'react';
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
} from 'react-native';
const styles = require('./styles.ios.js');
var Register = require('./register.ios.js');
var Users = require('./users.ios.js');
var LoginForm = React.createClass({

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
           component: Users,
           title: "Users"
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

module.exports = LoginForm;
