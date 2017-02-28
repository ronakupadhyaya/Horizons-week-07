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
          justifyContent: 'center', //vertically centered
          alignItems: 'center' //horizontally centered
        }}>
        <Text>
          I am centered
        </Text>
      </View>

    // 2/3rds
      // <View style={{flex: 1}}>
      //   <View style={{flex: 1, backgroundColor: 'red'}} ></View>
      // <View style={{flex: 2, backgroundColor: 'blue'}} ></View>
      // </View>

    //removes item when clicked
    // <View style={{
    //   marginTop: 20,
    //   flex: 1
    // }}>
    //   <ListView renderRow={(item) => (
    //     <View style={{
    //       alignItems: 'center'
    //     }}>
    //       <TouchableOpacity onPress={this.remove.bind(this, item)}>
    //         <Text>{item}</Text>
    //       </TouchableOpacity>
    //     </View>
    //   )} dataSource={dataSource.cloneWithRows(this.state.data)}/>
    // </View>

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
