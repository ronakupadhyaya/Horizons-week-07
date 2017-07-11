import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ListView,
  Alert,
  Button,
  AsyncStorage
} from 'react-native';
import {styles} from '../style';

class MessageScreen extends React.Component {
  static navigationOptions = {
    title: 'Messages'
  };

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.state = {
      dataSource: ds.cloneWithRows([])
    };

    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    }).then((response) => response.json()).then((responseJson) => {
      if (responseJson.success) {
        this.setState({
          dataSource: ds.cloneWithRows(responseJson.messages)
        });
      } else {
        console.log("error", responseJson.error);
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView dataSource={this.state.dataSource} renderRow={message => <View style={styles.messages}>
          <Text>From: {message.from.username}</Text>
          <Text>To: {message.to.username}</Text>
          <Text>When: {message.timestamp}</Text>
        </View>}/>
      </View>
    )
  }
}

export default MessageScreen;
