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

  remove(item) {
    this.setState({
      numbers: this.state.numbers.filter((curItem) => (item !== curItem))
    });
  }

  render() {
    var dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => (r1 !== r2)
    });

    return (
      <View style={styles.container}>
        <ListView dataSource={dataSource.cloneWithRows(this.state.numbers)} renderRow={(item) => (
          <TouchableOpacity style={styles.button} onPress={this.remove.bind(this, item)}>
            <Text>{item}</Text>
          </TouchableOpacity>
        )}>
        </ListView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,

    backgroundColor: '#FFFFFF'
  },
  button: {
    alignItems: 'center',
  }
});

AppRegistry.registerComponent('myFirstRN', () => myFirstRN);
