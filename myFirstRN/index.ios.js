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
      numbers: _.range(100)
    };

  }

  add() {
    this.setState({});
  }

  render() {
    var dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => (r1 !== r2)
    });

    return (
        <ListView dataSource={dataSource.cloneWithRows(this.state.numbers)} renderRow={(item) => (
          <Text>{item}</Text>
        )}>
        </ListView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  button: {
    fontSize: 40
  }
});

AppRegistry.registerComponent('myFirstRN', () => myFirstRN);
