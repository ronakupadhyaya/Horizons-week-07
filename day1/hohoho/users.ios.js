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


var Users = React.createClass({
  render() {
    return (
      <View></View>
    )
  }
})
//   fetch('https://horizons-json-cors.s3.amazonaws.com/poem.txt')
//   .then((resp) => {
//     return resp.text();
//   })
//   .then((text)=> {
//     console.log(text.split(" ").length);
//     this.setState({
//       length: text.split(" ").length
//     });
//   })
//   .catch((err) => {
//     console.log(err);
//     console.log('error', err);
//   });


module.exports = Users;
