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
var LoginForm = require('./loginform.ios.js');
var Register = require('./register.ios.js');



var Login = React.createClass({
  press() {
    this.props.navigator.push({component: LoginForm, title: "Login"});
  },
  register() {
    this.props.navigator.push({component: Register, title: "Register"});
  },
  messages(){
    this.props.navigator.push({component: Messages, title: "Messages"});
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

module.exports = Login;
