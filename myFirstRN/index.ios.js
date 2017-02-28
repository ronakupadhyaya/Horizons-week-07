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
      textSize: 40
    };

    this.state = {
      //dataSource: dataSource.cloneWithRows(_.range(100))
      show: true
    };

  }

  remove() {
    this.setState({
        show: false
      });
  }

  render() {

    return (
      <View style={styles.container}>
        {this.state.show &&
          <TouchableOpacity onPress={this.remove.bind(this)} style={{
          width: 50,
          height: 50,
          backgroundColor: 'red'
          }}>
          </TouchableOpacity>
        }

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
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between'
  },
  button: {
    fontSize: 40
  }
});

AppRegistry.registerComponent('myFirstRN', () => myFirstRN);
