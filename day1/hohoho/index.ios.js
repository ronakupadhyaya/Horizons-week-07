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

var Register = require('./register.ios.js');
var Users = require('./users.ios.js');
var LoginForm = require('./loginform.ios.js');
var Login = require('./login.ios.js');
var Messages = require('./messages.ios.js');

const styles = require('./styles.ios.js');

AppRegistry.registerComponent('hohoho', () => hohoho);
