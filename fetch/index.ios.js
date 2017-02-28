/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View} from 'react-native';

export default class fetchExample extends Component {

  constructor() {
    super();
    this.state = {
      length: "loading..."
    };
  }
  componentDidMount() {
    fetch('https://horizons-json-cors.s3.amazonaws.com/poem.txt')
    .then((resp) => {
      return resp.text();
    })
    .then((text)=> {
      console.log(text.split(" ").length);
      this.setState({
        length: text.split(" ").length
      });
    })
    .catch((err) => {
      console.log(err);
      console.log('error', err);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
        <Text style={styles.instructions}>
          Word count: {this.state.length}
        </Text>
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

AppRegistry.registerComponent('fetchExample', () => fetchExample);
