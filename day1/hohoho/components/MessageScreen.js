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
import {MapView} from 'expo';
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
    let locationCheck = function(message) {
      if(message.location && message.location.longitude) {
        return <MapView
          style={styles.map}
          showsUserLocation={true}
          scrollEnabled={true}
          region={{
            longitude: message.location.longitude,
            latitude: message.location.latitude,
            longitudeDelta: 1,
            latitudeDelta: 1
          }}>
          <MapView.Marker
          coordinate={{latitude: message.location.latitude,
          longitude: message.location.longitude}}
          title={message.from.username + "'s location"}/>
        </MapView>
      }
    }
    return (
      <View style={styles.container}>
        <ListView dataSource={this.state.dataSource} renderRow={message =>
          <View style={styles.messages}>
          <Text>From: {message.from.username}</Text>
          <Text>To: {message.to.username}</Text>
          <Text>Message: {message.body}</Text>
          <Text>When: {message.timestamp}</Text>
          {locationCheck(message)}
        </View>
        }/>
      </View>
    )
  }
}

export default MessageScreen;
