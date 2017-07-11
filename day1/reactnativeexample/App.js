import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
          {/* <TouchableOpacity>
              <Text>Hello</Text>
          </TouchableOpacity> */}
          <View style={styles.top}>
              <Text>Hello</Text>
          </View>
          <View style={styles.bottom}>
              <Text>Hello</Text>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  top: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom: {
    flex: 2,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
