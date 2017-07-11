import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ListView,
  Alert,
  Button
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import styles from '../assets/styles'

export default class Messages extends React.Component {
  static navigationOptions = {
    title: 'Messages',
  };
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
  }

  componentDidMount() {
    var self = this;
    fetch('https://hohoho-backend.herokuapp.com/messages')
      .then(response => {
        return response.json();
      })
      .then((data) =>
        self.setState({messages: data.messages})
      );
  }

  render() {
    var self = this;
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return(
      <ListView
        dataSource={ds.cloneWithRows(this.state.messages)}
        renderRow={((message) => (
        <View>
            <Text
              style={{
                fontSize: 20,
                color: 'blue'
              }}>{message.from.username}
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: 'blue',
              }}>{message.to.username}
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: 'blue',
                marginBottom: 20
              }}>{message.timestamp}
            </Text>
        </View>) )}
        ></ListView>
    )
  }
}
