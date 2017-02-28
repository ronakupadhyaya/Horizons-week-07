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
    <View style={{flex: 1,
        marginTop:20,
        alignItems: 'center',

      }}>
      <TouchableOpacity style={{flex: 1,
          justifyContent: 'center',

        }}>
        <Text style={{
            fontSize: 40
          }}>Junjie is fat</Text>
        </TouchableOpacity>
    </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
});

AppRegistry.registerComponent('myFirstRN', () => myFirstRN);
