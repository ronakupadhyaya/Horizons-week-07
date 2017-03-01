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

var Users = React.createClass({

  touchUser(user) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body : JSON.stringify({
        to: user._id
      })
    }).then((response) => response.json())
    .then((resp) => {
      console.log(resp);
      if (resp.success === true) {
        alert("Your Ho Ho Ho! to " + user.username + " has been sent!");
      } else {
        alert("Your Ho Ho Ho! to " + user.username + " has not been sent. Error: " + resp.error);
      }
    }).catch((err) => {
      console.log(err);
      alert(err);
    });
  },

  getInitialState() {

    fetch('https://hohoho-backend.herokuapp.com/users', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    }).then((response) => response.json()).then((resp) => {
      console.log(resp);
      if (resp.success === true) {
        this.setState({
          dataSource: ds.cloneWithRows(resp.users)
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
    return {
      dataSource: ds.cloneWithRows([{_id: 0, username: "Test"}])
    };
  },
  render() {

    return (
      <View style={{
        flex: 1
      }}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow= {(rowData) => <TouchableOpacity onPress={this.touchUser.bind(this, rowData)}><Text>{rowData.username}</Text></TouchableOpacity>}
          >

        </ListView>
      </View>
    )
  }
});

module.exports = Users;
