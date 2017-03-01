import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  NavigatorIOS,
  ListView,
  Button
} from 'react-native';
const styles = require('./styles.ios.js');

var Messages = React.createClass({

  getInitialState() {

    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    }).then((response) => response.json()).then((resp) => {
      console.log(resp);
      if (resp.success === true) {
        this.setState({
          dataSource: ds.cloneWithRows(resp.messages)
        });
      } else {
        alert("User loading failed. Error: " + resp.error);
      }
    }).catch((err) => {
      alert(err)/* do something if there was an error with fetching */
    });

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    return {dataSource: ds.cloneWithRows([])};
  },
  render() {

    return (
      <View style={{
        flex: 1
      }}>
        <ListView dataSource={this.state.dataSource} renderRow= {(rowData) => (<View><Text>{rowData.from.username}</Text><Text>{rowData.to.username}</Text><Text>{rowData.timestamp}</Text><Text>{rowData.message}</Text></View>)}></ListView>
      </View>
    )
  }
});

module.exports = Messages;
