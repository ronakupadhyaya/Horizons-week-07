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
    var dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => (r1 !== r2)
    });
    this.state = {
      dataSource: dataSource.cloneWithRows(_.range(100))
    };

  }
  press(item){
    alert('Pressed ' + item);
  };

  bigger() {
    this.setState({
      textSize: this.state.textSize + 5
    });
  }
  render() {
    return (

      <View style={{
        marginTop: 20,
        flex: 1
      }}>
        <ListView renderRow={(item) => (
          <View style={{
            alignItems: 'center'
          }}>
            <TouchableOpacity onPress={this.press.bind(this, item)}>
              <Text>{item}</Text>
            </TouchableOpacity>
          </View>
        )} dataSource={this.state.dataSource}/>
      </View>
    // <View style={{
    //   flex: 1,
    //   justifyContent: 'center',
    //   alignItems: 'center',
    //   backgroundColor: 'red'
    // }}>
    //   <TouchableOpacity onPress={this.bigger.bind(this)}>
    //     <Text style={{
    //       fontSize: this.state.textSize
    //     }}>
    //       Hello
    //     </Text>
    //   </TouchableOpacity>
    // </View>

    // <View style={styles.container}>
    // <Text>test</Text>
    //   <Text style={styles.welcome}>
    //     Welcome to React Native.
    //   </Text>
    //   <Text style={styles.instructions}>
    //     To get started, edit index.ios.js
    //   </Text>
    //   <Text style={styles.instructions}>
    //     Press Cmd+R to reload,{'\n'}
    //     Cmd+D or shake for dev menu
    //   </Text>
    // </View>
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
