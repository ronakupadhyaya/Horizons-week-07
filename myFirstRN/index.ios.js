/**
* Sample React Native App
* https://github.com/facebook/react-native
* @flow
*/

import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ListView
} from 'react-native';
var _ = require('underscore');

export default class myFirstRN extends Component {

  constructor() {
    super();

    this.state = {
      count: 0
    };

  }

  add() {
    this.setState({
      count: this.state.count + 1
    });
  }

  subtract() {
    this.setState({
      count: this.state.count - 1
    });
  }
  render() {

    return (
      <View style={styles.container}>
        <Text>{this.state.count}</Text>

        <TouchableOpacity onPress={this.add.bind(this)}>
          <Text>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.subtract.bind(this)}>
          <Text>Subtract</Text>
        </TouchableOpacity>

      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  button: {
    fontSize: 40
  }
});

AppRegistry.registerComponent('myFirstRN', () => myFirstRN);
