import React from 'react';
import { RefreshControl, ListView, View, Text, TouchableOpacity } from 'react-native';
import { MapView } from 'expo';
import styles from './styles';
const baseUrl = 'https://hohoho-backend.herokuapp.com/';

class MessagesScreen extends React.Component {
  /* static navigationOptions = { */
  /*   title: 'Messages', */
  /* }; */
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([
        {
          _id: 0,
          from: {username: 'mason'},
          to: {username: 'jeff'},
          timestamp: 'right now',
          location: {
            latitude: 30.2672,
            longitude: -97.7431,
          },
        }
      ]),
      refreshing: false,
      ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    };
    this.getMessages();
  }
  getMessages() {
    fetch(baseUrl + 'messages', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          dataSource: this.state.ds.cloneWithRows(responseJson.messages),
        });
      })
      .catch(err => {
        alert('Error: ' + err);
      });
  }
  _onRefresh() {
    fetch(baseUrl + 'messages', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          dataSource: this.state.ds.cloneWithRows(responseJson.messages),
        });
      })
      .catch(err => {
        alert('Error: ' + err);
      });
  }
  render() {
    return (
      <View style={styles.container}>
        <ListView
          renderRow={aMessage => {
            return (
              <View style={{flex: 1}} key={aMessage._id}>
                <TouchableOpacity>
                  <View style={{padding: 5, borderColor: 'grey', borderWidth: 1}}>
                    <Text>From: {aMessage.from.username}</Text>
                    <Text>To: {aMessage.to.username}</Text>
                    <Text>Message: {aMessage.body}</Text>
                    <Text>Timestamp: {aMessage.timestamp}</Text>
                    {aMessage.location ?
                      <MapView
                        style={{height: 70}}
                        region={{
                          latitude: aMessage.location.latitude,
                          longitude: aMessage.location.longitude,
                          latitudeDelta: 0.3,
                          longitudeDelta: 0.2,
                        }}>
                        <MapView.Marker
                          coordinate={aMessage.location}
                        />
                      </MapView>
                      :
                      <View></View>
                    }
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
          dataSource={this.state.dataSource}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        />
      </View>
    );
  }
}

export default MessagesScreen;
