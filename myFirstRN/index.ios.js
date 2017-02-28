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
      data: _.range(100)
    };

  }
  press(item) {
    alert('Pressed ' + item);
  };

  bigger() {
    this.setState({
      textSize: this.state.textSize + 5
    });
  }

  remove(item) {
    // console.log(this.state.dataSource.rowIdentities[0].splice(item, 1));
    this.setState({
      data: this.state.data.filter((curItem) => (item !== curItem))
    });
  }

  render() {
    var dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => (r1 !== r2)
    });

    return (
    <View style={styles.container}>


      <TouchableOpacity>
        <Text style={styles.button}>Button 1</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.button}>Button 2</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.button}>Button 3</Text>
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
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between'
  },
  button: {
    fontSize: 40
  }
});

AppRegistry.registerComponent('myFirstRN', () => myFirstRN);
