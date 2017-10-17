import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ListView,
  RefreshControl,
  AsyncStorage,
} from 'react-native';
import {
  MapView,
} from 'expo';
import styles from '../Styles/styles'

class MessagesScreen extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      refreshing: false,
      username: '',
      id: '',
    };
  }

  static navigationOptions = (props) => ({
    title: 'All Messages',
  })

  _onRefresh() {
    this.setState({
      refreshing: true,
    });
    this.callMessages()
    .then( (resp) => {
      this.setState({
        messages: resp.messages,
        refreshing: false,
      });
    })
    .catch( error => {console.log('error in messages: ', error);})
  }

  componentWillMount() {
    AsyncStorage.getItem('user')
    .then(result => {
      const parsedResult = JSON.parse(result);
      this.setState({
        username: parsedResult.username,
        id: parsedResult.id,
      })
    })
  }

  callMessages() {
    return fetch('https://hohoho-backend.herokuapp.com/messages')
    .then( responseJson => responseJson.json() )
  }

  componentDidMount() {
    this.callMessages()
    .then( (resp) => {
      this.setState({
        messages: resp.messages,
      });
    })
    .catch( error => {console.log('error in messages: ', error);})
  }

  navToConversation(message) {
    console.log(message);
    AsyncStorage.setItem('conversation', JSON.stringify({
      fromId: message.from._id,
      toId: message.to._id,
      latitude: message.location ? message.location.latitude : null,
      longitude: message.location ? message.location.longitude : null,
    }))
    .then( () => {this.props.navigation.navigate('Conversation')})
    .catch(error => {console.log('error in navToConversation: ', error)})
  }

  render() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    })
    console.log(this.state);
    return (
      <View style={styles.container}>
        <ListView
          style={{alignSelf: 'stretch'}}
          dataSource={ds.cloneWithRows(this.state.messages)}
          renderRow={ (item) => (
            <TouchableOpacity
              style={[styles.textMessageContainer]}
              onPress={ () => this.navToConversation(item) }
            >
              <Text style={
                this.state.id === item.from._id ?
                [styles.textMessageRight] :
                [styles.textMessageLeft]
                }>{'From: ' + item.from.username}</Text>
              <Text style={
                this.state.id === item.from._id ?
                [styles.textMessageRight] :
                [styles.textMessageLeft]
                }>{'To: ' + item.to.username}</Text>
              <Text style={
                this.state.id === item.from._id ?
                [styles.textMessageRight] :
                [styles.textMessageLeft]
                }>{'Message: ' + item.body}</Text>
              <Text style={
                this.state.id === item.from._id ?
                [styles.textMessageRight] :
                [styles.textMessageLeft]
              }>{'Sent at: ' + new Date(item.timestamp).toString().split(' ').slice(0,5).join(' ')}</Text>
              {item.location && item.location.latitude && item.location.longitude ?
                <View
                  style={{flex: 1}}
                  >
                  <MapView
                    style={styles.mapViewContainer}
                    region={{
                      latitude: item.location.latitude,
                      longitude: item.location.longitude,
                      latitudeDelta: .01,
                      longitudeDelta: .01,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    showsUserLocation
                  >
                    <MapView.Marker
                      coordinate={{
                        latitude: item.location.latitude,
                        longitude: item.location.longitude,
                      }}
                      title={'Here I am'}
                    />
                  </MapView>
                </View>
                : null
              }
            </TouchableOpacity>
            ) }
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={ () => this._onRefresh() }
            />
          }
        />
      </View>
    )
  }
}

export default MessagesScreen;
