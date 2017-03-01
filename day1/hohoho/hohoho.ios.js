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
var Login = require('./login.ios.js');
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


module.exports = hohoho;
