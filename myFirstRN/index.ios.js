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
  ListView,
  Button
} from 'react-native';
var _ = require('underscore');

export default class myFirstRN extends Component {

  constructor() {
    super();

    this.state = {
      numbers: _.range(10)
    };
  }

  add() {
    var lastNum = this.state.numbers[this.state.numbers.length - 1];

    this.setState({
      numbers: this.state.numbers.concat(this.state.numbers[this.state.numbers.length - 1] + 1)
    });
  }
  remove() {
    this.setState({
      numbers: this.state.numbers.filter((curItem) => {
        return this.state.numbers[this.state.numbers.length - 1] !== curItem
      })
    });
  }

  removeOne(item) {
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
        <View>
          <Button title="Add" onPress={this.add.bind(this)}></Button>
          <Button title="Remove" onPress={this.remove.bind(this)}></Button>
        </View>
        <ListView dataSource={dataSource.cloneWithRows(this.state.numbers)} renderRow={(item) => (
          <TouchableOpacity style={styles.numbers} onPress={this.removeOne.bind(this, item)}>
            <Text>{item}</Text>
          </TouchableOpacity>
        )}></ListView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: '#FFFFFF'
  },
  numbers: {
    alignItems: 'center'
  }
});

AppRegistry.registerComponent('myFirstRN', () => myFirstRN);
