import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ListView,
  RefreshControl
} from 'react-native';
import { MapView } from 'expo';
import styles from '../styles/styles.js';

class MessagesScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      dataSource: [],
      refreshing: false,
    }
  }

  static navigationOptions = {
    title: 'Messages',
    headerStyle: { marginTop: 25 },
  }

  componentWillMount() {
    return fetch('https://hohoho-backend.herokuapp.com/messages', {
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then(resp => resp.json())
    .then(respJson => {
      if (respJson.success) {
        this.setState({dataSource: respJson.messages})
      } else {
        alert('There was an error loading messages. Close this window and we will make another atempt.');
        this.props.navigation.navigate('Mein');
      }
    })
    .catch(err => {
      alert('There seems to have been a problem. Pls contact the devs... bro.')
      console.log('ERROR', err);
    })
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.componentWillMount().then(() => {
      this.setState({refreshing: false});
    });
  }

  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Messages</Text>
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          dataSource={ds.cloneWithRows(this.state.dataSource)}
          renderRow={rowData => (
            <View style={styles.message}>
              <Text>From: {rowData.from.username}</Text>
              <Text>To: {rowData.to.username}</Text>
              <Text>Message: {rowData.body}</Text>
              <Text>When: {(new Date(rowData.timestamp)).toString()}</Text>
              {rowData.location ? <MapView
                scrollEnabled={false}
                style={{height: 200, marginTop: 10}}
                region={{
                  latitude: rowData.location.latitude,
                  longitude: rowData.location.longitude,
                  latitudeDelta: 0.5,
                  longitudeDelta: 0.25
                }}
                >
                  <MapView.Marker coordinate={{
                    latitude: rowData.location.latitude,
                    longitude: rowData.location.longitude
                  }} />
                </MapView> : null}
            </View>
          )}
        />
      </View>
    )
  }
}

export default MessagesScreen;
