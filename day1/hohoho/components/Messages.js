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
import {
  MapView
} from 'expo';

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
      .then((data) => {
        self.setState({messages: data.messages})
        console.log('message data', data.messages);
      });
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
              }}>From: {message.from.username}
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: 'blue',
              }}>To: {message.to.username}
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: 'blue',
                marginBottom: 20
              }}>Time sent: {message.timestamp}
            </Text>
            {message.location && <MapView
              style={{height: 200, margin: 40}}
              showsUserLocation={false}
              scrollEnabled={false}
              region={{
                longitude: message.location.longitude,
                latitude: message.location.latitude,
                longitudeDelta: 1,
                latitudeDelta: 1
              }}
            />}
        </View>) )}
        ></ListView>
    )
  }
}
